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
    user: "admin",
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

app.get('/dashboards/admin', (req, res) => { // routing for getting to admin dashboard
    if (req.session.isLoggedIn && req.session.username.substring(0,3) == "adm") {
        console.log("welcome admin");
        res.sendFile(path.join(__dirname, '/pages/dashboards/admin'));
    }
    else {
        console.log("Not logged in as admin");
        res.redirect("/login");
    }
});

app.get('/dashboards/librarian', (req, res) => { // routing for getting to librarian dashboard
    if (req.session.isLoggedIn && (req.session.username.substring(0,3) == "lib" || req.session.username.substring(0,3) == "adm")) {
        console.log("welcome librarian");
        res.sendFile(path.join(__dirname, '/pages/dashboards/librarian'));
    }
    else {
        console.log("Not logged in as librarian");
        res.redirect("/login");
    }
});

app.get('/dashboards/visitor', (req, res) => { // routing for getting to visitor dashboard
    if (req.session.isLoggedIn && (req.session.username.substring(0,3) == "vis" || req.session.username.substring(0,3) == "lib" || req.session.username.substring(0,3) == "adm")) {
        console.log("welcome visitor");
        res.sendFile(path.join(__dirname, '/pages/dashboards/visitor'));
    }
    else {
        console.log("Not logged in as visitor");
        res.redirect("/login");
    }
});

//Functionalities for visitor dashboard goes here
app.get('/book-display-all', (req, res) => {
    con.connect((err) => {
        if (err) throw err;
        con.query(`SELECT * FROM Book`, (err, results, fields) => {
            if (err) throw err;
            res.json(results);
        })
    });  
});

app.post('/search-specific', (req, res) => {
    let book_search = req.body.book_search;
    let book_input = req.body.book_input;
    console.log(book_search);
    console.log(book_input);

    con.connect((err) => {
        if (err) throw err;
        switch (book_search) {
            case "ISBN":
                con.query('SELECT * FROM Book WHERE ISBN = "' + book_input +'"', (err, result, fields) => {
                    if (err) throw err;
                    //console.log(result[0])
                    //The absolute mess that is this below, most certainly need a fix if we want to display the result in dashboard proper
                    res.setHeader('content-type', 'text/html');
                    res.write("<table border = 1>" + "<tr>" + 
                            " <th>ISBN</th>" +
                            " <th>Book Name</th>" +
                            " <th>Author</th>" +
                            " <th>Genre</th>" +
                            " <th>Num_pages</th>" +
                            " <th>Count</th>" +
                            "</tr>");
                    for (var i = 0; i < result.length; i++){
                        res.write("<tr>");
                        res.write("<td>" + result[i].ISBN + "</td>" +
                                  "<td>" + result[i].Book_name + "</td>" +
                                  "<td>" + result[i].Author + "</td>" +
                                  "<td>" + result[i].Genre + "</td>" +
                                  "<td>" + result[i].Num_pages + "</td>" +
                                  "<td>" + result[i].Count + "</td>"
                        );
                        res.write("</tr>");
                    }
                    res.write("</table>");
                    res.write("<br><br>");
                    res.write("<p>Book data retrieved.</p> <p>Keep this page on and return to dashboard on a separate tab if you want to request this (or these) specific books.</p>");
                    res.end("<p>If there is no book information(s) displayed on this table, return back to the dashboard.</p>")
                });
                break;
            case "Book_name":
                con.query('SELECT * FROM Book WHERE Book_name = "' + book_input +'"', (err, result, fields) => {
                    if (err) throw err;
                    //console.log(result[0])
                    res.setHeader('content-type', 'text/html');
                    res.write("<table border = 1>" + "<tr>" + 
                            " <th>ISBN</th>" +
                            " <th>Book Name</th>" +
                            " <th>Author</th>" +
                            " <th>Genre</th>" +
                            " <th>Num_pages</th>" +
                            " <th>Count</th>" +
                            "</tr>");
                    for (var i = 0; i < result.length; i++){
                        res.write("<tr>");
                        res.write("<td>" + result[i].ISBN + "</td>" +
                                  "<td>" + result[i].Book_name + "</td>" +
                                  "<td>" + result[i].Author + "</td>" +
                                  "<td>" + result[i].Genre + "</td>" +
                                  "<td>" + result[i].Num_pages + "</td>" +
                                  "<td>" + result[i].Count + "</td>"
                        );
                        res.write("</tr>");
                    }
                    res.write("</table>");
                    res.write("<br><br>");
                    res.write("<p>Book data retrieved.</p> <p>Keep this page on and return to dashboard on a separate tab if you want to request this (or these) specific books.</p>");
                    res.end("<p>If there is no book information(s) displayed on this table, return back to the dashboard.</p>")
                });
                break;
            case "Author":
                con.query('SELECT * FROM Book WHERE Author LIKE "%' + book_input +'%"', (err, result, fields) => {
                    if (err) throw err;
                    //console.log(result[0])
                    res.setHeader('content-type', 'text/html');
                    res.write("<table border = 1>" + "<tr>" + 
                            " <th>ISBN</th>" +
                            " <th>Book Name</th>" +
                            " <th>Author</th>" +
                            " <th>Genre</th>" +
                            " <th>Num_pages</th>" +
                            " <th>Count</th>" +
                            "</tr>");
                    for (var i = 0; i < result.length; i++){
                        res.write("<tr>");
                        res.write("<td>" + result[i].ISBN + "</td>" +
                                  "<td>" + result[i].Book_name + "</td>" +
                                  "<td>" + result[i].Author + "</td>" +
                                  "<td>" + result[i].Genre + "</td>" +
                                  "<td>" + result[i].Num_pages + "</td>" +
                                  "<td>" + result[i].Count + "</td>"
                        );
                        res.write("</tr>");
                    }
                    res.write("</table>");
                    res.write("<br><br>");
                    res.write("<p>Book data retrieved.</p> <p>Keep this page on and return to dashboard on a separate tab if you want to request this (or these) specific books.</p>");
                    res.end("<p>If there is no book information(s) displayed on this table, return back to the dashboard.</p>")
                });
                break;
            case "Genre":
                con.query('SELECT * FROM Book WHERE Genre = "' + book_input +'"', (err, result, fields) => {
                    if (err) throw err;
                    //console.log(result[0])
                    res.setHeader('content-type', 'text/html');
                    res.write("<table border = 1>" + "<tr>" + 
                            " <th>ISBN</th>" +
                            " <th>Book Name</th>" +
                            " <th>Author</th>" +
                            " <th>Genre</th>" +
                            " <th>Num_pages</th>" +
                            " <th>Count</th>" +
                            "</tr>");
                    for (var i = 0; i < result.length; i++){
                        res.write("<tr>");
                        res.write("<td>" + result[i].ISBN + "</td>" +
                                  "<td>" + result[i].Book_name + "</td>" +
                                  "<td>" + result[i].Author + "</td>" +
                                  "<td>" + result[i].Genre + "</td>" +
                                  "<td>" + result[i].Num_pages + "</td>" +
                                  "<td>" + result[i].Count + "</td>"
                        );
                        res.write("</tr>");
                    }
                    res.write("</table>");
                    res.write("<br><br>");
                    res.write("<p>Book data retrieved.</p> <p>Keep this page on and return to dashboard on a separate tab if you want to request this (or these) specific books.</p>");
                    res.end("<p>If there is no book information(s) displayed on this table, return back to the dashboard.</p>")
                });
                break;
        }
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