(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
                    updateLabels(window.move_number);
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvamVzc2llbGl1L0RvY3VtZW50cy9TdW1tZXIgMjAxNi93Mi8yMDQ4L2dzaXRlL2FwcC9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsU0FBUyxjQUFjLENBQUMsT0FBTyxDQUFDO1lBQ3BCLElBQUksU0FBUyxFQUFFLENBQUMsYUFBYSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztZQUNqRCxJQUFJLEtBQUssR0FBRyx1QkFBdUIsQ0FBQztZQUNwQyxJQUFJLFNBQVMsR0FBRyxjQUFjLENBQUM7WUFDL0IsS0FBSyxJQUFJLEdBQUcsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUU7Z0JBQzdDLFNBQVMsSUFBSSxNQUFNLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQzthQUNsRDtZQUNELFNBQVMsSUFBSSxpQkFBaUIsQ0FBQztBQUMzQyxZQUFZLEtBQUssSUFBSSxTQUFTLENBQUM7O1lBRW5CLElBQUksSUFBSSxHQUFHLFVBQVUsQ0FBQztZQUN0QixLQUFLLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUU7WUFDN0M7Z0JBQ0ksSUFBSSxJQUFJLE1BQU0sQ0FBQztnQkFDZixLQUFLLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUU7Z0JBQy9DO29CQUNJLElBQUksSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQztpQkFDM0Q7Z0JBQ0QsSUFBSSxJQUFJLE9BQU8sQ0FBQzthQUNuQjtB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QUFDLFdBQVcsQ0FBQyxDQUFDO29CQUNqQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7aUJBQ3hDO0FBQ2pCLGFBQWEsQ0FBQyxDQUFDOztZQUVILENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVTtnQkFDOUIsSUFBSSxNQUFNLENBQUMsV0FBVyxHQUFHLENBQUMsRUFBRTtvQkFDeEIsTUFBTSxDQUFDLFdBQVcsSUFBSSxDQUFDLENBQUM7b0JBQ3hCLFlBQVksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7b0JBQ2pDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztpQkFDeEM7YUFDSixDQUFDLENBQUM7U0FDTixDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImZ1bmN0aW9uIGJ1aWxkSFRNTHRhYmxlKGpvYmplY3Qpe1xuICAgICAgICAgICAgdmFyIGNvbHVtblNldD0gW1wibW92ZV9udW1iZXJcIiwgXCJzd2lwZVwiLCBcInNjb3JlXCJdO1xuICAgICAgICAgICAgdmFyIHRhYmxlID0gXCI8dGFibGUgY2xhc3M9J3RhYmxlJz5cIjtcbiAgICAgICAgICAgIHZhciB0YmxIZWFkZXIgPSBcIjx0aGVhZD4gPHRyPlwiO1xuICAgICAgICAgICAgZm9yICh2YXIga2V5ID0gMDsga2V5IDwgY29sdW1uU2V0Lmxlbmd0aDsga2V5KyspIHtcbiAgICAgICAgICAgICAgICB0YmxIZWFkZXIgKz0gXCI8dGg+XCIgKyBjb2x1bW5TZXRba2V5XSArIFwiPC90aD5cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRibEhlYWRlciArPSBcIiA8L3RyPiA8L3RoZWFkPlwiO1xuICAgICAgICAgICAgdGFibGUgKz0gdGJsSGVhZGVyO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgYm9keSA9IFwiPHRib2R5PiBcIjtcbiAgICAgICAgICAgIGZvciAodmFyIHJvdyA9IDA7IHJvdyA8IGpvYmplY3QubGVuZ3RoOyByb3crKylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBib2R5ICs9IFwiPHRyPlwiO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IGNvbHVtblNldC5sZW5ndGg7IGNvbCsrKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgYm9keSArPSBcIjx0ZD5cIiArIGpvYmplY3Rbcm93XVtjb2x1bW5TZXRbY29sXV0gKyBcIjwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJvZHkgKz0gXCI8L3RyPlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYm9keSArPSBcIjwvdGFibGU+XCI7XG5cbiAgICAgICAgICAgIHRhYmxlICs9IGJvZHk7XG5cbiAgICAgICAgICAgIHJldHVybiB0YWJsZTtcbiAgICAgICAgfTtcblxuXG4gICAgICAgIGZ1bmN0aW9uIGRpc3BsYXlHYW1lQm9hcmQobW92ZV9udW0pe1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAod2luZG93LmRhdGFfdGFibGUubGVuZ3RoID4gMClcbiAgICAgICAgICAgIHsgICBcbiAgICAgICAgICAgICAgICB2YXIgYm9hcmQgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDQ7IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgIGJvYXJkW2ldID0gW107XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IDQ7IGorKyl7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIga2V5ID0gaSsnLCAnICtqO1xuICAgICAgICAgICAgICAgICAgICAgICAgYm9hcmRbaV1bal0gPSB3aW5kb3cuZGF0YV90YWJsZVttb3ZlX251bV1ba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBjdnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWVib2FyZFwiKTtcbiAgICAgICAgICAgICAgICB2YXIgY3R4ID0gY3ZzLmdldENvbnRleHQoXCIyZFwiKTtcblxuICAgICAgICAgICAgICAgIHNwYWNpbmcgPSAxMDtcbiAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJyZ2IoMTgyLDE3MiwxNTgpXCI7XG5cbiAgICAgICAgICAgICAgICBjdHguZmlsbFJlY3QoMCwgMCwgY3ZzLndpZHRoLCBjdnMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICB0aWxlV2lkdGggPSAoY3ZzLndpZHRoIC0gNSAqIHNwYWNpbmcpIC8gNDtcblxuICAgICAgICAgICAgICAgIGNvbG9yc19kaWN0aW9uYXJ5PXtcbiAgICAgICAgICAgICAgICAgICAgMDogW1wicmdiKDIwMSwxOTIsMTc4KVwiXSxcbiAgICAgICAgICAgICAgICAgICAgMjogW1wicmdiKDIzNSwyMjcsMjE3KVwiXSxcbiAgICAgICAgICAgICAgICAgICAgNDogW1wicmdiKDIzMywyMjMsMTk5KVwiXSxcbiAgICAgICAgICAgICAgICAgICAgODogW1wicmdiKDI0MiwxNzcsMTIxKVwiXSxcbiAgICAgICAgICAgICAgICAgICAgMTY6IFtcInJnYigyNDUsMTQ5LDk5KVwiXSxcbiAgICAgICAgICAgICAgICAgICAgMzI6IFtcInJnYigyNDYsMTI0LDk1KVwiXSxcbiAgICAgICAgICAgICAgICAgICAgNjQ6IFtcInJnYigyNDYsOTQsNTkpXCJdLFxuICAgICAgICAgICAgICAgICAgICAxMjg6IFtcInJnYigyMzcsMjA3LDExNClcIl0sXG4gICAgICAgICAgICAgICAgICAgIDI1NjogW1wicmdiKDIzNywyMDQsOTcpXCJdLFxuICAgICAgICAgICAgICAgICAgICA1MTI6IFtcInJnYigyMzcsMjAwLDgwKVwiXSxcbiAgICAgICAgICAgICAgICAgICAgMTAyNDogW1wicmdiKDIzNywxOTcsNjMpXCJdLFxuICAgICAgICAgICAgICAgICAgICAyMDQ4OiBbXCJyZ2IoMjM3LDE5NCw0NilcIl0sXG4gICAgICAgICAgICAgICAgICAgIG90aGVyOiBbXCJyZ2IoMCwwLDApXCJdXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCA0OyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCA0OyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB4ID0gKChqICsgMSkgKiBzcGFjaW5nKSArIChqICogdGlsZVdpZHRoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB5ID0gKChpICsgMSkgKiBzcGFjaW5nKSArIChpICogdGlsZVdpZHRoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGlsZVZhbCA9IGJvYXJkW2ldW2pdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRpbGVWYWwgPD0gMjA0OCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yc19kaWN0aW9uYXJ5W3RpbGVWYWxdWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCB0aWxlV2lkdGgsIHRpbGVXaWR0aCk7IFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gY29sb3JzX2RpY3Rpb25hcnlbXCJvdGhlclwiXVswXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdHguZmlsbFJlY3QoeCwgeSwgdGlsZVdpZHRoLCB0aWxlV2lkdGgpOyBcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIFxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGlsZVZhbCAhPSAwKVxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aWxlVmFsID4gNCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBcInJnYigyNTUsMjU1LDI1NSlcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IFwicmdiKDExOSwxMTAsMTAxKVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aWxlVmFsID4gNTEyKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZvbnRTaXplID0gMjg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5mb250ID0gXCIyOHB4IEZ1dHVyYVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZm9udFNpemUgPSAzNDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmZvbnQgPSBcIjM0cHggRnV0dXJhXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5maWxsVGV4dChib2FyZFtpXVtqXSwgeCArIHRpbGVXaWR0aC8yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5ICsgc3BhY2luZyArIHRpbGVXaWR0aC8yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFyIGN2cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZWJvYXJkXCIpO1xuICAgICAgICAgICAgICAgIHZhciBjdHggPSBjdnMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBcInJnYigxMTksMTM2LDE1MylcIjtcbiAgICAgICAgICAgICAgICBjdHguZmlsbFJlY3QoMCwgMCwgY3ZzLndpZHRoLCBjdnMuaGVpZ2h0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuXG5cbiAgICAgICAgZnVuY3Rpb24gZGlzcGxheVJlc3VsdHNUYWJsZSgpe1xuICAgICAgICAgICAgaWYgKHdpbmRvdy5kYXRhX3RhYmxlLmxlbmd0aCA9PSAwKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICQoXCIjdGFibGUtcmVzdWx0c1wiKS5odG1sKFwiTm8gcmVzdWx0c1wiKTsgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIHZhciB0YWJsZV9odG1sID0gYnVpbGRIVE1MdGFibGUod2luZG93LmRhdGFfdGFibGUpO1xuICAgICAgICAgICAgICAgICQoXCIjdGFibGUtcmVzdWx0c1wiKS5odG1sKHRhYmxlX2h0bWwpOyBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZUxhYmVscyhtb3ZlX251bSl7XG4gICAgICAgICAgICAkKCcjZ2FtZS1pZCcpLmh0bWwoXCJnYW1lIGlkOiBcIiArIHdpbmRvdy5kYXRhX3RhYmxlW21vdmVfbnVtXVtcImdhbWVfaWRcIl0pO1xuICAgICAgICAgICAgJCgnI25ldC1pZCcpLmh0bWwoXCJuZXQgaWQ6IFwiICsgd2luZG93LmRhdGFfdGFibGVbbW92ZV9udW1dW1wibmV0X2lkXCJdKTtcbiAgICAgICAgICAgICQoJyNtb3ZlLW51bWJlcicpLmh0bWwoXCJtb3ZlIG51bWJlcjogXCIgKyB3aW5kb3cuZGF0YV90YWJsZVttb3ZlX251bV1bXCJtb3ZlX251bWJlclwiXSk7XG4gICAgICAgICAgICAkKCcjc2NvcmUnKS5odG1sKFwic2NvcmU6IFwiICsgd2luZG93LmRhdGFfdGFibGVbbW92ZV9udW1dW1wic2NvcmVcIl0pXG4gICAgICAgICAgICBpZiAobW92ZV9udW0gIT0gMCl7XG4gICAgICAgICAgICAgICAgJCgnI3N3aXBlJykuaHRtbChcInN3aXBlOiBcIiArIHdpbmRvdy5kYXRhX3RhYmxlW21vdmVfbnVtXVtcInN3aXBlXCJdKTtcblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgfVxuXG4gICAgICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJCgnI25leHQtYnV0dG9uJykuaGlkZSgpO1xuICAgICAgICAgICAgJCgnI3ByZXYtYnV0dG9uJykuaGlkZSgpO1xuICAgICAgICAgICAgJCgnI2xhYmVscycpLmhpZGUoKTtcblxuICAgICAgICAgICAgJCgnI3NlYXJjaC10ZXh0Jykua2V5cHJlc3MoZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgICAgIC8vcHJldmVudCBwYWdlIHJlZnJlc2ggd2hlbiBwcmVzc2luZyBlbnRlclxuICAgICAgICAgICAgICAgIC8vc3VibWl0IHNlYXJjaCB3aGVuIHByZXNzaW5nIGVudGVyXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LmtleUNvZGU9PTEzKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnI3NlYXJjaC1zdWJtaXQnKS50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkKCcjc2VhcmNoLXN1Ym1pdCcpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdmFyIHBheWxvYWQgPSB7XG4gICAgICAgICAgICAgICAgICAgIHE6ICQoJyNzZWFyY2gtdGV4dCcpLnZhbCgpXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvc2VhcmNoXCIsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiR0VUXCIsXG4gICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogcGF5bG9hZCxcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcjd2VsY29tZScpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNsYWJlbHMnKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuZGF0YV90YWJsZSA9IEpTT04ucGFyc2UoZGF0YS5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdpbmRvdy5kYXRhX3RhYmxlLmxlbmd0aCA+IDApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZUxhYmVscygwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9kb24ndCBzaG93IGxhYmVscyBpZiB0aGVyZSBhcmUgbm8gcmVzdWx0c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNsYWJlbHMnKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubW92ZV9udW1iZXIgPSAwXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5UmVzdWx0c1RhYmxlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5R2FtZUJvYXJkKHdpbmRvdy5tb3ZlX251bWJlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcjbmV4dC1idXR0b24nKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcjcHJldi1idXR0b24nKS5zaG93KCk7ICAgICAgXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICQoJyNuZXh0LWJ1dHRvbicpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgaWYgKHdpbmRvdy5tb3ZlX251bWJlciA8IHdpbmRvdy5kYXRhX3RhYmxlLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93Lm1vdmVfbnVtYmVyICs9IDE7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZUxhYmVscyh3aW5kb3cubW92ZV9udW1iZXIpO1xuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5R2FtZUJvYXJkKHdpbmRvdy5tb3ZlX251bWJlcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICQoJyNwcmV2LWJ1dHRvbicpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgaWYgKHdpbmRvdy5tb3ZlX251bWJlciA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93Lm1vdmVfbnVtYmVyIC09IDE7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZUxhYmVscyh3aW5kb3cubW92ZV9udW1iZXIpO1xuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5R2FtZUJvYXJkKHdpbmRvdy5tb3ZlX251bWJlcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pOyJdfQ==
