let MongoDB = require("./MongoDB.js");
const jwt = require("jsonwebtoken");
let MailGun = require("./MailGun.js");

function reqSignup(email) {
    return new Promise((resolve, reject) => {
        console.log("starting reqSignup");
        MongoDB.Read("Lunch", "Users", {"email": email}).then((data) => {
            console.log("checking for existing user: read data", data);
            if (data.length > 0) {
                console.log("Found existing user");
                if (data[0].subscribed) {
                    console.log("User already exists, resolve.");
                    resolve("user exist");
                } else { //resend token
                    console.log("need to resend token.");
                    JWTSign({email}).then((userData) => {
                        console.log("generated new token", userData);
                        MongoDB.Update("Lunch", "Users", {"email": userData.email}, {"token": userData.token}).then((res) => {
                            console.log("updated to database");
                            const link = "seansun.org/confirm/" + userData.token;
                            MailGun.sendEmail("", "SALuncher@seansun.org", email, "Confirm your Luncher subscription", "by clicking on this link: " + link).then(() => {
                                resolve("resent token");
                            });
                        });
                    });
                }
            } else {
                JWTSign({email}).then((userData) => {
                    MongoDB.Write("Lunch", "Users", userData).then((res) => {
                        console.log("inserted");
                        const link = "seansun.org/confirm/" + userData.token;
                        MailGun.sendEmail("", "SALuncher@seansun.org", email, "Confirm your Luncher subscription", "by clicking on this link: " + link).then(() => {
                            resolve("sent");
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
            const data = { //write this to database
                "email": userData.email,
                "subscribed": false,
                "token": token,
                "time": ""
            };
            resolve(data);
        });
    });
}

function getJWTPasswd() {
    return new Promise((resolve, reject) => {
        MongoDB.Read("Passwds", "MyJWTPasswd", {handle: true}).then((data) => {
            const myPasswd = data[0].key;
            console.log("jwt passwd is ", myPasswd);
            resolve(myPasswd);
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
            } else if (data[0].subscribed === true) {
                // resolve("already added"); UNSUBSCRIBE
                console.log("unsubscribe...");
                Unsubscribe(token, data).then((res) => {
                    console.log("uns", res);
                    resolve(res);
                })
            } else {
                console.log("creating new user...");
                // if (token === data[0].token) {
                const time = getTime();
                getJWTPasswd().then((myPasswd) => {
                    let newtoken = jwt.sign({"email": data[0].email}, myPasswd); //this is the unsubscribe token
                    console.log("This is the unsubscribe token", newtoken);
                    MongoDB.Update("Lunch", "Users", {token}, {
                        "subscribed": true,
                        "time": time,
                        "token": newtoken
                    }).then((res) => {
                        console.log("user added(updated) to database");
                        addToMailingList(data[0].email, time);
                        resolve("added");
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
        })

    });
}

function Unsubscribe(data) {
    return new Promise((resolve) => {
        MongoDB.Delete("Lunch", "Users", {"token": data.token}).then((res) => {
            console.log("User deleted from database"); //deleted from database
            console.log("Deleting from mailgun with searchStr:", data[0].email);
            MailGun.MailingList("delete", data[0].email).then((result) => {
                console.log(result); //deleted from MailGun
                console.log("User deleted from Mailing List");
                MailGun.sendEmail("", "SALuncher@seansun.org", data[0].email, "You are unsubscribed from Luncher", "Click here to subscribe again: seansun.org/signup" + link).then(() => {
                    console.log("Sent goodbye email");
                    resolve("sent");
                });
            });


        }, (err) => console.log(err));
    });
}

module.exports = {
    reqSignup
};