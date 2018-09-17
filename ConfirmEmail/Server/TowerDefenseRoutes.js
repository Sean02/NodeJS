let app = require("./index");
let towerDefense = require("../TowerDefense.js");



app.post("/towerdefense/addscore", urlencodedParser, (req, res) => {
    console.log("received tower defense add game highscore request");
    console.log(req.body.name);
    console.log(req.body.score);
    if (req.body.name === undefined || req.body.score === undefined) {
        console.log("name or score undefined: not running add score");
        res.status(200).send("undefined parameters");
        console.log("clean exit");
    } else {
        towerDefense.addScore(req.body.name, req.body.score, getIP(req)).then((result) => {
            console.log(result);
            res.status(200).send(JSON.stringify(result));
            console.log("clean exit");
        });
    }
});

app.post("/towerdefense/leaderboard", urlencodedParser, (req, res) => {
    console.log("received tower defense get game highscore request");
    console.log(req.body.start);
    console.log(req.body.end);
    if (req.body.start === undefined || req.body.end === undefined) {
        console.log("start or end undefined: not running get score");
        res.status(200).send(JSON.stringify({
            message: "undefined parameters"
        }));
    } else {
        towerDefense.GenerateLeaderboardTable(req.body.start, req.body.end).then((result) => {
            console.log(result);
            if (result === "added") {
            }
            res.status(200).send(JSON.stringify(result));
        });
    }
});

app.get("/towerDefense", (req, res) => {
    res.sendFile(__dirname + "/views/TowerDefense/index.html");
});

app.get("/towerDefense/leaderboard", (req, res) => {
    res.send(tableCSS + `<div id="res"</div><script src="/jquery"></script><script>$.ajax({type: "POST",url: "./leaderboard",dataType: "json",data: "start=0&end=0"}).done((data) => {$("body").html(data.table);});</script>`);
});
