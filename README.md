# autodraft
Automatically draft replies in Gmail using Google's Gemini API

## How to use

1. Open [http://script.google.com ](https://script.google.com/) and create a new script.
2. Copy the content of `autodraft.js` into the script editor.
3. Set up triggers to have it call the main function (`draftWithGPT`) once an hour or daily if you prefer. (In `autodraft.js`, `draftWithGPT` is the function that initiates the drafting process).
4. You'll see your emails labeled with a new label called 'autodrafted' after it's been processed. Remove the label if you want it to be re-drafted again.

## How to customize (if you're not Samuel L Jackson)

The script now uses Google's Gemini API (specifically the `gemini-1.5-pro-latest` model by default) to generate draft replies. You'll need to configure the API keys at the top of the `autodraft.js` script.

**API Keys:**

*   `GEMINI_API_KEY`: **This is now the primary API key you need to set.** You can obtain a Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
*   `API_KEY`: This variable was previously used for the OpenAI API. If you are only using Gemini (which is the current default behavior of the script), you may not need to set this. It's kept for now for users who might have older versions or wish to adapt the script back.

You can also update the variable `name` below for yourself and any biographical information about yourself that will be part of the prompt.

```javascript
var autodraftedLabel = "autodrafted"
// Change this to match who you are.
var name = "Samuel Leroy Jackson is an American film and television actor and film producer. " +
  "After Jackson became involved with the Civil Rights Movement, he moved on to acting " +
  "in theater at Morehouse College, and then films."

// For OpenAI API (Legacy - not used by default with Gemini)
var API_KEY = "INSERT_OPENAI_API_KEY_HERE"
// For Gemini API (Primary key for current version)
var GEMINI_API_KEY = "INSERT_GEMINI_API_KEY_HERE";
```

## Running Tests

The project includes a test suite to verify some of its functionality. The tests are located in the `tests.js` file.

To run the tests:

1.  **Project Setup**: Ensure both `autodraft.js` and `tests.js` are part of the same Google Apps Script project. You can do this by:
    *   Creating a new script file in your Apps Script project named `tests` (or similar).
    *   Copying the entire content of the `tests.js` file from this repository into that new script file.
2.  **Open Editor**: In Google Apps Script, make sure you have the project open.
3.  **Select Test Function**: From the function dropdown menu at the top of the editor (it might say "Select function"), choose `runAllTests`.
4.  **Execute**: Click the "Run" button (it looks like a play icon ▶️).
5.  **View Results**: The test results will be logged to the Google Apps Script "Execution log". You can view this by:
    *   Going to "View" > "Logs".
    *   Or using the keyboard shortcut (e.g., Ctrl+Enter on Windows, Cmd+Enter on Mac).

The log will show a summary of how many tests passed and details for any failed tests.

Enjoy! Feedback welcome at (owner of this repo) at gmail.com
