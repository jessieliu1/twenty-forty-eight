

function getData() {
	
    GameTiles = [];
    GameTiles[0] = [0, 2, 4, 0];
    GameTiles[1] = [8, 16, 32, 0];
    GameTiles[2] = [64, 128, 256, 0];
    GameTiles[3] = [0, 2, 4, 0];
}

function displayData() {
    var c = document.getElementById("canvas1");
    var ctx = c.getContext("2d");
    ctx.font = "20px Helvetica";
    spacing = 10;
    ctx.fillStyle = "rgb(187,173,161)";
    ctx.fillRect(0, 0, c.width, c.height);
    tileWidth = (c.width - 5 * spacing) / 4;
    for (i = 0; i < 4; i++) {
        for (j = 0; j < 4; j++) {
            if (GameTiles[j][i] == 0) {
                ctx.fillStyle = "rgb(205,193,181)";
                ctx.fillRect(i * tileWidth + spacing * (i + 1), 
                	j * tileWidth + spacing * (j + 1), tileWidth, tileWidth);
            } 
            else {
                ctx.fillStyle = "rgb(238,228,219)";
                ctx.fillRect(i * tileWidth + spacing * (i + 1), 
                	j * tileWidth + spacing * (j + 1), tileWidth, tileWidth);
                ctx.fillStyle = "rgb(119,110,101)";
                ctx.fillText(GameTiles[j][i], 
                	i * tileWidth + spacing * (i + 1) + tileWidth / 2, 
                	j * tileWidth + spacing * (j + 1) + tileWidth / 2);
                ctx.stroke();
            }
        }
    }
}