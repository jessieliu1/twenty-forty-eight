
public interface Thinker 
{
	/**
	 * Given a GameBoard, choose the next move for the player to make
	 * @param gb the GameBoard
	 * @return L to move left, R to move right, 
	 * 			U to move up, D to move down
	 */
	String nextMove(GameBoard gb);
}
