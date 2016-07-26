
public class Tester 
{
	public static void main(String args[])
	{	
//		GamePlayer j = new GamePlayer("j", new RandomThinker());
//		Game g1 = new Game(j);
//		try {
//			System.out.println(g1.isGameOver());
//			while (!g1.isGameOver())
//			{
//				g1.playNextMove();
//				System.out.println(g1.getBoard().toString());
//			}
//			Game g2 = new Game(j);
//			g2.playNextMove();
//		} catch (InvalidMoveException e) {
//			System.out.println("your thinker suks");
//		}
//		System.out.println(j.getHighScore());
//		System.out.println("but why");
		
		GameServer testServer = new GameServer(6789);
		testServer.startRunning();
		
	}

	

}
