var mysql = require('mysql')

var pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: 'bl00p',
	database: 'tester',
	multipleStatements: true

});

//ALTER TO FIT MYSQL TABLE
exports.getRecords = function(strQuery, callback){
	pool.getConnection(function(err, connection) {
		if(err) {console.log(err); callback(true); return;}
		
		connection.query(strQuery, function(err, results){
			connection.release();
			if(err) {console.log(err); callback(true); return;}
			callback(false, results);
		});

	});
};

connection.connect(function(err) {
	if (err) throw err
		console.log('Connection established')
})