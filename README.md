# About the Inclusive Design Guide

This project contains the content related to the Inclusive Design Guides.

The HTML content is generated with `docpad` and uses the [`docs-template`](https://github.com/fluid-project/docs-template) project as its template.

# Building

1. Get a local copy of the [`Inclusive Design Guides repository`](https://github.com/inclusive-design/guides.inclusivedesign.ca).

2. Install DocPad if it isn't already installed:
```
sudo npm install -g docpad
```
3. Get the required node modules:
```
npm install
```
4. Run docpad:
```
docpad run
```
5. Confirm everything is set up properly by opening `http://localhost:9778/` in a web browser.

# Modifying Content

If you wish to edit or modify the design guides content, you will find the content located in the `./src/documents/` directory. Each category is located in its own sub-directory.

# Adding New Content

If you wish to add new content, copy the text from an existing content file and paste it into a new blank text file. Then customize the title, text, and category to match your new content.

Here are some important remarks:

* The new filename should be "heads-up camel case" (each word in the filename is to be capitalized, with no no spaces or punctuation).
* The file should be saved in the directory matching the name of the "category" text field in your content.
* The `site-structure.json` file should be updated with the new file, otherwise it will not appear in the navigation.

# Deploy to GitHub Pages
```
docpad deploy-ghpages --env static
```

*Note:* The above command will deploy to the origin of the repository. To deploy
to production, you may need to be working from Master, not a fork.

# Generating a Static version
To create a static version of the site, run: `docpad generate --env static`. This will generate a version in the `./out/` directory which you can then view locally or upload to a web server.

# Differences with docs-template
The Inclusive Design Guide uses the `docs-template` project, but uses a slightly different template structure. The `docs-template` uses a single content template `default.html.handlebars`. The Inclusive Design Guide instead refactored that default template into partials located in the `/layouts/partials/` directory.

# Printing the Inclusive Design Guide

## Inserting Front / Back Card Splits in the Content

## Preparing to Print
Before printing, use print preview to ensure all content is visible. If there
are problems, refer to the Print Troubleshooting section below.

It is recommended to test print first two pages before printing all the content.

Configure the printer settings (not all of these features may be present for
your printer):
* Page orientation set to Landscape
* Disable "scale to fit" or any "fit to page" feature
* Enable duplex printing if available. If not, refer to "Printer does not have a
duplex feature" in the Print Troubleshooting section.
* If there is a print binding edge, set it to the short edge.
* Set print margins to as small as possible.

## Print Troubleshooting:

Note: many solutions reference changing configuration variables within the
`print-settings.styl` file.

Problem: Content is getting cut off above the footer.
Solution:
* cut down text from the content
* decrease the `printFontSize`
* decrease header and footer size

Problem: Content is getting cut off along the sides.
Solution:
* reduce the `cardWidth`, or increase `cardContentMargin`.

Problem: The front side and back side don't align properly.
Solution:
* remove any margins set by the printer
* in printer settings, set the print binding edge to the short side

Problem: The reverse side is printing upside down.
* in printer's duplex settings, enable reverse side rotation, or set the
  variable `enableReverseSideRotation` to "true".

Problem: Cutting guides are not all visible
* reduce `cardWidth`

Problem: Printer does not have a duplex feature
* print odd numbered pages first, then load the printed odd pages back into
  the printer's paper tray and then print the even numbered pages.

# License Information
The docs-template project is licensed under Creative Commons Attribution 3.0 - http://creativecommons.org/licenses/by/3.0/
