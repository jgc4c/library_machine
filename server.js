const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
var mysql = require('mysql2');
const app = express();
const port = 3000;

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "pingu",
    database: "library_machine"
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('pages'));
app.use(
    session({
        secret: 'secret-key',
        resave: false,
        saveUninitialized: false,
    })
);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/pages/index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/pages/login.html'));
});

app.post('/login-check', (req, res) => {
    const { user_type, username, password } = req.body;

    con.connect(function(err) {
        if (err) throw err;
        con.query(`SELECT admin_user, admin_pass FROM ${user_type}`, function (err, result, fields) {
            if (err) throw err;
            // console.log(result);
            let valid = false;
            for (var i = 0; i < result.length; i++) {
                if (username == result[i].Admin_user && password == result[i].Admin_pass) {
                    valid = true;
                }
            }
            
            if ( valid ) {
                console.log("login success");
                req.session.isLoggedIn = true;
                req.session.username = username;

                res.redirect(`/dashboards/${user_type.toLowerCase()}`);
            }
            else {
                console.log("login failed");
                res.redirect("/login");
            }
        });
    });
});

app.get('/dashboards/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '/pages/dashboards/admin.html'));
});

app.get('/dashboards/librarian', (req, res) => {
    res.sendFile(path.join(__dirname, '/pages/dashboards/librarian.html'));
});

app.get('/dashboards/visitor', (req, res) => {
    res.sendFile(path.join(__dirname, '/pages/dashboards/visitor.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Access site at localhost:${port}`);
});

function isValidUser(user_type, username, password) {
    var valid = false;
    con.connect(function(err) {
        if (err) throw err;
        con.query(`SELECT admin_user, admin_pass FROM ${user_type}`, function (err, result, fields) {
            if (err) throw err;
            // console.log(result);

            for (var i = 0; i < result.length; i++) {
                if (username == result[i].admin_user) {
                    valid = true;
                }
            }
        });
    });

    return valid;
};