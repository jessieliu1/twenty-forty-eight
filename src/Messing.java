import java.security.InvalidParameterException;
import java.util.Arrays;

public class Messing 
{
	public static void main(String args[])
	{
		NumberTile[][] bloop = new NumberTile[4][4];
		for (int i = 0; i < bloop.length; i++)
		{
			for (int j = 0; j < bloop[0].length; j++)
			{
				bloop[i][j] = new NumberTile();
			}
		}
		bloop[2][2] = new NumberTile(2048);
		
		GameBoard gb = new GameBoard(bloop);
		String sgb = gb.toString();
		GameBoard gb2 = readBoard(sgb);
		System.out.println(Arrays.deepToString(gb.toString().split(":"))
				.replaceAll(",", "\n"));
		System.out.println(Arrays.deepToString(gb2.toString().split(":"))
				.replaceAll(",", "\n"));
		
//		System.out.println(Arrays.toString(gb.toString().split(":")));
//		System.out.println(Arrays.deepToString(gb.toString().split(":"))
//				.replaceAll(",", "\n"));
		
		
		
		
		
		
		
		
//		String p = "h     ho";
//		String[] p2 = p.split("\\s+");
//		System.out.println(Arrays.toString(p2));

		
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
