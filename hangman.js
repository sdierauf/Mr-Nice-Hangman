/**
 * Stefan Dierauf 2014
 * JS implementation of EvilHangman
 */

var guessesbox = document.getElementById('guesses');
var submit = document.getElementById('guessbutton');
var guesschar = document.getElementById('guesschar');
var result = document.getElementById('result');
var alertbox = document.getElementById('alertbox');
var guessesleft = document.getElementById('guessesleft');
var debug = document.getElementById('debug');
var debugoutput = document.getElementById('output');
var header = document.getElementById('header');
var tryagain = document.getElementById('playagain');

Array.prototype.randomElement = function() {
  return this[Math.floor(Math.random() * this.length)];
};

/**
 * Manages the evil hangman game.
 * @param numguesses The number of guesses the user has.
 * @param length The length of the current word.
 */
function HangmanManager(numguesses, length) {
  this.guesscount = numguesses;  // Save the number of guesses.
  this.length = length;  // Save the word length.
  // Get all the words out of the global dictionary of a certain length.
  this.curDictionary = window.dictionary.filter(
      function (element) {
        return element.length == this.length;
      },
      this
    );
  this.guesses = [];  // Char array of the guessed letters.
  this.activePattern = "";  // The drawn pattern in the dom.
  for (var i = 0; i < this.length; i++) {
    if (i != 0) {
      this.activePattern += " ";
    }
    this.activePattern += "__";
  }
  result.innerHTML = this.activePattern;
  this.redraw();
}


/**
 * Takes a word, a letter, then builds a word family pattern out of the current
 * active pattern + the word. For example, if word = apple, letter = a, and the
 * activePattern is '__ p p __ __', returns 'a p p __ __'. Requires that the
 * passed word matches the activeFamily pattern.
 * @param word
 * @param letter
 * @return {string}
 */
HangmanManager.prototype.famPatternBuilder = function (word, letter) {
  var family = "";
  for (var j = 0; j < word.length; j++) {
    if (j != 0) {
      family += " ";
    }
    if (word.charAt(j) == letter) {
      family += letter;
    } else if (this.activePattern.indexOf(word.charAt(j)) != -1) {
      family += word.charAt(j);
    } else {
      family += "__";
    }
  }
  return family;
};


/**
 * @return {string} The active pattern.
 */
HangmanManager.prototype.getActivePattern = function () {
  return this.activePattern;
};


/**
 * @return {number} The number of guesses remaining.
 */
HangmanManager.prototype.getGuessCount = function () {
  return this.guesscount;
};


/**
 * @return {string} A formatted string of all the guessses.
 */
HangmanManager.prototype.getGuesses = function () {
  var string = "";
  for (var i = 0; i < this.guesses.length; i++) {
    string += this.guesses[i] + ", ";
  }
  return string;
};


/**
 * Takes a character and 'guesses' it against EvilHangman. Returns the number
 * of words in the dictionary that make a pattern with the largest set of
 * matching words.
 * @param {string} character
 * @return {number}
 */
HangmanManager.prototype.play = function (character) {
  var families = this.findFamilies(character);
  var largest = "unassigned";
  var keys = Object.keys(families);
  for (var i = 0; i < keys.length; i++) {
    if (largest == "unassigned" || families[keys[i]].length > families[largest].length) {
      largest = keys[i];
    }
  }
  var count = 0;
  for (var j = 0; j < largest.length; j++) {
    if (largest.charAt(j) == character) {
      count++;
    }
  }
  this.update(character, largest, families);
  this.redraw();
  return count;
};


/**
 * Updates the UI with the current state of the game.
 */
HangmanManager.prototype.redraw = function () {
  if (this.guesscount == 0) {
    if (this.activePattern.indexOf("_") > -1) {
      this.activePattern = this.curDictionary.randomElement();
    }
    result.classList.add("text-danger");
    header.innerHTML = "You lost!";
  }
  console.log(this.guesscount);
  guessesbox.innerHTML = this.getGuesses();
  result.innerHTML = this.activePattern;

  // Update debug view.
  if (debug.checked) {
    debugoutput.innerHTML = this.curDictionary;
  } else {
    debugoutput.innerHTML = "";
  }
  guessesleft.innerHTML = this.guesscount;
};


/**
 * Takes a letter and returns a map of all possible family patterns 
 * to an array of their matching words.
 * @param {string} letter
 * @return Map<{string}, Array<{String}>>
 */
HangmanManager.prototype.findFamilies = function(letter) {
  var families = {};
  for (var i = 0; i < this.curDictionary.length; i++) {
    var word = this.curDictionary[i];
    var famPattern = this.famPatternBuilder(word, letter);
    if (families[famPattern] == undefined) {
      families[famPattern] = Array(word);
    } else {
      families[famPattern].push(word);
    }
  }
  return families;
}


/**
 * 
 */
HangmanManager.prototype.update = function (letter, largest, families) {
  // If the active pattern didn't change with the new guess,
  // the letter was not part of it, so decrement guesscount.
  if (this.activePattern == largest) {
    this.guesscount--;
  }
  this.activePattern = largest;
  this.curDictionary = families[largest];
  this.guesses.push(letter);
};


/**
 * @return {Array<string>} the current set of words EvilHangman is
 * 'guessing' from.
 */
HangmanManager.prototype.words = function () {
  return this.curDictionary;
};


/**
 * @return {HangmanManager} a new EvilHangman game with a random
 * word length and guess amount.
 */
function HangmanGen () {
  var guesses = Math.floor((Math.random() * 3) + 5);
  var letters = Math.floor((Math.random() * 3) + 4);
  return new HangmanManager(guesses, letters);
};


var hangman = HangmanGen();


/**
 * Clicking debug should update the state to show the debug output
 */
debug.onclick = function () {
  hangman.redraw();
};


/**
 * Call submit on pressing the return key.
 */
window.onkeypress = function (event) {
  if (event.keyCode == 13) {
    submit.onclick();
  }
};



/**
 * Manage UI on a guess.
 */
submit.onclick = function () {
  if (hangman.getGuessCount() == 0) {
    // Reload the page to play a new game.
    location.reload();
  } else {
    if (guesschar.value.length == 1) {
      if (hangman.getGuesses().indexOf(guesschar.value.toLowerCase()) == -1) {
        alertbox.innerHTML = "";
        hangman.play(guesschar.value.toLowerCase());
      } else {
        alertbox.innerHTML = "You've already guessed that letter!";
      }
    } else {
      alertbox.innerHTML = "You forgot to enter a letter!";
    }
    guesschar.value = "";
    guesschar.focus();
  }
};


/**
 * Clicking the try again button should reload the page.
 */
tryagain.onclick = function () {
  location.reload();
};


/**
 * Focus on the guess input after a page load.
 */
window.onload = function () {
  guesschar.focus();
};


