// *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    │
// │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)
const cout = console.log;
// const system = {out:{println:console.log}};
let schedule = require("node-schedule");
let GetLunch = require("./webscraper.js");
let MailGun = require("./MailGun.js");
let fs = require("./FSread.js");
let MongoDB = require("./MongoDB.js");
let ps = "Hey students, thank you for using Luncher! If you enjoy our service and want to support us, consider introducing Luncher to your parents, they might be concerned what you have for lunch too! Click <a href='http://seansun.org'>here</a> to signup.";
//
ps = "";
// ps="This is the last Luncher email of the school year! We hoped you enjoyed our service and continue to support us next semester!";
let a = schedule.scheduleJob('0 30 7 * * 1-5', function () {
    console.log("Fired");
    sendLunch("Luncher@seansun.org", false).then((res) => {
        ps = ""; //after send ps, set it to nothing so it doesn't resend tomorrow.
        console.log("Exited with message", res);
    })
});
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
console.log("Starting CronJob...");

function getDate() {
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let date = new Date();
    let day = date.getDate();
    let monthIndex = date.getMonth();
    let year = date.getFullYear();
    return monthNames[monthIndex] + ' ' + day + ', ' + year;
}

function sendLunch(email, test) {
    return new Promise((resolve, reject) => {
        GetLunch.scrape().then((data) => {
            let EmailHTML = fs.read("LuncherEmail.html");
            let date = getDate();
            console.log(data);
            //
            let dataAvailable = ((data.soup) || (data.entree) || (data.specialdietentree) || (data.salad) || (data.dessert) || (data.sides));
            if (!dataAvailable) {
                resolve("Lunch data not available, not sending.");
                return;
            }
            //
            //lets record and save this menu in the database Lunch -> Menu
            if (!test)
                recordMenu(data, date);
            //
            EmailHTML = nicenIt(EmailHTML, data, date);
            firstTime = false;
            // console.log(EmailHTML)
            // return;
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

function recordMenu(data, date) {
    data.date = date;
    let d = new Date();
    data.time = d.getTime();
    MongoDB.Write("Lunch", "Menu", data).then((res) => {
        console.log("Menu Saved In Database.");
    });
}

function nicenIt(EmailHTML, data, date) {
    EmailHTML = EmailHTML.replace("[SOUP]", data.soup || "Soup Not Available");
    EmailHTML = EmailHTML.replace("[ENTREE]", data.entree || "Entree Not Available");
    EmailHTML = EmailHTML.replace("[SPECIALDIETENTREE]", data.specialdietentree || "Diet Entree Not Available");
    EmailHTML = EmailHTML.replace("[SALAD]", data.salad || "Salad Not Available");
    EmailHTML = EmailHTML.replace("[DESSERT]", data.dessert || "Dessert Not Available");
    EmailHTML = EmailHTML.replace("[SIDES]", data.sides || "Sides Not Available");
    EmailHTML = EmailHTML.replace("[DATE]", date || "Date Not Available");
    //if not the first time, cancel ps
    if (ps != "") {
        ps = "<p>" + ps + "</p>"
        // if (!((data.soup) && (data.entree) && (data.specialdietentree) && (data.salad) && (data.dessert) && (data.sides))) {
        //     ps += "<a href='seansun.org/view/whynotavailable.html'>Why is the menu not available?,</a>"
        // }
        ps = `<tr><td align='center' style='padding: 0 56px 28px 56px;' valign='middle'><span style='font-family: "lato", "Helvetica Neue", Helvetica, Arial, sans-serif; line-height: 28px;font-size: 16px;  vertical-align: middle;'>` + ps + "</span></td></tr>";
    }
    console.log("ps:", ps);
    EmailHTML = EmailHTML.replace("[P.S.]", ps);
    return EmailHTML;
}

module.exports = {
    sendLunch
};
console.log("TESTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT");
sendLunch("sean_sun2002@icloud.com", true).then((res) => {
    ps = ""; //after send ps, set it to nothing so it doesn't resend tomorrow.
    console.log("Exited with message", res);
});

if (false) {
    //THIS SHOULD NEVER RUN
    console.log("YOU SHOULD NEVERRRRR SEE THIS LINE OF CONSOLE UNLESS YOU KNOW WHAT YOU ARE DOING.")
    // sendLunch("Luncher@seansun.org").then((res) => {
    //     ps = ""; //after send ps, set it to nothing so it doesn't resend tomorrow.
    //     console.log("Exited with message", res);
    // });
    GetLunch.scrape().then((data) => {
        recordMenu(data, getDate());
    });
}
console.log("END TESTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT");
