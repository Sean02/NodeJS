const {MongoClient, ObjectID} = require("mongodb");


function Find(database, collection, searchStr, callback, errCallback) {
    MongoClient.connect("mongodb://localhost:27017/" + database, (err, db) => {
        if (err)
            return console.log("Unable to connect to MongoDB server", err);
        console.log("Connected to MongoDB server");
        //connected to database
        db.collection(collection).find(searchStr).toArray().then((data) => {
            console.log(data);
            callback(data);
        }, (err) => {
            console.log("Unable to get mailgun api key ", err);
            errCallback("Unable to get mailgun api key " + err);
        });
        db.close(); //close database
    });
}

function Write(database, collection, Data, callback, errCallback){

}

module.exports = {
    Find,
    Write
};

