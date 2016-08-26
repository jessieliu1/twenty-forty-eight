import java.io.*;
import java.net.*;


/**
 * Represents a server for the game 2048
 * @author Jessie Liu
 *
 */
public class GameServer 
{
	private ServerSocket server;
	private int port;
	
	/**
	 * Creates a server listening on a given port
	 * @param portNum the port to listen on
	 */
	public GameServer(int portNum)
	{
		port = portNum;
	}
	
	public void startRunning()
	{
		try 
		{
			int counter = 1;
			
			//backlog is the maximum queue length for incoming connection indications 
			//hard coded, change to fit needs
			server = new ServerSocket(port, 100);
			while (true)
			{
				System.out.println("Server Listening");				
				Socket connection = server.accept();
				
				new GameThread(connection, counter++, "tester", "game_stats").start();
			}
		}
		catch(IOException io)
		{
			System.err.println("Could not listen on port " + port);
			System.exit(-1);
		}
	}
	
}
