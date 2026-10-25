const form = document.getElementById("search-form");
const input = document.getElementById("word-input");
const errorMessage = document.getElementById("error");
const result = document.getElementById("result");
const savedList = document.getElementById("saved-list");

const API_URL = "https://freedictionaryapi.com/api/v1/entries/en/";

let savedWords = [];
let currentWord = "";

// Form submission: stop the page reload and search for the typed word
form.addEventListener("submit", (event) => {
  event.preventDefault();
  searchWord(input.value.trim());
});

// Fetch the word from the API and show it, or show an error
async function searchWord(word) {
  errorMessage.textContent = "";

  if (word === "") {
    errorMessage.textContent = "Please enter a word.";
    return;
  }

  try {
    const entry = await fetchEntry(word);

    if (!entry) {
      result.classList.add("hidden");
      errorMessage.textContent = `Word "${word}" not found.`;
      return;
    }

    showWord(entry);
  } catch (error) {
    // fetch fails (or the response is invalid) when the API is down or unreachable
    result.classList.add("hidden");
    errorMessage.textContent = "Could not reach the dictionary service. Please try again in a moment.";
  }
}

// Ask the v1 API for a word and convert its shape into the shape showWord() expects
async function fetchEntry(word) {
  const response = await fetch(API_URL + encodeURIComponent(word));
  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  if (!Array.isArray(data.entries) || data.entries.length === 0) {
    return null;
  }

  return {
    word: data.word,
    phonetic: firstPhonetic(data.entries),
    phonetics: [],
    meanings: data.entries.map((entry) => ({
      partOfSpeech: entry.partOfSpeech,
      synonyms: entry.synonyms || [],
      definitions: (entry.senses || []).map((sense) => ({
        definition: sense.definition,
        example: sense.examples && sense.examples[0],
        synonyms: sense.synonyms || [],
      })),
    })),
  };
}

function firstPhonetic(entries) {
  for (const entry of entries) {
    const phonetic = (entry.pronunciations || []).find((p) => p.type === "ipa" && p.text);
    if (phonetic) {
      return phonetic.text;
    }
  }
  return "";
}

// Build the result on the page
function showWord(entry) {
  currentWord = entry.word;
  result.innerHTML = "";
  result.classList.remove("hidden");

  const title = document.createElement("h2");
  title.textContent = entry.word;
  result.appendChild(title);

  const pronunciation = document.createElement("p");
  pronunciation.textContent = entry.phonetic || "";
  result.appendChild(pronunciation);

  // Audio pronunciation, if the API has one
  const audioInfo = entry.phonetics.find((p) => p.audio);
  if (audioInfo) {
    const audio = document.createElement("audio");
    audio.controls = true;
    audio.src = audioInfo.audio;
    result.appendChild(audio);
  }

  // Part of speech, definition, example and synonyms
  entry.meanings.forEach((meaning) => {
    const partOfSpeech = document.createElement("p");
    partOfSpeech.className = "part-of-speech";
    partOfSpeech.textContent = meaning.partOfSpeech;
    result.appendChild(partOfSpeech);

    const firstDefinition = meaning.definitions[0];

    const definition = document.createElement("p");
    definition.textContent = firstDefinition.definition;
    result.appendChild(definition);

    if (firstDefinition.example) {
      const example = document.createElement("p");
      example.className = "example";
      example.textContent = `Example: ${firstDefinition.example}`;
      result.appendChild(example);
    }

    if (meaning.synonyms.length > 0) {
      const synonyms = document.createElement("p");
      synonyms.textContent = `Synonyms: ${meaning.synonyms.join(", ")}`;
      result.appendChild(synonyms);
    }
  });

  const saveButton = document.createElement("button");
  saveButton.textContent = "Save word";
  saveButton.addEventListener("click", saveWord);
  result.appendChild(saveButton);

  // Highlight the card if this word was already saved
  result.classList.toggle("saved", savedWords.includes(currentWord));
}

// Add the current word to the saved list and highlight the card
function saveWord() {
  if (!savedWords.includes(currentWord)) {
    savedWords.push(currentWord);

    const item = document.createElement("li");
    item.textContent = currentWord;
    savedList.appendChild(item);
  }

  result.classList.add("saved");
}
