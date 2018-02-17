//vars
var key; //the mailgun api key
var mailgun;
let MongoDB = require("./db/MongoDB.js");
//get the mailgun api key: under mongo database -> MailgunApiKey -> key -> key


function sendEmail(domain,from,to,subject,text) {
    MongoDB.Find("Passwds","MailgunApiKey",null,(data)=>{
        key = data[0].key;
        console.log("key is ",key);
        send(domain,from,to,subject,text);
    },(err)=>console.log(err));
}

function send(domain,from,to,subject,text) {
    if (from === "") from = 'Sean <no-reply@seansun.org>';
    if (to === "") to = 'sean.sun@sonomaacademy.org';
    if (subject === "") subject = 'Email from seansun.org';
    if (text === "") text = 'Hello World!';
    if (domain === "") domain = 'seansun.org';


    mailgun = require('mailgun-js')({apiKey: key, domain: domain});
    var data = {
        from: from,
        to: to,
        subject: subject,
        text: text
    };

    console.log("data to be sent is ", data);

    mailgun.messages().send(data, function (error, body) {
        console.log(body);
    });
}

module.exports = {
    sendEmail
};