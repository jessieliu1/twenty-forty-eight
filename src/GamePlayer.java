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
	
	/**
	 * Defaults thinker as a random thinker
	 * @param name
	 */
	public GamePlayer(String name)
	{
		this.name = name;
		highScore = 0;
		gamesPlayed = 0;
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
	
	/**
	 * Gets the high score of the player
	 * @return the high score of the player
	 */
	public int getHighScore()
	{
		return highScore;
	}
	
	public String getName()
	{
		return name;
	}
	
	public void setName(String s)
	{
		name = s;
	}
	

}
