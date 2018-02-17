"use strict";

var _freeGoogleImageSearch = require("free-google-image-search");

var _freeGoogleImageSearch2 = _interopRequireDefault(_freeGoogleImageSearch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_freeGoogleImageSearch2.default.searchImage("cats").then(function (res) {
    console.log(res); // This will return array of image URLs
});