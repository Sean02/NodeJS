let MongoDB = require("./MongoDB.js");
let rp = require('request-promise');

function addScore(name, score, ip) {
    return new Promise((resolve, reject) => {
        if (score < 100) {
            console.log("score:", score, " is too low to submit, not adding");
            resolve({
                message: "low score",
                success: false
            });
            return;
        }
        if (name.length === 0 || name.length > 128) {
            console.log("name length:", name.length, "is invalid");
            resolve({
                message: "name length invalid",
                success: false
            });
            return;
        }
        console.log("checking name safety");
        languageSafe(name).then((safeName) => {
            // console.log("got safename:",safeName);
            console.log("got safename.result:", safeName.result);
            safeName = safeName.result;
            console.log("name has bad language =", safeName.isBad, ", the number of bad words is", safeName.badWordCount, "the bad words are:", safeName.badWords);
            //record the bad words count
            const d = new Date();
            //add the new highscore
            const Writedata = { //write this to database
                "name": safeName.censoredContent,
                "original name": name,
                "score": parseInt(score, 10),
                "time": d.getTime(),
                "IP": ip
            };
            console.log("data to be written is", Writedata);
            if (isNaN(Writedata.score)) {
                console.log("score is NaN, not adding");
                resolve({
                    message: "score NaN",
                    success: false
                });
                return;
            }
            MongoDB.Write("TowerDefense", "Leaderboard", Writedata).then((res) => {
                console.log("inserted with name:" + name + ", score" + score);
                console.log(res);
                //
                //calculate user's Rankings
                RankingYouWouldGetIfYouHaveThisScore(Writedata.score).then((ranking) => {
                    ranking++; //count yourself
                    //
                    ////record num of bad words
                    if (safeName.isBad) {
                        MongoDB.Read("TowerDefense", "BadWords", {
                            handle: true
                        }).then((res) => {
                            MongoDB.Update("TowerDefense", "BadWords", {
                                handle: true
                            }, {
                                "Count": res[0].Count + safeName.badWordCount
                            }).then((res) => {
                                console.log("recorded bad words:", res);
                                resolve({
                                    message: "bad words but added",
                                    ranking: ranking,
                                    success: true
                                });
                                return;
                            }, (err) => {
                                console.log("error when recording bad words:", err);
                                resolve({
                                    message: err,
                                    success: false
                                });
                            });
                        });
                    } else {
                        //no bad words to add
                        resolve({
                            message: "added",
                            ranking: ranking,
                            success: true
                        });
                    }
                });
            }, (err) => {
                console.log(err);
                resolve({
                    message: err
                });
            });
        });
    });
}

function getScore(start, end) {
    return new Promise((resolve, reject) => {
        console.log("Starting get high score function");
        start = parseInt(start, 10);
        end = parseInt(end, 10);
        console.log("start:", start, ", end", end);
        MongoDB.ReadWithSortAndSkipAndLimit("TowerDefense", "Leaderboard", {}, {
            "score": -1
        }, start - 1, end - start + 1).then((res) => {
            console.log(res);
            resolve(res);
        }, (err) => {
            console.log(err);
            resolve(err);
        });
    });
}

function languageSafe(text) {
    return new Promise((resolve, reject) => {
        let options = {
            uri: 'https://apifort-bad-word-filter-v1.p.mashape.com/v1/extract/badword?censorCharacter=*&content=' + text,
            qs: {
                access_token: 'xxxxx xxxxx'
            },
            headers: {
                'User-Agent': 'Request-Promise',
                "X-Mashape-Key": "6Nn4iQB13ZmshzQBCaVsjmChbLIEp1wYaH4jsnO0hPkJCwDFFl",
                "Accept": "application/json"
            },
            json: true // Automatically parses the JSON string in the response
        };
        rp(options).then(function(res) {
            console.log('Result from check language request:', res);
            resolve(res);
        }).catch(function(err) {
            // API call failed...
            console.log("Check lanugage request failed:", err);
            resolve("failed");
        });
    });
}

function GenerateLeaderboardTable(start, end) {
    return new Promise((resolve, reject) => {
        start = parseInt(start, 10);
        end = parseInt(end, 10);
        if (start < 1) start = 1;
        if (end < 0) end = 5;
        getScore(start, end).then((res) => {
            res.forEach((item, index) => {
                delete item["original name"];
                delete item._id;
                delete item.time;
                delete item.IP;
                item.ranking = start + index;
            })
            let table = "<table><tr><th>Rank</th><th>Name</th><th>Score</th></tr>";
            res.forEach((item, index) => {
                table += "<tr><td>" + (index + start).toString() + "</td><td>" + item.name.toString() + "</td><td>" + item.score.toString() + "</td>"
            })
            for (var i = start; i <= end; i++) {}
            table += "</table>";
            resolve({
                table: table,
                json: res
            });
        });
    });
}

function RankingYouWouldGetIfYouHaveThisScore(a) {
    return new Promise((resolve, reject) => {
        MongoDB.Count("TowerDefense", "Leaderboard", {
            score: {
                $gt: a //gets the count of items that has a score greater than passed in score
            }
        }).then((res) => {
            resolve(res);
        }, (err) => {
            resolve(err);
        });
    });
}
module.exports = {
    addScore,
    getScore,
    GenerateLeaderboardTable
};