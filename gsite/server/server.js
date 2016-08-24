var express = require("express");
var path = require("path");

var app = express();
app.use(express.static(path.join(__dirname,"../app/dist")));

var mysql = require('mysql')

var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'bl00p',
    database: 'tester',
    multipleStatements: true

});


/*
pool.getConnection(function(err, connection) {
    if(err) {console.log(err); return;}
    
    connection.query('SELECT * FROM game_stats2 where '
        + 'game_id like 1.0'
        +'OR net_ID like "jll2219"', function(err, results){
        connection.release();
        if(err) {console.log(err); return;}

        var data=[];
        for(i=0;i<results.length;i++)
        {
            data.push(results[i]);
        }
        console.log(data)
        -res.end(JSON.stringify(data));

        -callback(false, results);
        -return results
    });

}); */




app.get('/search', function(req, res){
    pool.getConnection(function(err, connection) {
        if(err) {console.log(err); return;}
        
        connection.query(/*'SELECT * FROM game_stats2 where '
            + 'game_id like "%'+req.query.key+'%" '
            +'OR net_ID like "%'+req.query.key+'%"',*/
            'SELECT * FROM game_stats2 where game_id like 1.0 '
            +'AND net_id like "jll2219"', function(err, results){
            connection.release();
            if(err) {console.log(err); return;}

            var data=[];
            for(i=0;i<results.length;i++)
            {
                data.push(results[i]);
            }
            console.log(data)
            res.end(JSON.stringify(data));

            /*callback(false, results);*/
            /*return results*/
        });

    });
});




app.listen(3000,function(){
    console.log("Started listening on port", 3000);
})