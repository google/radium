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
