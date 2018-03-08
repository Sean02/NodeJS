let express = require("express");
let bodyParser = require("body-parser");
let MailGun = require("./MailGun.js");
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
    MailGun.sendEmail("(domain)", req.body.from, req.body.to, req.body.subject, req.body.text).then((res) => {
        console.log(res);
        return;
    }, (err) => {
        console.log(err);
    });
});
// start server
app.listen(81, () => {
    console.log(`Started up at port 81`);
});
module.exports = {
    app
};