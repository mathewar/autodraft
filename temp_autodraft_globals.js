var autodraftedLabel = "autodrafted";

function doesThreadHaveDrafts(thread) {
  var hasLabel = thread.getLabels().some(function(label) {
    return label.getName() === autodraftedLabel;
  });
  return hasLabel;
}

// Add a log to confirm this part is loaded
console.log("temp_autodraft_globals.js loaded.");
