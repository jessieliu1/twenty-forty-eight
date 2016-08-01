#twenty-forty-eight

## Overview
This assignment is based off of the game 2048 created by Gabriele Cirulli. (Play it here: https://gabrielecirulli.github.io/2048/, Source code: https://github.com/gabrielecirulli/2048.) The game board is traditionally a 4x4 board of tiles, which starts off with two "2" tiles placed in random spots on the board. The player can swipe Left, Right, Up, or Down to move all tiles linearly in that direction. Tiles with the same value are merged into a single tile, and their values are added. Merges happen sequentially from the side that is swiped to; if there is a row [ 4 2 2 2 ] and the player swipes right, the resulting board is [ - 4 2 4 ] where [-] is a blank tile. After each swipe that changes the state of the board, a [2] or [4] tile is added in a random spot on the board.

Students will play the game by connecting to a server and running their own code, written to return the next move in the game. The game code is written in Java and the server is hosted by AWS.



### Setting up the server



### Game Code
The code that recreates the game is structured as such: Each Game has a GameBoard, a GamePlayer, and a score. A GameBoard is composed of NumberTiles (a GameBoard's core is a two-dimensional array of NumberTiles.)


