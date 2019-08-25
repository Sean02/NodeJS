// *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    │
// │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)
let schedule = require("node-schedule");
let GetLunch = require("./webscraper.js");
let MailGun = require("./MailGun.js");
let fs = require("./FSread.js");
let firstTime = true;
let ps = "";
//
// let a = schedule.scheduleJob('0 30 7 * * 1-5', function() {
//     console.log("Fired");
//     sendLunch("Luncher@seansun.org").then((res) => {
//         console.log("Exited with message", res);
//     })
// });
// let b = schedule.scheduleJob('20 18 15 * * 1-5', function() {
//     sendLunch("Luncher@seansun.org");
//     console.log("Fired");
// });
// let a = schedule.scheduleJob('20 52 15 * * 1-5', function() {
//     console.log("Cron Fired");
//     sendLunch("Luncher@seansun.org").then((res) => {
//         console.log("exited:", res);
//     });
// });
console.log("Starting SendLunch func...");

function getDate() {
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let date = new Date();
    let day = date.getDate();
    let monthIndex = date.getMonth();
    let year = date.getFullYear();
    return monthNames[monthIndex] + ' ' + day + ', ' + year;
}

function sendLunch(email) {
    return new Promise((resolve, reject) => {
        GetLunch.scrape().then((data) => {
            let EmailHTML = fs.read("LuncherEmail.html");
            let date = getDate();
            console.log(data);
            //
            EmailHTML = nicenIt(EmailHTML, data, date);
            firstTime = false;
            //
            MailGun.sendEmail("", "Luncher <Luncher@seansun.org>", email, `Today's Menu - ${date}`, EmailHTML).then((res) => {
                resolve("sent");
                return;
            }, (err) => {
                console.log(err);
                resolve(err);
            });
        });
    });
}

function nicenIt(EmailHTML, data, date) {
    EmailHTML = EmailHTML.replace("[SOUP]", data.soup || "Not Available");
    EmailHTML = EmailHTML.replace("[ENTREE]", data.entree || "Not Available");
    EmailHTML = EmailHTML.replace("[SPECIALDIETENTREE]", data.specialdietentree || "Not Available");
    EmailHTML = EmailHTML.replace("[SALAD]", data.salad || "Not Available");
    EmailHTML = EmailHTML.replace("[DESSERT]", data.dessert || "Not Available");
    EmailHTML = EmailHTML.replace("[SIDES]", data.sides || "Not Available");
    EmailHTML = EmailHTML.replace("[DATE]", date || "Not Available");
    //if not the first time, cancel ps
    if (!firstTime) {
        ps = "";
    } else if (ps != "") { //not only it's not the first time, but also there is something in it
        ps = "<p>" + ps + "</p>"
    }
    if (!((data.soup) && (data.entree) && (data.specialdietentree) && (data.salad) && (data.dessert) && (data.sides))) {
        ps += "<a href='seansun.org/view/whynotavailable.html'>Why is the menu not available?,</a>"
    }
    console.log("ps text", ps);
    //if there are any data, then format it
    if (ps != "") {
        ps = `<tr><td align='center' style='padding: 0 56px 28px 56px;' valign='middle'><span style='font-family: "lato", "Helvetica Neue", Helvetica, Arial, sans-serif; line-height: 28px;font-size: 16px;  vertical-align: middle;'>` + ps + "</span></td></tr>";
    }
    console.log("ps final:", ps)
    EmailHTML = EmailHTML.replace("[P.S.]", ps);
    return EmailHTML;
}
module.exports = {
    sendLunch
}
// sendLunch("sean.sun@sonomaacademy.org");