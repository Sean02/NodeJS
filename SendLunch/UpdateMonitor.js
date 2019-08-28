const Nightmare = require('nightmare');
let MongoDB = require("./MongoDB.js");


pressReset = () => {
    return new Promise((resolve, reject) => {
        let nightmare = Nightmare({show: true});
        let url = 'https://script.google.com/a/sonomaacademy.org/d/MTSX05vShLS55Ieb61adCNAl5z2TKvFXd/edit?mid=ACjPJvFkgxwfeM_8sJBirmLmZvDRgYo_5x4x-tsGru7f0f2niuomXqtNz_3kesEnTLkRxyufHd6mAxJwAwnhLgU6Zmbn-aQ3vM0JpDR7Mx6DHWlo7x5ZFNSRSlBJF7XQEKympcL3239SvY0&uiv=2';

        getPasswd().then((passwd) => {
            passwd = passwd[0].key;
            console.log("Passwd:"+passwd);
            try {
                nightmare
                    .goto(url)
                    .viewport(1000, 700)
                    // .inject("js", "./jquery.min.js")
                    .wait(1000)
                    .type("input#Email", "sean.sun@sonomaacademy.org")
                    .wait(1000)
                    .click("input#next")
                    .wait(1000)
                    .type("input#Passwd", passwd)
                    .wait(1000)
                    .click("input#signIn")
                    .wait(5000)
                    .mousedown("div.goog-toolbar-menu-button-inner-box")
                    .wait(3000)
                    .mousedown("div[role='option'][id=':4c']")
                    .wait(500)
                    .mouseup("div[role='option'][id=':4c']")
                    .wait(1000)
                    .mousedown("div#debugButton")
                    .wait(500)
                    .mouseup("div#debugButton")
                    .wait(20000)
                    // .click(".primary")
                    // .wait(7000)
                    .end()
                    .then(() => {
                        console.log("done");
                        resolve(null);
                    });
            } catch (e) {
                console.log(e);
            }
        });

    });
};

pressUpdate = () => {
    return new Promise((resolve, reject) => {
        let nightmare = Nightmare({show: true});
        let url = 'https://script.google.com/a/sonomaacademy.org/d/MTSX05vShLS55Ieb61adCNAl5z2TKvFXd/edit?mid=ACjPJvFkgxwfeM_8sJBirmLmZvDRgYo_5x4x-tsGru7f0f2niuomXqtNz_3kesEnTLkRxyufHd6mAxJwAwnhLgU6Zmbn-aQ3vM0JpDR7Mx6DHWlo7x5ZFNSRSlBJF7XQEKympcL3239SvY0&uiv=2';

        getPasswd().then((passwd) => {
            passwd = passwd[0].key;
            try {
                nightmare
                    .goto(url)
                    .viewport(1000, 700)
                    // .inject("js", "./jquery.min.js")
                    .wait(1000)
                    .type("input#Email", "sean.sun@sonomaacademy.org")
                    .wait(1000)
                    .click("input#next")
                    .wait(1000)
                    .type("input#Passwd", passwd)
                    .wait(1000)
                    .click("input#signIn")
                    .wait(5000)
                    .mousedown("div.goog-toolbar-menu-button-inner-box")
                    .wait(3000)
                    .mousedown("div[role='option'][id=':4b']")
                    .wait(500)
                    .mouseup("div[role='option'][id=':4b']")
                    .wait(1000)
                    .mousedown("div#debugButton")
                    .wait(500)
                    .mouseup("div#debugButton")
                    .wait(20000)
                    // .click(".primary")
                    // .wait(7000)
                    .end()
                    .then(() => {
                        console.log("done");
                        resolve(null);
                    });
            } catch (e) {
                console.log(e);
            }
        });

    });
};

getPasswd = () => {
    return new Promise((resolve, reject) => {
        MongoDB.Read("Passwds", "GooglePasswd", {
            handle: true
        }).then((data) => {
            console.log(data)
            resolve(data);
        });
    });
};

module.exports = {pressReset, pressUpdate}

// pressUpdate().then(() => {
// });
// console.log("PRESS  ED RESET");
// getPasswd().then(()=>{});
