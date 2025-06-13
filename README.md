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

Enjoy! Feedback welcome at (owner of this repo) at gmail.com
