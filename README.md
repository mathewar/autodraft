# autodraft
Automatically draft replies in Gmail using OpenAI GPT

## How to use

1. Open [http://script.google.com ](https://script.google.com/) and create a new script
2. Set up triggers to have it call the main function (draftWithGpt) once an hour or daily if you prefer
3. You'll see your emails labeled with a new label called 'autodrafted' after it's been processed. Remove the label if you want it to be re-drafted again.

## How to customize (if you're not Samuel L Jackson)

Right now the variables at the top have an empty API key. You'l need to set it with your Open AI API key (https://platform.openai.com/api-keys). You can also update the variable name below for yourself and any biographical information about yourself that will be part of the prompt.

```
var autodraftedLabel = "autodrafted"
var name = "Samuel Leroy Jackson is an American film and television actor and film producer. After Jackson became involved with the Civil Rights Movement, he moved on to acting in theater at Morehouse College, and then films."
var API_KEY = "INSERT_OPENAI_API_KEY_HERE"
```

Enjoy! Feedback welcome at (owner of this repo) at gmail.com
