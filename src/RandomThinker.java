/**
 * A thinker that chooses the next move randomly
 * @author Jessie Liu
 *
 */
public class RandomThinker implements Thinker
{
	public RandomThinker()
	{
		
	}
	
	/**
	 * Chooses a random next move
	 * @return L to move left, R to move right, 
	 * 			U to move up, D to move down
	 */
	public String nextMove(GameBoard gb)
	{
		int move = (int) (Math.random() * 4);
		if (move == 0)
		{
			return "L";
		}
		
		else if (move == 1)
		{
			return "R";
		}
		
		else if (move == 2)
		{
			return "U";
		}
		
		else return "D";
	}
}
