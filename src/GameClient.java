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
            
            //set up system input reader
            BufferedReader stdIn =
                    new BufferedReader(new InputStreamReader(System.in));
            
            /*****************CHANGE THINKER AS NEEDED********************/
            RandomThinker think = new RandomThinker();
            
            //start communication
            String gameUpdate;
            String userInput;
            
            while ((gameUpdate = in.readLine()) != null) 
            {
            	//if the update is a board, use your thinker to get next move
            	if (gameUpdate.contains(";"))
            	{
            		System.out.println("Server:\n" + readBoard(gameUpdate).toString()
            				.replace(";", "\n"));
            		userInput = think.nextMove(readBoard(gameUpdate));
            	}	
            	
            	//if server sends something that isn't a board, take user input to
            	//respond
            	else
            	{
            		System.out.println("Server:\n" + gameUpdate);
            		userInput = stdIn.readLine();
            		if (gameUpdate.contains("Game Over!"))
            			break;
            	}

                
                if (userInput != null) {
                    System.out.println("Client: " + userInput);
                    out.println(userInput);
                }
            }
            
//            out.close();
//            in.close();
//            stdIn.close(); 
			
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
		String[] rows = b.split(";");
		NumberTile[][] bd = new NumberTile[rows.length][rows.length];
		for (int i = 0; i < rows.length; i++)
		{
			String[] tileValues = rows[i].trim().split("\\s+");
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
