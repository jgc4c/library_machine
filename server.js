const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
var mysql = require('mysql2');
const app = express();
const port = 8080;

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/pages/index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/pages/login.html'));
});

app.post('/login-check', (req, res) => {
    // res.send(`User-type Selection is: ${req.body.user_Schema}\n ID is: ${req.body.id}\n Password is: ${req.body.pass}`);

});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});