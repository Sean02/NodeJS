const Nightmare = require('nightmare')

getLunch = () => {
    return new Promise((resolve, reject) => {
        getMenuData(getDate()).then((data) => {
            resolve(data);
        });
    });
};

getDate = () => {
    let date = new Date();
    let year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate();
    let res = year.toString() + "-" + ((month < 10) ? "0" + month.toString() : month.toString()) + "-" + ((day < 10) ? "0" + day.toString() : day.toString());
    console.log(res);
    return res;
};

getMenuData = (date) => {
    return new Promise((resolve, reject) => {

        let nightmare = Nightmare({show: false});
        let url = 'https://sonomaacademy.flikisdining.com/menu/sonoma-academy/lunch/' + date;
        let day = date.substring(date.length - 2, date.length);

        console.log("date: " + date);
        console.log("day: " + day);
        console.log("url: " + url);

        nightmare
            .goto(url)
            .viewport(1000, 700)
            .inject("js", "./jquery.min.js")
            .wait(4000)
            .click(".primary")
            .wait(7000)
            .evaluate(function (day) { // to pass variables to the headless browser, put it here, and down there
                console.log("You won't see this in the server log, because inside the evaluate function everything is passed to the headless browser to run: " + day);
                let data = {
                    "soup": "",
                    "salad": "",
                    "entree": "",
                    "specialdietentree": "",
                    "sides": "",
                    "dessert": ""
                };

                $("div.week-container div.weeks span:contains('" + day + "')").parent().parent().find("li.title:contains('Soup')").nextAll().find("a.food-name-inner").each((index, element) => {
                    if (index) {
                        data.soup += ", ";
                    }
                    data.soup += element.text.trim();
                });

                $("div.week-container div.weeks span:contains('" + day + "')").parent().parent().find("li.title:contains('Salad')").nextAll().find("a.food-name-inner").each((index, element) => {
                    if (index) {
                        data.salad += ", ";
                    }
                    data.salad += element.text.trim();
                });

                $("div.week-container div.weeks span:contains('" + day + "')").parent().parent().find("li.title:contains('Entree')").nextAll().find("a.food-name-inner").each((index, element) => {
                    if (index) {
                        data.entree += ", ";
                    }
                    data.entree += element.text.trim();
                });

                $("div.week-container div.weeks span:contains('" + day + "')").parent().parent().find("li.title:contains('Special Diet')").nextAll().find("a.food-name-inner").each((index, element) => {
                    if (index) {
                        data.specialdietentree += ", ";
                    }
                    data.specialdietentree += element.text.trim();
                });

                $("div.week-container div.weeks span:contains('" + day + "')").parent().parent().find("li.title:contains('Sides')").nextAll().find("a.food-name-inner").each((index, element) => {
                    if (index) {
                        data.sides += ", ";
                    }
                    data.sides += element.text.trim();
                });

                $("div.week-container div.weeks span:contains('" + day + "')").parent().parent().find("li.title:contains('Condiments/Toppings')").nextAll().find("a.food-name-inner").each((index, element) => {
                    if (index) {
                        data.dessert += ", ";
                    }
                    data.dessert += element.text.trim();
                });
                return data;
                // return document.body.innerHTML;
            }, day) //and down here (we are passing the variable to the evaluate funciton)
            .end()
            .then((data) => {
                console.log(data);
                console.log("done");
                resolve(data);
            });
    });
};

// makeJQuerySelector = (foodName) => {
//     $("div.week-container div.weeks span:contains('27')").parent().parent().find("li.title:contains('Condiments/Toppings')").nextAll().find("a.food-name-inner").each((index, element) => {
//         if (index) {
//             result += ", ";
//         }
//         result += element.text.trim();
//     });
// }


//
// getLunch().then((data) => {
//     console.log("returned");
//     console.log(data);
// });

module.exports = {getLunch}