import java.util.Arrays;

/**
 * Represents the game board for the game 2048. Boards are always square.
 * @author Jessie Liu
 *
 */
public class GameBoard 
{
	public static final int STANDARD_DIMENSIONS = 4;
	private NumberTile[][] board;
	private int dimension;
	//number of non empty tiles
	private int numberOfTiles;
	
	/**
	 * Default game board dimensions are 4x4. Board always starts with two 
	 * 2 tiles placed in a random locations.
	 */
	public GameBoard()
	{
		dimension = STANDARD_DIMENSIONS;
		board = new NumberTile[dimension][dimension];
		for (int i = 0; i < dimension; i++)
		{
			Arrays.fill(board[i],new NumberTile());
		}
		numberOfTiles = 0;
		
		//inserts two 2 tiles
		insertTwo();
		insertTwo();
	}
	
	/**
	 * Game board with custom dimensions. Board always starts with two 
	 * 2 tiles placed in a random locations.
	 * @param dim the specified dimension
	 */
	public GameBoard(int dim)
	{
		dimension = dim;
		board = new NumberTile[dimension][dimension];
		for (int i = 0; i < dimension; i++)
		{
			Arrays.fill(board[i],new NumberTile());
		}
		numberOfTiles = 0;
		
		//inserts two 2 tiles in random locations
		insertTwo();
		insertTwo();
	}
	
	/**
	 * Inserts a 2 number tile in a random empty spot on the board
	 */
	public void insertTwo()
	{
		//if the board isn't full
		if (this.isFull() == false)
		{
			int firstDim = (int) (Math.random() * dimension);
			int secondDim = (int) (Math.random() * dimension);
			
			while (board[firstDim][secondDim].isEmpty() == false)
			{
				firstDim = (int) (Math.random() * dimension);
				secondDim = (int) (Math.random() * dimension);
			}
			
			//insert a 2 tile and increment number of tiles
			board[firstDim][secondDim] = new NumberTile(2);
			numberOfTiles++;
		}
		
		//if board is full do nothing
	}
	
	/**
	 * Checks if the board is full
	 * @return true if the board is full
	 * 			false otherwise
	 */
	public boolean isFull()
	{
		if (numberOfTiles < (dimension * dimension))
		{
			return false;
		}
		return true;
	}
	
	public NumberTile[][] getBoard()
	{
		return board;
	}
	
	/**
	 * Checks if any more moves are possible
	 * @return true if there are more moves
	 * 		false if there are no more moves
	 */
	public boolean moreMoves()
	{
		if (this.isFull() == false)
		{
			return true;
		}
		boolean more = false;
		for (int i = 0; i < dimension; i++)
		{
			for (int j = 0; j < dimension; j++)
			{
				int currVal = board[i][j].getValue();
				if (currVal != 0)
				{

					if (j + 1 < dimension && board[i][j + 1].getValue() == currVal)
					{
						more = true;
					}					

					if (i + 1 < dimension && board[i + 1][j].getValue() == currVal)
					{
						more = true;
					}
				}
			}
		}
		return more;
	}
	
	/**
	 * Represents the board as a string
	 * @return the String board representation
	 */
	public String toString()
	{
		StringBuilder sb = new StringBuilder();
		for (int i = 0; i < dimension; i++)
		{
			for (int j = 0; j < dimension; j++)
			{
				sb.append(String.format("%5d", board[i][j].getValue()));
			}
			sb.append("\n");
		}
		return sb.toString();	
	}
	
	/**
	 * 
	 * @return int the addition to the score after the swipe
	 */
	public int swipeLeft()
	{
		int scoreAdd = 0;
		for (int row = 0; row < dimension; row++)
		{
			int last = 0;
			int curr = 1;
			while (curr < dimension)
			{
				NumberTile lastTile = board[row][last];
				
				if (lastTile.isEmpty())
				{
					while (curr < dimension && board[row][curr].isEmpty())
					{
						curr++;
					}
					
					if (curr < dimension)
					{
						lastTile.setValue(board[row][curr].getValue());
						board[row][curr].setValue(0);
						numberOfTiles--;
						curr++;
					}
				}
				
				else
				{
					while (curr < dimension && board[row][curr].isEmpty())
					{
						curr++;
					}
					if (curr < dimension)
					{
						if (board[row][curr].getValue() == lastTile.getValue())
						{
							lastTile.setValue(2 * lastTile.getValue());
							scoreAdd += lastTile.getValue();
							board[row][curr].setValue(0);
							numberOfTiles--;
							last++;
							curr = last + 1;
						}
						else
						{
							last++;
						}
					}
				}		
			}
		}
		return scoreAdd;
	}
	
	/**
	 * 
	 * @return int the addition to the score after the swipe
	 */
	public int swipeRight()
	{
		int scoreAdd = 0;
		for (int row = 0; row < dimension; row++)
		{
			int last = dimension - 1;
			int curr = dimension - 2;
			while (curr >= 0)
			{
				NumberTile lastTile = board[row][last];
				
				if (lastTile.isEmpty())
				{
					while (curr >=0 && board[row][curr].isEmpty())
					{
						curr--;
					}
					
					if (curr >= 0)
					{
						lastTile.setValue(board[row][curr].getValue());
						board[row][curr].setValue(0);
						numberOfTiles--;
						curr--;
					}
				}
				
				else
				{
					while (curr >=0 && board[row][curr].isEmpty())
					{
						curr--;
					}
					if (curr >= 0)
					{
						if (board[row][curr].getValue() == lastTile.getValue())
						{
							lastTile.setValue(2 * lastTile.getValue());
							scoreAdd += lastTile.getValue();
							board[row][curr].setValue(0);
							numberOfTiles--;
							last--;
							curr = last - 1;
						}
						else
						{
							last--;
						}
					}
				}		
			}
		}
		return scoreAdd;
	}
	
	
}
