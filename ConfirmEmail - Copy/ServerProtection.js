let MongoDB = require("./MongoDB.js");
const renewRequestInterval = 60 * 1000;
const numOfRequestsInThisTime = 60;

//this is supposed to be a rate limiter, but then I found a amazing library that does this better,
//but I still don't want to delete this beautiful piece of code, so just leave it here

function addTotalReq() {
    return new Promise((resolve, reject) => {

        MongoDB.Read("ServerProtection", "TotalRequests", {handle: true}).then((res) => {
            MongoDB.Update("ServerProtection", "TotalRequests", {handle: true}, {Req: res[0].Req + 1}).then((res) => {
                console.log("added total Req:", res);
                resolve();
            });
        });
    });
}

function getTotalReqs() {
    return new Promise((resolve, reject) => {
        MongoDB.Read("ServerProtection", "TotalRequests", {handle: true}).then((data) => {
            resolve(data[0].Req);
        });
    });
}


function allowThisIP(ip, req) {
    return new Promise((resolve, reject) => {
        MongoDB.Read("ServerProtection", "Frequency", {IP: ip}).then((res) => {
            const d = new Date();
            if (res.length === 0) {
                //this is the first time this ip has been on my website
                MongoDB.Write("ServerProtection", "Frequency", {
                    IP: ip,
                    lastRenewTime: d.getTime(),
                    timeFormatted: d.toString(),
                    requests: 1,
                    totalRequests: 1,
                    numOfTimesTooFrequent: 0,
                    lastRequest: getLastRequest(res.lastRequest, req, res.lastVisitTime, d.getTime())
                }).then((result) => {
                    resolve({allow: true});
                });
            } else {
                //this user has been on my site before
                res = res[0];
                if (res.lastRenewTime + renewRequestInterval < d) {
                    //ok, this user hasn't been on my site for the interval, he gets a renew no matter what.
                    MongoDB.Update("ServerProtection", "Frequency", {IP: ip}, {
                        lastRenewTime: d.getTime(),
                        timeFormatted: d.toString(),
                        requests: 1,
                        totalRequests: res.totalRequests + 1,
                        lastRequest: getLastRequest(res.lastRequest, req, res.lastVisitTime, d.getTime())
                    }).then((result) => {
                        resolve({allow: true});
                    });
                } else if (res.requests <= numOfRequestsInThisTime) {
                    //just another request
                    MongoDB.Update("ServerProtection", "Frequency", {IP: ip}, {
                        requests: res.requests + 1,
                        totalRequests: res.totalRequests + 1,
                        lastRequest: getLastRequest(res.lastRequest, req, res.lastVisitTime, d.getTime())
                    }).then((result) => {
                        resolve({allow: false});
                    });
                } else {
                    //block and add bad record
                    MongoDB.Update("ServerProtection", "Frequency", {IP: ip}, {
                        numOfTimesTooFrequent: res.numOfTimesTooFrequent + 1,
                        lastRequest: getLastRequest(res.lastRequest, req, res.lastVisitTime, d.getTime())
                    }).then((result) => {
                        resolve({allow: false});
                    });
                }
            }

        });
    });
}

function recordRequest(ip, req) {
    return new Promise((resolve, reject) => {
        addTotalReq().then((uselessVar) => {
            MongoDB.Read("ServerProtection", "RequestHistory", {IP: ip}).then((res) => {
                const d = new Date();
                if (res.length === 0) {
                    //this is the first time this ip has been on my website
                    MongoDB.Write("ServerProtection", "RequestHistory", {
                        IP: ip,
                        lastVisitTime: d.getTime(),
                        timeFormatted: d.toString(),
                        requests: 1,
                        badRecords: 0,
                        lastRequest: getLastRequest(res.lastRequest, req, res.lastVisitTime, d.getTime())
                    }).then((result) => {
                        resolve();
                    });
                } else {
                    //this user has been on my site before
                    res = res[0];
                    MongoDB.Update("ServerProtection", "RequestHistory", {IP: ip}, {
                        lastVisitTime: d.getTime(),
                        timeFormatted: d.toString(),
                        requests: res.requests + 1,
                        lastRequest: getLastRequest(res.lastRequest, req, res.lastVisitTime, d.getTime())
                    }).then((result) => {
                        resolve();
                    });

                }

            });
        });
    });
}

function recordBadRecord(ip, req) {
    return new Promise((resolve, reject) => {
        addTotalReq().then((uselessVar) => {
            MongoDB.Read("ServerProtection", "RequestHistory", {IP: ip}).then((res) => {
                const d = new Date();
                if (res.length === 0) {
                    //this is the first time this ip has been on my website
                    MongoDB.Write("ServerProtection", "RequestHistory", {
                        IP: ip,
                        lastVisitTime: d.getTime(),
                        timeFormatted: d.toString(),
                        requests: 1,
                        badRecords: 1,
                        lastRequest: getLastRequest(res.lastRequest, req, res.lastVisitTime, d.getTime())
                    }).then((result) => {
                        resolve();
                    });
                } else {
                    //this user has been on my site before
                    res = res[0];
                    MongoDB.Update("ServerProtection", "RequestHistory", {IP: ip}, {
                        lastVisitTime: d.getTime(),
                        timeFormatted: d.toString(),
                        requests: res.requests + 1,
                        badRecords: (res.badRecords || 0) + 1,
                        lastRequest: getLastRequest(res.lastRequest, req, res.lastVisitTime, d.getTime())
                    }).then((result) => {
                        resolve();
                    });

                }

            });
        });
    });
}

function getLastRequest(oldReq, newReq, oldTime, newTime) {
    if (newTime - oldTime <= 5 * 1000)
        return oldReq;
    return newReq.method + ",  " + newReq.protocol + '://' + newReq.get('host') + newReq.originalUrl;
}


module.exports = {
    allowThisIP,
    recordRequest,
    recordBadRecord,
    getTotalReqs
}