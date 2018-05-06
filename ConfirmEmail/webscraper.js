let request = require('request');
let cheerio = require('cheerio');

function scrape() {
    return new Promise((resolve, reject) => {
        let url = 'http://www.myschooldining.com/sa';
        request(url, function(error, response, html) {
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
    let year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate();
    let res = year.toString() + "-" + ((month < 10) ? "0" + month.toString() : month.toString()) + "-" + ((day < 10) ? "0" + day.toString() : day.toString());
    console.log(res);
    return res;
};
parseLunch = (html) => {
    let $ = cheerio.load(html);
    let date = getDate();
    let res = {
        soup: getSoup($, date) || "Soup Not Available",
        salad: getSalad($, date) || "Salad Not Available",
        entree: getEntree($, date) || "Entree Not Available",
        specialdietentree: getSpecialDietEntree($, date) || "Special Entree Not Available",
        sides: getSides($, date) || "Sides Not Available",
        dessert: getDessert($, date) || "Dessert Not Available"
    };
    // console.log(res);
    return res;
};
const re = new RegExp('\\s{2,}', 'g');
const rep = "\n";
//
// String.prototype.foobar = function(){
//   const foo = new RegExp('\\r?\\n|\\r\\g');
//   const bar = new RegExp("^\s+|\s+$/g")
// }
getSoup = ($, date) => {
    return $("[day_no=" + date + "] div#sonomaacademy_lunch_soup span.item-value").text().trim().replace(re, rep);
};
getEntree = ($, date) => {
    return $("[day_no=" + date + "] div#sonomaacademy_lunch_entree span.item-value").text().trim().replace(re, rep);
};
getSalad = ($, date) => {
    return $("[day_no=" + date + "] div#sonomaacademy_lunch_salad span.item-value").text().trim().replace(re, rep);
};
getSpecialDietEntree = ($, date) => {
    return $("[day_no=" + date + "] div#sonomaacademy_lunch_specialdietentree span.item-value").text().trim().replace(re, rep);
};
getSides = ($, date) => {
    return $("[day_no=" + date + "] div#sonomaacademy_lunch_sides span.item-value").text().trim().replace(re, rep);
};
getDessert = ($, date) => {
    return $("[day_no=" + date + "] div#sonomaacademy_lunch_dessert span.item-value").text().trim().replace(re, rep);
};
module.exports = {
    scrape
};
// scrape().then((lunch) => {
//     console.log(lunch);
// });