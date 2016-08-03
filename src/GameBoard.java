import java.security.InvalidParameterException;
import java.util.Arrays;

/**
 * Represents the game board for the game 2048. Boards should be square.
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
	private boolean reached2048 = false;
	
	/**
	 * Default game board dimensions are 4x4. Board always starts with two 
	 * 2 tiles placed in random locations.
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
	 * Create a game board from an existing square number tile array
	 * @param nt a number tile array
	 */
	public GameBoard(NumberTile[][] nt)
	{
		if (nt.length == nt[0].length)
		{
			board = nt;
			dimension = nt.length;
			numberOfTiles = 0;
			for (int i = 0; i < dimension; i++)
			{
				for (int j = 0; j < dimension; j++)
				{
					if (board[i][j] == null)
					{
						throw new InvalidParameterException("Board cannot have null "
								+ "elements");
					}
					else if(!board[i][j].isEmpty())
					{
						numberOfTiles++;
					}
				}
			}
		}
		else
		{
			throw new InvalidParameterException("Board must be square");
		}
		
	}
	
	
	
	/**
	 * Inserts a 2 number tile in a random empty spot on the board
	 */
	public String insertTwo()
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
			return "(" + firstDim + ", " + secondDim + ")";
		}
		
		return null;
		//if board is full do nothing
	}
	
	/**
	 * Inserts a 4 number tile in a random empty spot on the board
	 */
	public String insertFour()
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
			
			//insert a 4 tile and increment number of tiles
			board[firstDim][secondDim] = new NumberTile(4);
			numberOfTiles++;
			return "(" + firstDim + ", " + secondDim + ")";
		}
		
		return null;
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
	
	public NumberTile[][] toArray()
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
		//if the board isn't full there are more moves
		if (this.isFull() == false)
		{
			return true;
		}
		
		boolean more = false;
		//check each cell of the board and see if any adjacent cells
		//can be merged with it
		for (int i = 0; i < dimension; i++)
		{
			for (int j = 0; j < dimension; j++)
			{
				int currVal = board[i][j].getValue();
				if (currVal != 0)
				{
					if (j + 1 < dimension 
							&& board[i][j + 1].getValue() == currVal)
					{
						more = true;
					}					

					if (i + 1 < dimension 
							&& board[i + 1][j].getValue() == currVal)
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
				sb.append(String.format("%6s", board[i][j].toString()));
			}
			sb.append("\n");
		}
		return sb.toString();	
	}
	
	/**
	 * Swipes left, collapsing appropriate tiles. Adds a new 2 tile.
	 * @return the addition to the score after the swipe
	 */
	public Move swipeLeft()
	{
		int scoreAdd = 0;
		boolean boardChanged = false;
		
		for (int row = 0; row < dimension; row++)
		{
			int last = 0;
			int curr = 1;
			while (curr < dimension)
			{
				//if the tile is empty, merge it with the next non empty tile 
				//to its right if it exists.
				if (board[row][last].isEmpty())
				{
					
					//looking for the next non empty tile
					while (curr < dimension && board[row][curr].isEmpty())
					{
						curr++;
					}
					
					if (curr < dimension)
					{
						board[row][last] = 
								new NumberTile(board[row][curr].getValue());
						board[row][curr].setValue(0);
						boardChanged = true;
						curr++;
					}
				}
				
				//if the tile is not empty, merge it with the next non 
				// empty tile with the same value
				else
				{
					while (curr < dimension && board[row][curr].isEmpty())
					{
						curr++;
					}
					
					if (curr < dimension)
					{
						//if the values of the two tiles are equal, 
						//merge the tiles
						if (board[row][curr].getValue() 
								== board[row][last].getValue())
						{
							board[row][last]
									.setValue(2 * board[row][last].getValue());
							
							//add the value of merged tile to the score addition
							scoreAdd += board[row][last].getValue();
							board[row][curr].setValue(0);
							
							//check if you got 2048
							check2048(board[row][last]);
							
							
							
							
							//since tiles were merged number of tiles decrements
							numberOfTiles--;
							last++;
							
							boardChanged = true;
							curr = last + 1;
						}
						else
						{
							last++;
							if (last == curr)
							{
								curr++;
							}
						}
					}
				}		
			}
		}
		
		//after every swipe, insert a random tile only if the 
		//swipe actually changed anything
		if (boardChanged)
		{
			String location = Math.random() < .9 ? insertTwo(): insertFour();
			String swipe = "L";
			Move l = new Move(location, swipe, scoreAdd);
			return l;
		}
		
		//if nothing has changed
		return new Move("", "L", 0);
	}
	
	/**
	 * Swipes right, collapsing appropriate tiles. Adds a new 2 tile.
	 * @return the addition to the score after the swipe
	 */
	public Move swipeRight()
	{
		int scoreAdd = 0;
		boolean boardChanged = false;

		for (int row = 0; row < dimension; row++)
		{
			int last = dimension - 1;
			int curr = last - 1;
			while (curr >= 0)
			{
				if (board[row][last].isEmpty())
				{
					while (curr >= 0 && board[row][curr].isEmpty())
					{
						curr--;
					}
					
					if (curr >= 0)
					{
						board[row][last] 
								= new NumberTile(board[row][curr].getValue());
						board[row][curr].setValue(0);
						
						boardChanged = true;
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
						if (board[row][curr].getValue() 
								== board[row][last].getValue())
						{
							board[row][last]
									.setValue(2 * board[row][last].getValue());
							scoreAdd += board[row][last].getValue();
							
							board[row][curr].setValue(0);
							
							//check if you got 2048
							check2048(board[row][last]);
							
							numberOfTiles--;
							boardChanged = true;
							
							last--;
							curr = last - 1;
						}
						else
						{
							last--;
							if (last == curr)
							{
								curr--;
							}
						}
					}
				}		
			}
		}
		
		//after every swipe, insert a random tile only if the 
		//swipe actually changed anything
		if (boardChanged)
		{
			//90% chance of inserting a 2, 10% of inserting a 4.
			String location = Math.random() < .9 ? insertTwo(): insertFour();
			String swipe = "R";
			Move r = new Move(location, swipe, scoreAdd);
			return r;
		}
		
		//if nothing has changed
		return new Move("", "R", 0);
	}
	
	/**
	 * Swipes down, collapsing appropriate tiles. Adds a new 2 tile.
	 * @return the addition to the score after the swipe
	 */
	public Move swipeDown()
	{
		int scoreAdd = 0;
		boolean boardChanged = false;
		
		for (int col = 0; col < dimension; col++)
		{
			int last = dimension - 1;
			int curr = last - 1;
			while (curr >= 0)
			{
				if (board[last][col].isEmpty())
				{
					while (curr >= 0 && board[curr][col].isEmpty())
					{
						curr--;
					}
					
					if (curr >= 0)
					{
						board[last][col] 
								= new NumberTile(board[curr][col].getValue());
						board[curr][col].setValue(0);
						
						boardChanged = true;
						curr--;
					}
				}
				
				else
				{
					while (curr >=0 && board[curr][col].isEmpty())
					{
						curr--;
					}
					if (curr >= 0)
					{
						if (board[curr][col].getValue() 
								               == board[last][col].getValue()) 
						{
							board[last][col]
									.setValue(2 * board[last][col].getValue());
							scoreAdd += board[last][col].getValue();
							board[curr][col].setValue(0);
							
							//check if you got 2048
							check2048(board[last][col]);
							
							numberOfTiles--;
							boardChanged = true;
							
							last--;
							curr = last - 1;
						}
						else
						{
							last--;
							if (last == curr)
							{
								curr--;
							}
						}
					}
				}		
			}
		}
		
		//after every swipe, insert a random tile only if the 
		//swipe actually changed anything
		if (boardChanged)
		{
			String location = Math.random() < .9 ? insertTwo(): insertFour();
			String swipe = "D";
			Move d = new Move(location, swipe, scoreAdd);
			return d;
		}
		
		//if nothing has changed
		return new Move("", "D", 0);
	}
	
	/**
	 * Swipes up, collapsing appropriate tiles. Adds a new 2 tile.
	 * @return the addition to the score after the swipe
	 */
	public Move swipeUp()
	{
		int scoreAdd = 0;
		boolean boardChanged = false; 
		
		for (int col = 0; col < dimension; col++)
		{
			int last = 0;
			int curr = 1;
			while (curr < dimension)
			{
				if (board[last][col].isEmpty())
				{
					while (curr < dimension && board[curr][col].isEmpty())
					{
						curr++;
					}
					
					if (curr < dimension)
					{
						board[last][col] 
								 = new NumberTile(board[curr][col].getValue());
						board[curr][col].setValue(0);
						
						boardChanged = true;
						curr++;
					}
				}
				
				else
				{
					while (curr < dimension && board[curr][col].isEmpty())
					{
						curr++;
					}
					if (curr < dimension)
					{
						if (board[curr][col].getValue() 
								         == board[last][col].getValue())
						{

							board[last][col]
									 .setValue(2 * board[last][col].getValue());
							scoreAdd += board[last][col].getValue();
							board[curr][col].setValue(0);

							//check if you got 2048
							check2048(board[last][col]);
							
							numberOfTiles--;
							boardChanged = true;
							
							last++;
							curr = last + 1;
						}
						else
						{
							last++;
							if (last == curr)
							{
								curr++;
							}
						}
					}
				}		
			}
		}
		//after every swipe, insert a random tile only if the 
		//swipe actually changed anything
		if (boardChanged)
		{
			String location = Math.random() < .9 ? insertTwo(): insertFour();
			String swipe = "U";
			Move u = new Move(location, swipe, scoreAdd);
			return u;
		}
		
		//if nothing has changed
		return new Move("", "U", 0);
	}
	
	/**
	 * Returns the dimension of the board
	 * @return the dimension of the board
	 */
	public int getDimension()
	{
		return dimension;
	}
	
	private void check2048(NumberTile n)
	{
		if (n.getValue() == 2048)
		{
			reached2048 = true;
		}
	}
}
