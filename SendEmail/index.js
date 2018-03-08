let express = require("express");
let bodyParser = require("body-parser");
let MailGun = require("./MailGun.js");
let MongoDB = require("./MongoDB.js");
// const { body,validationResult } = require('express-validator/check');
// const { sanitizeBody } = require('express-validator/filter');
//config
const maintenance = false;
//
let app = express();
let urlencodedParser = bodyParser.urlencoded({
    extended: false
});
//
app.use(function(err, req, res, next) {
    console.error("Express ERROR:" + err.stack);
    res.status(500).send('<h1>500 Internal Error</h1>');
    return;
});
//----------------------------------------------------------------------
app.get("/", (req, res) => {
    console.log("Send Email Page");
    res.sendFile(__dirname + "/index.html");
});
app.post("/", urlencodedParser, (req, res) => {
    console.log("received sendEmail post");
    console.log(req.body.from);
    console.log(req.body.to);
    console.log(req.body.subject);
    console.log(req.body.text);
    MailGun.sendEmail("(domain)", req.body.from, req.body.to, req.body.subject, req.body.text).then((result) => {
        console.log(result);
        res.status(200).send("<h1>Success: sent</h1>");
    }, (err) => {
        console.log(err);
        res.status(200).send("<h1>Error: " + err + "</h1>")
    });
});
app.get("/users/", (req, res) => {
    res.status(200).sendFile(__dirname + "/users.html");
});
app.get("/users/t", (req, res) => {
    MongoDB.Read("Lunch", "Users", {
        "subscribed": true
    }).then((data) => {
        // console.log(data);
        res.status(200).send(nicenIt(data));
    }, (err) => {
        console.log(err);
        res.status(200).send("<h1>Error: " + err + "</h1>")
    });
});
app.get("/users/f", (req, res) => {
    MongoDB.Read("Lunch", "Users", {
        "subscribed": false
    }).then((data) => {
        // console.log(data);
        res.status(200).send(nicenIt(data));
    }, (err) => {
        console.log(err);
        res.status(200).send("<h1>Error: " + err + "</h1>")
    });
});
app.get("/users/a", (req, res) => {
    MongoDB.Read("Lunch", "Users", {}).then((data) => {
        // console.log(data);
        res.status(200).send(nicenIt(data));
    }, (err) => {
        console.log(err);
        res.status(200).send("<h1>Error: " + err + "</h1>")
    });
});

function nicenIt(data) {
    let res = "<style>th {text-align: left;}table, td, th {border: 1px solid black;}table {border-collapse: collapse;  width: 100%;}</style> <table><tr><th>No</th><th>_id</th><th>Email</th><th>Subscribed</th><th>Time</th><th>Token</th></tr>";
    data.forEach((item, index) => {
        res += "<tr><td>" + (index + 1) + "</td><td>" + item._id + "</td><td>" + item.email + "</td><td>" + item.subscribed + "</td><td>" + item.time + "</td><td>" + item.token + "</td><tr>";
    });
    return res += "</table>";
}
// start server
app.listen(81, () => {
    console.log(`Started up at port 81`);
});
module.exports = {
    app
};