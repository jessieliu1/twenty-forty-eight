/**
 * Store information for each move
 * @author Jessie Liu
 *
 */
public class Move 
{
	private int moveNumber;
	private String swipe;
	private String location;
	private int tileValue;
	private int scoreAdd;
	
	public Move (int num, String swipe, String location, int tile, int score)
	{
		moveNumber = num;
		this.swipe = swipe.toUpperCase();
		this.location = location;
		tileValue = tile;
		scoreAdd = score;
	}
	
	public int getMoveNumber()
	{
		return moveNumber;
	}
	
	public String getLocation()
	{
		return location;
	}
	
	public String getSwipe()
	{
		return swipe;
	}
	
	public int getTileValue()
	{
		return tileValue;
	}
	
	public int getScoreAdd()
	{
		return scoreAdd;
	}
}
