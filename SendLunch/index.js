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

let a = schedule.scheduleJob('0 40 11 * * 1-5', function(){
    GetLunch.scrape().then((data) => {
        MailGun.sendEmail("","Luncher <Luncher@seansun.org>","Luncher@seansun.org","Today's lunch","Hi Lunchers, here's today's menu:\n"+NicenIt(data)).then((res)=>{
           //nothing to do
            console.log(NicenIt(data));
            console.log(res);
        });
    });

});
// GetLunch.scrape().then((data)=>{
//     MailGun.sendEmail("","Luncher <Luncher@seansun.org>","Luncher@seansun.org","Today's lunch","Hi Lunchers, here's today's menu:\n"+NicenIt(data)).then(()=>{
//
//     });
// });

function NicenIt(data) {
    let res = "";
    data.forEach((item) => {
        res += "<p>" + item + "</p>";
    });
    return res;
}