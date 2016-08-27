var express = require("express");
var path = require("path");

var app = express();
app.use(express.static(path.join(__dirname,"../app/dist")));


app.get('/', function (req, res) {
  res.render(index);
});

//use the node-config package
var config = require('config');

//uses elements in config folder 
var dbConfig = config.get('dbConfig');
var dbTable = config.get('dbTable');

var mysql = require('mysql');
var pool = mysql.createPool(dbConfig);

app.get('/search', function(req, res) {
    //get connection from pool
    pool.getConnection(function(err, conn){
        if (err) {
            console.log(err);
            return;
        }

        //console.log(req.query.q);
        conn.query('SELECT * FROM ' + dbTable.table 
            + ' WHERE game_id LIKE ? OR net_ID LIKE ?', [req.query.q, req.query.q],
            function (err, result) {
                conn.release();
                if (err) {
                    console.log(err);
                    return;
                }

                //console.log(JSON.stringify(result))

                res.end(JSON.stringify(result));

            });

    })
});

app.listen(3000,function(){
    console.log("Started listening on port", 3000);
})