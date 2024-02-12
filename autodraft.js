var autodraftedLabel = "autodrafted"

// Change this to match who you are.
var name = "Samuel Leroy Jackson is an American film and television actor and film producer. After Jackson became involved with the Civil Rights Movement, he moved on to acting in theater at Morehouse College, and then films."

// Add your API_KEY here for OPENAI. Verify below that the code doesn't do anything with it you don't want it to! 
var API_KEY = "INSERT_OPENAI_API_KEY_HERE"

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

  var preamble = "You are a helpful personal assistant for " + name + ". You received the email below. If a reply is required, generate a draft reply to use. If a reply is not needed, respond with ***NO REPLY*** instead. \n"
  var prompt = "Subject : " + subject + "\n\n" + "Received on : " + date + "\n\n" + text;

  var payload = {
    messages : [
      {"role": "system", "content": preamble},
      {"role": "user", "content": prompt},
    ],
    "max_tokens": 600,
    "temperature": 0.7,
    "n": 1,
    "model" : "gpt-4"
  };

  // Make a get request to OpenAI API
    var response = UrlFetchApp.fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        contentType : 'application/json',
        payload: JSON.stringify(payload),
        headers: {
          Authorization: "Bearer " + API_KEY
        }
      }
    );
  var data = JSON.parse(response.getContentText());
  //var completedText = data.choices[0].text;
  var completedText = data.choices[0].message.content

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
