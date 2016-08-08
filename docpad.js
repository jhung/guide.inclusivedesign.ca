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
var fs = require("fs");
var docsCore = require("docs-core");
var guidelinesHelpers = require('./helpers/idg.js');
var siteStructure = JSON.parse(fs.readFileSync("site-structure.json"));

// We locate the images within the src/documents directory so that images can
// be viewed on GitHub, as well as in the DocPad output. We need to
// instruct DocPad to treat the images specially so that they are not
// processed. We tell DocPad to ignore the images using "ignorePaths" and we
// then copy them ourselves with a "writeAfter" event handler.
var rootPath = process.cwd();
var imagesSrcDir = path.join(rootPath, "src", "documents", "images");
var imagesDestDir = "out/images";

var fs = require('fs');
var partialsDir = 'src/layouts/partials';
var staticImagesDir = 'src/static/images'

module.exports = {
    rootPath: rootPath,
    filesPaths: [
        docsCore.getStaticFilesDir(),
        "static"
    ],
    ignorePaths: [ imagesSrcDir ],
    renderSingleExtensions: true,
    templateData: {
        siteStructure: siteStructure
    },
    plugins: {
        redirector: {
            redirects: {
                "/principles/":"/principles/DiverseParticipationAndPerspectives.html",
                "/practices/":"/practices/Collaborate.html",
                "/tools/":"/tools/UXWalkthroughs.html",
                "/activities/":"/activities/MatchingGame.html"
            }
        },
        handlebars: {
            helpers: {
                rewriteMdLinks: docsCore.helpers.rewriteMdLinks,
                getGithubLocation: docsCore.helpers.makeGithubLocationHelper(githubDocRoot),
                getRelativeUrl: docsCore.helpers.getRelativeUrl,
                ifEqual: docsCore.helpers.ifEqual,
                getCategoryIcon: guidelinesHelpers.helpers.getCategoryIcon
            },
            partials: {
                headMatter: fs.readFileSync(partialsDir + '/' + 'head-matter.html.handlebars', 'utf8'),
                header: fs.readFileSync(partialsDir + '/' + 'header.html.handlebars', 'utf8'),
                footer: fs.readFileSync(partialsDir + '/' + 'footer.html.handlebars', 'utf8'),
                printBanner: fs.readFileSync(partialsDir + '/' + 'print-banner.html.handlebars', 'utf8'),
                printFooter: fs.readFileSync(partialsDir + '/' + 'print-footer.html.handlebars', 'utf8'),
                sidebar: fs.readFileSync(partialsDir + '/' + 'sidebar.html.handlebars', 'utf8'),
                activitiesIcon: fs.readFileSync(staticImagesDir + '/' + 'icon-hexagon.svg', 'utf8'),
                principlesIcon: fs.readFileSync(staticImagesDir + '/' + 'icon-circle.svg', 'utf8'),
                practicesIcon: fs.readFileSync(staticImagesDir + '/' + 'icon-diamond.svg', 'utf8'),
                toolsIcon: fs.readFileSync(staticImagesDir + '/' + 'icon-square.svg', 'utf8'),
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
    }
};
