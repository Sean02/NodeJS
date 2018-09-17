let app = require("index.js");
let mailgun = require("../MailGun.js");


app.post('/webhooks/mailgun/opens', urlencodedParser, function (req, res) {
    console.log(req.body);
    if (!mailgun.verifyMailgunWebhook(req.body.timestamp, req.body.token, req.body.signature, req, res)) {
        return;
    }
    MongoDB.Write("Lunch", "EmailOpens", req.body).then((result) => {
        console.log(result);
    });
    res.status(200).send("received mailgun webhook: OPENS");
});

app.post('/webhooks/mailgun/clicks', urlencodedParser, function (req, res) {
    if (!mailgun.verifyMailgunWebhook(req.body.timestamp, req.body.token, req.body.signature, req, res)) {
        return;
    }
    MongoDB.Write("Lunch", "EmailClicks", req.body).then((result) => {
        console.log(result);
    });
    console.log(req);
    res.status(200).send("received mailgun webhook: CLICKS");
});

app.post('/webhooks/mailgun/delivered', urlencodedParser, function (req, res) {
    if (!mailgun.verifyMailgunWebhook(req.body.timestamp, req.body.token, req.body.signature, req, res)) {
        return;
    }
    MongoDB.Write("Lunch", "EmailDelivers", req.body).then((result) => {
        console.log(result);
    });
    console.log("DELIVERED");
    res.status(200).send("received mailgun webhook: DELIVERED");
});