import java.io.*;
import java.net.*;
public class GameServer 
{
	private ServerSocket server;
	private int port;
	
	public GameServer(int portNum)
	{
		port = portNum;
	}
	
	public void startRunning()
	{
		try 
		{
			//backlog is set at 10 arbitrarily, change if you want
			server = new ServerSocket(port, 10);
			while (true)
			{
				System.out.println("Server Listening");				
				Socket connection = server.accept();
				//THOUGHTS: make a new player every time 
				//if a player's thinker needs to learn put in a point where 
				//games can be played many times
//				GamePlayer play = 
//						new GamePlayer(connection.getInetAddress().getHostName());
				new GameThread(connection, 
						new GamePlayer(connection.getInetAddress().getHostName())).start();
			}
		}
		catch(IOException io)
		{
			System.err.println("Could not listen on port " + port);
			System.exit(-1);
		}
	}
	
}
