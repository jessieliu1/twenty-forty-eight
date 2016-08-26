/**
 * Represents a 2048 game
 * @author Jessie Liu
 *
 */
public class Game 
{
	private GameBoard board;
	private Move lastMove = null;
	private int score;
	private String ID;
	
	/**
	 * Creates a game with the default 4x4 board
	 * @param id the game id 
	 */
	public Game(String id)
	{
		board = new GameBoard();
		score = 0;
		ID = id;
	}
	
	/**
	 * Creates a game with a board of a given dimension
	 * @param dimension the dimension of the board
	 */
	public Game(String id, int dimension)
	{
		board = new GameBoard(dimension);
		score = 0;
		ID = id;
	}
	
	/**
	 * Plays the game with a given player 
	 * @param the next move of the user. must be "L", "R", "U", or "D"
	 * 			case insensitive
	 * @return the board after the move
	 * @throws InvalidMoveException
	 */
	public GameBoard playNextMove(String nextMove) throws InvalidMoveException
	{
		//if the game isn't over, play the next move
		//and return the updated board
		if (!isGameOver())
		{
			if (nextMove.toUpperCase().equals("L"))
			{
				lastMove = board.swipeLeft(getScore());
				score = lastMove.getNewScore();
			}
			else if (nextMove.toUpperCase().equals("R"))
			{
				lastMove = board.swipeRight(getScore());
				score = lastMove.getNewScore();
			}
			else if (nextMove.toUpperCase().equals("U"))
			{
				lastMove = board.swipeUp(getScore());
				score = lastMove.getNewScore();
			}
			else if (nextMove.toUpperCase().equals("D"))
			{
				lastMove = board.swipeDown(getScore());
				score = lastMove.getNewScore();
			}
			else 
			{
				throw new InvalidMoveException();
			}
			
			return board;
		}
		
		//otherwise, end the game and return a null board
		else
		{
			return null;
		}
	}	
	
	/**
	 * Returns if the game is over
	 */
	public boolean isGameOver()
	{
		return !board.moreMoves();
	}
	
	public Move getLastMove()
	{
		return lastMove;
	}
	
	public GameBoard getBoard()
	{
		return board;
	}
	
	public String getID()
	{
		return ID;
	}
	
	public int getScore()
	{
		return score;
	}
	
}
