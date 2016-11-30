/**
 * Add simple XPath XML parsing to google scripts. Essentially be able to
 * use the xpath notation that works in the IMPORTXML formula but from
 * script code instead.
 *
 * NOTE: this is a GOOGLE SCRIPT library - this WILL NOT WORK outside of
 * google scripts because it uses the apps script XML Service
 * https://developers.google.com/apps-script/reference/xml-service/
 *
 * Usage:
 *
 *   In your script, go to Resources -> Libraries then enter the following
 *   Project Key or Script ID in the 'Find a Library' box.
 *
 *   Project Key: M1YVJTfv66XpF5AoIeE9zsAopJxr71Kma
 *   Script ID: 1EyZK520ihKS4JWE1B47Ra0fU4B4m9vAHX0FWMZ50xNUJsU_R9VRIsqf3
 *
 */

/**
 * Returns the value (or list of values) at the given path in
 * the given xmlFile
 *
 * Example:
 *
 *     <xml>
 *       <foo>
 *         <bar>
 *           <baz what='wrong'>thing1</baz>
 *           <baz what='test'>thing2</baz>
 *         </bar>
 *       </foo>
 *       <fizz>buzz</fizz>
 *      </xml>
 *
 *     var xml = readRemoteXML('https://test-xml-file.xml');
 *
 *     var simple = xPath('fizz', xml);
 *     simple; // 'fizz'
 *
 *     var list_values = xPath('foo/bar//baz', xml);
 *     list_values; // ['thing1', 'thing2']
 *
 *     var attribute_after_list = xPath('foo/bar//baz[1]/@what', xml);
 *     attribute_after_list; // test
 *
 */
function xPath(path, xmlFile) {
  var root = xmlFile.getRootElement();
  return xPathStep(path, root);
}


/**
 * Recursive path parsing - you probably want to use xPath instead of using
 * this function directly.
 */
function xPathStep(path, node) {
  // if node is an array, return the result for each entry
  if (Array.isArray(node)) {
    return node.map(function(singleNode) {
      return xPathStep(path, singleNode);
    });
  }

  if (!node) {
    return;
  }

  var nextNode, nodeValue;
  var paths = path.split('/');
  var firstChild = paths[0];
  var remainingPath = paths.slice(1).join('/');

  // if child ends with [\d] - find a list, return this index
  var indexMatch = firstChild.match(/(\w+)\[(\d+)\]/);
  var attributeMatch = firstChild.match(/@(\w+)/);

  if (indexMatch) {
    var tagName = indexMatch[1];
    var index = indexMatch[2];

    var children = node.getChildren(tagName);
    nextNode = children[index];
  } else if (firstChild === '') {
    // if another name is next, use as a matching tag (and remove from path)
    var tagName = '';
    if (paths.length > 1) {
      tagName = paths[1];
      remainingPath = paths.slice(2).join('/');
    }
    nextNode = node.getChildren(tagName);
  } else if (attributeMatch) {
    // @ means attribute
    var attributeName = attributeMatch[1];
    nodeValue = node.getAttribute(attributeName).getValue();
  } else {
    nextNode = node.getChild(firstChild);
  }

  var result;
  if (nodeValue) {
    result = nodeValue;
  } else if (remainingPath !== '') {
    result = xPathStep(remainingPath, nextNode);
  } else {
    result = nextNode.getText && nextNode.getText();
  }

  return result;
}


/**
 * Read a remote file at xmlFileUrl, parse it as xml, and
 * return an XMLService document object.
 */
function readRemoteXML(xmlFileUrl) {
  var content = UrlFetchApp.fetch(xmlFileUrl).getContentText();
  return XmlService.parse(content);
}
