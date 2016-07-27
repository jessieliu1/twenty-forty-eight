import java.io.*;
import java.net.*;
import java.security.InvalidParameterException;
import java.util.Arrays;

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
            	//if the update is a board
            	if (gameUpdate.contains(":"))
            	{
            		System.out.println("Server:\n" + readBoard(gameUpdate).toString()
            				.replace(":", "\n"));
            	}	
            	else
            	{
            		System.out.println("Server:\n" + gameUpdate);
            		if (gameUpdate.equals("Bye!"))
            			break;
            	}

                
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
	
	/**
	 * Takes in a string that represents the board in this format: 
	 *    # # # # ....#` # # # # ....#` etc. where the # signify number tiles
	 *    and the ` signifies the end of a row
	 * @param b the string
	 * @return a GameBoard
	 */
	private GameBoard readBoard(String b)
	{
		String[] rows = b.split(":");
//		System.out.println(Arrays.toString(rows));
		NumberTile[][] bd = new NumberTile[rows.length][rows.length];
		for (int i = 0; i < rows.length; i++)
		{
			String[] tileValues = rows[i].trim().split("\\s+");
//			System.out.println(Arrays.toString(tileValues));
			if (tileValues.length != rows.length)
			{
				throw new InvalidParameterException();
			}
			else
			{
				for (int j = 0; j < tileValues.length; j++)
				{
					String value = tileValues[j];
					if (value.equals("-"))
					{
						bd[i][j] = new NumberTile();
					}
					else
					{
						bd[i][j] = new NumberTile(Integer.parseInt(value));
					}
				}
			}
		}
		return new GameBoard(bd);
	}
	
	
}
