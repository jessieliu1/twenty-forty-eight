/**
 * Store information for each move
 * @author Jessie Liu
 *
 */
public class Move 
{
	private int moveNumber;
	private GameBoard board;
	private String swipe;
	private int scoreAdd;
	
	public Move (int num, GameBoard gb, String swipe, int score)
	{
		moveNumber = num;
		board = gb;
		this.swipe = swipe.toUpperCase();
		scoreAdd = score;
	}
	
	public int getMoveNumber()
	{
		return moveNumber;
	}
	
	public GameBoard getBoard()
	{
		return board;
	}
	
	public String getSwipe()
	{
		return swipe;
	}
	
	public int getScoreAdd()
	{
		return scoreAdd;
	}
}
