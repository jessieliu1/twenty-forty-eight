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
//    private GamePlayer player;
    private String netID = "";
    private GameDBAccess access = new GameDBAccess("tester", "game_stats");
    private int threadNumber;
    private PrintWriter out;
    private BufferedReader in; 

    //can add name to thread? Maybe? for debugging purposes.
    //call super("name"); at the start of the constructor
    public GameThread(Socket s, int number)
    {
    	this.socket = s;
//    	this.player = new GamePlayer(s.getLocalAddress().getHostName());
    	threadNumber = number;
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
    			out.println("How many games? Please enter a number between 1 and 100");
    			int numberOfGames = Integer.parseInt(in.readLine());
    			out.println("Please enter your NetID: ");
//    			player.setName(in.readLine().trim());
    			netID = in.readLine().trim();
    			
    			for (int i = 0; i < numberOfGames; i++)
    			{
		    		Game g = new Game(threadNumber + "." + i);
	
		    		
		    		//replace the line breaks with ";" because client only reads
		    		//in one line at a time
					out.println(g.getBoard().toString().replace("\n", ";"));
					
					System.out.println("Sent first board to "+ netID);
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
				    				
				    				
//				    				try {
//				    					Thread.sleep(10000);
//				    				} catch (InterruptedException e1) 
//				    				{
//				    					e1.printStackTrace();
//				    				}
				    				
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
			    			executor.shutdown(); // This does not cancel the already-scheduled task.

			    			try { 
			    			  future.get(5, TimeUnit.SECONDS); 
			    			}
			    			catch (InterruptedException ie) { 
			    			  	ie.printStackTrace();
			    			}

			    			catch (TimeoutException te) { 
			    				future.cancel(true);
			    				isCancelled = true;
			    				String message = "Timeout Exception";
			    				te.printStackTrace();
			    				if (i + 1 < numberOfGames)
			    				{
			    					out.println(message + "; Keep playing?");
			    				}
			    				
			    				else{ out.println(message);}
			    				
			    				if (!in.readLine().equals("Y"))
			    				{
			    					isCancelled = true;
			    					break;
			    				}
			    				
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
