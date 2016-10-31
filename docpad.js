/*
Copyright 2014 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

// This project's repository on GitHub. Used to build URLs for "Edit on GitHub" links
// Change this value to match your site.
var githubDocRoot = "https://github.com/inclusive-design/guide.inclusivedesign.ca/tree/master/src/documents/";

var path = require("path");
var fs = require("fs-extra");
var docsCore = require("docs-core");
var guidelinesHelpers = require('./helpers/idg.js');
var siteStructure = JSON.parse(fs.readFileSync("site-structure.json"));
var partialsDir = 'src/layouts/partials';
var staticImagesDir = 'src/static/images';

module.exports = {
    filesPaths: [
        docsCore.getStaticFilesDir(),
        "static"
    ],
    renderSingleExtensions: true,
    templateData: {
        siteStructure: siteStructure
    },
    plugins: {
        redirector: {
            redirects: {
                "/insights/":"/insights/DiverseParticipationAndPerspectives.html",
                "/practices/":"/practices/Collaborate.html",
                "/tools/":"/tools/UXWalkthroughs.html",
                "/activities/":"/activities/MatchingGame.html",
                "/principles/":"/insights/",
                "/principles/DiverseParticipationAndPerspectives.html": "/insights/DiverseParticipationAndPerspectives.html",
                "/principles/AutonomousUser.html": "/insights/AutonomousUser.html",
                "/principles/DisabilityAsMismatch.html": "/insights/DisabilityAsMismatch.html",
                "/principles/IntegratedSolutions.html": "/insights/IntegratedSolutions.html",
                "/principles/Interconnectedness.html": "/insights/Interconnectedness.html",
                "/principles/OneSizeFitsOne.html": "/insights/OneSizeFitsOne.html",
                "/principles/UserContinuedDesign.html": "/insights/UserContinuedDesign.html",
                "/principles/VirtuousCycles.html": "/insights/VirtuousCycles.html"
            }
        },
        handlebars: {
            helpers: {
                rewriteMdLinks: docsCore.helpers.rewriteMdLinks,
                getGithubLocation: docsCore.helpers.makeGithubLocationHelper(githubDocRoot),
                getRelativeUrl: docsCore.helpers.getRelativeUrl,
                ifEqual: docsCore.helpers.ifEqual,
                getCategoryIcon: guidelinesHelpers.helpers.getCategoryIcon,
                insertPrintBreak: guidelinesHelpers.helpers.insertPrintBreak
            },
            partials: {
                headMatter: fs.readFileSync(partialsDir + '/' + 'head-matter.html.handlebars', 'utf8'),
                header: fs.readFileSync(partialsDir + '/' + 'header.html.handlebars', 'utf8'),
                footer: fs.readFileSync(partialsDir + '/' + 'footer.html.handlebars', 'utf8'),
                sidebar: fs.readFileSync(partialsDir + '/' + 'sidebar.html.handlebars', 'utf8'),
                idrcLogo: fs.readFileSync(staticImagesDir + '/' + 'idrc-logo.svg', 'utf8')
            }
        },
        highlightjs: {
            aliases: {
                stylus: "css"
            }
        },
        stylus: {
            stylusLibraries: {
                nib: true
            },
            stylusOptions: {
                compress: true,
                'include css': true
            }
        },
        uglify: {
            //  Disable UglifyJS on the development environment.
            environments: {
                development: {
                    enabled: false
                }
            },

            //  Pass false to skip compressing entirely. Pass an object to specify custom
            //  compressor options: http://lisperator.net/uglifyjs/compress .
            compress: {},

            //  Pass false to skip mangling names.
            mangle: {}
        }
    },

    environments: {
        development: {
            stylusOptions: {
                // Disable compression on the development environment
                compress: false
            }
        }
    },

    events: {
        renderBefore: function() {
            // Create the output directory for the print output parts
            guidelinesHelpers.helpers.createPrintDirectories()
        },
        writeAfter: function () {
            // Concatenate print files into 2-cards-per-side duplex order.
            guidelinesHelpers.helpers.createPrintFile()
        },
        generateAfter: function () {
            // Delete the print directories created during renderBefore event.
            guidelinesHelpers.helpers.deletePrintDirectories()
        }
    }
};
