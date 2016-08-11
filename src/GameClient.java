import java.io.*;
import java.net.*;
import java.security.InvalidParameterException;
import java.util.Arrays;

public class GameClient 
{
	private String hostName;
	private int port;
	private Socket socket;
	private PrintWriter out;
	private BufferedReader in;
	private BufferedReader stdIn;
	
	private Thinker t;
	
	public GameClient(String host, int portNumber, Thinker t)
	{
		this.t = t;
		hostName = host;
		port = portNumber;
		
		//connect to server
		try {
			
			socket = new Socket(hostName, port);
			System.out.println("Connection Established! Connected to: " 
					+ socket.getInetAddress().getHostName());
			
			//set up readers
			out = new PrintWriter(socket.getOutputStream(), true);
            in = new BufferedReader(
                new InputStreamReader(socket.getInputStream()));
            
            //set up system input reader
            stdIn =
                    new BufferedReader(new InputStreamReader(System.in));		
			
		} 
		catch (UnknownHostException e) 
		{
			System.err.println("Don't know about host " + hostName);
            System.exit(1);
		} 
		catch (IOException e) 
		{
			System.err.println("Couldn't get I/O for the connection to " +
	                hostName);
	            System.exit(1);
		}
		
		

	}
	   
	public void startRunning()
	{       
            //start communication
            String gameUpdate;
            String userInput = null;

            try {
				while ((gameUpdate = in.readLine()) != null) 
				{
					//if the update is a board, use your thinker to get next move
					if (gameUpdate.contains(";"))
					{
						try
						{
							GameBoard gb = readBoard(gameUpdate);
							
							//workaround for sending the board as one line
							System.out.println("Server:\n" + gb.toString()
							.replace(";", "\n"));
							if (gb.moreMoves())
							{
//								userInput = t.nextMove(gb);
								userInput = stdIn.readLine();
//								System.out.println("Client: " + userInput);
								out.println(userInput);
							}
						}
						catch(Exception e)
						{
							System.out.println("Server:\n" + gameUpdate
									.replace(";", "\n"));
							
							String message;
							if ((message = stdIn.readLine()) != null)
								{
									out.print(message);
//									in.reset();
								}
							
							
						}
					}	
			
					//if server sends something that isn't a board, take user input to
					//respond
					else
					{
						System.out.println("Server:\n" + gameUpdate);
						if (gameUpdate.contains("Bye!"))
							break;
						userInput = stdIn.readLine();
						System.out.println("Client: " + userInput);
				        out.println(userInput);
				        out.flush();
						
					}
				    
				}
			} catch (IOException e) {
				System.err.println("Couldn't get I/O for the connection to " +
		                hostName);
		            System.exit(1);
			}
            

			this.closeReaders();
		}

	
	public void closeReaders()
	{
		System.exit(0);
        out.close();
        try 
        {
			in.close();
			stdIn.close(); 
		} 
        catch (IOException e) 
        {
			e.printStackTrace();
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
