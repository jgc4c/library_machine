const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
var mysql = require('mysql2');
const app = express();
const port = 8080;

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "pingu",
    database: "library_machine"
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('pages'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/pages/index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/pages/login.html'));
});

app.post('/login-check', (req, res) => {
    con.connect(function(err) {
        if (err) throw err;

        switch(req.body.user_Schema) {
            case "Visitor":
                break;
            case "Librarian":
                break;
            case "Admin":
                break;
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});