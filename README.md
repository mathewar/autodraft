# autodraft
Automatically draft replies in Gmail using Google Gemini

## How to use

1. Open [http://script.google.com ](https://script.google.com/) and create a new script.
2. Copy the content of `autodraft.js` into the script editor.
3. Set up triggers to have it call the main function (`draftWithGPT`) once an hour or daily if you prefer. (In `autodraft.js`, `draftWithGPT` is the function that initiates the drafting process).
4. You'll see your emails labeled with a new label called 'autodrafted' after it's been processed. Remove the label if you want it to be re-drafted again.

Note: This script now uses the Google Gemini API (specifically `gemini-1.5-flash-latest`) and the request/response structure has been updated accordingly.

## How to customize (if you're not Samuel L Jackson)

Right now the variables at the top have an empty API key. You'll need to set it with your Google Gemini API key (you can get one from [Google AI Studio](https://aistudio.google.com/app/apikey)). You can also update the variable `name` below for yourself and any biographical information about yourself that will be part of the prompt.

```javascript
var autodraftedLabel = "autodrafted"
// Change this to match who you are.
var name = "Samuel Leroy Jackson is an American film and television actor and film producer. " +
  "After Jackson became involved with the Civil Rights Movement, he moved on to acting " +
  "in theater at Morehouse College, and then films."
// Add your GEMINI_API_KEY here.
var GEMINI_API_KEY = "INSERT_GEMINI_API_KEY_HERE"
```

### Dynamic Personal Context via Google Doc

The script can dynamically load your personal context (the biographical information used in the prompt) from a Google Document. This is useful if you want to update your context without editing the script directly.

1.  **Create a Google Doc**: Write your desired personal context into a Google Doc. This will be treated as plain text.
2.  **Get the Doc ID**: Open your Google Doc. The ID is the long string of characters in the URL between `/d/` and `/edit`. For example, if the URL is `https://docs.google.com/document/d/12345abcdefGHIJKLoopqrstuvwxyz67890/edit`, your Doc ID is `12345abcdefGHIJKLoopqrstuvwxyz67890`.
3.  **Set `CONTEXT_DOC_ID`**: In `autodraft.js`, find the line `var CONTEXT_DOC_ID = "";` and replace the empty string with your Google Doc ID.

    ```javascript
    // Optional: Specify a Google Doc ID to load personal context dynamically.
    var CONTEXT_DOC_ID = "YOUR_GOOGLE_DOC_ID_HERE";
    ```

**Behavior:**

*   If `CONTEXT_DOC_ID` is provided and the script can successfully access the document, its text content will be used as the personal context for drafting replies.
*   If `CONTEXT_DOC_ID` is left empty, or if the script encounters an error trying to access or read the document (e.g., incorrect ID, permissions issues), it will fall back to using the content of the hardcoded `name` variable as the context.

**Permissions Note:**
If you use this feature, the script will require permission to access your Google Docs. Google Apps Script will typically prompt you to grant these permissions the first time it tries to access the document. Ensure you grant these permissions if you want to use the dynamic context feature.

Enjoy! Feedback welcome at (owner of this repo) at gmail.com
