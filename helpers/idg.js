/*
Copyright 2016 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

var fs = require("fs");
var hb = require("handlebars");

var svgs = {
    "principles": fs.readFileSync("src/static/images/icon-circle.svg", 'utf8'),
    "practices": fs.readFileSync("src/static/images/icon-diamond.svg", 'utf8'),
    "tools": fs.readFileSync("src/static/images/icon-square.svg", 'utf8'),
    "activities": fs.readFileSync("src/static/images/icon-hexagon.svg", 'utf8')};

module.exports.helpers = {};

module.exports.helpers.getCategoryIcon = function (category) {
    return svgs[category.toLowerCase()];
};

module.exports.helpers.getPrintBanner = function (category, printBreak) {

    /*
Testing stuff. Commented out for now.

    TEMPLATE:

    <div class="idg-print-banner idg-print-only idg-print-page-break">
        {{{getCategoryIcon document.category}}} <-- SVG
        {{document.category}} <-- string
    </div>
    */

    // var banner = document.createElement ("div");
    // banner.className += "idg-print-banner idg-print-only";
    // banner.appendChild(module.exports.helpers.getCategoryIcon(category)); // getCategoryIcon()
    // banner.textContent(category); // add category string
    //
    // if (printBreak) {
    //     banner.className += "idg-print-page-break";
    // }



    // IGNORE THIS: this builds a string. For reference only
    // var banner = module.exports.helpers.getCategoryIcon(category) + category + '</div>';
    // if (printBreak) {
    //     banner = 'idf-print-page-break>' + banner;
    // }
    // banner = '<div class="idg-print-banner idg-print-only ' + banner;
    // return new hb.SafeString(banner);
}
