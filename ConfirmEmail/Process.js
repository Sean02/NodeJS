let MongoDB = require("./MongoDB.js");
const jwt = require("jsonwebtoken");
let MailGun = require("./MailGun.js");

function reqSignup(email) {
    return new Promise((resolve, reject) => {
        console.log("starting reqSignup");
        email = email.toLowerCase();
        MongoDB.Read("Lunch", "Users", {"email": email}).then((data) => {
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
                    JWTSign({email}).then((userData) => {
                        console.log("generated new token", userData);
                        MongoDB.Update("Lunch", "Users", {"email": userData.email}, {"token": userData.token}).then((res) => {
                            console.log("updated to database");
                            const link = "seansun.org/confirm/" + userData.token;
                            MailGun.sendEmail("", "SALuncher@seansun.org", email, "Confirm your Luncher subscription", "by clicking on this link: " + link).then(() => {
                                resolve("resent token");
                                return;
                            });
                        });
                    });
                }
            } else { //create new user
                JWTSign({email}).then((userData) => {
                    MongoDB.Write("Lunch", "Users", userData).then((res) => {
                        console.log("inserted");
                        const link = "seansun.org/confirm/" + userData.token;
                        MailGun.sendEmail("", "SALuncher@seansun.org", email, "Confirm your Luncher subscription", "by clicking on this link: " + link).then(() => {
                            resolve("sent");
                            return;
                        });
                    });
                });
            }

        });
    });
}


function reqUnsubscribe(email) {
    return new Promise((resolve, reject) => {
        console.log("starting reqUnsubscribe");
        email = email.toLowerCase();
        MongoDB.Read("Lunch", "Users", {"email": email}).then((data) => {
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
                JWTSign({email}).then((userData) => {
                    console.log("generated new token", userData);
                    MongoDB.Update("Lunch", "Users", {"email": userData.email}, {"token": userData.token}).then((res) => {
                        console.log("updated to database");
                        const link = "seansun.org/confirm/" + userData.token;
                        MailGun.sendEmail("", "SALuncher@seansun.org", email, "Unsubscribe Luncher", "by clicking on this link: " + link).then(() => {
                            resolve("resent token");
                            return;
                        });
                    });
                });
            } else {
                console.log("unsubscribe");
                JWTSign({email}).then((userData) => {
                    console.log("generated new token", userData);
                    MongoDB.Update("Lunch", "Users", {"email": userData.email}, {"token": userData.token}).then((res) => {
                        console.log("updated to database");
                        const link = "seansun.org/confirm/" + userData.token;
                        MailGun.sendEmail("", "SALuncher@seansun.org", email, "Unsubscribe Luncher", "by clicking on this link: " + link).then(() => {
                            resolve("sent token");
                            return;
                        });
                    });
                });
            }

        });
    });
}

// function getUser(searchStr) {
//     return new Promise((resolve, reject) => {
//         MongoDB.Read("Lunch", "Users", {searchStr}, (data) => {
//             resolve(data)
//         });
//     });
// }

function JWTSign(userData) {
    return new Promise((resolve) => {
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
        });
    });
}

function getJWTPasswd() {
    return new Promise((resolve, reject) => {
        MongoDB.Read("Passwds", "MyJWTPasswd", {handle: true}).then((data) => {
            const myPasswd = data[0].key + Math.random().toString();
            console.log("jwt passwd is ", myPasswd);
            resolve(myPasswd);
            return;
        }, (err) => console.log(err));
    });
}

function confirm(token) {
    return new Promise((resolve) => {
        console.log("starting confirm");
        MongoDB.Read("Lunch", "Users", {token}).then((data) => {
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
                })
            } else {
                console.log("creating new user...");
                // if (token === data[0].token) {
                const time = getTime();
                getJWTPasswd().then((myPasswd) => {
                    // let newtoken = jwt.sign({"email": data[0].email}, myPasswd); //this is the unsubscribe token
                    // console.log("This is the unsubscribe token", newtoken);
                    MongoDB.Update("Lunch", "Users", {token}, {
                        "subscribed": true,
                        "time": time,
                        "token": ""  //newtoken
                    }).then((res) => {
                        console.log("user added(updated) to database");
                        addToMailingList(data[0].email, time);
                        resolve("added");
                        return;
                    });
                });
            }
        }, (err) => console.log(err));
    })
}

function addToMailingList(email, time) {
    return new Promise((resolve, reject) => {
        var luncher = {
            subscribed: true,
            address: email,
            name: '',
            vars: {time}
        };
        // console.log(luncher);
        MailGun.MailingList("create", luncher).then((res) => {
            console.log("User added to Mailing List", res);
            resolve(res);
            return;
        })

    });
}

function Unsubscribe(data) {
    return new Promise((resolve) => {
        console.log(data);
        data = data[0];
        console.log(data);
        console.log(data.email);
        MongoDB.Delete("Lunch", "Users", {"token": data.token}).then((res) => {
            console.log("User deleted from database"); //deleted from database
            console.log("Deleting from mailgun with searchStr:", data.email);
            MailGun.MailingList("delete", data.email).then((result) => {
                console.log(result); //deleted from MailGun
                console.log("User deleted from Mailing List");
                const link = "<a href='seansun.org/signup'>Sign up</a>";
                MailGun.sendEmail("", "SALuncher@seansun.org", data.email, "You are unsubscribed from Luncher", "Click here to subscribe again: " + link).then(() => {
                    console.log("Sent goodbye email");
                    resolve("unsubscribed");
                    return;
                });
            });


        }, (err) => console.log(err));
    });
}


function getTime() {
    let d = new Date();
    return d.getFullYear().toString() + "-" + (d.getMonth() + 1).toString() + "-" + d.getDate().toString() + " " + d.getHours().toString() + ":" + d.getMinutes().toString() + ":" + d.getSeconds().toString() + "." + d.getMilliseconds().toString();
}

module.exports = {
    reqSignup,
    reqUnsubscribe,
    confirm
};