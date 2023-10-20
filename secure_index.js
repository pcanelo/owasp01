const express = require("express");
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const session = require("express-session");

const app = express();
const session_secret = process.env.SESSION_SECRET;
const hour = 3600000;
const cookies = {
    secret: session_secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: new Date(Date.now() + hour),
        maxAge: hour,
        sameSite: 'strict'
    }
}

app.set('views', './templates');
app.set('view engine', 'pug');
app.use(session(cookies));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', (req, res) => {
    res.render('index')
});

app.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    if (username === "admin" && password === "password") {
        req.session.regenerate((err) => {
            if (err) {
                res.render('error', {message: 'Unable to generate session'});
            }
            req.session.username = req.body.username;
            res.render('auth', {username: req.body.username});
        })
        
    } else {
        res.render('error', {'message': 'Invalid credentials'})
    }
});

app.get('/admin', (req, res) => {
    let mySession = req.session;
    if (mySession.username) {
        res.render('auth', {username: mySession.username});
    } else {
        res.render('error', {message: "Please login first"});
    }
})

app.get('/logout', (req,res) => {
    req.session.destroy((err) => {
        if (err) {
            res.render('error', {message: 'Unable to delete session'});
        } else {
            res.render('index');
        }
    })
});

app.listen(5000, () => {
    console.log("App is listening on port 5000");
});  
