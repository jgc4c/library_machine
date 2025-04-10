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
                con.query(`SELECT Visitor_id, Visitor_user, Visitor_pass FROM Visitor`, function (err, result, fields) {
                    if (err) throw err;
                    // console.log(result);
                    let valid = false;
                    let userIndex = -1;
                    for (var i = 0; i < result.length; i++) {
                        if (username == result[i].Visitor_user && password == result[i].Visitor_pass) {
                            userIndex = i;
                            valid = true;
                            break;
                        }
                    }
                    
                    if ( valid ) {
                        console.log("login success for visitor");
                        req.session.isLoggedIn = true;
                        req.session.username = "vis_" + username;
                        req.session.userID = result[userIndex].Visitor_id;
        
                        res.redirect(`/dashboards/${user_type.toLowerCase()}`);
                    }
                    else {
                        console.log("login failed for visitor");
                        res.redirect("/logout");
                    }
                });
                break;
            case "Librarian":
                con.query(`SELECT Librarian_id, Librarian_user, Librarian_pass FROM Librarian`, function (err, result, fields) {
                    if (err) throw err;
                    // console.log(result);
                    let valid = false;
                    let userIndex = -1;
                    for (var i = 0; i < result.length; i++) {
                        if (username == result[i].Librarian_user && password == result[i].Librarian_pass) {``
                            userIndex = i;
                            valid = true;
                            break;
                        }
                    }
                    
                    if ( valid ) {
                        console.log("login success for librarian");
                        req.session.isLoggedIn = true;
                        req.session.username = "lib_" + username;
                        req.session.userID = result[userIndex].Librarian_id;
        
                        res.redirect(`/dashboards/${user_type.toLowerCase()}`);
                    }
                    else {
                        console.log("login failed for librarian");
                        res.redirect("/logout");
                    }
                });
                break;
            case "Admin":
                con.query(`SELECT Admin_id, Admin_user, Admin_pass FROM Admin`, function (err, result, fields) {
                    if (err) throw err;
                    // console.log(result);
                    let valid = false;
                    let userIndex = -1;
                    for (var i = 0; i < result.length; i++) {
                        if (username == result[i].Admin_user && password == result[i].Admin_pass) {
                            userIndex = i;
                            valid = true;
                            break;
                        }
                    }
                    
                    if ( valid ) {
                        console.log("login success for admin");
                        req.session.isLoggedIn = true;
                        req.session.username = "adm_" + username;
                        req.session.userID = result[userIndex].Admin_id;
        
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
        console.log("User logging in as: " + req.session.username + ", User ID: " + req.session.userID);
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
        console.log("User logging in as: " + req.session.username + ", User ID: " + req.session.userID);
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
        console.log("User logging in as: " + req.session.username + ", User ID: " + req.session.userID);
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
    let book_ISBN = "";
    let book_title = "";
    let visitor_data = {ID : req.session.userID, vis_name : req.session.username};
    con.connect( (err) => {
        if (err) throw err;
        con.query(`SELECT Count FROM Book WHERE ISBN="${value}"`, (err, results, fields) => {
            if (err){
                res.send( "<b>" + "You have provided an invalid input, please try again." + "</b>");
            }
            else{
                //Checks if output is literally nothing (as invalid/not matching ISBN number)
                if (results.length === 0){
                    res.send( "<b>" + "ERROR: Invalid/Not registered ISBN number!" + "</b>");
                }
                else if (results[0].Count > 0){

                    //Have proper hit on ISBN value.
                    book_ISBN = value;
                    //res.send("should continue from here");
                    con.query(`SELECT ISBN, Book_name FROM Book WHERE ISBN = "${value}"` , (err, results) => {
                        
                        //TODO fix, likely have to play around with async/await, Javascript assign operator isn't what is expected
                        book_title = results[0].Book_name;
                        
                        con.query(`INSERT INTO Request_list (ISBN, Book_name, Requester_id, Requester_user) VALUES ("${book_ISBN}", "${book_title}", ${visitor_data.ID}, "${visitor_data.vis_name}")`, (err, results) => {
                            if (err){
                                res.send("<b>" + "An error involving our database has occurred:" + "</b>" + err);
                            }
                            else{
                                res.send("<b>" + "Your book request has been processed." + "</b>");
                            }
                        });
                    });
                } 
                else {
                    res.send("<b>" + "Error: cannot request a book that isn't available in our library! (on count of 0)" + "</b>");
                }
            }
        });
    });
});

//Librarian functionality goes here
app.get('/getAllRequests', (req, res) => {
    const {min, max} = req.body;
    con.connect((err) => {
        if (err) throw err;
        con.query(`SELECT * FROM Request_list`, (err, results, fields) => {
            if (err) throw err;
            res.json(results);
        })
    });  
});

app.get('/getAllLoaners', (req, res) => {
    const {min, max} = req.body;
    con.connect((err) => {
        if (err) throw err;
        con.query(`SELECT * FROM Loaner_list`, (err, results, fields) => {
            if (err) throw err;
            res.json(results);
        })
    });  
});


//Administrator functionality goes here
app.get('/getVisitorInfo', (req, res) => {
    const {min, max} = req.body;
    con.connect((err) => {
        if (err) throw err;
        con.query(`SELECT * FROM Visitor`, (err, results, fields) => {
            if (err) throw err;
            res.json(results);
        })
    });  
});

app.get('/getLibrarianInfo', (req, res) => {
    const {min, max} = req.body;
    con.connect((err) => {
        if (err) throw err;
        con.query(`SELECT * FROM Librarian`, (err, results, fields) => {
            if (err) throw err;
            res.json(results);
        })
    });  
});


app.post('/accountCreation', (req, res) => {
    const {user_type, username, password, firstname, lastname, emailAddr, phoneNum} = req.body;

    //console.log(user_type, username, password, firstname, lastname, emailAddr, phoneNum);
    con.connect((err) => {
        if (err) throw err;
        switch(user_type) {
            case "Visitor":
                console.log("Account creating in Visitor relation.");
                con.query(`INSERT INTO Visitor (Visitor_user, Visitor_pass, First_name, Last_name, Email, Phone_num) VALUES ("${username}", "${password}", "${firstname}", "${lastname}", "${emailAddr}", "${phoneNum}")`, (err, result) => {
                    if (err) {
                        res.send("<b>" + "An error related to the database have occurred: " + "</b>" + err);
                    }
                    else {
                        res.send("<b>" + "Visitor account has been added. Note that the form is not be cleared on submit, a second input of the same data to the same account schema will result in an error." + "</b>");
                    }
                });
                break;
            case "Librarian":
                console.log("Account creating in Librarian relation.");
                con.query(`INSERT INTO Librarian (Librarian_user, Librarian_pass, First_name, Last_name) VALUES ("${username}", "${password}", "${firstname}", "${lastname}")`, (err, result) => {
                    if (err) {
                        res.send("<b>" + "An error related to the database have occurred: " + "</b>" + err);
                    }
                    else{
                        res.send("<b>" + "Librarian account has been added. Note that the form is not be cleared on submit, a second input of the same data to the same account schema will result in an error." + "</b>");
                    }
                });
                break;
        };
    })
});

app.post('/accountDeletion', (req, res) => {
    const {user_type, value} = req.body;
    //console.log(user_type, value);

    con.connect((err) => {
        if (err) throw err;
        switch(user_type){
            case "Visitor":
                console.log("Account deleting in Visitor relation: " + value);
                con.query(`DELETE FROM Visitor WHERE Visitor_id = ${value}`, (err, result) => {
                    if (err) {
                        res.send("<b>" + "An error related to the database have occurred: " + "</b>" + err);
                    }
                    else {
                        res.send("<b>" + "Visitor account deletion request has been processed. Please use the Show Account List to inspect the change." + "</b>");
                    }
                });
                break;
            case "Librarian":
                console.log("Account deleting in Librarian relation: " + value);
                con.query(`DELETE FROM Librarian WHERE Librarian_id = ${value}`, (err, result) => {
                    if (err) {
                        res.send("<b>" + "An error related to the database have occurred: " + "</b>" + err);
                    }
                    else {
                        res.send("<b>" + "Librarian account deletion request has been processed. Please use the Show Account List to inspect the change." + "</b>");
                    }
                });
                break;
        }

    });
});

app.post('/bookAddition', (req, res) => {
    const {ISBN, book_name, author, genre, num_pages} = req.body;

    //console.log(ISBN, book_name, author, genre, num_pages);
    con.connect((err) => {
        if (err) throw err;
        con.query(`INSERT INTO Book (ISBN, Book_name, Author, Genre, Num_pages, Count) VALUES ("${ISBN.toString()}", "${book_name}", "${author}", "${genre}", ${num_pages}, ${getRandomInt(1,5)})`, (err, result) => {
            if (err) {
                res.send("<b>" + "An error related to the database have occurred: " + "</b>" + err);
            }
            else{
                res.send("<b>" + "Book information has been added to the database. Reminder that this post form does not refresh the page, a second attempt on adding the same book information may result in an error." + "</b>");
            }
        });
    });
});

app.post('/bookDeletion', (req, res) => {
    const {value} = req.body;
    //console.log(value);

    con.connect((err) => {
        if (err) throw err;
        console.log("Deleting Book with ISBN value of: " + value);
        con.query(`DELETE FROM Book WHERE ISBN = ${value}`, (err, result) => {
            if (err) {
                res.send("<b>" + "An error related to the database have occurred: " + "</b>" + err);
            }
            else {
                res.send("<b>" + "Book deletion request has been processed. Please use either Show All Book or Search tab to inspect the change." + "</b>");
            }
        });

    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Access site at [ localhost:${port} ]`);
    makeDatabase();
    loadDatabase();
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