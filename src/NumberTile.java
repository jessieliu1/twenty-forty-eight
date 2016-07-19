import java.security.InvalidParameterException;

/**
 * Represents a NumberTile. Tiles can only have values that are powers of 2.
 * A blank tile has a value of 0. 
 * @author Jessie Liu
 *
 */
public class NumberTile 
{
	private int value;
	private boolean blank;
	
	/**
	 * Creates a blank NumberTile (tile with value of 0)
	 */
	public NumberTile()
	{
		this.value = 0;
		blank = true;
	}
	
	/**
	 * Creates a tile with a specified non zero value
	 * @param value the value to give the tile
	 */
	public NumberTile(int value)
	{
		this.value = value;
		blank = false;
	}
	
	/**
	 * Gets the value of a tile
	 * @return the value of the tile
	 */
	public int getValue()
	{
		return value;
	}
	
	/**
	 * Sets the value of a tile to be something else
	 * @param value the new value of the tile
	 */
	public void setValue(int value)
	{
		if (value % 2 != 0 || value < 0)
		{
			throw new InvalidParameterException("Values cannot be odd or "
					+ "negative");
		}
		else
		{
			this.value = value;
			if (value == 0)
			{
				blank = true;
			}
			else
			{
				blank = false;
			}
		}
	}
	
	/**
	 * Returns whether or not the tile is blank
	 * @return whether the tile is blank
	 */
	public boolean isEmpty()
	{
		return this.blank;
	}
	
	/**
	 * Returns the tile as a string. If the tile is empty returns "-".
	 */
	public String toString()
	{
		if (value == 0)
		{
			return "-";
		}
		else return Integer.toString(value);
	}
	
}
