# autodraft
Automatically draft replies in Gmail using Google Gemini

## How to use

1. Open [http://script.google.com ](https://script.google.com/) and create a new script.
2. Copy the content of `autodraft.js` into the script editor.
3. Set up triggers to have it call the main function (`draftWithGemini`) once an hour or daily if you prefer. (In `autodraft.js`, `draftWithGemini` is the function that initiates the drafting process).
4. You'll see your emails labeled with a new label called 'autodrafted' after it's been processed. Remove the label if you want it to be re-drafted.

Note: This script uses the Google Gemini API (`gemini-1.5-flash-latest`).

## How to customize

1.  **Set your API Key**:
    *   Obtain a Google Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
    *   In `autodraft.js`, find the line `var GEMINI_API_KEY = "INSERT_GEMINI_API_KEY_HERE";` and replace `"INSERT_GEMINI_API_KEY_HERE"` with your actual API key.

2.  **Update Personal Information**:
    *   In `autodraft.js`, modify the `name` variable to include your biographical information. This information is used to personalize the drafted replies.

```javascript
var autodraftedLabel = "autodrafted";

// Change this to match who you are.
var name = "YOUR_NAME_AND_BIOGRAPHICAL_INFORMATION_HERE";

// Add your GEMINI_API_KEY here.
var GEMINI_API_KEY = "INSERT_GEMINI_API_KEY_HERE";
```

3.  **(Optional) Dynamic Personal Context via Google Doc**:
    The script can dynamically load your personal context from a Google Document. This allows you to update your context without directly editing the script.
    *   **Create a Google Doc**: Write your desired personal context in a Google Doc.
    *   **Get the Doc ID**: From the Google Doc URL (e.g., `https://docs.google.com/document/d/YOUR_DOC_ID/edit`), copy the `YOUR_DOC_ID` part.
    *   **Set `CONTEXT_DOC_ID`**: In `autodraft.js`, find `var CONTEXT_DOC_ID = "";` and replace the empty string with your Google Doc ID.
        ```javascript
        // Optional: Specify a Google Doc ID to load personal context dynamically.
        var CONTEXT_DOC_ID = "YOUR_GOOGLE_DOC_ID_HERE";
        ```
    *   **Behavior**:
        *   If `CONTEXT_DOC_ID` is set and the document is accessible, its content will be used for personalization.
        *   Otherwise, the script will use the `name` variable's content.
    *   **Permissions**: Using this feature requires granting the script permission to access your Google Docs.

Enjoy! Feedback is welcome. Contact the repository owner via email.

## Google Calendar Integration
This script can integrate with your Google Calendar to provide context for email drafting.
- When enabled, it fetches events from your default calendar for the next 30 days.
- This calendar information is then formatted as CSV and included in the prompt sent to the AI.
- The CSV format is: `Date,Start Time,End Time,Name,Description,Participants,Location`.
- You can disable this feature by setting the `enableCalendarIntegration` variable in `autodraft.js` to `false`. By default, it is `true`.
