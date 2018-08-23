let express = require("express");
let bodyParser = require("body-parser");
let MailGun = require("./MailGun.js");
let MongoDB = require("./MongoDB.js");
let FSread = require("./FSread.js");
// const { body,validationResult } = require('express-validator/check');
// const { sanitizeBody } = require('express-validator/filter');
//config
const maintenance = false;
const tableCSS = `<style>table{font-family:"Trebuchet MS",Arial,Helvetica,sans-serif;border-collapse:collapse;width:100%}table td,table th{border:1px solid #ddd;padding:8px}table tr:nth-child(even){background-color:#f2f2f2}table tr:hover{background-color:#ddd}table th{padding-top:12px;padding-bottom:12px;text-align:left;background-color:#4CAF50;color:#fff}</style>`;
//
let app = express();
let urlencodedParser = bodyParser.urlencoded({
    extended: false
});
//
app.use(function (err, req, res, next) {
    console.error("Express ERROR:" + err.stack);
    res.status(500).send('<h1>500 Internal Error</h1>');
    return;
});
//----------------------------------------------------------------------
app.get("/", (req, res) => {
    console.log("Send Email Page");
    res.sendFile(__dirname + "/index.html");
});
app.post("/", urlencodedParser, (req, res) => {
    console.log("received sendEmail post");
    console.log(req.body.from);
    console.log(req.body.to);
    console.log(req.body.subject);
    console.log(req.body.text);
    MailGun.sendEmail("(domain)", req.body.from, req.body.to, req.body.subject, req.body.text).then((result) => {
        console.log(result);
        res.status(200).send("<h1>Success: sent</h1>");
    }, (err) => {
        console.log(err);
        res.status(200).send("<h1>Error: " + err + "</h1>")
    });
});
app.get("/users/", (req, res) => {
    res.status(200).sendFile(__dirname + "/users.html");
});
app.get("/users/t", (req, res) => {
    MongoDB.Read("Lunch", "Users", {
        "subscribed": true
    }).then((data) => {
        // console.log(data);
        res.status(200).send(nicenIt(data) + tableCSS);
    }, (err) => {
        console.log(err);
        res.status(200).send("<h1>Error: " + err + "</h1>")
    });
});
app.get("/users/f", (req, res) => {
    MongoDB.Read("Lunch", "Users", {
        "subscribed": false
    }).then((data) => {
        // console.log(data);
        res.status(200).send(nicenIt(data) + tableCSS);
    }, (err) => {
        console.log(err);
        res.status(200).send("<h1>Error: " + err + "</h1>")
    });
});
app.get("/users/a", (req, res) => {
    MongoDB.Read("Lunch", "Users", {}).then((data) => {
        // console.log(data);
        res.status(200).send(nicenIt(data) + tableCSS);
    }, (err) => {
        console.log(err);
        res.status(200).send("<h1>Error: " + err + "</h1>")
    });
});

app.get("/a", (req, res) => {
    // let s = req.params.search;
    // let searchStr = {s: req.params.matchValue}

    MongoDB.Read("ServerProtection", "RequestHistory", {}).then((data) => {
        // console.log(data);
        res.status(200).send(`<a href="/a/t"><button>Sort by time last visited</button></a><a href="/a/i"><button>Sort by IP</button></a><a href="/a/r"><button>Sort by num of requests</button></a><a href="/a/b"><button>Sort by num of bad records</button></a><a href="/a/l"><button>Sort by request</button></a>` + nicenReq(data) + tableCSS);
    }, (err) => {
        console.log(err);
        res.status(200).send("<h1>Error: " + err + "</h1>")
    });
});

app.get("/a/t", (req, res) => {
    MongoDB.ReadWithSortAndSkipAndLimit("ServerProtection", "RequestHistory", {}, {
        "lastVisitTime": -1
    }, 0, 0).then((data) => {
        // console.log(data);
        res.status(200).send(nicenReq(data) + tableCSS);
    }, (err) => {
        console.log(err);
        res.status(200).send("<h1>Error: " + err + "</h1>")
    });
});
app.get("/a/i", (req, res) => {
    MongoDB.ReadWithSortAndSkipAndLimit("ServerProtection", "RequestHistory", {}, {
        "IP": 1
    }, 0, 0).then((data) => {
        // console.log(data);
        res.status(200).send(nicenReq(data) + tableCSS);
    }, (err) => {
        console.log(err);
        res.status(200).send("<h1>Error: " + err + "</h1>")
    });
});
app.get("/a/r", (req, res) => {
    MongoDB.ReadWithSortAndSkipAndLimit("ServerProtection", "RequestHistory", {}, {
        "requests": -1
    }, 0, 0).then((data) => {
        // console.log(data);
        res.status(200).send(nicenReq(data) + tableCSS);
    }, (err) => {
        console.log(err);
        res.status(200).send("<h1>Error: " + err + "</h1>")
    });
});
app.get("/a/b", (req, res) => {
    MongoDB.ReadWithSortAndSkipAndLimit("ServerProtection", "RequestHistory", {}, {
        "badRecords": -1
    }, 0, 0).then((data) => {
        // console.log(data);
        res.status(200).send(nicenReq(data) + tableCSS);
    }, (err) => {
        console.log(err);
        res.status(200).send("<h1>Error: " + err + "</h1>")
    });
});app.get("/a/l", (req, res) => {
    MongoDB.ReadWithSortAndSkipAndLimit("ServerProtection", "RequestHistory", {}, {
        "lastRequest": -1
    }, 0, 0).then((data) => {
        // console.log(data);
        res.status(200).send(nicenReq(data) + tableCSS);
    }, (err) => {
        console.log(err);
        res.status(200).send("<h1>Error: " + err + "</h1>")
    });
});
app.get("/t", (req, res) => {
    // let s = req.params.search;
    // let searchStr = {s: req.params.matchValue}

    MongoDB.Read("ServerProtection", "RequestHistory", {}).then((data) => {
        // console.log(data);
        let total = 0;
        data.forEach((item) => {
            total += item.requests
        });
        // res.status(200).send("<br><br><br><br><br><center style='font-family: sans-serif; font-size: xx-large;'>Total number of requests:</center><br><br><center style='font-family: sans-serif; font-size: 200;'>" + total + "</center>");
        res.status(200).send("<div style='margin: auto; position: absolute; top:0; left: 0; bottom: 0; right: 0; height:500px;'><br><center style='font-family: sans-serif; font-size: xx-large;'>Total number of requests:</center><br><br><center style='font-family: sans-serif; font-size: 200;'>" + total + "</center></div>");
    }, (err) => {
        console.log(err);
        res.status(200).send("<h1>Error: " + err + "</h1>")
    });
});

app.get("/tu", (req, res) => {
    // let s = req.params.search;
    // let searchStr = {s: req.params.matchValue}

    MongoDB.Read("Lunch", "Users", {subscribed: true}).then((data) => {
        // console.log(data);
        let total = data.length;
        // res.status(200).send("<br><br><br><br><br><center style='font-family: sans-serif; font-size: xx-large;'>Total number of requests:</center><br><br><center style='font-family: sans-serif; font-size: 200;'>" + total + "</center>");
        res.status(200).send("<div style='margin: auto; position: absolute; top:0; left: 0; bottom: 0; right: 0; height:500px;'><br><center style='font-family: sans-serif; font-size: xx-large;'>Total number of users:</center><br><br><center style='font-family: sans-serif; font-size: 200;'>" + total + "</center></div>");
    }, (err) => {
        console.log(err);
        res.status(200).send("<h1>Error: " + err + "</h1>")
    });
});

app.get("/l", (req, res) => {
    // let s = req.params.search;
    // let searchStr = {s: req.params.matchValue}

    MongoDB.ReadWithSortAndSkipAndLimit("TowerDefense", "Leaderboard", {}, {
        "score": -1
    }, 0, 0).then((data) => {
        // console.log(data);
        res.status(200).send(nicenLea(data) + tableCSS);
    }, (err) => {
        console.log(err);
        res.status(200).send("<h1>Error: " + err + "</h1>")
    });
});

app.get("/scan", (req, res) => {
    MongoDB.Read("Lunch", "Users", {
        "subscribed": true
    }).then((data) => {
        // console.log(data);
        res.status(200).send(checkDuplicate(data) + "<br><br><br>" + compareWith(data, FSread.read("./data.txt")));
    }, (err) => {
        console.log(err);
        res.status(200).send("<h1>Error: " + err + "</h1>")
    });
});

function checkDuplicate(data) {
    // let arr = data.slice().sort((x, y) => {
    //     console.log(x, y)
    //     console.log(x > y)
    //     return (x.email > y.email)
    // });
    let arr = [];
    data.forEach((item) => {
        arr.push(item.email);
    });
    arr.sort();
    console.log(arr);
    let results = [];
    for (i = 0; i < arr.length - 1; i++) {
        if (arr[i + 1] == arr[i]) {
            results.push(arr[i]);
        }
    }
    console.log(results);
    return results;
}

function compareWith(data, str) {
    let arr = [];
    data.forEach((item) => {
        arr.push(item.email);
    });
    let res = [];
    arr.forEach((item) => {
        if (str.search(item.toLowerCase().trim()) == -1) {
            res.push(item);
        }
    });
    console.log(res);
    return res;
}

function nicenIt(data) {
    let res = "<style>th {text-align: left;}table, td, th {border: 1px solid black;}table {border-collapse: collapse;  width: 100%;}</style> <table><tr><th>No</th><th>_id</th><th>Email</th><th>Subscribed</th><th>Time</th><th>Token</th></tr>";
    data.forEach((item, index) => {
        res += "<tr><td>" + (index + 1) + "</td><td>" + item._id + "</td><td>" + item.email + "</td><td>" + item.subscribed + "</td><td>" + item.time + "</td><td>" + item.token + "</td><tr>";
    });
    return res += "</table>";
}

function nicenReq(data) {
    let res = "<style>th {text-align: left;}table, td, th {border: 1px solid black;}table {border-collapse: collapse;  width: 100%;}</style> <table><tr><th>No</th><th>IP</th><th>Last Visit Time</th><th>Time Formatted</th><th>Requests</th><th>Bad Records</th><th>Last Request</th></tr>";
    data.forEach((item, index) => {
        res += "<tr><td>" + (index + 1) + "</td><td>" + item.IP + "</td><td>" + item.lastVisitTime + "</td><td>" + item.timeFormatted + "</td><td>" + item.requests + "</td><td>" + item.badRecords + "</td><td>" + item.lastRequest + "</td><tr>";
    });
    return res += "</table>";
}

function nicenLea(data) {
    let res = "<style>th {text-align: left;}table, td, th {border: 1px solid black;}table {border-collapse: collapse;  width: 100%;}</style> <table><tr><th>Ranking</th><th>Name</th><th>Score</th><th>Time</th><th>Time Formatted</th><th>IP</th><th>Original Name</th></tr>";
    data.forEach((item, index) => {
        res += "<tr><td>" + (index + 1) + "</td><td>" + item.name + "</td><td>" + item.score + "</td><td>" + item.time + "</td><td>" + item.timeFormatted + "</td><td>" + item.IP + "</td><td>" + item["original name"] + "</td><tr>";
    });
    return res += "</table>";
}

function deleteMe() {
    return new Promise((resolve, reject) => {
        MongoDB.Read("ServerProtection", "RequestHistory", {}).then((res) => {
            res.forEach((item) => {
                MongoDB.Update("ServerProtection", "RequestHistory", {
                    IP: item.IP
                }, {badRecords: 0}).then((result) => {
                    console.log("updated", result);
                })
            })
        }, (err) => {
            resolve("error", err);
        });
    });

}

// deleteMe().then((res)=>{
//     console.log(res);
// });

// start server
app.listen(81, () => {
    console.log(`Started up at port 81`);
});
module.exports = {
    app
};