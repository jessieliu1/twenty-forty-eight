import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class GameDBAccess 
{
	//URL of the database
	//autoReconnect and useSSL parameters will disable SSL and also suppress the SSL errors.
    public static final String URL = "jdbc:mysql://localhost:3306/tester?autoReconnect=true&useSSL=false";
    public static final String USER = "jessieliu";
    public static final String PASSWORD = "catzcatz";
    public static final String DRIVER_CLASS = "com.mysql.jdbc.Driver"; 
    
    private Connection connect;
//    private Statement statement;
    private PreparedStatement insertStatement;
//    private ResultSet resultSet;
    
    
    public GameDBAccess(String db, String table)
    {
    	try 
    	{
			Class.forName(DRIVER_CLASS);
			connect = DriverManager.getConnection(URL, USER, PASSWORD);
			
			//for a 4x4 board
			insertStatement = connect
			          .prepareStatement("insert into " + db + "." + table + 
			        		  " values (?, ?, ?, ?,"
			        		  		+ " ?, ?, ?, ?,"
			        		  		+ " ?, ?, ?, ?,"
			        		  		+ " ?, ?, ?, ?, ?, ?, ?, ?, ?)");
		} 
    	
    	catch (ClassNotFoundException e) 
    	{
			e.printStackTrace();
		} 
    	catch (SQLException e) {
			System.out.println("Unable to connect to database");
			e.printStackTrace();
		}
    }
    
    /**
     * Populate the game table with the columns: gameID, netID, move_number, swipe,
     * addition to score, and board values by row
     * @param gameID
     * @param netID
     * @param move
     * @throws SQLException
     */
    public void populateGameTable(String gameID, String netID, Move move) throws SQLException
    {
    	  insertStatement.setString(1, gameID);
    	  insertStatement.setString(2, netID);
    	  insertStatement.setInt(3, move.getMoveNumber());
    	  insertStatement.setString(4, move.getSwipe());
    	  insertStatement.setInt(5, move.getScoreAdd());
    	  NumberTile[][] numBoard = move.getBoard().toArray();
    	  
    	  //the current values on the board
    	  for (int i = 0; i < numBoard.length; i++)
    	  {
    		  for (int j = 0; j < numBoard.length; j++)
    		  {
    			  insertStatement.setInt(6 + (numBoard.length) * i + j, 
    					  numBoard[i][j].getValue());
    		  }
    	  }
    	  
    	  insertStatement.executeUpdate();

    }
    
    /**
     * Close database connections
     */
    public void closeConnections() 
    {
    	try
    	{
	    	connect.close();
	    	insertStatement.close();
    	}
    	catch (SQLException sq)
    	{
    		sq.printStackTrace();
    	}
    }
    
    
     
}
