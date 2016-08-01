#twenty-forty-eight

## Overview
This assignment is created for Prof. Selman's course and is based off of the game 2048 created by Gabriele Cirulli. (Play it here: https://gabrielecirulli.github.io/2048/, Source code: https://github.com/gabrielecirulli/2048.) The game board is traditionally a 4x4 board of tiles, which starts off with two "2" tiles placed in random spots on the board. The player can swipe Left, Right, Up, or Down to move all tiles linearly in that direction. Tiles with the same value are merged into a single tile, and their values are added. Merges happen sequentially from the side that is swiped to; if there is a row [ 4 2 2 2 ] and the player swipes right, the resulting board is [ - 4 2 4 ] where [-] is a blank tile. After each swipe that changes the state of the board, a [2] or [4] tile is added in a random spot on the board. Every time two tiles are merged, the value of the new tile is added to the score. 

Students will play the game by connecting to a server and running their own code, written to return the next move in the game. The game code is written in Java and the server is hosted by AWS.

### Setting up the AWS server
Follow the steps here to create and connect to an instance. In this case, I'll be making an Ubuntu instance. Make sure to do the prerequisites (setting up a key pair): http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html
During set up, create a security rule with a custom TCP rule type, uses a TCP protocol, and that listens on the port specified in your Tester code (currently set up to be 6174, Kaprekar's constant!) Allow the source to be anywhere. This will allow people to actually connect to your server. It can take a bit to start up. 

Once connected, make a directory to store your java files using mkdir. Upload files to the directory from a terminal window not connected to the server like so:

`$scp -i [path to your key pair] *.java [user@ec2-107-20-98-238.compute-1.amazonaws.com]:[name of your directory]`

Ignore the [], they're just there to keep things separated. Replace *.java if you don't want to upload every java file. If you aren't in the directory that contains the java files on your machine, make sure to include the path to the java files. Now from a terminal window connected to the server, open your directory and check if everything made it. You should see the files/file that you uploaded.

#### Java set up
1. Update the package with `sudo apt-get update`.
2. Check if java is already installed (it shouldn't be) with `java -version`
3. Get the Java Development Kit with `sudo apt-get install default-jdk`




### Game Code
The code that recreates the game is structured as such: Each Game has a GameBoard, a GamePlayer, and a score. A GameBoard is composed of NumberTiles (a GameBoard's core is a two-dimensional array of NumberTiles.)


