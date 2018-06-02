let MongoDB = require("./MongoDB.js");
const renewRequestInterval = 60 * 1000;
const numOfRequestsInThisTime = 60;

//this is supposed to be a rate limiter, but then I found a amazing library that does this better,
//but I still don't want to delete this beautiful piece of code, so just leave it here
function allowThisIP(ip) {
    return new Promise((resolve, reject) => {
        MongoDB.Read("ServerProtection", "Frequency", {IP: ip}).then((res) => {
            const d = (new Date()).getTime();
            if (res.length === 0) {
                //this is the first time this ip has been on my website
                MongoDB.Write("ServerProtection", "Frequency", {
                    IP: ip,
                    lastRenewTime: d,
                    requests: 1,
                    totalRequests: 1,
                    numOfTimesTooFrequent: 0
                }).then((result) => {
                    resolve({allow: true});
                });
            } else {
                //this user has been on my site before
                res = res[0];
                if (res.lastRenewTime + renewRequestInterval < d) {
                    //ok, this user hasn't been on my site for the interval, he gets a renew no matter what.
                    MongoDB.Update("ServerProtection", "Frequency", {IP: ip}, {
                        lastRenewTime: d,
                        requests: 1,
                        totalRequests: res.totalRequests + 1
                    }).then((result) => {
                        resolve({allow: true});
                    });
                } else if (res.requests <= numOfRequestsInThisTime) {
                    //just another request
                    MongoDB.Update("ServerProtection", "Frequency", {IP: ip}, {
                        requests: res.requests + 1,
                        totalRequests: res.totalRequests + 1
                    }).then((result) => {
                        resolve({allow: false});
                    });
                } else {
                    //block and add bad record
                    MongoDB.Update("ServerProtection", "Frequency", {IP: ip}, {
                        numOfTimesTooFrequent: res.numOfTimesTooFrequent + 1
                    }).then((result) => {
                        resolve({allow: false});
                    });
                }
            }

        });
    });
}

module.exports = {
    allowThisIP
}