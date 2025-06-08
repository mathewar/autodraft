// Mock Logger for local testing (if not in Google Apps Script environment)
// In Google Apps Script, Logger is a built-in global object.
if (typeof Logger === 'undefined') {
  var Logger = {
    log: function(message) {
      console.log(message); // Output to console for Node.js environment
    }
  };
}

// Global mock for GmailApp
// This mock assumes 'autodraftedLabel' is globally available from autodraft.js
const MockGmailApp = {
  getUserLabelByName: function(name) {
    // 'autodraftedLabel' would be from the global scope provided by temp_autodraft_globals.js in the combined file
    if (typeof autodraftedLabel !== 'undefined' && name === autodraftedLabel) {
      return {
        getName: function() {
          return name;
        },
      };
    }
    return null;
  },
  createLabel: function(name) {
    Logger.log('MockGmailApp.createLabel called with: ' + name);
    return {
      getName: function() {
        return name;
      }
    };
  }
};
var GmailApp = MockGmailApp;


function createMockThread(labelsArray = []) {
  const currentLabels = [].concat(labelsArray);
  return {
    getLabels: function() {
      return currentLabels;
    },
    addLabel: function(label) {
      currentLabels.push(label);
      Logger.log('MockThread.addLabel called with label: ' + label.getName());
    }
  };
}

function testDoesThreadHaveDraftsCases() {
  const results = [];
  // 'autodraftedLabel' and 'doesThreadHaveDrafts' are expected to be globally defined
  // when this script is combined with temp_autodraft_globals.js
  const mockAutodraftedLabelObject = GmailApp.getUserLabelByName(autodraftedLabel);
  const threadWithAutodraftLabel = createMockThread(mockAutodraftedLabelObject ? [mockAutodraftedLabelObject] : []);
  let actual1 = doesThreadHaveDrafts(threadWithAutodraftLabel);
  results.push({
    name: "doesThreadHaveDrafts - Label present",
    passed: actual1 === true,
    expected: true,
    actual: actual1
  });

  const threadWithNoLabels = createMockThread([]);
  let actual2 = doesThreadHaveDrafts(threadWithNoLabels);
  results.push({
    name: "doesThreadHaveDrafts - No labels",
    passed: actual2 === false,
    expected: false,
    actual: actual2
  });

  const mockOtherLabelObject = { getName: function() { return "someOtherLabel"; } };
  const threadWithOtherLabel = createMockThread([mockOtherLabelObject]);
  let actual3 = doesThreadHaveDrafts(threadWithOtherLabel);
  results.push({
    name: "doesThreadHaveDrafts - Other label present",
    passed: actual3 === false,
    expected: false,
    actual: actual3
  });

  return results;
}

function runAllTests() {
  Logger.log("Starting tests..."); // This should now appear
  let testsPassedCount = 0;
  let totalTests = 0;

  const doesThreadHaveDraftsResults = testDoesThreadHaveDraftsCases();
  doesThreadHaveDraftsResults.forEach(function(result) {
    totalTests++;
    if (result.passed) {
      Logger.log("PASS: " + result.name);
      testsPassedCount++;
    } else {
      Logger.log("FAIL: " + result.name + " - Expected: " + result.expected + ", Actual: " + result.actual);
    }
  });

  Logger.log("--------------------");
  Logger.log("Test Summary: " + testsPassedCount + "/" + totalTests + " tests passed.");

  if (testsPassedCount === totalTests) {
    Logger.log("All tests passed successfully!");
  } else {
    Logger.log((totalTests - testsPassedCount) + " test(s) failed.");
  }
}

Logger.log("tests.js script loaded and parsed.");

// Conditionally run tests if the necessary globals from autodraft.js are present.
// This will be true when combined with temp_autodraft_globals.js.
if (typeof autodraftedLabel !== 'undefined' && typeof doesThreadHaveDrafts !== 'undefined') {
  Logger.log("Found globals from autodraft.js. Running tests...");
  runAllTests();
} else {
  Logger.log("Cannot run tests automatically: autodraftedLabel or doesThreadHaveDrafts is not defined globally. Load autodraft.js first or run manually in Apps Script.");
}
