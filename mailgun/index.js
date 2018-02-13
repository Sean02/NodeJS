const fs = require("fs");
var api_key = fs.readFileSync('C:\\MailgunApiKey.txt');
var domain = 'seansun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

var data = {
    from: 'Sean <no-reply@seansun.org>',
    to: 'sean.sun@sonomaacademy.org',
    subject: 'Email from seansun.org',
    text: 'Hello World!'
};

mailgun.messages().send(data, function (error, body) {
    console.log(body);
});