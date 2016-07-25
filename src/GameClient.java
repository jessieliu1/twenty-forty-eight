import java.io.*;
import java.net.*;

public class GameClient 
{
	private String hostName;
	private int port;
	private Socket socket;
	
	
	public GameClient(String host, int portNumber)
	{
		hostName = host;
		port = portNumber;
	}
	   
	public void startRunning()
	{
		try     
		{
			//connect to server
			socket = new Socket(hostName, port);
			System.out.println("Connection Established! Connected to: " 
					+ socket.getInetAddress().getHostName());
			
			//set up readers
			PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
            BufferedReader in = new BufferedReader(
                new InputStreamReader(socket.getInputStream()));
            BufferedReader stdIn =
                    new BufferedReader(new InputStreamReader(System.in));
            
            //start communication
            String gameUpdate;
            String userInput;
            while ((gameUpdate = in.readLine()) != null) 
            {
            	System.out.println("Server: " + gameUpdate);
                if (gameUpdate.equals("Bye!"))
                    break;
                
                userInput = stdIn.readLine();
                if (userInput != null) {
                    System.out.println("Client: " + userInput);
                    out.println(userInput);
                }
            }
            
            //TODO: MOVE THESE AFTER U REFACTOR! TO A NEW METHOD
            out.close();
            in.close();
            stdIn.close();
            
			
		}
		catch(UnknownHostException e)
		{
			System.err.println("Don't know about host " + hostName);
            System.exit(1);
		}
		catch(IOException io)
		{
			System.err.println("Couldn't get I/O for the connection to " +
	                hostName);
	            System.exit(1);
		}

	}
}
