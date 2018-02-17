let request = require('request');
let cheerio = require('cheerio');

function scrape(){
    return new Promise((resolve, reject) => {
        let url = 'http://www.myschooldining.com/sa';
        request(url, function (error, response, html) {
            if (!error) {
                // $("[day_no=" + date + "] div#sonomaacademy_lunch_soup span.item-value").text();

                // let table = $("#table_calendar_week>tbody>tr");
                resolve(parseLunch(html));

            }
        });
    });
}


getDate = () => {
    let date = new Date();
    let year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDate();

    let res = year.toString() + "-" + ((month < 10) ? "0" + month.toString() : month.toString()) + "-" + ((day < 10) ? "0" + day.toString() : day.toString());
    console.log(res);
    return res;
};

parseLunch = (html) => {
    let $ = cheerio.load(html);
    let date = getDate();
    let res= [getSoup($, date), getSalad($, date), getEntree($, date), getSpecialDietEntree($, date), getSides($, date), getDessert($, date)];
    // console.log(res);
    return res;
};

getSoup = ($, date) => {
    return $("[day_no=" + date + "] div#sonomaacademy_lunch_soup span.item-value").text().trim();
};
getEntree = ($, date) => {
    return $("[day_no=" + date + "] div#sonomaacademy_lunch_entree span.item-value").text().trim();
};
getSalad = ($, date) => {
    return $("[day_no=" + date + "] div#sonomaacademy_lunch_salad span.item-value").text().trim();
};
getSpecialDietEntree = ($, date) => {
    return $("[day_no=" + date + "] div#sonomaacademy_lunch_specialdietentree span.item-value").text().trim();
};
getSides = ($, date) => {
    return $("[day_no=" + date + "] div#sonomaacademy_lunch_sides span.item-value").text().trim();
};
getDessert = ($, date) => {
    return $("[day_no=" + date + "] div#sonomaacademy_lunch_dessert span.item-value").text().trim();
};

module.exports = {
    scrape
};

// scrape().then((lunch) => {
//     console.log(lunch);
// });