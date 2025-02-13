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
        cookie: { maxAge: 1000*60*5 }
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
        switch (user_type) {
            case "Visitor":
                con.query(`SELECT Visitor_user, Visitor_pass FROM Visitor`, function (err, result, fields) {
                    if (err) throw err;
                    // console.log(result);
                    let valid = false;
                    for (var i = 0; i < result.length; i++) {
                        if (username == result[i].Visitor_user && password == result[i].Visitor_pass) {
                            valid = true;
                            break;
                        }
                    }
                    
                    if ( valid ) {
                        console.log("login success for visitor");
                        req.session.isLoggedIn = true;
                        req.session.username = "vis_" + username;
        
                        res.redirect(`/dashboards/${user_type.toLowerCase()}`);
                    }
                    else {
                        console.log("login failed for visitor");
                        res.redirect("/logout");
                    }
                });
                break;
            case "Librarian":
                con.query(`SELECT Librarian_user, Librarian_pass FROM Librarian`, function (err, result, fields) {
                    if (err) throw err;
                    // console.log(result);
                    let valid = false;
                    for (var i = 0; i < result.length; i++) {
                        if (username == result[i].Librarian_user && password == result[i].Librarian_pass) {``
                            valid = true;
                            break;
                        }
                    }
                    
                    if ( valid ) {
                        console.log("login success for librarian");
                        req.session.isLoggedIn = true;
                        req.session.username = "lib_" + username;
        
                        res.redirect(`/dashboards/${user_type.toLowerCase()}`);
                    }
                    else {
                        console.log("login failed for librarian");
                        res.redirect("/logout");
                    }
                });
                break;
            case "Admin":
                con.query(`SELECT Admin_user, Admin_pass FROM Admin`, function (err, result, fields) {
                    if (err) throw err;
                    // console.log(result);
                    let valid = false;
                    for (var i = 0; i < result.length; i++) {
                        if (username == result[i].Admin_user && password == result[i].Admin_pass) {
                            valid = true;
                            break;
                        }
                    }
                    
                    if ( valid ) {
                        console.log("login success for admin");
                        req.session.isLoggedIn = true;
                        req.session.username = "adm_" + username;
        
                        res.redirect(`/dashboards/${user_type.toLowerCase()}`);
                    }
                    else {
                        console.log("login failed for admin");
                        res.redirect("/logout");
                    }
                });
                break;
            default:
                res.redirect("/logout");
        }
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy( (err) => {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/login");
        }
    })
});

app.get('/dashboards/admin', (req, res) => {
    if (req.session.isLoggedIn && req.session.username.substring(0,3) == "adm") {
        console.log("welcome admin");
        res.sendFile(path.join(__dirname, '/pages/dashboards/admin.html'));
    }
    else {
        console.log("Not logged in as admin");
        res.redirect("/login");
    }
});

app.get('/dashboards/librarian', (req, res) => {
    if (req.session.isLoggedIn && (req.session.username.substring(0,3) == "lib" || req.session.username.substring(0,3) == "adm")) {
        console.log("welcome librarian");
        res.sendFile(path.join(__dirname, '/pages/dashboards/librarian.html'));
    }
    else {
        console.log("Not logged in as librarian");
        res.redirect("/login");
    }
});

app.get('/dashboards/visitor', (req, res) => {
    if (req.session.isLoggedIn && (req.session.username.substring(0,3) == "vis" || req.session.username.substring(0,3) == "lib" || req.session.username.substring(0,3) == "adm")) {
        console.log("welcome visitor");
        res.sendFile(path.join(__dirname, '/pages/dashboards/visitor.html'));
    }
    else {
        console.log("Not logged in as visitor");
        res.redirect("/login");
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Access site at [ localhost:${port} ]`);
});
