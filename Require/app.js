console.log("starting...");

const fs = require("fs");
const os = require("os");
const notes = require("./notes");
const _ = require("lodash");
const yargs = require("yargs")


const yargsArgv =
    yargs
        .command("add", "Add a new note", {
                data: {
                    describe: "The data of the note",
                    demand: true,
                    alias: "d"
                }
            }
        )
        .help()
        .argv;
console.log("Yargs: ", yargsArgv);
const cmd = yargsArgv._[0];

if (cmd === "add") {
    let checkDuplicate = false;
    if (yargsArgv.d === true) {
        checkDuplicate = true;
        console.log("Request check duplicate");
    }
    console.log(notes.saveNotes(yargsArgv.data, checkDuplicate));
} else if (cmd === "get") {
    console.log(notes.getNotes());
} else if (cmd === "del") {
    console.log(notes.deleteNote(yargsArgv.data));
}

//
// console.log(_.isString(true));
//
// const arr = _.uniq([1,"a",2,"a","b",3,2,5,6,7,8]);
//
// console.log(arr);
//
// // fs.appendFile("greetings.txt","HelloWorld",function (err) {
// //     if (err){
// //         console.log(err);
// //     }
// // });
//
// const user = os.userInfo();
// // console.log(user);
//
// console.log("2+1 = "+notes.addOne(2));
//
// fs.appendFileSync("greetings.txt","Hello, "+user.username+".  ");
//
// console.log("These were the inputs: ");
//
// const sysArgv = process.argv;
// const cmds = sysArgv[2];
// console.log("Command", sysArgv);

