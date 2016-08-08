import java.security.InvalidParameterException;
import java.sql.SQLException;
import java.util.Arrays;

public class Messing 
{
	public static void main(String args[]) throws SQLException
	{
		GameDBAccess ndb = new GameDBAccess("tester", "potluck");
		
		
	}
	
	/**
	 * Takes in a string that represents the board in this format: 
	 *    # # # # ....#| # # # # ....#| etc. where the # signify number tiles
	 * @param b the string
	 * @return a GameBoard
	 */
	private static GameBoard readBoard(String b)
	{
		String[] rows = b.split(":");
		NumberTile[][] bd = new NumberTile[rows.length][rows.length];
		for (int i = 0; i < rows.length; i++)
		{
			String[] tileValues = rows[i].trim().split("\\s+");
			if (tileValues.length != rows.length)
			{
				throw new InvalidParameterException();
			}
			else
			{
				for (int j = 0; j < tileValues.length; j++)
				{
					String value = tileValues[j];
					if (value.equals("-"))
					{
						bd[i][j] = new NumberTile();
					}
					else
					{
						bd[i][j] = new NumberTile(Integer.parseInt(value));
					}
				}
			}
		}
		return new GameBoard(bd);
	}

}
