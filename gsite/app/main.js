function buildHTMLtable(jobject){
            var columnSet= ["move_number", "swipe", "score"];
            var table = "<table class='table'>";
            var tblHeader = "<thead> <tr>";
            for (var key = 0; key < columnSet.length; key++) {
                tblHeader += "<th>" + columnSet[key] + "</th>";
            }
            tblHeader += " </tr> </thead>";
            table += tblHeader;
            
            var body = "<tbody> ";
            for (var row = 0; row < jobject.length; row++)
            {
                body += "<tr>";
                for (var col = 0; col < columnSet.length; col++)
                {
                    body += "<td>" + jobject[row][columnSet[col]] + "</td>";
                }
                body += "</tr>";
            }
            body += "</table>";

            table += body;

            return table;
        };


        function displayGameBoard(move_num){
            
            if (window.data_table.length > 0)
            {   
                var board = [];
                for (var i = 0; i < 4; i++){
                    board[i] = [];
                    
                    for (var j = 0; j < 4; j++){
                        var key = i+', ' +j;
                        board[i][j] = window.data_table[move_num][key];
                    }
                }

                var cvs = document.getElementById("gameboard");
                var ctx = cvs.getContext("2d");

                spacing = 10;
                ctx.fillStyle = "rgb(182,172,158)";

                ctx.fillRect(0, 0, cvs.width, cvs.height);
                tileWidth = (cvs.width - 5 * spacing) / 4;

                colors_dictionary={
                    0: ["rgb(201,192,178)"],
                    2: ["rgb(235,227,217)"],
                    4: ["rgb(233,223,199)"],
                    8: ["rgb(242,177,121)"],
                    16: ["rgb(245,149,99)"],
                    32: ["rgb(246,124,95)"],
                    64: ["rgb(246,94,59)"],
                    128: ["rgb(237,207,114)"],
                    256: ["rgb(237,204,97)"],
                    512: ["rgb(237,200,80)"],
                    1024: ["rgb(237,197,63)"],
                    2048: ["rgb(237,194,46)"],
                    other: ["rgb(0,0,0)"]
                };

                for (i = 0; i < 4; i++) {
                     for (j = 0; j < 4; j++) {
                        var x = ((j + 1) * spacing) + (j * tileWidth);
                        var y = ((i + 1) * spacing) + (i * tileWidth);

                        tileVal = board[i][j];
                        if (tileVal <= 2048){
                            ctx.fillStyle = colors_dictionary[tileVal][0];
                            ctx.fillRect(x, y, tileWidth, tileWidth); 
                        }
                        else{
                            ctx.fillStyle = colors_dictionary["other"][0];
                            ctx.fillRect(x, y, tileWidth, tileWidth); 
                        }
                        

                        if (tileVal != 0)
                        {
                            if (tileVal > 4){
                                ctx.fillStyle = "rgb(255,255,255)";
                            }
                            else{
                                ctx.fillStyle = "rgb(119,110,101)";
                            }

                            if (tileVal > 512){
                                var fontSize = 28;
                                ctx.font = "28px Futura";
                            }
                            else{
                                var fontSize = 34;
                                ctx.font = "34px Futura";
                            }
                            ctx.textAlign = "center";
                            ctx.fillText(board[i][j], x + tileWidth/2,
                                y + spacing + tileWidth/2);
                            ctx.stroke();
                        }

                        } 
                    }

            }

            else
            {
                var cvs = document.getElementById("gameboard");
                var ctx = cvs.getContext("2d");
                ctx.fillStyle = "rgb(119,136,153)";
                ctx.fillRect(0, 0, cvs.width, cvs.height);
            }
        };



        function displayResultsTable(){
            if (window.data_table.length == 0)
            {
                $("#table-results").html("No results"); 
            }
            else{
                var table_html = buildHTMLtable(window.data_table);
                $("#table-results").html(table_html); 
            }

        };

        function updateLabels(move_num){
            $('#game-id').html("game id: " + window.data_table[move_num]["game_id"]);
            $('#net-id').html("net id: " + window.data_table[move_num]["net_id"]);
            $('#move-number').html("move number: " + window.data_table[move_num]["move_number"]);
            $('#score').html("score: " + window.data_table[move_num]["score"])
            if (move_num != 0){
                $('#swipe').html("swipe: " + window.data_table[move_num]["swipe"]);

            }
            
            
        }

        $(document).ready(function() {
            $('#next-button').hide();
            $('#prev-button').hide();
            $('#labels').hide();

            $('#search-text').keypress(function(event){
                //prevent page refresh when pressing enter
                //submit search when pressing enter
                if (event.keyCode==13)
                {
                    event.preventDefault();
                    $('#search-submit').trigger('click');
                }
            });

            $('#search-submit').click(function(){
                var payload = {
                    q: $('#search-text').val()
                };

                $.ajax({
                    url: "/search",
                    type: "GET",
                    dataType: "json",
                    data: payload,
                    complete: function (data) {
                        $('#welcome').hide();
                        $('#labels').show();
                        window.data_table = JSON.parse(data.responseText);
                        if (window.data_table.length > 0){
                            updateLabels(0);
                        }
                        else{
                            //don't show labels if there are no results
                            $('#labels').hide();
                        }
                        window.move_number = 0
                        displayResultsTable();
                        displayGameBoard(window.move_number);
                        $('#next-button').show();
                        $('#prev-button').show();      
                    }
                });

            });

            $('#next-button').click(function(){
                if (window.move_number < window.data_table.length - 1) {
                    window.move_number += 1;
                    updateLabels(window.data_table[window.move_number]["move_number"]);
                    displayGameBoard(window.move_number);
                }
            });

            $('#prev-button').click(function(){
                if (window.move_number > 0) {
                    window.move_number -= 1;
                    updateLabels(window.move_number);
                    displayGameBoard(window.move_number);
                }
            });
        });