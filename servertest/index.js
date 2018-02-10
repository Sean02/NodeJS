const maintenance = true;
const express = require("express");
const hbs = require("hbs")
const fs = require("fs")

let app = express();

hbs.registerPartials(__dirname + "/views/partials");
app.set("view engine", "hbs");

//log request
app.use((req, res, next) => {
    let now = new Date().toString();
    let log = `${now}: ${req.method} ${req.url}`
    console.log(log);
    fs.appendFile("server.log", log + "\n", (err) => {
        if (err)
            console.log("Error when logging: ", err)
    });

    next();
});

//shutdown website
app.use((req, res, next) => {
    if (maintenance) {
        res.render("maintenance.hbs");
        return;
    }
    next();
    // next(); DO NOT continue
});

//static hosting
app.use(express.static(__dirname + "/www"));

hbs.registerHelper("currentYear", () => {
    return new Date().getFullYear();
});

app.get("/", (req, res) => {
    console.log("Someone visited.")
    // console.log(req);
    res.send("<h1>Hello Express!</h1>");
});

app.get("/about", (req, res) => {
    console.log("Someone visited about.")
    // console.log(req);
    // res.send("<h1>Hello Express!</h1>");
    res.render("about.hbs", {
        pageTitle: "About Page"
        // ,currentYear: new Date().getFullYear()
    });
});


app.listen(3000, () => {
    console.log("Serving...");
});
console.log("Starting...");