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
let urlencodedParser = bodyParser.urlencoded({
    extended: false
});
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
app.use(function(err, req, res, next) {
    console.error("Express ERROR:" + err.stack);
    res.status(500).send('<h1>500 Internal Error</h1>');
    return;
});
//----------------------------------------------------------------------
app.get("/signup", (req, res) => {
    console.log("Someone visited the signup page.");
    res.render("signup.hbs", {});
});
app.get("/unsubscribe", (req, res) => {
    console.log("Someone visited the unsubscribe page.");
    res.render("unsubscribe.hbs", {});
});
app.post("/signup", urlencodedParser, (req, res) => {
    console.log("received signup post");
    console.log(req.body.email);
    Process.reqSignup(req.body.email).then((result) => {
        console.log("resolve:", result);
        if (result === "sent") {
            res.status(200).render("confirmEmail", {
                title: "You are <span style=\"color: #ff9933;\">one</span> step away.",
                msg: "Go to your email inbox and confirm your Luncher subscription!"
            });
        } else if (result === "user exist") {
            res.status(200).render("confirmEmail", {
                title: "You are already a Luncher",
                msg: "There's no point to subscribe again."
            });
        } else if (result === "too frequent") {
            res.status(200).render("confirmEmail", {
                title: "The confirmation email was sent",
                msg: "If you want another one, come back in a little bit."
            });
        } else if (result === "invalid email") { // need to add this in Process.js
            res.status(200).render("confirmEmail", {
                title: "Invalid email",
                msg: `Please check that email(${req.body.email}) is correct and try again.\n If you are still having problems, contact us at development@seansun.org.`
            });
        } else {
            console.log("Unknown ERROR", result);
            res.status(200).render("confirmEmail", {
                title: "Unknown Error",
                msg: `<span style='text-decoration: underline; cursor:pointer;color:#ff9933' onclick="
                location.href='mailto:development@seansun.org?subject=Feedback%20for%20Luncher'
                ">Contact us</span> about this error: [` + result + `]`
            });
        }
    }, (err) => {
        console.log("Unknown ERROR", err);
        res.status(200).render("confirmEmail", {
            title: "Unknown Error",
            msg: `<span style='text-decoration: underline; cursor:pointer;color:#ff9933' onclick="
            location.href='mailto:development@seansun.org?subject=Feedback%20for%20Luncher'
            ">Contact us</span> about this error: [` + err + `]`
        });
    });
});
app.post("/unsubscribe", urlencodedParser, (req, res) => {
    console.log("received unsubscribe post");
    console.log(req.body.email);
    Process.reqUnsubscribe(req.body.email).then((result) => {
        console.log("resolve:", result);
        if (result === "user doesnt exist") {
            res.status(200).render("confirmEmail", {
                title: "You are not subscribed",
                msg: `Click <span style='text-decoration: underline; cursor:pointer;color:#ff9933' onclick="
                location.href = '/signup'
                ">here</span> to subscribe!`
            });
        } else if (result === "user not confirmed") {
            res.status(200).render("confirmEmail", {
                title: "You are not subscribed",
                msg: "You need to confirm your email to subscribe."
            });
        } else if (result === "too frequent") {
            res.status(200).render("confirmEmail", {
                title: "Your confirmation email was sent",
                msg: "If you want another one, come back in a little bit."
            });
        } else if (result === "resent token") {
            res.status(200).render("confirmEmail", {
                title: "We resent you a confirmation email",
                msg: "Go to your email inbox and click on that email to unsubscribe."
            });
        } else if (result === "sent") {
            res.status(200).render("confirmEmail", {
                title: "We sent you a confirmation email",
                msg: "Go to your email inbox click on that email to unsubscribe."
            });
        } else {
            console.log("Server: Unknown ERROR", result);
            res.status(200).render("confirmEmail", {
                title: "Unknown Error",
                msg: `<span style='text-decoration: underline; cursor:pointer;color:#ff9933' onclick="
                location.href = 'mailto:development@seansun.org?subject=Feedback%20for%20Luncher'
                ">Contact us</span> about this error: [` + result + `]`
            });
        }
    });
});
app.get('/confirm/:token', function(req, res) {
    // res.send('user ' + req.params.token);
    if (req.params.token === "") {
        res.status(200).render("emailConfirmed", {
            title: "This link doesn't go anywhere.",
            msg: "Where did you even get it?"
        });
    }
    console.log("received confirm token");
    Process.confirm(req.params.token).then((result) => {
        console.log("clean exit");
        if (result === "token not found") {
            res.status(200).render("emailConfirmed", {
                title: "This link doesn't go anywhere.",
                msg: "Where did you even get it?"
            });
        } else if (result === "unsubscribed") {
            res.status(200).render("emailConfirmed", {
                title: "You are unsubscribed from Luncher",
                msg: `Do you mind telling us why you unsubscribed? <span style='text-decoration: underline; cursor:pointer;color:#ff9933' onclick="location.href='mailto:development@seansun.org?subject=Feedback%20for%20Luncher'">Contact us</span>!`
            });
        } else if (result === "added") {
            res.status(200).render("emailConfirmed", {
                title: "Congrats! You are now a Luncher",
                msg: "We will be emailing you lunch menus at 7:30am!"
            });
        } else if (result === "invalid email") {
            res.status(200).render("emailConfirmed", {
                title: "Your email is invalid",
                msg: "We will be emailing you lunch menus at 7:30am!"
            });
        } else {
            res.status(200).render("emailConfirmed", {
                title: "Well this is embarrassing, there has been an error.",
                msg: "You can retry but if the error doesn't go away, contact us by sending an email to development@seansun.org."
            });
        }
    });
});
// app.get("/stats", (req, res) => {
//     res.sendFile(__dirname + "/views/stats.html");
// });
app.get("/getStats", (req, res) => {
    Process.getUserCount().then((data) => {
        res.status(200).send({
            count: data
        });
    });
});
//none of above are found -> look for static
app.use("/", express.static(__dirname));
//not found in static either, emm... return 404 page!
app.use(function(req, res, next) {
    res.sendFile(__dirname + "/views/404.html");
    return;
});
// start server
app.listen(80, () => {
    console.log(`Started up at port 80`);
});
module.exports = {
    app
};