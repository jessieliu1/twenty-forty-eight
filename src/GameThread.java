import java.net.*;
import java.sql.SQLException;
import java.io.*;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

public class GameThread extends Thread
{
    private Socket socket = null;
    private String netID = "";
    private GameDBAccess access;
    private int threadNumber;
    private PrintWriter out;
    private BufferedReader in; 

    //can add name to thread? Maybe? for debugging purposes.
    //call super("name"); at the start of the constructor
    public GameThread(Socket s, int number, String db, String table)
    {
    	this.socket = s;
    	threadNumber = number;
    	access = new GameDBAccess(db, table);
    	try 
    	{
			out = new PrintWriter(socket.getOutputStream(), true);
			in = new BufferedReader(
					new InputStreamReader(
							socket.getInputStream()));
		} 
    	catch (IOException e) 
    	{
			e.printStackTrace();
		}
        
    	
    }
    
 
    public void run()
    {
    	try
    	{
    		out.println("Hello, would you like to play? (Y/N)");
    		if (in.readLine().equalsIgnoreCase("Y"))
    		{
    			boolean notNumber = true;
    			int numberOfGames = 0;
    			while(notNumber)
    			{
    				out.println("How many games? Please enter a number between 1 and 100");
    				try
    				{
    					numberOfGames = Integer.parseInt(in.readLine());
    					notNumber = false;
    				}
    				catch (NumberFormatException e)
    				{
    					
    				}
    			}
    			
    			out.println("Please enter your NetID: ");
    			netID = in.readLine().trim();
    			
    			//for each game that the player wishes to play
    			for (int i = 0; i < numberOfGames; i++)
    			{
		    		Game g = new Game(threadNumber + "." + i);
		    		
		    		//replace the line breaks with ";" because client only reads
		    		//in one line at a time
					out.println(g.getBoard().toString().replace("\n", ";"));
					
					System.out.println("Sent first board to "+ netID);
					//put initial board in db
					Move firstMove = new Move(0, g.getBoard(), "", 0);
					try {
						access.populateGameTable(g.getID(), netID, firstMove);
					} catch (SQLException e1) {
						e1.printStackTrace();
					}
					
					
					boolean isCancelled = false;
					while(!g.isGameOver() && !isCancelled)
		    		{
						final Runnable playGame = new Thread()
						{
							@Override
							public void run()
							{
				    			try 
				    			{
				    				String input = in.readLine();
				    				System.out.println(netID + ": " + input);
				    				GameBoard gb = g.playNextMove(input.trim());
				    				
				    				//store move in table
				    				Move lastMove = g.getLastMove();
				    				try 
				    				{
				    					if (lastMove.getMoveNumber() != -1)
				    					{
				    						access.populateGameTable(g.getID(), netID, lastMove);
				    					}
									} 
				    				catch (SQLException e) 
				    				{
										e.printStackTrace();
									}
				    				
				    				if (gb != null)
				    				{
				    					if (gb.moreMoves())
				    					{
				    						out.println(gb.toString().replace("\n", ";"));
				    					}
				    					else 
				    					{
				    						
				    						out.println(gb.toString().replace("\n", ";") 
				    								+ ";Game Over! Score was " + g.getScore());
				    					}
				    				}
				    				
									} 
				    				catch (InvalidMoveException e) 
				    				{
				    					e.printStackTrace();
				    				}
					    			catch (IOException e) 
					    			{
					    				e.printStackTrace();
					    			}
				    			}
			    			};
			    			
			    			final ExecutorService executor = Executors.newSingleThreadExecutor();
			    			final Future<?> future = executor.submit(playGame);
			    			executor.shutdown(); //restricts the executor from accepting more tasks.

			    			try { 
			    			  future.get(5, TimeUnit.SECONDS); 
			    			}
			    			catch (InterruptedException ie) { 
			    			  	ie.printStackTrace();
			    			}

			    			catch (TimeoutException te) { 
			    				future.cancel(true);
			    				executor.shutdownNow();
			    				isCancelled = true;
			    				String message = "Timeout Exception, press any key to keep playing";
			    				out.println(message);
			    				te.printStackTrace();
			    				in.readLine();
			    				
			    			} 
			    			catch (ExecutionException e) {
								e.printStackTrace();
								break;
							}
			    			
			    			if (!executor.isTerminated())
			    			    executor.shutdownNow();			

		    		}
		    		

		    		}
    			
    			out.println("Bye!");

    			}
//    		closeReaders();
    		
    		//If they choose to not play
    		else
    		{
    			out.println("Bye!");
    		}
    	}
    	//when the client exits, a NullPointerException will be thrown
    	//when this happens, stop the thread.
    	catch (NullPointerException np)
    	{
    		this.interrupt();
    	}
		catch (IOException e) 
		{
			e.printStackTrace();
		}


	}
						
    private void closeReaders()
    {
		try 
		{
			in.close();
			out.close();
			socket.close();
		} 
		catch (IOException e) 
		{
			e.printStackTrace();
		}
		
    }
    

    
}
