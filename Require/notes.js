// console.log("Cool! notes.js is running");
//
// console.log(module);

const fs = require("fs");

let addOne = (a) => {
    console.log("add one is called");
    return a + 1;
};

let getNotes = () => {
    try {
        let noteString = fs.readFileSync("data.json");
        return JSON.parse(noteString);
    } catch (e) {
        console.log("Error when getting notes:", e);
        return [];
    }
};

let saveNotes = (note, checkForDuplicates) => {
    try {
        let notes = getNotes();
        console.log("Got notes: ",notes);
        if (checkForDuplicates) {
            let duplicateNotes = notes.filter((item) => {return note === item});
            if (duplicateNotes.length !== 0)
                return "Duplicate, did not add";
        }
        console.log("Actually adding notes");
        notes.push(note);
        writeToJSON("data.json", notes);
        return "Successful";
    }catch (e){
        return "Error: "+e.toString();
    }
};

let deleteNote = (note) =>{
    let notes = getNotes();
    let NewNotes = notes.filter((item) => {return note !== item});
    writeToJSON("data.json", NewNotes);
    if (notes.length === NewNotes.length)
        return "Not found: nothing deleted";
    else
        return "Successful";
}

let writeToJSON = (file, data) => {
    console.log(`writing notes: ${data} to this file: ${file}`);
    fs.writeFileSync(file, JSON.stringify(data));
};

module.exports = {
    addOne,
    saveNotes,
    getNotes,
    deleteNote
};