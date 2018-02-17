const jwt = require("jsonwebtoken");

const token = jwt.sign({email: "abc"}, "abcd");
console.log(token);