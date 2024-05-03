const words = `melancholy serendipity ephemeral mellifluous obfuscate nebulous vicissitudes perfidious labyrinthine quixotic perspicacious reticent cacophony incendiary prosaic garrulous discombobulate penumbra languorous quotidian mellotron diaphanous ineffable pulchritude obstreperous verisimilitude plenitude effulgent inchoate sibilant euphonious ethereal juxtaposition ambivalence chiaroscuro idiosyncratic apotheosis pernicious proclivity disparate languid esoteric sagacious vociferous peregrination supercilious insidious obsequious recondite inexorable insouciant disingenuous intransigent pugnacious mendacious sycophant ubiquitous reprobate lugubrious platitudinous punctilious recalcitrant soporific truculent unctuous voracious winsome anomalous belligerent copacetic demure effervescent elucidate maudlin nefarious rapscallion sanguine zeitgeist apocryphal bucolic capricious debacle egregious fecund halcyon iconoclast ignominious imbroglio impecunious ineluctable insuperable kowtow magnanimous nihilism sequitur onerous opulent palliate paradigm paragon parsimonious pejorative pellucid penchant pervasive plethora predilection preponderance pretentious probity propensity quagmire quintessential rancor rebuke redolent salient sardonic staid stentorian taciturn tenuous tirade truncate umbrage vacillate venerate veracity verbose vicarious virulent wane wistful xenophobia yoke zenith acumen balk burgeon cajole circumlocution cloying decry desultory dichotomy dissonant embroiled enervate eponymous equanimity evanescent exacerbate exculpate exigent extemporaneous facetious fatuous feckless feral foible fracas harbinger histrionic jocular ostentatious verdant ebullient`;
const wordsArray = words.match(/\S+/g);

// const { insert } = require("./app");
// const { insert } = require("./app");

const wordsCount = words.length;

const gameTime = 30 * 1000;
window.timer = null;
window.gameStart = null;
window.pauseTime = 0;

const keySound = new Audio("keyPressSound1.mp3");

let backSpaceCount = 0;
let ctrlBackSpaceCount = 0;
let expectedKeyNotPressed = 0;

let previousMargin = 0;

function addClass(el, name) {
  el.className += " " + name;
}
function removeClass(el, name) {
  el.className = el.className.replace(name, "");
}

function getRandomWords(numWords) {
  let randomWords = "";
  for (let i = 0; i < numWords; i++) {
    const randomIndex = Math.floor(Math.random() * wordsArray.length);
    randomWords += wordsArray[randomIndex] + " ";
  }
  // Trim any trailing space
  randomWords = randomWords.trim();
  return randomWords;
}

function formatWord(word) {
  let formattedWord = "";
  for (let i = 0; i < word.length; i++) {
    if (word[i] === " ") {
      formattedWord += '<span class="space">&nbsp;</span>'; // Use &nbsp; for space
      // formattedWord += ' ';
    } else {
      formattedWord += `<span class="letter">${word[i]}</span>`;
    }
  }
  return `<div class="word">${formattedWord}</div>`;
}

function newGame() {
  if (document.getElementById("game").classList.contains("over")) {
    // Game is already over, reset the game state
    document.getElementById("popup-container").style.display = "none";
    document.getElementById("game").classList.remove("over");
    backSpaceCount = 0;
    ctrlBackSpaceCount = 0;
    expectedKeyNotPressed = 0;
  }

  clearInterval(window.timer); // Clear any existing timer
  window.gameStart = null; // Reset game start time
  window.pauseTime = 0; // Reset pause time

  const words = document.getElementById("words");
  words.style.marginTop = previousMargin + "px";

  document.getElementById("words").innerHTML = "";
  for (let i = 0; i < 200; i++) {
    document.getElementById("words").innerHTML += formatWord(getRandomWords(1));
  }

  // Ensure all necessary classes are properly set for initial rendering
  document.querySelectorAll(".word").forEach((word) => {
    removeClass(word, "current");
  });

  document.querySelectorAll(".letter").forEach((letter) => {
    removeClass(letter, "current");
    removeClass(letter, "correct");
    removeClass(letter, "incorrect");
  });

  const firstWord = document.querySelector(".word");
  addClass(firstWord, "current");
  const firstLetter = firstWord.querySelector(".letter");
  if (firstLetter) {
    addClass(firstLetter, "current");
  }

  const cursor = document.getElementById("cursor");
  const currentCursorPosition = parseFloat(cursor.style.left); // Get the current left position of the cursor
  cursor.style.left = currentCursorPosition - 20 + "px"; // Move the cursor 20 pixels behind its initial position
  if (firstLetter) {
    cursor.style.top = firstLetter.getBoundingClientRect().top + 1 + "px";
    cursor.style.left = firstLetter.getBoundingClientRect().left + "px";
  }

  document.getElementById("info").innerHTML = gameTime / 1000 + "";

  // Ensure that the event listeners are correctly set up after starting a new game
  document.getElementById("game").addEventListener("keyup", gameKeyUpHandler);

  window.timer = null; // Ensure timer is reset
}

function getWpm() {
  const currentTime = new Date().getTime();
  const timeElapsedInSeconds = (currentTime - window.gameStart) / 1000;
  const totalCharactersTyped =
    document.querySelectorAll(".letter.correct").length;

  // Calculate words per minute based on total characters typed
  const wpm = totalCharactersTyped / 5 / (timeElapsedInSeconds / 60); // Assuming an average word length of 5 characters

  return wpm;
}

function playKeyPressSound() {
  // Play the sound
  keySound.currentTime = 0; // Rewind to the beginning in case it's already playing
  keySound.play();
}

function getAccuracy() {
  // const totalLettersTyped = document.querySelectorAll('.letter:not(.extra)').length;
  const totalLettersTyped = document.querySelectorAll(
    ".letter.correct, .letter.incorrect"
  ).length;

  // const correctLettersTyped =
  //   document.querySelectorAll(".letter.correct").length;

  const incorrectLettersTyped =
    document.querySelectorAll(".letter.incorrect").length;

  // Calculate the total correct letters (including correct letters and errors)
  const totalCorrectLetters =
    totalLettersTyped -
    incorrectLettersTyped -
    backSpaceCount -
    ctrlBackSpaceCount;

  // Calculate accuracy based on correct letters only
  let accuracy = (totalCorrectLetters / totalLettersTyped) * 100;

  if (accuracy < 0) {
    return 0;
  }

  return accuracy;
}

function gameOver() {
  clearInterval(window.timer);
  addClass(document.getElementById("game"), "over");
  const result = getWpm();
  const accuracy = getAccuracy();

  // insert("Vivashwan", "vivashwanghosh@gmail.com", accuracy);
  // document.getElementById('info').innerHTML = `WPM: ${result.toFixed(2)} - Accuracy: ${accuracy.toFixed(2)}`;

  // Display the popup container

  const popupContainer = document.getElementById("popup-container");
  popupContainer.style.display = "flex";

  // Populate the popup with results
  document.getElementById("accuracy").innerText = accuracy.toFixed(2);
  document.getElementById("wpm").innerText = result.toFixed(2);

  // Add event listener to the new game button in the popup
  document.getElementById("newGameBtnPopup").addEventListener("click", () => {
    // Hide the popup
    popupContainer.style.display = "none";
    // Start a new game
    newGame();
  });
}

const gameKeyUpHandler = (ev) => {
  // Your existing keyup event handling code here...
  const key = ev.key;
  const currentWord = document.querySelector(".word.current");
  const currentLetter = document.querySelector(".letter.current");
  const expected = currentLetter?.innerHTML || " ";
  const isLetter = key.length === 1 && key !== " ";
  const isSpace = key === " ";
  const isBackspace = key === "Backspace";
  const isFirstLetter = currentLetter === currentWord.firstChild;
  const isCtrlBackspace = ev.ctrlKey && key === "Backspace"; // Check for CTRL+Backspace

  const isLetterOrNumber = /^[a-zA-Z0-9 ]$/.test(key);

  if (isLetterOrNumber || isBackspace) {
    playKeyPressSound();
  }

  if (expected === " " && key !== expected) {
    expectedKeyNotPressed++;
  }

  if (document.querySelector("#game.over")) {
    return;
  }

  if (isBackspace) {
    backSpaceCount++; // Increment the count of backspace key presses
  }

  if (isCtrlBackspace) {
    ctrlBackSpaceCount++; // Increment the count of Ctrl+Backspace key presses
  }

  // Prevent spacebar from being the first key pressed only for the first word
  if (isFirstLetter && isSpace && !currentWord.previousSibling) {
    return;
  }

  if ((isBackspace || isCtrlBackspace) && isFirstLetter) {
    return; // Do nothing if at the first character of a word
  }

  if (!window.timer && isLetter) {
    window.gameStart = new Date().getTime();
    window.timer = setInterval(() => {
      const currentTime = new Date().getTime();
      const msPassed = currentTime - window.gameStart;
      const sPassed = Math.floor(msPassed / 1000);
      const sLeft = Math.max(0, Math.round(gameTime / 1000 - sPassed));
      if (sLeft === 0) {
        gameOver();
        return;
      }
      document.getElementById("info").innerHTML = sLeft + "";
    }, 100);
  }

  if (isLetter) {
    if (currentLetter) {
      addClass(currentLetter, key === expected ? "correct" : "incorrect");
      removeClass(currentLetter, "current");
      if (currentLetter.nextSibling) {
        addClass(currentLetter.nextSibling, "current");
      }
    } else {
      const incorrectLetter = document.createElement("span");
      incorrectLetter.innerHTML = key;
      incorrectLetter.className = "letter incorrect extra";
      currentWord.appendChild(incorrectLetter);
    }
  }

  if (isSpace) {
    // Check if the typed word matches the expected word completely
    const typedWord = currentWord.textContent.trim();
    const expectedWord = [...currentWord.querySelectorAll(".letter")]
      .map((letter) => letter.textContent)
      .join("");

    if (typedWord === expectedWord) {
      // Move to the next word
      removeClass(currentWord, "current");
      addClass(currentWord.nextSibling, "current");
      if (currentLetter) {
        removeClass(currentLetter, "current");
      }
      addClass(currentWord.nextSibling.firstChild, "current");
    } else {
      // Handle incorrect typing of the word (you can choose what you want to do here)
    }
    expectedKeyNotPressed = 0;
  }

  if (isBackspace) {
    if (expectedKeyNotPressed > 0) {
      const extraLetters = currentWord.querySelectorAll(".letter.extra");
      if (extraLetters.length > 0) {
        const lastExtraLetter = extraLetters[extraLetters.length - 1];
        currentWord.removeChild(lastExtraLetter);
        expectedKeyNotPressed--;
      }
    }
    if (currentLetter && isFirstLetter) {
      // make prev word current, last letter current
      removeClass(currentWord, "current");
      addClass(currentWord.previousSibling, "current");
      removeClass(currentLetter, "current");
      addClass(currentWord.previousSibling.lastChild, "current");
      removeClass(currentWord.previousSibling.lastChild, "incorrect");
      removeClass(currentWord.previousSibling.lastChild, "correct");
    }
    if (currentLetter && !isFirstLetter) {
      // move back one letter, invalidate letter
      removeClass(currentLetter, "current");
      addClass(currentLetter.previousSibling, "current");
      removeClass(currentLetter.previousSibling, "incorrect");
      removeClass(currentLetter.previousSibling, "correct");
    }
    if (!currentLetter) {
      addClass(currentWord.lastChild, "current");
      removeClass(currentWord.lastChild, "incorrect");
      removeClass(currentWord.lastChild, "correct");
    }
  }

  if (isCtrlBackspace) {
    const currentWord = document.querySelector(".word.current");
    const firstLetter = currentWord.querySelector(".letter:first-child");
    const cursor = document.getElementById("cursor");
    cursor.style.top = firstLetter.getBoundingClientRect().top + 2 + "px";
    cursor.style.left = firstLetter.getBoundingClientRect().left + "px";
    // Reset classes for letters in the current word
    const lettersInWord = currentWord.querySelectorAll(".letter");
    lettersInWord.forEach((letter) => {
      letter.classList.remove("correct", "incorrect", "current");
    });
    firstLetter.classList.add("current");
    return; // Exit the function after handling CTRL+Backspace
  }

  // move lines / words
  if (currentWord.getBoundingClientRect().top > 345) {
    const words = document.getElementById("words");
    const margin = parseInt(words.style.marginTop || "0px");
    previousMargin += margin;
    words.style.marginTop = margin - 62 + "px";
  }

  // move cursor
  const nextLetter = document.querySelector(".letter.current");
  const nextWord = document.querySelector(".word.current");
  const cursor = document.getElementById("cursor");
  cursor.style.top =
    (nextLetter || nextWord).getBoundingClientRect().top - 112.6 + "px";

  cursor.style.left =
    (nextLetter || nextWord).getBoundingClientRect()[
      nextLetter ? "left" : "right"
    ] -
    68 +
    "px";
};

document.getElementById("newGameBtn").addEventListener("click", newGame);

newGame();
