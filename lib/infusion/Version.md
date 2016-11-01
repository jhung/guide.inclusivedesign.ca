This version of Infusion was created using a custom build from the master branch:

https://github.com/fluid-project/infusion/

commit c9d974c3b2a667f963afd0ba90d55fc4e187bc08

using the command line:
```
    grunt custom --source=true --include="uiOptions" --name="uio"
```

The file src/framework/preferences/html/SeparatedPanelPrefsEditorFrame.html was modified to
reference infusion-uio.js instead of individual js files.

The following directories and files were stripped out of the build, since they contain
code that is included in the infusion-uio.js file or is not required by this plugin:

* src/components/slidingPanel/
* src/components/tableOfContents/js/
* src/components/tableOfContents/tableOfContentsDependencies.json
* src/components/textfieldSlider/
* src/components/textToSpeech/
* src/components/uiOptions/
* src/framework/core/js/
* src/framework/core/frameworkDependencies.json
* src/framework/enhancement/
* src/framework/preferences/js/
* src/framework/preferences/preferencesDependencies.json
* src/framework/renderer/
* src/lib/fastXmlPull/
* src/lib/fonts/fontsDependencies.json
* src/lib/jquery/core/
* src/lib/jquery/plugins/
* src/lib/jquery/ui/jQueryUICoreDependencies.json
* src/lib/jquery/ui/jQueryUIWidgetsDependencies.json
* src/lib/jquery/ui/js/
* src/lib/json/
* src/lib/normamlize/normalizeDependencies.json
* README.md
* ReleaseNotes.md
