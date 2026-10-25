# Wordly

A tiny dictionary web app. Type a word, get its definition, pronunciation, example, and synonyms — then save the ones you like.

## Features

- Search any English word via the [Free Dictionary API](https://freedictionaryapi.com)
- Shows part of speech, definition, example sentence, and synonyms
- Displays IPA pronunciation and audio when available
- Save words to a list (highlighted in the UI)
- Friendly error messages for empty input, unknown words, and network failures
- Responsive layout for small screens

## Tech

Plain HTML, CSS, and JavaScript. No build step, no dependencies.

## Run it

Just open `index.html` in a browser. Or serve it locally:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page structure — search form, result area, saved list |
| `style.css` | Styling and responsive layout |
| `script.js` | Search logic, API calls, rendering, and saving |

## Notes

- Saved words live in memory only — they reset on page reload.
- The app depends on the Free Dictionary API being reachable.
