#twenty-forty-eight

## Overview
This project is created for Prof. Selman's Artifical Intelligence course at Cornell University and is based off of the game 2048 created by Gabriele Cirulli. (Play it here: https://gabrielecirulli.github.io/2048/, Source code: https://github.com/gabrielecirulli/2048.) The game board is traditionally a 4x4 board of tiles, which starts off with two "2" or "4" tiles placed in random spots on the board. The player can swipe Left, Right, Up, or Down to move all tiles linearly in that direction. Adjacent tiles with the same value are merged into a single tile, and their values are added. Merges happen sequentially from the side that is swiped to; if there is a row [ 4 2 2 2 ] and the player swipes right, the resulting board is [ - 4 2 4 ] where [-] is a blank tile. After each swipe that changes the state of the board, a [2] or [4] tile is added in a random spot on the board. Every time two tiles are merged, the value of the new tile is added to the score. The game ends when there are no more possible moves - when every spot on the board is filled with a non empty tile and nothing can be merged. 

Students will play the game by connecting to a server and running their own code, written to send the next move in the game to the server. The game code is written in Java and the server will be hosted by AWS.

## Setting up the AWS EC2 instance
Follow the steps here to create and connect to an instance: http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html. This example will use an Ubuntu instance. Make sure to do the prerequisites (set up a key pair, and save it in a handy place - you won't be able to connect to the instance without it!) During set up, create a security rule with a custom TCP rule type, uses a TCP protocol, and that listens on the port specified in the ServerTester code (currently set up to be 6174, Kaprekar's constant.) Allow the source to be anywhere. This will allow people to actually connect to your server. It can take a bit to start up. 

Connect to your instance from the terminal window using the information given when you press "Connect" from the EC2 management console.

Once connected to the instance, make a directory to store your java files using `mkdir [name of directory]`. Upload files to the directory from a terminal window not connected to the server like so:

`$scp -i [path to your key pair] *.java [user@ec2-107-20-98-238.compute-1.amazonaws.com]:[name of your directory]`

(Do not include the [ ] in the above code section, but replace the contents of the brackets.) Replace *.java if you don't want to upload every java file. If you aren't in the directory that contains the java files on your machine, make sure to include the path to the java files. Now from a terminal window connected to the server, open your directory and check if everything made it. You should see the files/file that you uploaded.

#### Java set up in Ubuntu
1. Update the package with `sudo apt-get update`.
2. Check if java is already installed with `java -version`
3. Get the Java Development Kit with `sudo apt-get install default-jdk`

-----

## Running the Java Code
A prereq to running the Java code is having a MySQL database already created, and having the right database information in the Java code so it can correctly write to it. Check out the sections on MySQL and Database Access [below](#mysql).
Since the server writes move data to a MySQL database, the code utilizes a JDBC driver which is not contained in the standard Java library. This allows a connection to the MySQL database to be made, and the connection is created in the `GameDBAccess` class, which every `GameThread` uses. At compile time, if the .jar file is not added to the classpath, you will get a `ClassNotFoundException` which is not fun. The driver (ConnectorJ) can be downloaded here: https://dev.mysql.com/downloads/connector/j/. Once it is downloaded to the instance, unzip the file (`sudo apt-get install unzip`) and move the .jar file into the src directory for easy access.

In the terminal from the src directory in the 2048 project, run

1. `javac -cp .:/path/to/jar/file *.java` to compile all java files
2. `java -cp .:/path/to/jar/file ServerTester` to start the java server.

This might look something like this: `javac -cp .:mysql-connector-java-5.1.39-bin.jar *.java`.

I haven't tried this on the AWS server yet, but this works when running locally. 

To connect to the server from another computer, from a directory with all the Java files (except the `GameServer`, `ServerTester`, and `GameDBAccess` files - the student doesn't need those), compile all the files and run `ClientTester.java`. Make sure that the fields for IP address, port number, and the thinker are the ones you want (the ones that correspond to the public IP address of the AWS instance/computer running the Java server and the port that you specified to be open in the AWS security port and `ServerTester` code.)
After connected to the server, this message should be printed to the console:
>Connection Established! Connected to: host-name

>Server:

>Hello, would you like to play? (Y/N)

##Class Overview
----
###NumberTile
`NumberTiles` can have a value or can also be empty (have a value of 0.) The string version of an empty tile is "-" to not clutter the board when printing to the console. "Empty" `GameBoards` should be filled with NumberTiles of value 0.

###GameBoard
A GameBoard has methods for swiping left, right, up and down, and can also be constructed to have a custom square dimension (it defaults to being a 4x4 board.) The methods for swiping return a `Move`. `toString()` converts and formats the board into a String, where each row is a new line.

###Move
Stores information from each swipe - the location of the new `NumberTile` added, the swipe, and the new score.

###Thinker
`Thinker` is an interface with one method: `nextMove(GameBoard gb)`. Classes that implement this interface are intended to find the next move, given a board. An example is `RandomThinker` which chooses the next move randomly. In other Thinkers other methods could be added to help make smarter choices for the next move.

###Game
Each `Game` has a `GameBoard`, a `GamePlayer`, and a score. The game advances when `playNextMove(String move)` is called on a Game object, which takes in a swipe and throws an exception if the swipe isn't L, R, U, or D. This method alters the game's Board, updates the score, and returns the updated board.  

###GameClient
`GameClient` has one public method, `startRunning()`, which connects to the server using the IP and port number specified in the constructor. Exceptions `UnknownHostException` and `IOException` can be thrown, usually when the server is listening on a different port, the wrong IP address is used, or the client program starts before the server program is running. When connection is established, a message is printed to the console running the `Client` program. Within `startRunning()`, the `Thinker` object that is passed in through the constructor is used to send moves to the server. While there is still information from the server being sent, the program prints the input from the server to the console. If the server input is a board, the `Thinker`'s `nextMove(GameBoard gb)` method will be called to get the next move and that move will be sent back to the server. The server input is known to be a board if the message contains a semicolon character: ";". An important caveat is that _no non-board messages can contain a semicolon_. This is kind of annoying, but is a workaround for the fact that the BufferedReader only takes in one line at a time and the board spans multiple lines. So the new line characters at the end of each row of the board are replaced with a semicolon when they are sent to the client. If the server input is not a board, the client waits for the user to manually enter input that it will send to the server. If the server input includes the words "Game Over!" the client exits the system.

###GameServer
Has one method: `startRunning()`. Creates a new ServerSocket listening on a specific port, and with a specific maximum queue length for incoming connection indications. Currently that max queue length is hard coded at 100, but this can be changed. Every time a connection is made to the server from a client (`GameClient`), a new `GameThread` is created to deal with the Client.

###GameThread
Threads do the actual playing of the game with client. A `Game` is created. After requesting the information like a NetID, the board is sent as a String to the client. Note: The String version of the board is different from just the `toString()` method of `GameBoard` - the Client only reads one line of input at a time, so instead of line breaks after each row, the "\n" character is replaced with a semicolon. No non-board messages can contain a semicolon. The `GameThread` interprets client input of moves by playing the move on the board and sending it back.

##MySQL
Digital Ocean has some really great MySQL tutorials.

Basic MySQL: https://www.digitalocean.com/community/tutorials/a-basic-mysql-tutorial

For installing mysql on Ubuntu: https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-14-04.

For creating users and granting permissions: https://www.digitalocean.com/community/tutorials/how-to-create-a-new-user-and-grant-permissions-in-mysql

How I created the game_stats table in the database (which I named `tester`):
`CREATE TABLE game_stats(game_id VARCHAR(10), net_id VARCHAR(10), move_number INT, swipe VARCHAR(1), score INT, ``` `0, 0` ``` INT, ``` `0, 1` ``` INT, ``` `0, 2` ``` INT, ``` `0, 3` ``` INT, ``` `1, 0` ``` INT, ``` `1, 1` ``` INT, ``` `1, 2` ``` INT, ``` `1, 3` ``` INT, ``` `2, 0` ``` INT, ``` `2, 1` ``` INT, ``` `2, 2` ``` INT, ``` `2, 3` ``` INT, ``` `3, 0` ``` INT, ``` `3, 1` ``` INT, ``` `3, 2` ``` INT, ``` `3, 3` ``` INT);`

Try `DESCRIBE game_stats` to see if the table was created correctly.

###Database access

The `GameThread` class accesses the database through a  `GameDBAccess` object which requires a specific database name and table name, though the database name is hardcoded into the URL needed to get access within the `GameDBAccess` constant fields. The URL is in this format: `jdbc:<DBMS>://<HOSTNAME>:<PORT_NUMBER>/YOUR_DATABASE_NAME`. The hostname of the database can be found with the MySQL command `SHOW VARIABLES WHERE Variable_name = 'hostname'`. This hostname is different from the hostname that the client uses to access the server (the public IP). To change what database and table to write to, modify the constant fields within the `GameDBAccess` class and alter how the `GameDBAccess` object is constructed within the `GameThread` class (change the string name of the database/table). Same goes for changing the user/password - look into the constants in the `GameDBAccess` class.

`GameDBAccess` has an `insertStatement` variable which is used to insert new move entries into the database table. Essentially the `insertStatement` is a query with set slots that can be filled in, and then sent through MySQL. The question marks in `insertStatement = connect.prepareStatement("insert into " + db + "." + table + " values (?, ?, ?, ?, ?, ?, ?)");` represent the values needed to insert into the table. `populateGameTable()` is an example of how these values can be entered and sent. This is the Java tutorial on prepared statements: http://docs.oracle.com/javase/tutorial/jdbc/basics/prepared.html.


### Setting time limits

http://winterbe.com/posts/2015/04/07/java8-concurrency-tutorial-thread-executor-examples/

http://stackoverflow.com/questions/5715235/java-set-timeout-on-a-certain-block-of-code

The combination of an ExecutorService Java object and a Future object are used to timeout of game session. 

---
##Javascript

The design and set up of this project was largely inspired by this tutorial: (Part 1: http://www.codeproject.com/Articles/1067725/Part-Building-web-app-using-react-js-express-js). 

This project uses Node.js and its accompanying framework express.js, which simplifies the usage of Node. Node is a runtime for Javascript, which allows Javascript to be run outside of a browser. Essentially, it is a program that allows you to create a server and write server side code in Javascript (as opposed to something like PHP). 

###To run on a local computer
Download and install Node: (https://nodejs.org/en/download/). This will also download the Node package manager (npm). 

First, from the root directory (currently named gsite) create and edit a config file with the node config package (https://www.npmjs.com/package/config):

`$ npm install config`

`$ mkdir config`

`$ vim config/default.json` or create and open `default.json` with an editor of your choice.
This is the default.json set up I used: 
####default.json
<pre><code>
  {
  	"dbConfig": {
  		"hostname": "localhost",
  		"user": "username",
  		"password": "your password",
  		"database": "tester"
  	},
  
  	"dbTable": {
  		"table": "game_stats"
  	}
  }
  </code></pre>
This is used to set up the mysql connection from node. config is required in `server.js`.

While in the root project directory (currently named gsite), call 
`npm install`, which should install all the necessary dependencies (listed in the package.json file). Still in the root directory, run `gulp` which minifies the javascript, then run `node server/server.js` which will start the server. Navigate to http://hostname:portnumber (mine is localhost:3000), and hopefully the page shows up.

###Running on AWS
I haven't attempted running the app on AWS but here are some links that can be used in varying degrees to assist in the process:

https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-an-ubuntu-14-04-server

http://www.robert-drummond.com/2013/04/25/a-node-js-application-on-the-amazon-cloud-part-1-installing-node-on-an-ec2-instance/ (specifically the section titled "Using Git to deploy my application to the server")

https://codeforgeek.com/2015/05/setup-node-development-environment-amazon-ec2/#setup_node

https://scotch.io/tutorials/deploying-a-mean-app-to-amazon-ec2-part-1 

Also, make sure that the security groups are configured so that connections to the MySQL database and client connections can be made (the appropriate ports are open).

###Basic code overview
<pre><code>
gsite
  -app
    -dist
      index.html
      main.js
    index.html
    main.js
  -config
  -node_modules
  -server
    server.js
  gulpfile.js
  package.json
</pre></code>

Running `gulp` copies over a minified version of main.js and index.html to the dist directory in app. 

####Next Steps for website:
1. Animate game board to play through entire game without needing to click through
2. Be able to choose which move appears on the board directly/ click a row in the results table to show the move on the board

