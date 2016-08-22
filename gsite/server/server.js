var express = require("express");
var path = require("path");

var app = express();
app.use(express.static(path.join(__dirname,"../app/dist")));


// var mysql = require('mysql')

// var connection = mysql.createConnection({
// 	host: 'localhost',
// 	user: 'root',
// 	password: 'bl00p',
// 	database: 'tester'
// })

// connection.connect(function(err) {
// 	if (err) throw err
// 		console.log('Connection established')
// })



app.listen(3000,function(){
    console.log("Started listening on port", 3000);
})