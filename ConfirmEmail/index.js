let express = require("express");
let compression = require('compression');
let bodyParser = require("body-parser");
let RateLimit = require('express-rate-limit');
// let sitemap = require("express-sitemap");
// let MailGun = require("./MailGun.js");
let MongoDB = require("./MongoDB.js");
let Process = require("./Process.js");
let sendLunch = require("./SendLunch/index.js");
let getLunch = require("./webscraper.js");
// var subdomain = require('express-subdomain');
let towerDefense = require("./TowerDefense.js");
let ServerProtection = require("./ServerProtection.js");
let fs = require("./FSread.js");
let http = require('http');
let https = require("https");
let path = require("path");
// const { body,validationResult } = require('express-validator/check');
// const { sanitizeBody } = require('express-validator/filter');
//config
const tableCSS = `<style>table{font-family:"Trebuchet MS",Arial,Helvetica,sans-serif;border-collapse:collapse;width:100%}table td,table th{border:1px solid #ddd;padding:8px}table tr:nth-child(even){background-color:#f2f2f2}table tr:hover{background-color:#ddd}table th{padding-top:12px;padding-bottom:12px;text-align:left;background-color:#4CAF50;color:#fff}</style>`;

const maintenance = false;
//
let app = express();
let urlencodedParser = bodyParser.urlencoded({
    extended: false
});
// app.use(bodyParser.json());
app.set("view engine", "hbs");

//gzip compression
app.use(compression());
////


////ssl
const httpsOptions = {
    ca: fs.read(path.join(__dirname, "ssl", "cert.ca-bundle")),
    cert: fs.read(path.join(__dirname, "ssl", "cert.crt")),
    key: fs.read(path.join(__dirname, "ssl", "cert.key"))
};


app.use((req, res, next) => {
    // The 'x-forwarded-proto' check is for Heroku
    if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
        return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
});
///////


//block request if IP is too frequent
// app.use((req, res, next) => {
//     ServerProtection.allowThisIP(getIP(req),req).then((result) => {
//         if (result.allow) {
//             next();
//         } else {
//             res.status(429).send(`<h1>429 TOO FREQUENT</h1><h2>Try again soon</h2><br><p>This incident will be reported.</p>`);
//             return;
//         }
//     });
// });

//record request
app.use((req, res, next) => {
    console.log(getIP(req), "is trying to access", req.protocol + '://' + req.get('host') + req.originalUrl, "using", req.method, "method")
    next();
    ServerProtection.recordRequest(getIP(req), req).then(() => {
        return;
    });
});


//rate limiter

app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc)

let normalLimiter = new RateLimit({
    windowMs: 5 * 60 * 1000,
    max: 500,
    delayMs: 0, // plain reject
    message: `<h1>429 TOO FREQUENT</h1><h2>Try again later</h2><p>This incident will be reported.</p><style>*{font-family: 'Open Sans', sans-serif;}</style>`,
    onLimitReached: addBadRecord
});

function addBadRecord(req, res, options) {
    console.log("limit func called");
    ServerProtection.recordBadRecord(getIP(req), req).then(() => {
        return;
    });
}

let sensitiveLimiter = new RateLimit({
    windowMs: 5 * 60 * 1000,
    max: 50,
    delayMs: 0, // plain reject
    message: `<h1>429 TOO FREQUENT</h1><h2>Try again later</h2><p>This incident will be reported.</p><style>*{font-family: 'Open Sans', sans-serif}</style>`,
    onLimitReached: addBadRecord
});

//apply limiter to these routes
app.use('/signup/', normalLimiter);
app.use('/unsubscribe/', normalLimiter);
app.use('/calc/', normalLimiter);
app.use('/confirm/', sensitiveLimiter);
app.use('/towerdefense/leaderboard', normalLimiter);
app.use('/towerdefense/addscore', sensitiveLimiter);

//shutdown website
app.use((req, res, next) => {
    // console.log(req);
    if (maintenance) {
        res.render("maintenance.hbs");
        return;
    }
    next();
});


app.use(function (err, req, res, next) {
    console.error("Express ERROR:" + err.stack);
    res.status(500).send('<h1>500 Internal Error</h1>');
    return;
});

app.get("/favicon.ico", (req, res) => {
    console.log("Trying to get favicon.ico");
    res.status(200).sendFile(__dirname + "/views/favicon-96x96.png");
});


//----------------------------------------------------------------------
//
//
//----------------------------------------------------------------------

app.get("/stats", (req, res) => {
    // let s = req.params.search;
    // let searchStr = {s: req.params.matchValue}

    ServerProtection.getTotalReqs().then((total) => {
        console.log("getting total requests:", total);
        // res.status(200).send("<br><br><br><br><br><center style='font-family: sans-serif; font-size: xx-large;'>Total number of requests:</center><br><br><center style='font-family: sans-serif; font-size: 200;'>" + total + "</center>");
        res.status(200).send("<div style='margin: auto; position: absolute; top:0; left: 0; bottom: 0; right: 0; height:500px;'><br><center style='font-family: sans-serif; font-size: xx-large;'>Total number of requests:</center><br><br><center style='font-family: sans-serif; font-size: 200;'>" + total + "</center></div>");
    }, (err) => {
        console.log(err);
        res.status(200).send("<h1>Error: " + err + "</h1>")
    });
});



app.get("/calc", (req, res) => {
    console.log("calc");
    res.status(200).sendFile(__dirname + "/views/Calculator.html");
});

app.get("/jquery", (req, res) => {
    console.log("wow, so, for all the places you could get jquery from, you have to get it from me, but here you go, with status 200");
    res.status(200).sendFile(__dirname + "/views/jquery-3.3.1.min.js");
});



app.get("/api", (req, res) => {
    scrape().then((data) => {
        res.json(data);
    });
});



app.get('/sitemap.xml', function (req, res) {
    var sitemap = generate_xml_sitemap(); // get the dynamically generated XML sitemap
    res.header('Content-Type', 'text/xml');
    res.send(sitemap);
});

app.get('/robot.txt', function (req, res) {
    res.header('Content-Type', 'text/plain');
    res.send("User-agent: *\nDisallow:\nSITEMAP: http://www.seansun.org/sitemap.xml");
});


//no matches found above -> look for static hosting
app.use("/", express.static(__dirname));


//not found in static either, emm... return 404 page!
app.use(function (req, res, next) {
    console.log("404 Not Found");
    res.status(404).sendFile(__dirname + "/views/404.html");
});

function getIP(req) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log("ip", ip);
    return ip;
}

function generate_xml_sitemap() {
    // this is the source of the URLs on your site, in this case we use a simple array, actually it could come from the database
    var urls = ['', 'signup', 'towerdefense', 'unsubscribe'];
    // the root of your website - the protocol and the domain name with a trailing slash
    var root_path = 'http://www.seansun.org/';
    // XML sitemap generation starts here
    var priority = 0.5;
    var freq = 'daily';
    var xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    for (var i in urls) {
        xml += '<url>';
        xml += '<loc>' + root_path + urls[i] + '</loc>';
        xml += '<changefreq>' + freq + '</changefreq>';
        xml += '<priority>' + priority + '</priority>';
        xml += '</url>';
        i++;
    }
    xml += '</urlset>';
    return xml;
}


// start server
https.createServer(httpsOptions, app).listen(443, function () {
    console.log("Started Luncher @ port 443");
});

http.createServer(app).listen(80, function () {
    console.log("Started Luncher @ port 80");
});

//getMailgun keys:
MongoDB.Read("Passwds", "MailgunApiKey", {handle: true}).then((data) => {
    key = data[0].key;
    const domain = "seansun.org";
    mailgun = require('mailgun-js')({
        apiKey: key,
        domain: domain
    });
    console.log("Mailgun init success");
}, (err) => {
    console.log(err);
});



module.exports = {
    app
};