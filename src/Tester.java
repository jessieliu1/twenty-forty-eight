import java.util.Arrays;

public class Tester 
{
	public static void main(String args[])
	{	
		GameBoard b = new GameBoard();
		
//		System.out.println(Arrays.deepToString(b.getBoard()));
//		System.out.println(b.moreMoves());
		for (int i = 0; i < 15; i ++)
		{
			b.insertTwo();
		}
		
		System.out.println(b);
		System.out.println(b.swipeRight());
		System.out.println("right");
		System.out.println(b);
		System.out.println(b.swipeRight());
		System.out.println("right");
		System.out.println(b);
		System.out.println(b.swipeDown());
		System.out.println("down");
		System.out.println(b);
		System.out.println(b.swipeUp());
		System.out.println("up");
		System.out.println(b);
		
		
		
		
//		System.out.println(b.swipeRight());
//		System.out.println("right");
//		System.out.println(b);
//		System.out.println(b.swipeDown());
//		System.out.println("down");
//		System.out.println(b);
//		System.out.println(b.swipeUp());
//		System.out.println("up");
//		System.out.println(b);
//		System.out.println(b.swipeRight());
//		System.out.println("right");
//		System.out.println(b);

		
		
	}

	

}
