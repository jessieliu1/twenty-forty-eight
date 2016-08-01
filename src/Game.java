/**
 * Represents a 2048 game
 * @author Jessie Liu
 *
 */
public class Game 
{
	private GameBoard board;
	private GamePlayer player;
	private int score;
	
	/**
	 * Creates a game with the default 4x4 board
	 * @param p the player of the game
	 */
	public Game(GamePlayer p)
	{
		board = new GameBoard();
		this.player = p;
		score = 0;
	}
	
	/**
	 * Creates a game with a board of a given dimension
	 * @param p the player of the game
	 * @param dimension the dimension of the board
	 */
	public Game(GamePlayer p, int dimension)
	{
		board = new GameBoard(dimension);
		this.player = p;
		score = 0;
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
				score += board.swipeLeft().getScoreAdd();
			}
			else if (nextMove.toUpperCase().equals("R"))
			{
				score += board.swipeRight().getScoreAdd();
			}
			else if (nextMove.toUpperCase().equals("U"))
			{
				score += board.swipeUp().getScoreAdd();
			}
			else if (nextMove.toUpperCase().equals("D"))
			{
				score += board.swipeDown().getScoreAdd();
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
			this.gameOver();
			return null;
		}
	}
	
	/**
	 * Updates player info after a game ends
	 */
	public void gameOver()
	{
		if (isGameOver())
		{
			player.updateScore(score);
			player.incrementGames();
		}
	}
	
	/**
	 * Returns if the game is over
	 */
	public boolean isGameOver()
	{
		return !board.moreMoves();
	}
	

	public GameBoard getBoard()
	{
		return board;
	}
	
	public int getScore()
	{
		return score;
	}
	
}
