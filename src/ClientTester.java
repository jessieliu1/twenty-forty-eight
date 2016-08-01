
public class ClientTester 
{
	public static void main(String args[])
	{
		//parameters are the IP address and the port number
		GameClient gc = new GameClient("Jessies-Macbook-Pro.local",6174);
		gc.startRunning();
	}
}
