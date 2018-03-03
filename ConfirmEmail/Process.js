let MongoDB = require("./MongoDB.js");
const jwt = require("jsonwebtoken");
let MailGun = require("./MailGun.js");
let fs = require("./FSread.js");
let sendLunch = require("../SendLunch/index.js");

function reqSignup(email) {
    return new Promise((resolve, reject) => {
        email = email.toLowerCase();
        if (!(Validate(email))) {
            resolve("invalid email")
        }
        console.log("starting reqSignup", email);
        MongoDB.Read("Lunch", "Users", {
            "email": email
        }).then((data) => {
            console.log("checking for existing user: read data", data);
            if (data.length > 0) {
                console.log("Found existing user");
                if (data[0].subscribed) {
                    console.log("User already exists, resolve.");
                    resolve("user exist");
                    return;
                } else { //resend token
                    console.log("need to resend token.");
                    let d = new Date();
                    const waitTimeinMins = 10;
                    console.log(d.getTime() - data[0].time);
                    if (d.getTime() - data[0].time < waitTimeinMins * 60 * 1000) {
                        console.log("too frequent");
                        resolve("too frequent");
                        return;
                    }
                    //update token
                    JWTSign({
                        email
                    }).then((userData) => {
                        console.log("generated new token", userData);
                        MongoDB.Update("Lunch", "Users", {
                            "email": userData.email
                        }, {
                            "token": userData.token,
                            time: d.getTime()
                        }).then((res) => {
                            console.log("updated to database");
                            const link = "http://seansun.org/confirm/" + userData.token;
                            let EmailHTML = fs.read("./views/signupEmail.html");
                            EmailHTML = EmailHTML.replace("[EMAIL]", email);
                            EmailHTML = EmailHTML.replace("[CONFIRM_EMAIL]", link);
                            MailGun.sendEmail("", "Luncher@sonomaacademy.org", email, "Confirm your Luncher subscription", EmailHTML).then(() => {
                                resolve("resent token");
                                return;
                            }, (err) => {
                                console.log(err);
                                resolve(err);
                            });
                        }, (err) => {
                            console.log(err);
                            resolve(err);
                        });
                    }, (err) => {
                        console.log(err);
                        resolve(err);
                    });
                }
            } else { //create new user
                JWTSign({
                    email
                }).then((userData) => {
                    MongoDB.Write("Lunch", "Users", userData).then((res) => {
                        console.log("inserted");
                        const link = "http://seansun.org/confirm/" + userData.token;
                        let EmailHTML = fs.read("./views/signupEmail.html");
                        EmailHTML = EmailHTML.replace("[EMAIL]", email);
                        EmailHTML = EmailHTML.replace("[CONFIRM_EMAIL]", link);
                        MailGun.sendEmail("", "Luncher@sonomaacademy.org", email, "Confirm your Luncher subscription", EmailHTML).then(() => {
                            resolve("sent");
                            return;
                        }, (err) => {
                            console.log(err);
                            resolve(err);
                        });
                    }, (err) => {
                        console.log(err);
                        resolve(err);
                    });
                }, (err) => {
                    console.log(err);
                    resolve(err);
                });
            }
        }, (err) => {
            console.log(err);
            resolve(err); /*this returns to the server, let's not make it complicated*/
        });
    });
}

function reqUnsubscribe(email) {
    return new Promise((resolve, reject) => {
        email = email.toLowerCase();
        if (!(Validate(email))) {
            resolve("invalid email")
        }
        console.log("starting reqUnsubscribe", email);
        MongoDB.Read("Lunch", "Users", {
            "email": email
        }).then((data) => {
            console.log("checking for existing user: read data", data);
            if (data.length < 1) {
                console.log("user doesnt exist");
                resolve("user doesnt exist");
                return;
            } else if (!data[0].subscribed) {
                console.log("user not confirmed");
                resolve("user not confirmed");
                return;
            } else if (data[0].token !== "") {
                console.log("resend token");
                let d = new Date();
                const waitTimeinMins = 10;
                console.log(d.getTime() - data[0].time);
                if (d.getTime() - data[0].time < waitTimeinMins * 60 * 1000) {
                    console.log("too frequent");
                    resolve("too frequent");
                    return;
                }
                JWTSign({
                    email
                }).then((userData) => {
                    console.log("generated new token", userData);
                    MongoDB.Update("Lunch", "Users", {
                        "email": userData.email
                    }, {
                        "token": userData.token,
                        time: d.getTime()
                    }).then((res) => {
                        console.log("updated to database");
                        const link = "http://seansun.org/confirm/" + userData.token;
                        let EmailHTML = fs.read("./views/unsubscribeEmail.html");
                        EmailHTML = EmailHTML.replace("[LINK]", link);
                        MailGun.sendEmail("", "Luncher@sonomaacademy.org", email, "Unsubscribe Luncher", EmailHTML).then(() => {
                            resolve("resent token");
                            return;
                        }, (err) => {
                            console.log(err);
                            resolve(err);
                        });
                    }, (err) => {
                        console.log(err);
                        resolve(err);
                    });
                }, (err) => {
                    console.log(err);
                    resolve(err);
                });
            } else {
                console.log("unsubscribe");
                JWTSign({
                    email
                }).then((userData) => {
                    console.log("generated new token", userData);
                    let d = new Date();
                    MongoDB.Update("Lunch", "Users", {
                        "email": userData.email
                    }, {
                        "token": userData.token,
                        time: d.getTime()
                    }).then((res) => {
                        console.log("updated to database");
                        const link = "http://seansun.org/confirm/" + userData.token;
                        let EmailHTML = fs.read("./views/unsubscribeEmail.html");
                        EmailHTML = EmailHTML.replace("[LINK]", link);
                        MailGun.sendEmail("", "Luncher@sonomaacademy.org", email, "Unsubscribe Luncher", EmailHTML).then(() => {
                            resolve("sent");
                            return;
                        }, (err) => {
                            console.log(err);
                            resolve(err);
                        });
                    }, (err) => {
                        console.log(err);
                        resolve(err);
                    });
                }, (err) => {
                    console.log(err);
                    resolve(err);
                });
            }
        }, (err) => {
            console.log(err);
            resolve(err); /*this returns to the server, let's not make it complicated*/
        });
    });
}

function JWTSign(userData) {
    return new Promise((resolve, reject) => {
        getJWTPasswd().then((myPasswd) => {
            console.log("jwt passwd is ", myPasswd);
            const token = jwt.sign(userData, myPasswd);
            console.log("This is the jwt token", token);
            let d = new Date();
            const data = { //write this to database
                "email": userData.email,
                "subscribed": false,
                "token": token,
                "time": d.getTime()
            };
            resolve(data);
            return;
        }, (err) => {
            console.log(err);
            reject(err);
        });
    });
}

function getJWTPasswd() {
    return new Promise((resolve, reject) => {
        MongoDB.Read("Passwds", "MyJWTPasswd", {
            handle: true
        }).then((data) => {
            const myPasswd = data[0].key + Math.random().toString();
            console.log("jwt passwd is ", myPasswd);
            resolve(myPasswd);
            return;
        }, (err) => {
            console.log(err);
            reject(err);
        });
    });
}

function confirm(token) {
    return new Promise((resolve, reject) => {
        console.log("starting confirm");
        MongoDB.Read("Lunch", "Users", {
            token
        }).then((data) => {
            console.log("got user data:", data);
            if (data.length < 1) {
                console.log("token not found");
                resolve("token not found");
                return;
            } else if (data[0].subscribed === true) {
                // resolve("already added"); UNSUBSCRIBE
                console.log("unsubscribe...");
                Unsubscribe(data).then((res) => {
                    console.log("uns", res);
                    resolve(res);
                    return;
                }, (err) => {
                    console.log(err);
                    resolve(err);
                });
            } else {
                console.log("creating new user...");
                // if (token === data[0].token) {
                const time = getTime();
                getJWTPasswd().then((myPasswd) => {
                    // let newtoken = jwt.sign({"email": data[0].email}, myPasswd); //this is the unsubscribe token
                    // console.log("This is the unsubscribe token", newtoken);
                    MongoDB.Update("Lunch", "Users", {
                        token
                    }, {
                        "subscribed": true,
                        "time": time,
                        "token": "" //newtoken
                    }).then((res) => {
                        console.log("user added(updated) to database");
                        addToMailingList(data[0].email, time).then(() => {
                            //send user a test email (buggy - TODO)
                            // sendLunch.sendLunch(data[0].email);
                            resolve("added");
                            return;
                        }, (err) => {
                            console.log(err);
                            resolve(err);
                        });
                    }, (err) => {
                        console.log(err);
                        resolve(err);
                    });
                }, (err) => {
                    console.log(err);
                    resolve(err);
                });
            }
        }, (err) => {
            console.log(err);
            resolve(err);
        });
    });
}

function addToMailingList(email, time) {
    return new Promise((resolve, reject) => {
        var luncher = {
            subscribed: true,
            address: email,
            name: '',
            vars: {
                time
            }
        };
        // console.log(luncher);
        MailGun.MailingList("create", luncher).then((res) => {
            console.log("User added to Mailing List", res);
            resolve(res);
            return;
        }, (err) => {
            console.log(err);
            resolve(err);
        });
    });
}

function Unsubscribe(data) {
    return new Promise((resolve, reject) => {
        console.log(data);
        data = data[0];
        console.log(data);
        console.log(data.email);
        MongoDB.Delete("Lunch", "Users", {
            "token": data.token
        }).then((res) => {
            console.log("User deleted from database"); //deleted from database
            console.log("Deleting from mailgun with searchStr:", data.email);
            MailGun.MailingList("delete", data.email).then((result) => {
                console.log(result); //deleted from MailGun
                console.log("User deleted from Mailing List");
                resolve("unsubscribed");
                return;
            }, (err) => {
                console.log(err);
                resolve(err);
            });
        }, (err) => {
            console.log(err);
            resolve(err);
        });
    });
}

function getTime() {
    let d = new Date();
    return d.getFullYear().toString() + "-" + (d.getMonth() + 1).toString() + "-" + d.getDate().toString() + " " + d.getHours().toString() + ":" + d.getMinutes().toString() + ":" + d.getSeconds().toString() + "." + d.getMilliseconds().toString();
}

function Validate(input) {
    if (input.trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
        return false;
    } else if (input.trim().substr(-12) === "@seansun.org") {
        return false;
    }
    return true;
}

function getUserCount() {
    return new Promise((resolve, reject) => {
        MongoDB.Count("Lunch", "Users", {
            subscribed: true
        }).then((data) => {
            resolve(data);
        }, (err) => {
            resolve(err);
        });
    });
}
module.exports = {
    reqSignup,
    reqUnsubscribe,
    confirm,
    getUserCount
};