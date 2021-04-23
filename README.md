# Project Radius Geo Targeting aka Radium

<!--* freshness: { owner: 'nnajdova' reviewed: '2021-04-22' } *-->

Project “Radius Geo Targeting” (code name Radium) helps automatically generate
Google Ads radius targeting for given delivery areas.

Disclaimer: This is not an official Google product.

## Contents

- [1. Key Concepts](#1-key-concepts)
  - [1.1. Challenges of Google Ads geo targeting](#11-challenges-of-google-ads-geo-targeting)
  - [1.2. Solution overview](#12-solution-overview)
  - [1.3. Summary](#13-summary)
- [2. Installation](#2-installation)
  - [2.1. Create your map file](#21-create-your-map-file)
  - [2.2. Deploy the Web App](#22-deploy-the-web-app)
  - [2.3. Upload your map](#23-upload-your-map)
  - [2.4. Upload the radius targeting settings to Google Ads](#24-upload-the-radius-targeting-settings-to-google-ads)
- [3. Changes to the code](#3-changes-to-the-code)

## 1. Key Concepts

### 1.1. Challenges of Google Ads geo targeting

1.  Advertisers are faced with the challenge of mapping their business area back
 to the available
Google Ads targeting options (i.e. City, Postal Code etc).
2.  Getting the ads geo targeting right is a manual and time consuming process
especially for advertisers that cannot benefit from city level or country level
targeting
due to not being able to cover the entire city or country.
3.  Very broad geo targeting leads to advertising to customers advertisers
cannot serve with their business.

### 1.2. Solution overview

This solution provides an advertiser or an agency a platform to translate the
map they operate their business into a map where their ads will be displayed.
One replication can be leveraged for multiple customers as the tool doesn’t save
any data it processes. It downloads a file locally that can be used directly in
Google Ads Editor for bulk upload of the locations it generates.

### 1.3. Summary

1. Skills Required: JavaScript & Maps API are the minimum requirements.
2. Google Products Used: Google Ads (primary), SA360, DV360, Studio
3. Estimated time to implement the solution: If no adjustments needed, not more
than 1h.

## 2. Installation

### 2.1. Create your map file

**Tip: If you already have a map file in .kml you can skip this step.**

1. Visit [mymaps.google.com](https://mymaps.google.com)
2. Create a map with your delivery areas aka business targeting areas
3. Click the burger menu on the right and select export to KML
 * Make sure the KML checkbox is checked

### 2.2. Deploy the Web App

1. Visit [script.google.com](https://script.google.com/home/start)
   * You may need to login if you're not already, press Start Scripting for that
2. Press the "Create new project" button and give it a name
3. Paste the code from Code.js (in this folder) to your Code.gs file
4. Create 3 new HTML files named: MasterPage, Page and Stylesheet and copy the
code from the source files into each one accordingly.
5. In MasterPage.html:
    * Add the Maps API Key. [How to obtain Maps API key](https://developers.google.com/maps/documentation/embed/get-api-key)
    * Update the projectParameters with your own e.g. Account ID
6. Deploy the project as a [Web Application](https://developers.google.com/apps-script/guides/web)
 * Create a first version of the web app by pressing the button Deploy
 * Select New Deployment
 * Select type -> web app
 * Add the details required: "description", "execute as" and "who has acces"
 * Press Deploy
7. Copy the Web app url and paste into a new tab in your browser.
8. That's it, your web app is now up and running and you can use as in the next
step.

### 2.3. Upload your map

1. Press the "Upload KML File" button
2. Upload the map you have or have created in step 2.1
3. A csv file has been downloaded automatically that you can easily plug into
Google Ads Editor.

### 2.4. Upload the radius targeting settings to Google Ads

1. Visit the [Google Ads UI](https://ads.google.com)
2. Navigate to "Locations" menu
3. Select "Radius"
4. Enter the output you got from this tool, make sure you use comma between lat
and lng

Alternatively you can use the Google Ads Editor to upload the downloaded csv
file

Other Google Advertising products guides are coming soon.

## 3. Changes to the code

* **[Required] Minimum change is adding the Maps API Key for your cloud project.**
* [Optional] You could adjust the project parameters to match your project the
best.
* [Optional] You could change the format of the csv file output to match
different Ads Product requirements.
* [Optional] You could change the input format of the uploaded format (i.e. csv)
This will require a bigger change as the parsing of the given kml format won’t
work.





