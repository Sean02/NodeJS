let MongoDB = require("./MongoDB.js");

//get the mailgun api key: under mongo database -> MailgunApiKey -> key -> key
function sendEmail(domain, from, to, subject, text) {
    return new Promise((resolve, reject) => {
        MongoDB.Read("Passwds", "MailgunApiKey", {
            handle: true
        }).then((data) => {
            key = data[0].key;
            console.log("key is ", key);
            //Send Email
            send(domain, from, to, subject, text).then(() => {
                console.log("sent");
                resolve();
            }, (err) => {
                console.log(err);
                reject(err);
            });
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
        const domain = "seansun.org";
        let mailgun = require('mailgun-js')({
            apiKey: key,
            domain: domain
        });
        var data = {
            from: from,
            to: to,
            subject: subject,
            html: text,
            "h:Reply-To": "development@seansun.org",
            "v:my-custom-data": {"v:Recipient-Email": "%recipient.email%"}
        };
        console.log("data to be sent is ", data.from, "\n", data.to, "\n", data.subject);
        mailgun.messages().send(data, function (error, body) {
            console.log(body);
            resolve(0);
        }, (err) => {
            console.log(err);
            reject(err);
        });
    });
}

function MailingList(cmd, user) {
    return new Promise((resolve, reject) => {
        MongoDB.Read("Passwds", "MailgunApiKey", {
            handle: true
        }).then((data) => {
            key = data[0].key;
            console.log("key is ", key);
            List(cmd, user).then((res) => {
                console.log("Mailing list func: added.");
                resolve(res);
            }, (err) => {
                console.log(err);
                reject(err);
            });
        }, (err) => {
            console.log(err);
            reject(err);
        });
    });
}

function List(cmd, a) {
    return new Promise((resolve, reject) => {
        const domain = "seansun.org";
        let mailgun = require('mailgun-js')({
            apiKey: key,
            domain: domain
        });
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

module.exports = {
    sendEmail,
    MailingList
};
// sendEmail("","no-reply@seansun.org","sean.sun@sonomaacademy.org","hi","hello");