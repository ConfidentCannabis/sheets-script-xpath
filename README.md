# sheets-script-xpath
Very simple XPath XML parsing in Google Sheet Script


Adds simple XPath XML parsing to google scripts. Essentially allows
you to use the xpath notation that works in the IMPORTXML formula but from
script code instead.

NOTE: this is a GOOGLE SCRIPT library - this WILL NOT WORK outside of
google scripts because it uses the apps script XML Service
https://developers.google.com/apps-script/reference/xml-service/

Usage:

  In your script, go to Resources -> Libraries then enter the following
  Project Key or Script ID in the 'Find a Library' box.

  Project Key: M1YVJTfv66XpF5AoIeE9zsAopJxr71Kma
  Script ID: 1EyZK520ihKS4JWE1B47Ra0fU4B4m9vAHX0FWMZ50xNUJsU_R9VRIsqf3

  Pick a version and the functions will be available in your script using the
  Identifier you specify as a module name (defaults to XPathXMLParsing).


Example:

    <xml>
      <foo>
        <bar>
          <baz what='wrong'>thing1</baz>
          <baz what='test'>thing2</baz>
        </bar>
      </foo>
      <fizz>buzz</fizz>
     </xml>

    var xml = readRemoteXML('https://test-xml-file.xml');

    var simple = xPath('fizz', xml);
    simple; // 'fizz'

    var list_values = xPath('foo/bar//baz', xml);
    list_values; // ['thing1', 'thing2']

    var attribute_after_list = xPath('foo/bar//baz[1]/@what', xml);
    attribute_after_list; // test
