let MongoDB = require("./MongoDB.js");
const jwt = require("jsonwebtoken");
let MailGun = require("./MailGun.js");

function requestSignup(email) {
    return new Promise((resolve) => {
        //check if user already exist
        let useUpdateInsteadOfInsert = false;
        MongoDB.Read("Lunch", "Users", {email}).then((data) => {
            if (data.length > 0) {
                if (data[0].subscribed)
                    resolve("user exist");
                useUpdateInsteadOfInsert = true;
            }
            //user doesn't exist, let's send a confirmation email
            let userData = {
                email // equal to:    email:email
            };
            JWTSign(userData, useUpdateInsteadOfInsert).then((token) => {
                console.log("got back")
                const link = "seansun.org/confirm/" + token;
                MailGun.sendEmail("", "SALuncher@seansun.org", email, "Confirm your Luncher subscription", "by clicking on this link: " + link).then(() => {
                    resolve("sent");
                });
            }, (err) => console.log(err));
        }, (err) => console.log(err));
    });
}

function JWTSign(userData, useUpdateInsteadOfInsert) {
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
            if (!useUpdateInsteadOfInsert)
                MongoDB.Write("Lunch", "Users", data).then((res) => {
                    console.log("inserted", res);
                    resolve(token);
                });
            else
                MongoDB.Update("Lunch", "Users", {"email": userData.email}, {"token": token}).then((res) => {
                    console.log(res);
                    resolve(token);
                });
            //("Lunch", "Users", data);
        }, (err) => console.log(err));
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
        console.log("")
        MongoDB.Read("Lunch", "Users", {token}).then((data) => {
            console.log("important data", data);
            if (data.length < 1) {
                console.log("token not found");
                resolve("token not found");
            } else if (data[0].subscribed === true) {
                // resolve("already added"); UNSUBSCRIBE
                console.log("unsubcribe");
                Unsubscribe(token, data).then((res) => {
                    console.log("uns", res);
                    resolve(res);
                })
            } else {
                console.log("creating new user...")
                // if (token === data[0].token) {
                const time = getTime();
                getJWTPasswd().then((myPasswd) => {
                    let newtoken = jwt.sign({"email": data[0].email}, myPasswd); //this is the unsubscribe token
                    console.log("This is the unsubscribe token", token);
                    MongoDB.Update("Lunch", "Users", {token}, {
                        "subscribed": true,
                        "time": time,
                        "token": newtoken
                    }).then((res) => {
                        console.log(res);
                        addToMailingList(data[0].email, time);
                        resolve("added");
                    });
                });
            }
        }, (err) => console.log(err));
    })
}

function addToMailingList(email, time) {
    var luncher = {
        subscribed: true,
        address: email,
        name: '',
        vars: {time}
    };
    // console.log(luncher);
    MailGun.MailingList("create", luncher).then((res) => {
        console.log(res);
    })
}

function Unsubscribe(token, data) {
    return new Promise((resolve) => {
        MongoDB.Delete("Lunch", "Users", {"token": token}).then((res) => {
            console.log(res); //deleted from database
            console.log("finished mongoDB deletion");
            console.log("Deleting from mailgun", data[0].email);
            MailGun.MailingList("delete", data[0].email).then((result) => {
                console.log(result); //deleted from MailGun
                console.log("deleted");
                MailGun.sendEmail("", "SALuncher@seansun.org", email, "You are unsubscribed from Luncher", "Click here to subscribe again: seansun.org/signup" + link).then(() => {
                    resolve("sent");
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
    requestSignup,
    confirm
};

// JWTSign({email: "aaaa@bbb.com"}).then((token)=>{
//     console.log(token);
// });