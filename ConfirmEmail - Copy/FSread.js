const fs = require("fs");

let read = (fileName) => {
    try {
        let text = fs.readFileSync(fileName,"utf8");
        // console.log(text);
        return text;
    } catch (e) {
        console.log("Error when reading file (from fs):", e);
        throw e;
        return "";
    }
};

module.exports = {
  read
}
