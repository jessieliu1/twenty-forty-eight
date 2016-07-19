import java.util.Arrays;

public class Tester 
{
	public static void main(String args[])
	{
//		NumberTile[][] n = new NumberTile[2][2];
//		for (int i = 0; i < n.length; i++)
//		{
//			Arrays.fill(n[i], new NumberTile(2));
//		}
//		for (int p = 0; p <n.length; p++)
//		{
//			for (int l = 0; l < n.length; l++)
//			{
//				System.out.print(n[p][l] + " ");
//			}
//			System.out.println();
//		}
		
		GameBoard b = new GameBoard();
		
		System.out.println(Arrays.deepToString(b.getBoard()));
		System.out.println(b.moreMoves());
		for (int i = 0; i < 15; i ++)
		{
			b.insertTwo();
		}
		
		System.out.println(b);
		System.out.println(b.moreMoves());

		
		
		
	}
	

}
