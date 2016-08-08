import java.net.*;
import java.sql.SQLException;
import java.io.*;

public class GameThread extends Thread
{
    private Socket socket = null;
//    private GamePlayer player;
    private String netID = "";
    private GameDBAccess access = new GameDBAccess("tester", "game_stats");
    private int threadNumber;

    //can add name to thread? Maybe? for debugging purposes.
    //call super("name"); at the start of the constructor
    public GameThread(Socket s, int number)
    {
    	this.socket = s;
//    	this.player = new GamePlayer(s.getLocalAddress().getHostName());
    	threadNumber = number;
    	
    }
    
 
    public void run()
    {
    	try
    	(PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
            BufferedReader in = new BufferedReader(
            							new InputStreamReader(
            									socket.getInputStream()));) 
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
					
					System.out.println("Sent first board");
			
					while(!g.isGameOver())
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
		    				
		    				
		    				try {
		    					Thread.sleep(10000);
		    				} catch (InterruptedException e1) 
		    				{
		    					e1.printStackTrace();
		    				}
		    				if (gb != null)
		    				{
		    					if (gb.moreMoves())
		    					{
		    						out.println(gb.toString().replace("\n", ";"));
		    						out.flush();
		    					}
		    					else 
		    					{
		    						
		    						out.println(gb.toString().replace("\n", ";") 
		    								+ ";Game Over! Score was " + g.getScore());
		    						out.flush();
		    					}
		    				}
		    				
						} 
		    			catch (InvalidMoveException e) 
		    			{
							e.printStackTrace();
						}
		    		}
	    		}
    		}
    		out.println("Bye!");

    		in.close();
    		out.close();
    		socket.close();
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
    

    
}
