/**
 * Represents a player of the game 2048. Players have a name,
 * a high score, and know how many games they have played.
 * Players also decide what their next move in the game will be
 * @author Jessie Liu
 *
 */
public class GamePlayer 
{
	private String name;
	private int highScore;
	private int gamesPlayed;
	private Thinker myThinker;
	
	public GamePlayer(String name, Thinker t)
	{
		this.name = name;
		highScore = 0;
		gamesPlayed = 0;
		myThinker = t;
	}
	
	/**
	 * Chooses the next move, based on a thinking strategy 
	 * and the state of the game board
	 * @param gb the game board
	 * @return
	 */
	public String nextMove(GameBoard gb)
	{
		return myThinker.nextMove(gb);
	}
	
	/**
	 * Updates the high score if necessary
	 * @param score the new score of the player
	 */
	public void updateScore(int score)
	{
		if (score > highScore)
		{
			highScore = score;
		}
	}
	
	/**
	 * Increments the number of games played by the player
	 */
	public void incrementGames()
	{
		gamesPlayed++;
	}
	
	public int getHighScore()
	{
		return highScore;
	}
	

}
