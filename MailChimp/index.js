var request = require("request");

var options = { method: 'POST',
    url: 'https://us17.api.mailchimp.com/3.0/lists/82645d2768/members',
    headers:
        { 'Postman-Token': 'c6d0dfac-3462-6eeb-e654-779638e98254',
            'Cache-Control': 'no-cache',
            Authorization: 'Basic YW55c3RyaW5nOjI5NGUyMDJkMTE1ZGNkYjI5NWE1MGI5N2E5ZDQ3MDM0LXVzMTc=',
            'Content-Type': 'application/json' },
    body:
        { email_address: 'sean_sun2002@icloud.com',
            status: 'subscribed' },
    json: true };

request(options, function (error, response, body) {
    if (error) throw new Error(error);

    console.log(body);
});
