var autodraftedLabel = "autodrafted"

// Change this to match who you are.
var name = "Samuel Leroy Jackson is an American film and television actor and film producer. " + 
  "After Jackson became involved with the Civil Rights Movement, he moved on to acting " + 
  "in theater at Morehouse College, and then films."

// Add your GEMINI_API_KEY here. Verify below that the code doesn't do anything with it you don't want it to!
var GEMINI_API_KEY = "INSERT_GEMINI_API_KEY_HERE"

// Optional: Specify a Google Doc ID to load personal context dynamically.
var CONTEXT_DOC_ID = "";

// Enable or disable Google Calendar integration.
var enableCalendarIntegration = true;

function draftWithGemini() {
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

  // Initialize personalContext with the default 'name'
  var personalContext = name;

  // Check if CONTEXT_DOC_ID is set and attempt to load context from Google Doc
  if (CONTEXT_DOC_ID && CONTEXT_DOC_ID.trim() !== "") {
    try {
      var doc = DocumentApp.openById(CONTEXT_DOC_ID);
      var docText = doc.getBody().getText();
      if (docText && docText.trim() !== "") {
        personalContext = docText.trim();
        Logger.log("Successfully loaded context from Google Doc ID: " + CONTEXT_DOC_ID);
      } else {
        Logger.log("Google Doc ID " + CONTEXT_DOC_ID + " was found but is empty. Using default context.");
      }
    } catch (e) {
      Logger.log("Error loading context from Google Doc ID: " + CONTEXT_DOC_ID + ". Error: " + e.message + ". Using default context.");
    }
  }

  var calendarInfo = ""; // Initialize calendarInfo
  if (enableCalendarIntegration) {
    var calendarCsv = getCalendarEvents();
    // Check if calendarCsv is not empty and not the "no events" message before including it
    if (calendarCsv && calendarCsv.trim() !== "" && calendarCsv.indexOf("No upcoming events") === -1) {
      calendarInfo = "User's Calendar (next 30 days):\n" + calendarCsv + "\n\n";
    }
  }

  var preamble = calendarInfo + "You are a helpful personal assistant for " + personalContext +
    ". You received the email below. If a reply is required, generate a draft reply to use. " + 
    "If a reply is not needed, respond with ***NO REPLY*** instead. \n";
  var userPrompt = "Subject : " + subject + "\n\n" + "Received on : " + date + "\n\n" + text;

  var payload = {
    contents: [
      { "role": "user", "parts": [{ "text": preamble }] }, // System prompt as first user message
      { "role": "user", "parts": [{ "text": userPrompt }] }  // Actual user prompt
    ],
    generationConfig: {
      "maxOutputTokens": 600,
      "temperature": 0.7,
      "candidateCount": 1
    }
  };

  // Make a POST request to Gemini API
  var apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" + GEMINI_API_KEY;

  var response = UrlFetchApp.fetch(
    apiUrl,
    {
      method: "POST",
      contentType: 'application/json',
      payload: JSON.stringify(payload)
    }
  );
  var data = JSON.parse(response.getContentText());
  // Ensure candidates and parts exist before trying to access them
  if (data.candidates && data.candidates.length > 0 &&
      data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
    var completedText = data.candidates[0].content.parts[0].text;
  } else {
    Logger.log("Error: Unexpected response structure from Gemini API or no content generated.");
    Logger.log("Response data: " + JSON.stringify(data));
    return; // Exit if the response is not as expected
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

function getCalendarEvents() {
  var now = new Date();
  var thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(now.getDate() + 30);
  var calendar = CalendarApp.getDefaultCalendar();
  var events = calendar.getEvents(now, thirtyDaysFromNow);
  var csvData = "Date,Start Time,End Time,Name,Description,Participants,Location\n"; // Header

  if (events.length === 0) {
    return "No upcoming events in the next 30 days.\n";
  }

  for (var i = 0; i < events.length; i++) {
    var event = events[i];
    var title = event.getTitle();
    var startTime = event.getStartTime();
    var endTime = event.getEndTime();
    var description = event.getDescription();
    var guests = event.getGuestList().map(function(guest) { return guest.getEmail(); }).join(", ");
    var location = event.getLocation();

    // Date formatting
    var eventDate = startTime.getFullYear() + "-" + ("0" + (startTime.getMonth() + 1)).slice(-2) + "-" + ("0" + startTime.getDate()).slice(-2);
    // Time formatting
    var eventStartTime = ("0" + startTime.getHours()).slice(-2) + ":" + ("0" + startTime.getMinutes()).slice(-2);
    var eventEndTime = ("0" + endTime.getHours()).slice(-2) + ":" + ("0" + endTime.getMinutes()).slice(-2);

    // Clipping text
    var clipText = function(text, maxLength) {
      if (!text) return "";
      if (text.length > maxLength) {
        return text.substring(0, maxLength - 3) + "...";
      }
      return text;
    };

    var clippedTitle = clipText(title, 100);
    var clippedDescription = clipText(description, 100);
    var clippedGuests = clipText(guests, 100); // Assuming guest list might also be very long
    var clippedLocation = clipText(location, 100);

    csvData += eventDate + "," + eventStartTime + "," + eventEndTime + "," +
               clippedTitle + "," + clippedDescription + "," +
               clippedGuests + "," + clippedLocation + "\n";
  }
  return csvData;
}
