let express = require("express");
let bodyParser = require("body-parser");
// let MailGun = require("./MailGun.js");
let MongoDB = require("./MongoDB.js");
let SignUp = require("./signup.js");
let Process = require("./Process.js");
// const { body,validationResult } = require('express-validator/check');
// const { sanitizeBody } = require('express-validator/filter');

//config
const maintenance = false;
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


//----------------------------------------------------------------------
app.get("/signup", (req, res) => {
    console.log("Someone visited the signup page.");
    res.render("signup.hbs", {});
});

app.post("/signup", urlencodedParser, (req, res) => {
    console.log("received signup post");
    console.log(req.body.email);

    Process.reqSignup(req.body.email).then((result) => {
        console.log("clean exit");
        if (result === "user exist") {
            res.status(200).send("user already exist");
        } else {
            res.status(200).send("please confirm email");
        }
    });
    // SignUp.requestSignup(req.body.email).then((result) => {
    //     console.log("clean exit");
    //     if (result === "user exist") {
    //         res.status(200).send("user already exist");
    //     } else {
    //         res.status(200).send("please confirm email");
    //     }
    // });
});

app.get('/confirm/:token', function (req, res) {
    // res.send('user ' + req.params.token);
    console.log("received confirm token");
    SignUp.confirm(req.params.token).then((result) => {
        console.log("clean exit");
        if (result === "token not found") {
            res.status(200).send("token not found");
        } else if (result === "already added") {
            res.status(200).send("already added");
        } else if (result === "added") {
            res.status(200).send("success: added");
        } else {
            res.status(200).send("there was an error");
        }

    });
})
;


app.listen(80, () => {
    console.log(`Started up at port 80`);
});

module.exports = {app};

