let MongoDB = require("./MongoDB.js");

//get the mailgun api key: under mongo database -> MailgunApiKey -> key -> key


function sendEmail() {
    MongoDB.Find("Passwds", "MailgunApiKey", {handle: true}, (data) => {
        key = data[0].key;
        console.log("key is ", key);
        send();
    }, (err) => console.log(err));
}

function send() {
    const domain = "seansun.org";
    let mailgun = require('mailgun-js')({apiKey: key, domain: domain});
    var list = mailgun.lists('whatsforlunch@seansun.org');

    list.info(function (err, data) {
        // `data` is mailing list info
        console.log("_________________");
        console.log(data);
        console.log("_________________");
    });

    var bob = {
        subscribed: true,
        address: 'bob@gmail.com',
        name: 'Bob Bar',
        vars: {age: 26}
    };

    list.members().create(bob, function (err, data) {
        // `data` is the member details
        console.log("_________________");
        console.log(data);
        console.log("_________________");
    });

    list.members().list(function (err, members) {
        // `members` is the list of members
        console.log("_________________");
        console.log(members);
        console.log("_________________");
    });
}

module.exports = {
    sendEmail
};

sendEmail("", "", "", "", "");