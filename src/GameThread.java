import java.net.*;
import java.util.Arrays;
import java.io.*;

public class GameThread extends Thread
{
    private Socket socket = null;
    private GamePlayer player;

    //can add name to thread? Maybe? for debugging purposes.
    //call super("name"); at the start of the constructor
    public GameThread(Socket s, GamePlayer gp)
    {
    	this.socket = s;
    	this.player = gp;
    }
 
    public void run()
    {
    	try
    	(PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
            BufferedReader in = new BufferedReader(
            							new InputStreamReader(
            									socket.getInputStream()));) 
    	{
    		out.println("Hello " + player.getName() + ", would you like to play? (Y/N)");
    		if (in.readLine().equalsIgnoreCase("Y"))
    		{
    			out.println("Please enter your NetID: ");
    			player.setName(in.readLine().trim());
	    		Game g = new Game(player);
	    		//TODO: set up to ask to play more games
	    		
	    		//replace the line breaks with ":" because client only reads
	    		//in one line at a time
				out.println(g.getBoard().toString().replace("\n", ";"));
				System.out.println("Sent first board");
		
				while(!g.isGameOver())
	    		{
	    			try 
	    			{
	    				String input = in.readLine();
	    				System.out.println(player.getName() + ": " + input);
	    				GameBoard gb = g.playNextMove(input.trim());
//	    				try {
//	    					Thread.sleep(12000);
//	    				} catch (InterruptedException e1) 
//	    				{
//	    					e1.printStackTrace();
//	    				}
	    				if (gb != null)
	    				{
	    					out.println(gb.toString().replace("\n", ";"));
	    				}
	    				
					} 
	    			catch (InvalidMoveException e) 
	    			{
						e.printStackTrace();
					}
	    		}
				out.println("Game Over! Score was " + g.getScore());
    		}

		
			//move break if you wanna play more games

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
