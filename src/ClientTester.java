
public class ClientTester 
{
	public static void main(String args[])
	{
		//parameters are the IP address, port number, and the thinker you want to use
		
		GameClient gc = new GameClient("Jessies-Macbook-Pro.local",6174,
														new RandomThinker());
		gc.startRunning();

	}
}
