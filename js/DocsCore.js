/*
Copyright 2015 OCAD University
Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.
You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("docsCore");

    docsCore.init = function (libPath) {
        libPath = libPath || "";

        fluid.uiOptions.prefsEditor(".flc-prefsEditor-separatedPanel", {
            terms: {
                templatePrefix: libPath + "lib/infusion/src/framework/preferences/html",
                messagePrefix: libPath + "lib/infusion/src/framework/preferences/messages",
            },
            tocTemplate: libPath + "lib/infusion/src/components/tableOfContents/html/TableOfContents.html",
            ignoreForToC: {
                "ignore": ".ignore-for-TOC"
            }
        });

        docsCore.loadSidebar("body");
    };

    /******************
     * Sidebar Loader *
     ******************/

    /**
     * Save the flag for showing/hiding the side bar into the cookie. Also retrieve and apply the flag at init.
     */
    fluid.defaults("docsCore.loadSidebar", {
        gradeNames: ["fluid.viewComponent"],
        components: {
            sidebar: {
                type: "docsCore.sidebar",
                container: "{loadSidebar}.container",
                options: {
                    modelListeners: {
                        "": {
                            listener: "{cookieStore}.set",
                            args: ["{change}.value"]
                        }
                    },
                    model: {
                        expanded: {
                            expander: {
                                funcName: "fluid.get",
                                args: [{
                                    expander: {
                                        funcName: "{cookieStore}.get"
                                    }
                                }, "expanded"]
                            }
                        }
                    }
                }
            },
            cookieStore: {
                type: "fluid.prefs.cookieStore",
                options: {
                    cookie: {
                        name: "docsCore-settings"
                    }
                }
            }
        }
    });

    /***********
     * Sidebar *
     ***********/

    /**
     * Apply or remove the style for showing/hiding the side bar based on the model value.
     */
    fluid.defaults("docsCore.sidebar", {
        gradeNames: ["fluid.viewComponent"],
        styles: {
            expanded: "docs-core-sidebar-expanded"
        },
        selectors: {
            sidebarButton: ".docs-corec-sidebar-toggle",
            sidebar: ".docs-corec-sidebar-bar"
        },
        strings: {
            expandedText: "Hide Topics",
            collapsedText: "Show Topics"
        },
        members: {
            sidebarID: {
                expander: {
                    funcName: "fluid.allocateSimpleId",
                    args: ["{that}.dom.sidebar"]
                }
            }
        },
        model: {
            expanded: false
        },
        modelListeners: {
            expanded: {
                func: "{that}.toggleExpansion",
                args: ["{change}.value"]
            }
        },
        invokers: {
            toggleModel: {
                funcName: "docsCore.toggleModel",
                args: ["{that}"]
            },
            toggleExpansion: {
                funcName: "docsCore.toggleExpansion",
                args: ["{that}", "{arguments}.0"]
            },
            clickToggle: {
                funcName: "docsCore.prevenDefault",
                args: ["{arguments}.0", "{that}.toggleModel"]
            }
        },
        listeners: {
            "onCreate.clickTopics": [{
                "this": "{that}.dom.sidebarButton",
                method: "click",
                args: ["{that}.clickToggle"]
            }],
            "onCreate.setAria": {
                "this": "{that}.dom.sidebarButton",
                method: "attr",
                args: [{
                    role: "button",
                    "aria-controls": "{that}.sidebarID"
                }]
            }
        }
    });

    docsCore.prevenDefault = function (event, fn, args) {
        event.preventDefault();
        fn(args);
    };

    docsCore.toggleModel = function (that) {
        that.applier.change("expanded", !that.model.expanded);
    };

    docsCore.toggleExpansion = function (that, state) {
        that.container.toggleClass(that.options.styles.expanded, state);
        var sidebarButton = that.locate("sidebarButton");
        sidebarButton.attr("aria-pressed", state);
        sidebarButton.text(that.options.strings[state ? "expandedText" : "collapsedText"]);
        that.locate("sidebar").attr("aria-expanded", state);
    };
})(jQuery, fluid);
