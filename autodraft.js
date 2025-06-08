var autodraftedLabel = "autodrafted"

// Change this to match who you are.
var name = "Samuel Leroy Jackson is an American film and television actor and film producer. " + 
  "After Jackson became involved with the Civil Rights Movement, he moved on to acting " + 
  "in theater at Morehouse College, and then films."

// For OpenAI API
// Add your API_KEY here for OPENAI. Verify below that the code doesn't do anything with it you don't want it to! 
var API_KEY = "INSERT_OPENAI_API_KEY_HERE"

// For Gemini API
var GEMINI_API_KEY = "INSERT_GEMINI_API_KEY_HERE";

function draftWithGPT() {
  var threads = GmailApp.search('category:primary');
  var thread = threads[0]
  var message = thread.getMessages()[0];
  var text = message.getPlainBody();
  var subject = message.getSubject();
  var date = message.getDate().toLocaleString();
  // Don't bother to draft if there are drafts already.
  if (doesThreadHaveDrafts(thread)) {
    Logger.log("Already autodrafted : " + subject)
    return
  }

  var preamble = "You are a helpful personal assistant for " + name + 
    ". You received the email below. If a reply is required, generate a draft reply to use. " + 
    "If a reply is not needed, respond with ***NO REPLY*** instead. \n\n" // Added newline for better separation
  var emailContent = "Subject : " + subject + "\n\n" + "Received on : " + date + "\n\n" + text;
  var fullPrompt = preamble + emailContent;

  var geminiPayload = {
    "contents": [{
      "parts":[{
        "text": fullPrompt
      }]
    }],
    "generationConfig": {
      "temperature": 0.7,
      "maxOutputTokens": 600
    }
  };

  var geminiApiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=" + GEMINI_API_KEY;

  // Make a POST request to Gemini API
  var response = UrlFetchApp.fetch(
    geminiApiUrl,
    {
      method: "POST",
      contentType : 'application/json',
      payload: JSON.stringify(geminiPayload)
      // No Authorization header needed as API key is in the URL
    }
  );

  var data = JSON.parse(response.getContentText());
  // Typical Gemini response structure: data.candidates[0].content.parts[0].text
  // Adding checks for safety before accessing nested properties.
  var completedText = "";
  if (data.candidates && data.candidates.length > 0 &&
      data.candidates[0].content && data.candidates[0].content.parts &&
      data.candidates[0].content.parts.length > 0) {
    completedText = data.candidates[0].content.parts[0].text;
  } else {
    Logger.log("Error: Unexpected response structure from Gemini API or no content generated.");
    Logger.log("Response Data: " + JSON.stringify(data));
    return; // Exit if no valid text found
  }

  // Don't send emails if a reply is not needed.
  if (completedText.indexOf("NO REPLY") > -1) {
    Logger.log("No reply needed for : " + subject + " : " + completedText)
    return;
  }

  // Create a draft reply
  thread.createDraftReply(completedText);
  addLabelToThread(thread);
  Logger.log("Created draft for subject: " + subject)
}

function addLabelToThread(thread) {
  // Get the label, create it if it doesn't exist
  var label = GmailApp.getUserLabelByName(autodraftedLabel);
  if (!label) {
    label = GmailApp.createLabel(autodraftedLabel);
  }

  // Add the label to the thread
  thread.addLabel(label);
}

function doesThreadHaveDrafts(thread) {
  // Check if any label of the thread is "autodrafted"
  var hasLabel = thread.getLabels().some(function(label) {
    return label.getName() === autodraftedLabel;
  });
  return hasLabel;
}
