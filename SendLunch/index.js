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

let a = schedule.scheduleJob('0 30 7 * * 1-5', function(){
  sendLunch("Luncher@seansun.org");
});

console.log("Starting...");

function getDate() {
    var monthNames = [
        "Jan", "Feb", "Mar",
        "Apr", "May", "Jun", "Jul",
        "Aug", "Sep", "Oct",
        "Nov", "Dec"
    ];
    let date = new Date();

    let day = date.getDate();
    let monthIndex = date.getMonth();
    let year = date.getFullYear();

    return monthNames[monthIndex] + ' ' + day + ', ' + year;
}

function sendLunch(email){
  GetLunch.scrape().then((data) => {
    let EmailHTML = fs.read("LuncherEmail.html");
    let date = getDate();
    console.log(data);
    EmailHTML = EmailHTML.replace("[SOUP]",data.soup);
    EmailHTML = EmailHTML.replace("[ENTREE]",data.entree);
    EmailHTML = EmailHTML.replace("[SPECIALDIETENTREE]",data.specialdietentree);
    EmailHTML = EmailHTML.replace("[SALAD]",data.salad);
    EmailHTML = EmailHTML.replace("[DESSERT]",data.dessert);
    EmailHTML = EmailHTML.replace("[SIDES]",data.sides);
    EmailHTML = EmailHTML.replace("[DATE]",date);
  MailGun.sendEmail("","Luncher <Luncher@sonomaacademy.org>",email,`Today's Menu - ${date}`, EmailHTML).then((res)=>{
     //nothing to do
      console.log(res);
  });
  });
}

sendLunch("sean.sun@sonomaacademy.org");
