import java.net.*;
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
    		out.println("Would you like to play? (Y/N)");
    		if (in.readLine().equalsIgnoreCase("Y"))
    		{
    			System.out.println("yo");
	    		Game g = new Game(player);
	    		System.out.println("yUP");
//	    		@SuppressWarnings("unused")
//				String inputLine;
	    		
	    		//while the game isn't over and there is still non null input
	    		//TODO: set up to ask to play more games
	    		
//	    		while ((inputLine = in.readLine()) != null)
	    		System.out.println(g.getBoard().toString());
//				out.println(g.getBoard().toString());
				while(!g.isGameOver())
	    		{
	    			try 
	    			{
	    				out.println("What is your next move?");
	    				String input = in.readLine();
	    				GameBoard gb = g.playNextMove(input.trim());
	    				if (gb != null)
	    				{
	    					System.out.println(g.getBoard().toString());
//	    					out.println(gb.toString());
	    				}
	    				
					} 
	    			catch (InvalidMoveException e) 
	    			{
						e.printStackTrace();
					}
	    		}
				out.println("Game Over! Score was: " + g.getScore());
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
