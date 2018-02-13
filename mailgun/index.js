//vars
var key; //the mailgun api key
const from = 'Sean <no-reply@seansun.org>';
const to = 'sean.sun@sonomaacademy.org';
const subject = 'Email from seansun.org';
const text = 'Hello World!';
const domain = 'seansun.org';
//require libraries
const {MongoClient,ObjectID} = require("mongodb");
var mailgun;

//get the mailgun api key: under mongo database -> MailgunApiKey -> key -> key
MongoClient.connect("mongodb://localhost:27017/MailgunApiKey", (err, db) => {
    if (err)
        return console.log("Unable to connect to MongoDB server", err);
    // console.log("Connected to MongoDB server");
    //connected to database
    db.collection("key").find().toArray().then((docs)=>{
        key = docs[0].key;
        // console.log(docs[0].key);
        sendEmail();//got key -> send email now
    },(err)=>{//got error -> console and exit
        console.log("Unable to get mailgun api key ",err);
    });
    db.close(); //close database
});

//not going to save it in a txt anymore
// const fs = require("fs");
// var api_key = fs.readFileSync('C:\\MailgunApiKey.txt');

function sendEmail() {
    mailgun = require('mailgun-js')({apiKey: key, domain: domain});
    var data = {
        from: from,
        to: to,
        subject: subject,
        text: text
    };

    mailgun.messages().send(data, function (error, body) {
        console.log(body);
    });
}