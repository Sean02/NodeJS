const {
    MongoClient,
    ObjectID
} = require("mongodb");
// let Stopwatch = require('timer-stopwatch');
function Read(database, collection, searchStr) {
    return new Promise((resolve, reject) => {
        MongoClient.connect("mongodb://localhost:27017/" + database, (err, db) => {
            //Reject promise if connection failed
            if (err) {
                reject(err);
            }
            //connected to database
            // console.log("Connected to MongoDB server");
            db.collection(collection).find(searchStr).toArray((err, data) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                //Got Data
                console.log(data);
                resolve(data);
            });
            //close database
            db.close();
        });
    });
}

function Write(database, collection, data) {
    return new Promise((resolve, reject) => {
        MongoClient.connect("mongodb://localhost:27017/" + database, (err, db) => {
            //Reject promise if load fails
            if (err) {
                reject(err);
            }
            //connected to database
            // console.log("Connected to MongoDB server");
            db.collection(collection).insertOne(data, (err, result) => {
                if (err) {
                    console.log("Error inserting to database:", err);
                    reject(err);
                }
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
            if (err) reject("Unable to connect to MongoDB server", err);
            // console.log("Connected to MongoDB server");
            //connected to database
            db.collection(collection).findOneAndUpdate(searchStr, {
                $set: data
            }, {
                returnOriginal: false
            }, (err, res) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
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
            if (err) {
                reject("Unable to connect to MongoDB server", err);
            }
            // console.log("Connected to MongoDB server");
            //connected to database
            db.collection(collection).findOneAndDelete(searchStr, (err, res) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                //nothing to do.
                // callback(res);
                resolve(res);
            });
            //searchStr & data is in format: {a:b, c:d}
            db.close(); //close database
        });
    });
}

function Count(database, collection, searchStr) {
    return new Promise((resolve, reject) => {
        MongoClient.connect("mongodb://localhost:27017/" + database, (err, db) => {
            //Reject promise if connection failed
            if (err) {
                reject(err);
            }
            //connected to database
            // console.log("Connected to MongoDB server");
            db.collection(collection).count(searchStr, function(err, count) {
                if (err) {
                    reject(err);
                }
                resolve(count);
                db.close();
            });
            //close database
            db.close();
        });
    });
}
module.exports = {
    Read,
    Write,
    Update,
    Delete,
    Count
};
// let timer = new Stopwatch();
// timer.start();
// Read("Passwds", "MailgunApiKey", {handle: true}, (data) => {console.log("GotData",data)});
// timer.stop();
// console.log(timer.ms);