/**
<xml>
    <child>
        <grandchild>grandchildcontent</grandchild>
      <item>
          <value blah="1">foo</value>
      </item>
      <item>
          <value blah="2">bar</value>
      </item>
      <item>
          <value blah="3">baz</value>
      </item>
    </child>
</xml>
*/
function runTests() {
  var url = 'https://raw.githubusercontent.com/ConfidentCannabis/sheets-script-xpath/master/testxml.xml';
  var xml = readRemoteXML(url);

  var root = xml.getRootElement();

  var tests = [
    ['child/grandchild', 'grandchildcontent'],
    ['child/item[0]/value', 'foo'],
    ['child/item[1]/value', 'bar'],
    ['child/item[2]/value/@blah', '3'],
    ['child//item/value/@blah', ['1', '2', '3']]
  ];

  for (var i = 0, n = tests.length; i < n; i++) {
    var test = tests[i];
    var result = xPath(test[0], xml);
    var expected = test[1];
    var different = false;

    // if array, check that each item matches, in order
    if (Array.isArray(result)) {
      for (var i = 0, n = result.length; i < n; i++) {
        if (result[i] !== expected[i]) {
          different = true;
          break;
        }
      }
    } else {
      different = result !== expected;
    }

    // TODO: show test results visually instead of just in logs
    if (different) {
      Logger.log('TEST FAILED!');
      Logger.log('Expected: ' + test[1]);
      Logger.log('Found: ' + result);
    } else {
      Logger.log('Passed - ' + test[0]);
    }
  }
}
