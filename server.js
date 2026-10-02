const express = require("express");
const sql = require('node:sqlite');
const crypto = require('node:crypto');

const app = express();
const db = new sql.DatabaseSync(":memory:");

db.exec("CREATE TABLE Users (Email VARCHAR, Password BLOB, Salt BLOB)");

app.use(express.json());

app.get("/", (req, res, next) => {
    res.sendFile("index.html", {root: __dirname});
});

app.get("/signup", (req, res, next) => {
    res.sendFile("signup.html", {root: __dirname});
});

app.get("/signup-success", (req, res, next) => {
    res.sendFile("signup-success.html", {root: __dirname});
});

app.get("/login-success", (req, res, next) => {
    res.sendFile("login-success.html", {root: __dirname});
});

app.post("/login", (req, res, next) => {
    if(!req.body 
        || !req.body.password 
        || !req.body.email
        || !req.body.email.match(/.+@.+/)
        || req.body.password.length < 8) {
        res.sendStatus(400);
    } else {
        // check if salted hashed password matches the one in db
        let user = db.prepare(`SELECT * FROM Users WHERE Email=?`)
            .get(req.body.email);
        if(user) {
            let salted = crypto.pbkdf2Sync(req.body.password, user['Salt'], 10000, 64, 'sha256');
            if(salted.compare(user['Password']) === 0) {
                res.sendStatus(200);
            } else res.sendStatus(401);
        } else res.sendStatus(401);
    }
});

app.post('/createuser', (req, res, next) => {
    if(!req.body 
        || !req.body.password 
        || !req.body.email
        || !req.body.email.match(/.+@.+/)
        || req.body.password.length < 8) {
        res.sendStatus(400);
    } else {
        // check if user already exists
        let user = db.prepare(`SELECT * FROM Users WHERE Email=?`)
            .get(req.body.email);
        if(user) {
            res.sendStatus(403);
        } else {
            // salt password with random bytes
            let salt = crypto.randomBytes(64);
            let salted = crypto.pbkdf2Sync(req.body.password, salt, 10000, 64, 'sha256');
            db.prepare("INSERT INTO Users (Email, Password, Salt) VALUES (?, ?, ?)")
                .get(req.body.email, salted, salt);
            res.sendStatus(200);
        }
    }
})

app.listen(3000, (err) => console.error(err));