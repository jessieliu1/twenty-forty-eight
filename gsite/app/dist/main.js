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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvamVzc2llbGl1L0RvY3VtZW50cy9TdW1tZXIgMjAxNi93Mi8yMDQ4L2dzaXRlL2FwcC9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsU0FBUyxjQUFjLENBQUMsT0FBTyxDQUFDO1lBQ3BCLElBQUksU0FBUyxFQUFFLENBQUMsYUFBYSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztZQUNqRCxJQUFJLEtBQUssR0FBRyx1QkFBdUIsQ0FBQztZQUNwQyxJQUFJLFNBQVMsR0FBRyxjQUFjLENBQUM7WUFDL0IsS0FBSyxJQUFJLEdBQUcsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUU7Z0JBQzdDLFNBQVMsSUFBSSxNQUFNLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQzthQUNsRDtZQUNELFNBQVMsSUFBSSxpQkFBaUIsQ0FBQztBQUMzQyxZQUFZLEtBQUssSUFBSSxTQUFTLENBQUM7O1lBRW5CLElBQUksSUFBSSxHQUFHLFVBQVUsQ0FBQztZQUN0QixLQUFLLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUU7WUFDN0M7Z0JBQ0ksSUFBSSxJQUFJLE1BQU0sQ0FBQztnQkFDZixLQUFLLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUU7Z0JBQy9DO29CQUNJLElBQUksSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQztpQkFDM0Q7Z0JBQ0QsSUFBSSxJQUFJLE9BQU8sQ0FBQzthQUNuQjtB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QUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztvQkFDbkUsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2lCQUN4QztBQUNqQixhQUFhLENBQUMsQ0FBQzs7WUFFSCxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVU7Z0JBQzlCLElBQUksTUFBTSxDQUFDLFdBQVcsR0FBRyxDQUFDLEVBQUU7b0JBQ3hCLE1BQU0sQ0FBQyxXQUFXLElBQUksQ0FBQyxDQUFDO29CQUN4QixZQUFZLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO29CQUNqQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7aUJBQ3hDO2FBQ0osQ0FBQyxDQUFDO1NBQ04sQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJmdW5jdGlvbiBidWlsZEhUTUx0YWJsZShqb2JqZWN0KXtcbiAgICAgICAgICAgIHZhciBjb2x1bW5TZXQ9IFtcIm1vdmVfbnVtYmVyXCIsIFwic3dpcGVcIiwgXCJzY29yZVwiXTtcbiAgICAgICAgICAgIHZhciB0YWJsZSA9IFwiPHRhYmxlIGNsYXNzPSd0YWJsZSc+XCI7XG4gICAgICAgICAgICB2YXIgdGJsSGVhZGVyID0gXCI8dGhlYWQ+IDx0cj5cIjtcbiAgICAgICAgICAgIGZvciAodmFyIGtleSA9IDA7IGtleSA8IGNvbHVtblNldC5sZW5ndGg7IGtleSsrKSB7XG4gICAgICAgICAgICAgICAgdGJsSGVhZGVyICs9IFwiPHRoPlwiICsgY29sdW1uU2V0W2tleV0gKyBcIjwvdGg+XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0YmxIZWFkZXIgKz0gXCIgPC90cj4gPC90aGVhZD5cIjtcbiAgICAgICAgICAgIHRhYmxlICs9IHRibEhlYWRlcjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIGJvZHkgPSBcIjx0Ym9keT4gXCI7XG4gICAgICAgICAgICBmb3IgKHZhciByb3cgPSAwOyByb3cgPCBqb2JqZWN0Lmxlbmd0aDsgcm93KyspXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYm9keSArPSBcIjx0cj5cIjtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBjb2wgPSAwOyBjb2wgPCBjb2x1bW5TZXQubGVuZ3RoOyBjb2wrKylcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGJvZHkgKz0gXCI8dGQ+XCIgKyBqb2JqZWN0W3Jvd11bY29sdW1uU2V0W2NvbF1dICsgXCI8L3RkPlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBib2R5ICs9IFwiPC90cj5cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJvZHkgKz0gXCI8L3RhYmxlPlwiO1xuXG4gICAgICAgICAgICB0YWJsZSArPSBib2R5O1xuXG4gICAgICAgICAgICByZXR1cm4gdGFibGU7XG4gICAgICAgIH07XG5cblxuICAgICAgICBmdW5jdGlvbiBkaXNwbGF5R2FtZUJvYXJkKG1vdmVfbnVtKXtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHdpbmRvdy5kYXRhX3RhYmxlLmxlbmd0aCA+IDApXG4gICAgICAgICAgICB7ICAgXG4gICAgICAgICAgICAgICAgdmFyIGJvYXJkID0gW107XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA0OyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBib2FyZFtpXSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCA0OyBqKyspe1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGtleSA9IGkrJywgJyArajtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvYXJkW2ldW2pdID0gd2luZG93LmRhdGFfdGFibGVbbW92ZV9udW1dW2tleV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgY3ZzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lYm9hcmRcIik7XG4gICAgICAgICAgICAgICAgdmFyIGN0eCA9IGN2cy5nZXRDb250ZXh0KFwiMmRcIik7XG5cbiAgICAgICAgICAgICAgICBzcGFjaW5nID0gMTA7XG4gICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IFwicmdiKDE4MiwxNzIsMTU4KVwiO1xuXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxSZWN0KDAsIDAsIGN2cy53aWR0aCwgY3ZzLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgdGlsZVdpZHRoID0gKGN2cy53aWR0aCAtIDUgKiBzcGFjaW5nKSAvIDQ7XG5cbiAgICAgICAgICAgICAgICBjb2xvcnNfZGljdGlvbmFyeT17XG4gICAgICAgICAgICAgICAgICAgIDA6IFtcInJnYigyMDEsMTkyLDE3OClcIl0sXG4gICAgICAgICAgICAgICAgICAgIDI6IFtcInJnYigyMzUsMjI3LDIxNylcIl0sXG4gICAgICAgICAgICAgICAgICAgIDQ6IFtcInJnYigyMzMsMjIzLDE5OSlcIl0sXG4gICAgICAgICAgICAgICAgICAgIDg6IFtcInJnYigyNDIsMTc3LDEyMSlcIl0sXG4gICAgICAgICAgICAgICAgICAgIDE2OiBbXCJyZ2IoMjQ1LDE0OSw5OSlcIl0sXG4gICAgICAgICAgICAgICAgICAgIDMyOiBbXCJyZ2IoMjQ2LDEyNCw5NSlcIl0sXG4gICAgICAgICAgICAgICAgICAgIDY0OiBbXCJyZ2IoMjQ2LDk0LDU5KVwiXSxcbiAgICAgICAgICAgICAgICAgICAgMTI4OiBbXCJyZ2IoMjM3LDIwNywxMTQpXCJdLFxuICAgICAgICAgICAgICAgICAgICAyNTY6IFtcInJnYigyMzcsMjA0LDk3KVwiXSxcbiAgICAgICAgICAgICAgICAgICAgNTEyOiBbXCJyZ2IoMjM3LDIwMCw4MClcIl0sXG4gICAgICAgICAgICAgICAgICAgIDEwMjQ6IFtcInJnYigyMzcsMTk3LDYzKVwiXSxcbiAgICAgICAgICAgICAgICAgICAgMjA0ODogW1wicmdiKDIzNywxOTQsNDYpXCJdLFxuICAgICAgICAgICAgICAgICAgICBvdGhlcjogW1wicmdiKDAsMCwwKVwiXVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgNDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgNDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgeCA9ICgoaiArIDEpICogc3BhY2luZykgKyAoaiAqIHRpbGVXaWR0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgeSA9ICgoaSArIDEpICogc3BhY2luZykgKyAoaSAqIHRpbGVXaWR0aCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbGVWYWwgPSBib2FyZFtpXVtqXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aWxlVmFsIDw9IDIwNDgpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBjb2xvcnNfZGljdGlvbmFyeVt0aWxlVmFsXVswXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdHguZmlsbFJlY3QoeCwgeSwgdGlsZVdpZHRoLCB0aWxlV2lkdGgpOyBcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yc19kaWN0aW9uYXJ5W1wib3RoZXJcIl1bMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIHRpbGVXaWR0aCwgdGlsZVdpZHRoKTsgXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRpbGVWYWwgIT0gMClcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGlsZVZhbCA+IDQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJyZ2IoMjU1LDI1NSwyNTUpXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBcInJnYigxMTksMTEwLDEwMSlcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGlsZVZhbCA+IDUxMil7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmb250U2l6ZSA9IDI4O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdHguZm9udCA9IFwiMjhweCBGdXR1cmFcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZvbnRTaXplID0gMzQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0eC5mb250ID0gXCIzNHB4IEZ1dHVyYVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdHgudGV4dEFsaWduID0gXCJjZW50ZXJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdHguZmlsbFRleHQoYm9hcmRbaV1bal0sIHggKyB0aWxlV2lkdGgvMixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeSArIHNwYWNpbmcgKyB0aWxlV2lkdGgvMik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB9IFxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhciBjdnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWVib2FyZFwiKTtcbiAgICAgICAgICAgICAgICB2YXIgY3R4ID0gY3ZzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJyZ2IoMTE5LDEzNiwxNTMpXCI7XG4gICAgICAgICAgICAgICAgY3R4LmZpbGxSZWN0KDAsIDAsIGN2cy53aWR0aCwgY3ZzLmhlaWdodCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cblxuXG4gICAgICAgIGZ1bmN0aW9uIGRpc3BsYXlSZXN1bHRzVGFibGUoKXtcbiAgICAgICAgICAgIGlmICh3aW5kb3cuZGF0YV90YWJsZS5sZW5ndGggPT0gMClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAkKFwiI3RhYmxlLXJlc3VsdHNcIikuaHRtbChcIk5vIHJlc3VsdHNcIik7IFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICB2YXIgdGFibGVfaHRtbCA9IGJ1aWxkSFRNTHRhYmxlKHdpbmRvdy5kYXRhX3RhYmxlKTtcbiAgICAgICAgICAgICAgICAkKFwiI3RhYmxlLXJlc3VsdHNcIikuaHRtbCh0YWJsZV9odG1sKTsgXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiB1cGRhdGVMYWJlbHMobW92ZV9udW0pe1xuICAgICAgICAgICAgJCgnI2dhbWUtaWQnKS5odG1sKFwiZ2FtZSBpZDogXCIgKyB3aW5kb3cuZGF0YV90YWJsZVttb3ZlX251bV1bXCJnYW1lX2lkXCJdKTtcbiAgICAgICAgICAgICQoJyNuZXQtaWQnKS5odG1sKFwibmV0IGlkOiBcIiArIHdpbmRvdy5kYXRhX3RhYmxlW21vdmVfbnVtXVtcIm5ldF9pZFwiXSk7XG4gICAgICAgICAgICAkKCcjbW92ZS1udW1iZXInKS5odG1sKFwibW92ZSBudW1iZXI6IFwiICsgd2luZG93LmRhdGFfdGFibGVbbW92ZV9udW1dW1wibW92ZV9udW1iZXJcIl0pO1xuICAgICAgICAgICAgJCgnI3Njb3JlJykuaHRtbChcInNjb3JlOiBcIiArIHdpbmRvdy5kYXRhX3RhYmxlW21vdmVfbnVtXVtcInNjb3JlXCJdKVxuICAgICAgICAgICAgaWYgKG1vdmVfbnVtICE9IDApe1xuICAgICAgICAgICAgICAgICQoJyNzd2lwZScpLmh0bWwoXCJzd2lwZTogXCIgKyB3aW5kb3cuZGF0YV90YWJsZVttb3ZlX251bV1bXCJzd2lwZVwiXSk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgXG4gICAgICAgIH1cblxuICAgICAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICQoJyNuZXh0LWJ1dHRvbicpLmhpZGUoKTtcbiAgICAgICAgICAgICQoJyNwcmV2LWJ1dHRvbicpLmhpZGUoKTtcbiAgICAgICAgICAgICQoJyNsYWJlbHMnKS5oaWRlKCk7XG5cbiAgICAgICAgICAgICQoJyNzZWFyY2gtdGV4dCcpLmtleXByZXNzKGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgICAgICAvL3ByZXZlbnQgcGFnZSByZWZyZXNoIHdoZW4gcHJlc3NpbmcgZW50ZXJcbiAgICAgICAgICAgICAgICAvL3N1Ym1pdCBzZWFyY2ggd2hlbiBwcmVzc2luZyBlbnRlclxuICAgICAgICAgICAgICAgIGlmIChldmVudC5rZXlDb2RlPT0xMylcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICQoJyNzZWFyY2gtc3VibWl0JykudHJpZ2dlcignY2xpY2snKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJCgnI3NlYXJjaC1zdWJtaXQnKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHZhciBwYXlsb2FkID0ge1xuICAgICAgICAgICAgICAgICAgICBxOiAkKCcjc2VhcmNoLXRleHQnKS52YWwoKVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL3NlYXJjaFwiLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIkdFVFwiLFxuICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHBheWxvYWQsXG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnI3dlbGNvbWUnKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcjbGFiZWxzJykuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmRhdGFfdGFibGUgPSBKU09OLnBhcnNlKGRhdGEucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aW5kb3cuZGF0YV90YWJsZS5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVMYWJlbHMoMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vZG9uJ3Qgc2hvdyBsYWJlbHMgaWYgdGhlcmUgYXJlIG5vIHJlc3VsdHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjbGFiZWxzJykuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93Lm1vdmVfbnVtYmVyID0gMFxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheVJlc3VsdHNUYWJsZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheUdhbWVCb2FyZCh3aW5kb3cubW92ZV9udW1iZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnI25leHQtYnV0dG9uJykuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnI3ByZXYtYnV0dG9uJykuc2hvdygpOyAgICAgIFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkKCcjbmV4dC1idXR0b24nKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGlmICh3aW5kb3cubW92ZV9udW1iZXIgPCB3aW5kb3cuZGF0YV90YWJsZS5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5tb3ZlX251bWJlciArPSAxO1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVMYWJlbHMod2luZG93LmRhdGFfdGFibGVbd2luZG93Lm1vdmVfbnVtYmVyXVtcIm1vdmVfbnVtYmVyXCJdKTtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheUdhbWVCb2FyZCh3aW5kb3cubW92ZV9udW1iZXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkKCcjcHJldi1idXR0b24nKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGlmICh3aW5kb3cubW92ZV9udW1iZXIgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5tb3ZlX251bWJlciAtPSAxO1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVMYWJlbHMod2luZG93Lm1vdmVfbnVtYmVyKTtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheUdhbWVCb2FyZCh3aW5kb3cubW92ZV9udW1iZXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTsiXX0=
