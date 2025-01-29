var http = require('http');
var mysql = require('mysql2');

var con = mysql.createConnection({ // creates the connection to your database
	host: "localhost", // IP address of where the database is, localhost if you're doing it locally
	user: "geeb", // database user account you want to use. make sure it's a user 
	password: "pingu", // password for database user account
	database: "testing" // name of database to connect to
});

con.connect(function(err) {
	if (err) throw err;
	console.log("connected");

	con.query("INSERT INTO game VALUES (\"Minecraft\", \"2009-5-17\")", function (err, result, fields) {
		if (err) throw err;
		console.log(result);
	});

	con.query("SELECT * FROM game", function (err, result, fields) {
		if (err) throw err;
		console.log(result);
	});
});

http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.end('Hello world!');
}).listen(8080);
