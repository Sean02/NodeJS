let MongoDB = require("./MongoDB.js");
let ServerProtection = require("ServerProtection.js");
let mailgun; //init this later after MongoDB is inited



function verifyMailgunWebhook(timestamp, token, signature, req, res) {
    if (!mailgun.validateWebhook(timestamp, token, signature)) {
        console.log("FAKE MAILGUN!!!");
        ServerProtection.recordBadRecord(getIP(req), req).then(() => {
            MongoDB.Write("ServerProtection", "WebhookWarnings", {
                timestamp,
                token,
                signature,
                body: req.body
            }).then(() => {
                res.status(406).send("");
            });
        });
        return false;
    }
    return true;
}


function sendEmail(domain, from, to, subject, text) {
    return new Promise((resolve, reject) => {
        send(domain, from, to, subject, text).then(() => {
            console.log("sent");
            resolve();
        }, (err) => {
            console.log(err);
            reject(err);
        });
    });
}


function send(domain1, from, to, subject, text) {
    return new Promise((resolve, reject) => {
        if (from === "") from = 'Sean <no-reply@seansun.org>';
        if (to === "") to = 'sean.sun@sonomaacademy.org';
        if (subject === "") subject = 'Email from seansun.org';
        if (text === "") text = 'Hello World!';
        // if (domain === "") domain = 'seansun.org';
        var data = {
            from: from,
            to: to,
            subject: subject,
            html: text,
            "h:Reply-To": "development@seansun.org"
        };
        console.log("data to be sent is ", data.from, "\n", data.to, "\n", data.subject);
        mailgun.messages().send(data, function (error, body) {
            console.log(body);
            resolve(0);
        });
    });
}

function MailingList(cmd, user) {
    return new Promise((resolve, reject) => {
        List(cmd, user).then((res) => {
            console.log("Mailing list func: added.");
            resolve(res);
        }, (err) => {
            console.log(err);
            reject(err);
        });
    });
}

function List(cmd, a) {
    return new Promise((resolve, reject) => {
        var list = mailgun.lists('Luncher@seansun.org');
        if (cmd === "info") {
            list.info(function (err, data) {
                // `data` is mailing list info
                resolve(data);
            });
        } else if (cmd === "create") {
            // var bob = {
            //     subscribed: true,
            //     address: 'bob@gmail.com',
            //     name: 'Bob Bar',
            //     vars: {age: 26}
            // };
            console.log("creating");
            list.members().create(a, function (err, data) {
                // `data` is the member details
                console.log(data);
                console.log(err);
                resolve(data);
            });
        } else if (cmd === "list") {
            list.members().list(function (err, members) {
                // `members` is the list of members
                resolve(members);
            });
        } else if (cmd === "update") {
            // list.members('bob@gmail.com').update({ name: 'Foo Bar' }, function (err, body) {
            list.members(a.find).update(a.replace, function (err, body) {
                resolve(body);
            });
        } else if (cmd === "delete") {
            // list.members('bob@gmail.com').delete(function (err, data) {
            list.members(a).delete(function (err, data) {
                resolve(data);
            });
        } else {
            resolve("Unknown cmd");
        }
    });
}


//init mailgun
MongoDB.Read("Passwds", "MailgunApiKey", {
    handle: true
}).then((data) => {
    key = data[0].key;
    const domain = "seansun.org";
    mailgun = require('mailgun-js')({
        apiKey: key,
        domain: domain
    });
});

module.exports = {
    sendEmail,
    MailingList,
    verifyMailgunWebhook
};

// sendEmail("","no-reply@seansun.org","sean.sun@sonomaacademy.org","hi","hello");