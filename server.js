const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
var mysql = require('mysql2');
const fs = require("fs");
const app = express();
const port = 3000;

//differing user and password, need to change this per import from git (SC: {user:root,password:rootbeer} )
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "pingu",
    database: "library_machine",
    multipleStatements: true
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('pages'));
app.use(
    session({
        secret: 'secret-key',
        resave: false,
        saveUninitialized: false,
        cookie: { 
            maxAge: 1000*60*5
        }
    })
);

app.get('/', (req, res) => { // default route for getting homepage
    res.sendFile(path.join(__dirname, '/pages'));
});

app.get('/login', (req, res) => { // route for login page
    res.sendFile(path.join(__dirname, '/pages/login.html'));
});

app.post('/login-check', (req, res) => { // post request for checking login credentials 
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

app.get('/logout', (req, res) => { // route for logging out, deletes user sessions
    req.session.destroy( (err) => {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/login");
        }
    })
});

app.get('/dashboards/admin/', (req, res) => { // routing for getting to admin dashboard
    if (req.session.isLoggedIn && req.session.username.substring(0,3) == "adm") {
        console.log("welcome admin");
        res.sendFile(path.join(__dirname, '/pages/dashboards/admin/admin.html'));
    }
    else {
        console.log("Not logged in as admin");
        res.redirect("/login");
    }
});

app.get('/dashboards/librarian', (req, res) => { // routing for getting to librarian dashboard
    if (req.session.isLoggedIn && req.session.username.substring(0,3) == "lib" ) {
        console.log("welcome librarian");
        res.sendFile(path.join(__dirname, '/pages/dashboards/librarian/librarian.html'));
    }
    else {
        console.log("Not logged in as librarian");
        res.redirect("/login");
    }
});

app.get('/dashboards/visitor', (req, res) => { // routing for getting to visitor dashboard
    if (req.session.isLoggedIn && req.session.username.substring(0,3) == "vis") {
        console.log("welcome visitor");
        res.sendFile(path.join(__dirname, '/pages/dashboards/visitor/visitor.html'));
    }
    else {
        console.log("Not logged in as visitor");
        res.redirect("/login");
    }
});

//Shared Dashboard functionality: Get books, search up specific book
app.get('/getAllBooks', (req, res) => {
    const {min, max} = req.body;
    con.connect((err) => {
        if (err) throw err;
        con.query(`SELECT * FROM Book`, (err, results, fields) => {
            if (err) throw err;
            res.json(results);
        })
    });  
});

app.post('/searchSpecific', (req, res) => {
    const { book_search, value } = req.body;
    con.connect( (err) => {
        if (err) throw err;
        switch(book_search) {
            case "ISBN":
                con.query(`SELECT * FROM Book WHERE ISBN="${value}"`, (err, results, fields) => {
                    if (err) throw err;
                    res.json(results);
                });
                break;
            case "Book_name":
            case "Author":
            case "Genre":
                con.query(`SELECT * FROM Book WHERE ${book_search} LIKE "%${value}%"`, (err, results, fields) => {
                    if (err) throw err;
                    res.json(results);
                });
                break;
        }
    });
});

//Visitor functionality goes here

app.post('/sendBookRequest', (req, res) => {
    const { value } = req.body;
    let book_data = {ISBN : "", name : ""};
    let visitor_data = {ID : 1, vis_name : "test"};
    con.connect( (err) => {
        if (err) throw err;
        con.query(`SELECT Count FROM Book WHERE ISBN="${value}"`, (err, results, fields) => {
            if (err) throw err;

            if (results[0].Count > 1){
                //res.send("should continue from here");
                con.query(`SELECT ISBN, Book_name FROM Book WHERE ISBN = "${value}"` , (err, results) => {
                    console.log(results);
                    book_data.ISBN = results[0].ISBN;
                    book_data.name = results[0].Book_name;

                    console.log(book_data.ISBN);
                    console.log(book_data.name);
                });


                con.query(`INSERT INTO Request_list (ISBN, Book_name, Requester_id, Requester_fname) VALUES ("${book_data.ISBN}", "${book_data.name}", ${visitor_data.ID}, "${visitor_data.vis_name}")`, (err, results) => {
                    if (err){
                        res.send(`Error has occurred: ${err}`);
                    }
                    else{
                        res.send("request processed");
                    }
                });
            } 
            else {
                console.log(results[0].Count);
                res.send("Error: cannot request a book that isn't available in our library! (on count of 0)");
            }
        });
    });
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Access site at [ localhost:${port} ]`);
    //makeDatabase();
    //loadDatabase();
});


function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

function makeDatabase() {
    const sqlScript = fs.readFileSync('./schemas/Library_schema_test.sql', 'utf8');
    con.connect( (err) => {
        if (err) throw err;
        con.query(sqlScript, (err, result) => {
            console.log("database re-created");
        })
    });
}

function loadDatabase () {
    console.log("loading data into database...");
    con.connect( (err) => {
        if (err) throw err;
        const books = require("./data/books.json");
    
        for (let i = 0; i < books.length; i++) {
            con.query(`INSERT INTO Book (ISBN, Book_name, Author, Num_pages, Count) VALUES ("${books[i].isbn13.toString()}", "${books[i].title}", "${books[i].authors}", ${books[i].num_pages}, ${getRandomInt(1,5)})`, (err, result) => {
                // if (err) throw err;
                // console.log("book added");
            });
        }
    });
    console.log("data loaded!");
}