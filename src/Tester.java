
public class Tester 
{
	public static void main(String args[])
	{	
//		GamePlayer j = new GamePlayer("j", new RandomThinker());
//		Game g1 = new Game(j);
//		try {
//			g1.playNextMove();
//			Game g2 = new Game(j);
//			g2.playNextMove();
//		} catch (InvalidMoveException e) {
//			System.out.println("your thinker suks");
//		}
//		System.out.println(j.getHighScore());
		
		GameServer testServer = new GameServer(6789);
		testServer.startRunning();
		
	}

	

}
