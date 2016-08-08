/**
 * Store information for each move
 * @author Jessie Liu
 *
 */
public class Move 
{
	private String location;
	private String swipe;
	private int scoreAdd;
	
	public Move (String l, String s, int sA)
	{
		location = l;
		swipe = s;
		scoreAdd = sA;
	}
	
	public String getLocation()
	{
		return location;
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
