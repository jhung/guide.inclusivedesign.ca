/*
Copyright 2016 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

var fs = require("fs");
var path = require("path");
var sanitize = require("sanitize-filename");
var mkdirp = require("mkdirp");
var branding = JSON.parse(fs.readFileSync("src/static/print-branding/branding.json"));

var workingPath = process.cwd();
var outputPrintPartsPath = path.join(workingPath,"out","printParts");
var outputPrintFilename = "InclusiveDesignGuide-print.html"

module.exports.helpers = {};

/**
 * Get the SVG icon for a given category. If the category doesn't exist, then
 * nothing is returned.
 *
 * @param {string} category The category to get the icon for.
 * @return {string} svg A string containing the SVG icon for the given category.
 */
module.exports.helpers.getCategoryIcon = function (category) {
    switch (category.toLowerCase()) {
        case ("insights"):
            return (fs.readFileSync("src/static/images/icon-circle.svg", 'utf8'));
        case ("practices"):
            return (fs.readFileSync("src/static/images/icon-diamond.svg", 'utf8'));
        case ("tools"):
            return (fs.readFileSync("src/static/images/icon-square.svg", 'utf8'));
        case ("activities"):
            return (fs.readFileSync("src/static/images/icon-hexagon.svg", 'utf8'));
        case ("dimensions"):
            return (fs.readFileSync("src/static/images/icon-dimension.svg", 'utf8'));
        default:
            return;
    }
};

/**
 * Get the HTML content that appears at the top of every card. Returns a string.
 *
 * @param {object} theDocumentMetadata The DocPad document which contains the
 *                                     category and title metadata.
 *
 * @return {string} header The HTML content as a string.
 */
getPrintHeader = function (theDocumentMetadata) {

    // Todo: re-implement this as a partial.
    return "<section class='idg-category-"+theDocumentMetadata.meta.category+
            "'><header class='idg-print-header'>"+
            "<svg class='idg-print-background-svg'><rect width='100%' height='100%'></rect></svg>"+
            module.exports.helpers.getCategoryIcon(theDocumentMetadata.meta.category)+
            theDocumentMetadata.meta.category+
            "</header><div class='idg-print-cardContent'><h1>"+
            theDocumentMetadata.meta.title+"</h1>";
};

/**
 * Get the HTML content that appears at the bottom of every card. Returns a
 * string.
 *
 * @return {string} header The HTML content as a string.
 */
getPrintFooter = function () {

    // Todo: re-implement this as a partial.
    return "</div><footer class='idg-print-footer'>"+
            "<img src='/print-branding/logo.svg'>"+branding[0].organization+
            "</footer></section>";
};

/**
 * A wrapper function for node fs.writeFileSync which sanitizes the filename.
 *
 * @param {string} dirPath The directory path to the filename.
 * @param {string} filename The name of the file to write to.
 * @param {object} content The content to write into the file.
 */
writeFile = function (dirPath, filename, content) {
    fs.writeFileSync(path.join(dirPath, sanitize(filename)), content, 'utf8');
};

/**
 Find <div> elements with classname "idg-print-break" within the content.
 At the location of each matching <div>, split the content into sections.

Then process each section and insert any necessary blank pages.

Example 1, if the content string is:
    [0]: Lorem ipsum <div class="foo bar idg-print-break">some more text</div> bar.

The resulting split content array would be:
    [0]: Lorem ipsum
    [1]:  bar.

Example 2, if the content is to just output some blank cards and the string is:
    [0]: <div class="idg-print-break"></div>\n
         <div class="idg-print-break"></div>

The resulting split content array would be:
    [0]: Empty string
    [1]: Empty string
    [2]: Empty string

    @param {string} theContent the content to split into section.
    @param {string} theToken the optional string or regular expression used to
                             split the content.
    @return {string[]} the content split into an array of strings.
*/
parseSplits = function (theContent, theToken) {

    // TODO: To fix - regex should not treat multiple instances of the token on
    // a single line as a SINGLE match.
    var regex = theToken || /(<div[^>](?:.*)class=["'](?:.*)\bidg-print-break\b(?:.*)["']><\/div>)/gm;
    var splitContent = theContent.split(regex);

    for (var i=splitContent.length-1; i >= 0; i--) {

        // Deal with white space or empty items
        if (splitContent[i].trim() == 0) {

            if (i==0 && splitContent[i+1].match(regex)) {
                // If the item is at the start, and the next item is a token
                splitContent[i]="";
            } else {
                // Otherwise we remove it.
                splitContent.splice(i,1);
            }

        } else if (splitContent[i].match(regex)) {
            if (i==splitContent.length-1) {
                splitContent.push("");
            } else if (splitContent[i+1].match(regex)) {
                splitContent.splice(i+1, 0, "");
            }

            // Reached the start and it's a token, then put an empty card in front.
            if (i==0) {
                splitContent.splice(i, 0, "");
            }
        }
    }

    // Remove the tokens from the output before returning
    // We don't remove the tokens during the above processing because the loop
    // looks forward and backward in the array for tokens.
    for (var i=0; i<splitContent.length; i++) {
        if (splitContent[i].match(regex)) {
            splitContent.splice(i,1);
        }
    }
    return splitContent;
};

/**
 * Take a piece of content, and split the content into HTML <section> elements
 * which represents a single "card" side, and write it to the
 * `outputPrintPartsPath`.
 *
 * This method is called by the print template during the docpad rendering stage.
 *
 * @param {object} theDocumentMetadata The DocPad document which contains metadata for
 *                                     `theContent`.
 * @param {string} theContent The HTML content to be split.
 */

module.exports.helpers.insertPrintBreak = function (theDocumentMetadata, theContent) {

    // Get an array of all the split content parts
    var splitContent = parseSplits(theContent);

    // Get the headers and footers to be added to the output.
    var printHeader = getPrintHeader(theDocumentMetadata);
    var printFooter = getPrintFooter();

    // Output filename variables. Example: Tools-Mindmaps-1.html
    var outputFilePrefix = theDocumentMetadata.meta.category + "-" + theDocumentMetadata.meta.title;
    var outputPartNumber = 1;
    var outputFileExt = ".html";

    /* For each of the parts split, create a file for it. */
    splitContent.forEach (function (contentPart) {

        var outputFilename = outputFilePrefix+"-"+outputPartNumber+outputFileExt;

        // Add header and footer to the split content
        contentPart = printHeader + contentPart + printFooter;

        if (writeFile (outputPrintPartsPath, outputFilename, contentPart)) {
            // error writing file
            // TODO: do something? For now, return and stop trying to process that file.
            return;
        }
        outputPartNumber++;
    });
};

/**
 * Create the directory which will hold the split content files.
 */
module.exports.helpers.createPrintDirectories = function () {
    // check if output path exists, otherwise make it

    mkdirp(outputPrintPartsPath, function (err) {
        if (err) {
            return console.error(err);
        }
    });
};

/**
 * Object that contains paths to each card fragment, and a method to order those
 * cards into a duplex order.
 *
 * @param {string} path the path to the files specified in the `files` parameter
 * @param {string[]} files the filenames of the card parts to work from
 * @param {emptyCard} [emptyCard] optional string that appears in an empty card
 */
function cards (path, files, emptyCard) {
    var that = {};

    // if the emptyCard parameter is not set, then use the default value.
    that.emptyCard = emptyCard || "<section class='idg-print-empty'></section>";
    that.pathToCardFiles = path; // the absolute path to the card parts
    that.cardFiles = files;

    /**
       Given an index number an item in the cardFiles array, return its contents
       and the contents of its 3 duplex siblings in duplex order.

       For example:
       If the starting index is 1, and the siblings are 2, 3, and 4, then
       the duplex order is 1 3 4 2.

       @param {number} cardFilesIndex the index in the cardFiles array to start from.
     */
    that.getDuplexCards = function (cardFilesIndex) {

        // Create a table of the files, their duplex order, and initialize their content to emptyCard.
        var indexToDuplexPositionMap = [{cardFilesIndex: cardFilesIndex  , duplexPosition: 1, content: that.emptyCard},
                                        {cardFilesIndex: cardFilesIndex+1, duplexPosition: 4, content: that.emptyCard},
                                        {cardFilesIndex: cardFilesIndex+2, duplexPosition: 2, content: that.emptyCard},
                                        {cardFilesIndex: cardFilesIndex+3, duplexPosition: 3, content: that.emptyCard}];

        var duplexContent = ''; // the content to return at the end.

        // For each item, read its file contents.
        indexToDuplexPositionMap.forEach (function (item) {
            if (item.cardFilesIndex < that.cardFiles.length) {
                item.content = fs.readFileSync(that.pathToCardFiles+'/'+that.cardFiles[item.cardFilesIndex]);
            }
        });

        // Sort the array according to its duplex order.
        indexToDuplexPositionMap.sort( function(a,b) {
            return ((a.duplexPosition > b.duplexPosition) ? 1 : -1);
        });

        // Serialize the contents and return it.
        indexToDuplexPositionMap.forEach (function (item) {
            if (item.duplexPosition%2 == 0) {
                duplexContent += item.content+"</article>";
            } else {
                duplexContent += "<article>"+item.content;
            }
        });

        return duplexContent;
    };
    return that;
};

module.exports.helpers.createPrintFile = function () {
    var files = new Array ();
    var outputPrintFilePath = path.join (workingPath,'out', outputPrintFilename);
    var outputString = new String();

    // Clear the file for writing.
    fs.writeFileSync(outputPrintFilePath, outputString, 'utf8');

    // Go through all the HTML content parts and put them into duplex order.
    fs.readdir(outputPrintPartsPath, function(err, files) {
        // Remove any non HTML files from the list to be processed
        for (var i=0; i<files.length; i++) {
            if (files[i].substr(-5) !== '.html') {
                files.splice(i,1);
            }
        }

        var theCards = cards (outputPrintPartsPath, files);

        // Insert starting HTML elements for the output (body, article, etc.)
        outputString += fs.readFileSync('src/layouts/partials/print-header.html','utf8');

        for (var fileToProcessIndex = 0; fileToProcessIndex < files.length; fileToProcessIndex += 4) {
            // Get the duplex order for 4 card parts starting the specified index.
            outputString += theCards.getDuplexCards (fileToProcessIndex);
        }

        // Insert ending HTML elements.
        outputString += fs.readFileSync('src/layouts/partials/print-footer.html','utf8');

        // Write it all to disk.
        fs.appendFileSync(outputPrintFilePath, outputString, 'utf8');
    });
};
