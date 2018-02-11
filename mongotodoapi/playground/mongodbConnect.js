// const MongoClient = require("mongodb").MongoClient;
const {MongoClient,ObjectID} = require("mongodb"); // same as the code above ^


MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
    if (err)
        return console.log("Unable to connect to MongoDB server", err)
    console.log("Connected to MongoDB server");

    db.collection("Todos").insertOne({
        text: "Helloworld",
        completed: false
    }, (err, res) => {
        if (err)
            return console.log("unable to insert todo ", err);
        console.log(JSON.stringify(res.ops, undefined, 2))
        console.log("Id: ",res.ops[0]._id);
        // console.log("Created at: ",res.ops[0]._id.getTimeStamp());
    })

    db.close();
});