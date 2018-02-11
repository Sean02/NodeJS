let express = require("express");
let bodyParser = require("body-parser");

let {mongoose} =require("./db/index.js");
let {Todo} = require("./models/todo.js");
let {User} = require("./models/user.js");

let app = express();
app.use(bodyParser.json());


app.post("/todos",(req,res)=>{
   console.log(req.body);
    let newTodo = new Todo({
        text: req.body.text
    });
    newTodo.save().then((data) => {
        console.log("Saved todo: ", JSON.stringify(data, undefined, 2));
        res.status(200).send("Saved todo: ", JSON.stringify(data, undefined, 2));
    }, (err) => {
        console.log("Failed to save todo ", err);
        res.status(400).send("Failed to save todo ", err);
    })

});

app.listen(3000,()=>{
    console.log("Serving on port 3000");
});

