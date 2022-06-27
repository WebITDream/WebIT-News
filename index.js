const express = require('express')
const app = express()
const path = require('path')
const router = express.Router()
const mysql = require('mysql')
require('dotenv').config()

var nodemailer = require('nodemailer');
const { ClientRequest } = require('http')


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'webitnews'
})

conn.connect(function(err) {
    if (err) throw err;
    console.log('Connected to database')
})

app.use(express.static(__dirname + '/public'));
router.get('/', function(req, res) {
    const email = req.query.email;
    if (!email) {
        console.log("req.query.email not present");
        res.redirect('/error')
        return;
    }

    conn.query("SELECT * FROM users WHERE email = ?", [email], function(err, result) {
        if (err) {
            console.log(err);
            res.redirect('/error')
            return;
        }
        const resultLength = result.length;
        if (resultLength == 0) {
            conn.query('INSERT INTO users (email) VALUES (?)', [email], function(err, result) {
                if (err) {
                    console.log(err);
                    res.redirect('/error')
                    return;
                }
                console.log('1 record inserted')
                res.redirect('/succes');
                var mailOptions = {
                    from: process.env.EMAIL,
                    to: email,
                    subject: 'WebIT News',
                    html: "<h1>Welcome to WebIT News</h1><br>" + "<p style='text-align: center; font-size: 25px; font-family: sans-serif;'>You have successfully subscribed to our newsletter</p>"
                }
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                })
                return;
            })
        } else {
            console.log("You are already subscribed to our newsletter!")
            res.redirect('/error')
            return;
        }
    });
});


router.get('/succes', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/html/succes.html'));
})

router.get("/error", function(req, res) {
    res.sendFile(path.join(__dirname + '/public/html/error.html'));
})

router.get("/home", function(req, res) {
    res.sendFile(path.join(__dirname + '/public/html/index.html'))
})

app.use('/', router)
app.listen(3715)
console.log('Server running on port 3001')