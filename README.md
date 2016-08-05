#twenty-forty-eight
###The Ultimate Usage Guide

## Overview
This assignment is created for Prof. Selman's course and is based off of the game 2048 created by Gabriele Cirulli. (Play it here: https://gabrielecirulli.github.io/2048/, Source code: https://github.com/gabrielecirulli/2048.) The game board is traditionally a 4x4 board of tiles, which starts off with two "2" tiles placed in random spots on the board. The player can swipe Left, Right, Up, or Down to move all tiles linearly in that direction. Adjacent tiles with the same value are merged into a single tile, and their values are added. Merges happen sequentially from the side that is swiped to; if there is a row [ 4 2 2 2 ] and the player swipes right, the resulting board is [ - 4 2 4 ] where [-] is a blank tile. After each swipe that changes the state of the board, a [2] or [4] tile is added in a random spot on the board. Every time two tiles are merged, the value of the new tile is added to the score. The game ends when there are no more possible moves - when every spot on the board is filled with a non empty tile and nothing can be merged. 

Students will play the game by connecting to a server and running their own code, written to return the next move in the game. The game code is written in Java and the server is hosted by AWS.

## Setting up the AWS EC2 instance
Follow the steps here to create and connect to an instance. In this case, I'll be making an Ubuntu instance. Make sure to do the prerequisites (set up a key pair, and save it in a handy place): http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html. During set up, create a security rule with a custom TCP rule type, uses a TCP protocol, and that listens on the port specified in your Tester code (currently set up to be 6174, Kaprekar's constant!) Allow the source to be anywhere. This will allow people to actually connect to your server. It can take a bit to start up. 

Once connected, make a directory to store your java files using `mkdir`. Upload files to the directory from a terminal window not connected to the server like so:

`$scp -i [path to your key pair] *.java [user@ec2-107-20-98-238.compute-1.amazonaws.com]:[name of your directory]`

Ignore the [ ], they're just there to keep things separate. Replace *.java if you don't want to upload every java file. If you aren't in the directory that contains the java files on your machine, make sure to include the path to the java files. Now from a terminal window connected to the server, open your directory and check if everything made it. You should see the files/file that you uploaded.

#### Java set up
1. Update the package with `sudo apt-get update`.
2. Check if java is already installed with `java -version`
3. Get the Java Development Kit with `sudo apt-get install default-jdk`

-----

## Game Code Overview
`ServerTester` has a main method that creates a `GameServer` listening on specific port (currently 6174), and starts the server. Run `ServerTester` from the web instance. `ClientTester` has a main method that creates a `GameClient`, with parameters for the Public IP of the server (specified on the AWS instance) and the port to connect to (the same one that the game server is listening on.) Students should run `ClientTester` to connect to the server and play the game.

###NumberTile
`NumberTiles` can have a value or can also be empty (have a value of 0.) The string version of an empty tile is "-" to not clutter the board when printing to the console. "Empty" `GameBoards` should be filled with NumberTiles of value 0.

###GameBoard
A GameBoard has methods for swiping left, right, up and down, and can also be constructed to have a custom square dimension (it defaults to being a 4x4 board.) The methods for swiping return a `Move`. `toString()` converts and formats the board into a String, where each row is a new line.

###Move
Stores information from each swipe - the location of the new `NumberTile` added, the swipe, and how much the score changed.

###Thinker
`Thinker` is an interface with one method: `nextMove(GameBoard gb)`. Classes that implement this interface are intended to find the next move, given a board. An example is `RandomThinker` which chooses the next move randomly. In other Thinkers other methods could be added to help make smarter choices for the next move.

###Game
Each `Game` has a `GameBoard`, a `GamePlayer`, and a score. The game advances when `playNextMove(String move)` is called on a Game object, which takes in a move and throws an exception if the move isn't L, R, U, or D. This method alters the game's Board, updates the score, and returns the updated board.  

###GameClient
`GameClient` has one public method, `startRunning()`, which connects to the server using the IP and port number specified in the constructor. Exceptions `UnknownHostException` and `IOException` can be thrown, usually when the server is listening on a different port, the wrong IP address is used, or the client program starts before the server program is running. When connection is established, a message is printed to the console running the `Client` program. Within `startRunning()`, a `Thinker` object is created - the type of Thinker that is created is up to the student. While there is still information from the server being sent, the program prints the input from the server to the console. If the server input is a board, the `Thinker`'s `nextMove(GameBoard gb)` method will be called to get the next move and that move will be sent back to the server. The server input is known to be a board if the message contains a semicolon character: ";". An important caveat is that _no non-board messages can contain a semicolon_. If the server input is not a board, the client waits for the user to manually enter input that it will send to the server. If the server input includes the words "Game Over!" the client exits the system.

###GameServer
Has one method: `startRunning()`. Creates a new ServerSocket listening on a specific port, and with a specific maximum queue length for incoming connection indications. Currently that max queue length is hard coded at 100, but this can be changed. Every time a connection is made to the server from a client (`GameClient`), a new `GameThread` is created to deal with the Client.

###GameThread
Threads do the actual playing of the game with client. A `Game` is created. After requesting the information like a NetID, the board is sent as a String to the client. Note: The String version of the board is different from just the `toString()` method of `GameBoard` - the Client only reads one line of input at a time, so instead of line breaks after each row, the "\n" character is replaced with a semicolon. No non-board messages can contain a semicolon. The `GameThread` interprets client input of moves by playing the move on the board and sending it back.

##MySQL
https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-14-04





