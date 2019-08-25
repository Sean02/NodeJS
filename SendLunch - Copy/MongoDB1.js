const {MongoClient, ObjectID} = require("mongodb");

// let Stopwatch = require('timer-stopwatch');

function Read(database, collection, searchStr) {
    return new Promise((resolve) => {
        MongoClient.connect("mongodb://localhost:27017/" + database, (err, db) => {
            if (err)
                return console.log("Unable to connect to MongoDB server", err);
            console.log("Connected to MongoDB server");
            //connected to database
            db.collection(collection).find(searchStr).toArray().then((data) => {
                console.log(data);
                // console.log("got data");
                resolve(data);
            }, (err) => {
                console.log("Unable to get mailgun api key ", err);
                // errCallback("Unable to get mailgun api key " + err);
                resolve(err);
            });
            db.close(); //close database
        });
    });

}

function Write(database, collection, data) {
    return new Promise((resolve, reject) => {
        MongoClient.connect("mongodb://localhost:27017/" + database, (err, db) => {
            if (err)
                return console.log("Unable to connect to MongoDB server", err);
            console.log("Connected to MongoDB server");
            //connected to database
            db.collection(collection).insertOne(data, (err, result) => {
                if (err)
                    console.log("Error inserting to database:", err);
                // callback(result);
                resolve(result);
            }); //data is in format: {a:b, c:d}
            db.close(); //close database
        });
    });
}

function Update(database, collection, searchStr, data) {
    return new Promise((resolve, reject) => {
        MongoClient.connect("mongodb://localhost:27017/" + database, (err, db) => {
            if (err)
                return console.log("Unable to connect to MongoDB server", err);
            console.log("Connected to MongoDB server");
            //connected to database
            db.collection(collection).findOneAndUpdate(searchStr, {$set: data}, {returnOriginal: false}).then((res) => {
                //nothing to do.
                // callback(res);
                resolve(res);
            });
            //searchStr & data is in format: {a:b, c:d}
            db.close(); //close database
        });
    });
}

function Delete(database, collection, searchStr) {
    return new Promise((resolve, reject) => {
        MongoClient.connect("mongodb://localhost:27017/" + database, (err, db) => {
            if (err)
                return console.log("Unable to connect to MongoDB server", err);
            console.log("Connected to MongoDB server");
            //connected to database
            db.collection(collection).findOneAndDelete(searchStr).then((res) => {
                //nothing to do.
                // callback(res);
                resolve(res);
            });
            //searchStr & data is in format: {a:b, c:d}
            db.close(); //close database
        });
    });
}

module.exports = {
    Read,
    Write,
    Update,
    Delete
};
// let timer = new Stopwatch();
// timer.start();
// Read("Passwds", "MailgunApiKey", {handle: true}, (data) => {console.log("GotData",data)});
// timer.stop();
// console.log(timer.ms);
