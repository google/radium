// Copyright 2020 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Sends an HTTP get request
 * @returns {string} HTTP get response in HTML templated format
 */
function doGet() {
    const htmlTemplate = HtmlService.createTemplateFromFile('Page');
    return htmlTemplate.evaluate()
        .setTitle('Project Radium')
        .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  }

  /**
   * Parses xml text into a JSON object using XmlService.parse
   * @param {string} xmlText The xml text to parse.
   * @returns {!Object} The parsed element in json format.
   */
  function parseXml(xmlText) {
    // Replace 0.0 coordinates by 0
    // Polygons with 0.0 coordinates are not correctly processed
    const re = /([^0-9])(0\.0)([^0-9])/g;
    xmlText = xmlText.replace(re, (match, p1, p2, p3, offset, string) => {
      return `${p1}0${p3}`
    });

    const doc = XmlService.parse(xmlText);
    const result = {};
    const root = doc.getRootElement();
    result[root.getName()] = elementToJSON(root);
    return result;
  }

  /**
   * Converts an XmlService element to a JSON object
   * @param {!XmlService.Element} element The element to parse.
   * @returns {!Object} The parsed element.
   */
  function elementToJSON(element) {
    const result = {};
    element.getAttributes().forEach(
        (attribute) => result[attribute.getName()] = attribute.getValue());
    element.getChildren().forEach(function(child) {
      const key = child.getName();
      const value = elementToJSON(child);
      if (result[key]) {
        if (!(result[key] instanceof Array)) {
          result[key] = [result[key]];
        }
        result[key].push(value);
      } else {
        result[key] = value;
      }
    });
    if (element.getText()) {
      result['Text'] = element.getText();
    }
    return result;
  }

/**
 * Auxiliary function to update only modified values in the final Spreadsheet
 * It converts a list of locations (rows of the trix) into a Map of locations,
 * where the "key" is the location name and the values are as follows:
 *
 *  - radius: radius of Radius Targeting settings
 *  - lat: latitude of the center of the Radius Targeting
 *  - lng: longitude of the center of the Radius Targeting
 *  - location: settings using the format (distance:latitude:longitude)
 *
 * @param {!Array<string>} values Locations as a list of rows
 * @returns {!Object} The map of locations.
 */
function listToMap(values) {
  var valuesMap = {};

  values.map( value => {
    valuesMap[value[0]] = {
      'radius': value[1],
      'lat': value[2],
      'lng': value[3],
      'location': value[4]
    }
  });

  return valuesMap;
}

/**
 * Auxiliary function to update only modified values in the final Spreadsheet
 * It converts a map of locations into a list of locations, to overwrite
 * the rows of the final Spreadsheet
 *
 * @param {!Object} valuesMap The map of locations.
 * @returns {!Array<string>} Locations as a list to be inserted in the trix
 */
function mapToList(valuesMap) {
  var values = [];
  Object.keys(valuesMap).forEach( key => {
    var data = valuesMap[key];
    values.push([key, data.radius, data.lat, data.lng, data.location]);
  });

  return values;
}


/**
 * Update a list of location targeting settings with the new location settings
 *
 * @param {!Array<string>} sheetValues current location targetings to be updated
 * @param {!Object} locationsMap New location targeting to be updated
 * @param {!string} radiusUnit Unit for the Radius Targeting settings
 * @returns {!Array<string>} Updated location targetings as a list of values
 */
function updateSheetValues(sheetValues, locationsMap, radiusUnit) {
  // Convert location values into a map of locations,
  // to create or update the new ones
  let sheetValuesMap = listToMap(sheetValues);

  Object.keys(locationsMap).forEach(key => {
    const locationData = locationsMap[key];
    const selectedCircle = locationData[locationData.selected];
    const radius = selectedCircle.radius;
    const lat = selectedCircle.center.lat;
    const lng = selectedCircle.center.lng;

    // Create or update location targeting settings
    sheetValuesMap[key] = {
      'radius': selectedCircle.radius,
      'lat': selectedCircle.center.lat,
      'lng': selectedCircle.center.lng,
      'location': `(${radius}${radiusUnit}:${lat}:${lng})`
    }
  });

  // Return location map converted into values to update the Spreadsheet
  return mapToList(sheetValuesMap);
}

/**
 * Export the location targeting settings into the Spreadsheet.
 * It reads the contents of the Spreadsheet to overwrite, if existing, the
 * desired targeting settings of the Business Targeting Areas of the KML File.
 * The rest of the locations in the Spreadsheet will not be modified
 *
 * @param {!string} spreadsheetID ID of the Spreadsheet to store the targeting
 * @param {!Object} locationsMap Locations data to be stored in the Spreadsheet
 * @param {!string} radiusUnit Unit for the Radius Targeting settings
 */
function exportToSpreadsheet(spreadsheetID, locationsMap, radiusUnit) {
  const ss = SpreadsheetApp.openById(spreadsheetID);
  const sheet = ss.getSheetByName("Locations");
  const lastRow = sheet.getLastRow();
  const lastColumn = sheet.getLastColumn();
  let sheetValues = [];

  // Get trix location values, if not empty
  if (lastRow > 1) {
    sheetValues = sheet.getRange(2, 1, lastRow - 1, lastColumn).getValues();
  }

  // Update current sheet values with the new location settings
  sheetValues = updateSheetValues(sheetValues, locationsMap, radiusUnit);

  const range = sheet.getRange(2, 1, sheetValues.length, sheet.getLastColumn());
  range.setValues(sheetValues);
}
