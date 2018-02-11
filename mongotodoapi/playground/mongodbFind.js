// const MongoClient = require("mongodb").MongoClient;
const {MongoClient,ObjectID} = require("mongodb"); // same as the code above ^


MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
    if (err)
        return console.log("Unable to connect to MongoDB server", err)
    console.log("Connected to MongoDB server");


    db.collection("Todos").find().count().then((count)=>{
        console.log("find: all count");

        console.log(count)
    },(err)=>{
        console.log("Unable to read todos, ",err);
    });


    db.collection("Todos").find().toArray().then((docs)=>{
        console.log("find: all");

        console.log(JSON.stringify(docs,undefined,2));
    },(err)=>{
        console.log("Unable to read todos, ",err);
    });


    db.collection("Todos").find({"completed":false}).toArray().then((docs)=>{
        console.log("find: completed === false");

        console.log(JSON.stringify(docs,undefined,2));
    },(err)=>{
        console.log("Unable to read todos, ",err);
    });


    db.collection("Todos").find({
        _id: new ObjectID("5a7f81013d3eba1fa88434df")
    }).toArray().then((docs)=>{
        console.log("find _id = \"5a7f81013d3eba1fa88434df\"");

        console.log(JSON.stringify(docs,undefined,2));
    },(err)=>{
        console.log("Unable to read todos, ",err);
    });

    // db.close();
});