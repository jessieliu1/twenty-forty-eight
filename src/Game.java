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
	 * @throws InvalidMoveException
	 */
	public void playGame() throws InvalidMoveException
	{
		System.out.println(board);
		while(board.moreMoves())
		{
			String nextMove = player.nextMove(board);
			System.out.println(nextMove);
			if (nextMove.toUpperCase().equals("L"))
			{
				score += board.swipeLeft();
			}
			else if (nextMove.toUpperCase().equals("R"))
			{
				score += board.swipeRight();
			}
			else if (nextMove.toUpperCase().equals("U"))
			{
				score += board.swipeUp();
			}
			else if (nextMove.toUpperCase().equals("D"))
			{
				score += board.swipeDown();
			}
			else 
			{
				throw new InvalidMoveException();
			}
			System.out.println(board);
			System.out.println("Score is: " + score);
	  }
		
	  player.updateScore(score);
	  player.incrementGames();
	  
	  //TODO: update player in database
	  
	  board = new GameBoard();
	  
	  System.out.println("Game over!");
	}
	
	
}
