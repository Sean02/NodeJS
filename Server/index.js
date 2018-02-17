let express = require("express");
let bodyParser = require("body-parser");
let MailGun = require("./MailGun.js");
let MongoDB = require("./db/MongoDB.js");
var {mongoose} = require('./db/mongoose');
var {User} = require('./db/models/user');
// const { body,validationResult } = require('express-validator/check');
// const { sanitizeBody } = require('express-validator/filter');

//config
var env = process.env.NODE_ENV || 'development';

if (env === 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/Users';
}

const maintenance = false;
const port = process.env.PORT;
//
let app = express();
let urlencodedParser = bodyParser.urlencoded({extended: false});
// app.use(bodyParser.json());
app.set("view engine", "hbs");

//shutdown website
app.use((req, res, next) => {
    if (maintenance) {
        res.render("maintenance.hbs");
        return;
    }
    next();
});


app.get("/send", (req, res) => {
    console.log("Someone visited the send page.");
    res.render("send.hbs", {});
});

app.post("/send", urlencodedParser, (req, res) => {
    console.log(req.body);
    console.log(req.body.domain);
    MongoDB.Find("Passwds", "SendEmailPasswd", {handle: true}, (passwd) => {
        passwd = passwd[0].key;
        if (req.body.passwd === passwd) {
            MailGun.sendEmail(req.body.domain, req.body.from, req.body.to, req.body.subject, req.body.text);
            res.status(200).send("<h1>Your email has been sent!</h1>");
        } else {
            console.log("send email passwd wrong: ", req.body.passwd, " & ", passwd);
        }
    }, (err) => {
        console.log(err)
    });

});

app.get("/signup", (req, res) => {
    console.log("Someone visited the signup page.");
    res.render("signup.hbs", {});
});

app.post("signup/", urlencodedParser, (req, res) => {
    // var body = _.pick(req.body, ['email', 'password']);
    let body = {email: res.body.email, password: res.body.passwd}
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    })
});

app.get('users/me', (req, res) => {
    let token = req.header();

    User.findByToken(token).then((user) => {
        if (!user) {

        }

        res.send(user);
    })
});

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});

module.exports = {app};

