let app = require("../index.js");
let process = require("../Process.js");

app.get("/getStats", (req, res) => {
    process.getUserCount().then((data) => {
        res.status(200).send({
            count: data
        });
    });
});

app.get("/signup", (req, res) => {
    console.log("Someone visited the signup page.");
    res.render("signup.hbs", {});
});

app.get("/unsubscribe", (req, res) => {
    console.log("Someone visited the unsubscribe page.");
    res.render("unsubscribe.hbs", {});
});

app.get('/confirm/:token', function (req, res) {
    // res.send('user ' + req.params.token);
    if (req.params.token === "") {
        res.status(200).render("emailConfirmed", {
            title: "This link doesn't go anywhere.",
            msg: "Where did you even get it?"
        });
    }
    console.log("received confirm token");
    process.confirm(req.params.token, sendLunch).then((result) => {
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

app.post("/signup", urlencodedParser, (req, res) => {
    console.log("received signup post");
    console.log(req.body.email);
    process.reqSignup(req.body.email).then((result) => {
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
        } else if (result === "invalid email") {
            res.status(200).render("confirmEmail", {
                title: "Invalid email",
                msg: "Try harder, I don't believe you can hack my server."
            });
        } else if (result === "too frequent") {
            res.status(200).render("confirmEmail", {
                title: "The confirmation email was sent",
                msg: "If you want another one, come back in a little bit."
            });
        } else if (result === "invalid email") { // need to add this in Process functions
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
    process.reqUnsubscribe(req.body.email).then((result) => {
        console.log("resolve:", result);
        if (result === "user doesnt exist") {
            res.status(200).render("confirmEmail", {
                title: "You are not subscribed",
                msg: `Click <span style='text-decoration: underline; cursor:pointer;color:#ff9933' onclick="location.href = '/signup'">here</span> to subscribe!`
            });
        } else if (result === "user not confirmed") {
            res.status(200).render("confirmEmail", {
                title: "You are not subscribed",
                msg: "You need to confirm your email to subscribe."
            });
        } else if (result === "invalid email") {
            res.status(200).render("confirmEmail", {
                title: "Invalid email",
                msg: "Try harder, I don't believe you can hack my server."
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

