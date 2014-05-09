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

function HangmanManager(numguesses, thelength) {
  var curDictionary = stripDict(dictionary, thelength);
  
  var guesscount = numguesses;
  this.getGuessCount = function() { return guesscount };
  this.length = thelength;
  var guesses = [];
  this.getGuesses = function() {
    var string = "";
    for (var i = 0; i < guesses.length; i++) {
      string += guesses[i] + ", ";
    }
    return string;
  }
  //I don't understand js scope ;-;
  var getGuesses = function() {
    var string = "";
    for (var i = 0; i < guesses.length; i++) {
      string += guesses[i] + ", ";
    }
    return string;
  }
  
  this.callRedraw = function() {
    redraw();
  }
  
  var activePattern = "";
  for (var i = 0; i < this.length; i++) {
    if (i != 0) {
      activePattern += " ";
    }
    activePattern += "__";
  }
  result.innerHTML = activePattern;
  
  this.getActivePattern = function() { return activePattern };
  
  this.words = function() {
    return curDictionary;
  }
  
  this.play = function(character) {
    //guesscount--;
    var families = this.findFamilies(character);
    var largest = "unassigned";
    var keys = Object.keys(families);
    for (var i = 0; i < keys.length; i++) {
      //console.log(keys[i]);
      if (largest == "unassigned" || families[keys[i]].length > families[largest].length) {
        largest = keys[i];
      }
    }
    
    console.log("biggest was " + largest + " with " + families[largest]);
    
    var count = 0;
    for (var j = 0; j < largest.length; j++) {
      if (largest.charAt(j) == character) {
        count++;
      }
    }
    /*
if (count > 0) {
      this.guesses.push(character);
    }
*/
    
    update(character, largest, families);
    redraw();
    
    return count;
    
  }
  
  var redraw = function() {
  	if (guesscount == 0) {
    	if (activePattern.indexOf("_") > -1) {
	    	activePattern = curDictionary.randomElement();
    	}
      result.classList.add("text-danger");
      header.innerHTML = "You lost!";
    }
    console.log(guesscount);
    guessesbox.innerHTML = getGuesses();
    result.innerHTML = activePattern;
    
    if (debug.checked == true) {
      debugoutput.innerHTML = curDictionary;
    } else {
      debugoutput.innerHTML = "";
    }
    guessesleft.innerHTML = guesscount;
  }
  
  var update = function(letter, largest, families) {
    if (activePattern == largest) {
      guesscount--;
    }
    activePattern = largest;
    curDictionary = families[largest];
    guesses.push(letter);
  }
  
  this.findFamilies = function(letter) {
    var families = {};
    console.log(curDictionary.length);
    for (var i = 0; i < curDictionary.length; i++) {
      var word = curDictionary[i];
      //console.log(word);
      var famPattern = famPatternBuilder(word, letter);
      //console.log(famPattern);
      if (families[famPattern] == undefined) {
        families[famPattern] = Array(word);
      } else {
        //console.log("this happened");
        families[famPattern].push(word);
      }
    }
    return families;
  }
  
  var famPatternBuilder = function(word, letter) {
    var family = "";
    for (var j = 0; j < word.length; j++) {
      if (j != 0) {
        family += " ";
      }
      if (word.charAt(j) == letter) {
        family += letter;
      } else if (activePattern.indexOf(word.charAt(j)) != -1) {
        console.log("checked active pattern");
        family += word.charAt(j);
      } else {
        family += "__";
      }
    }
    return family;
  }
  
  redraw();
  
}

var stripDict = function(dict, num) {
  var newDict = [];
  for (var i = 0; i < dict.length; i++) {
    if (dict[i].length == num) {
      newDict.push(dict[i]);
    }
  }
  return newDict;
}

var hangmanGen = function() {
  var guesses = Math.floor((Math.random() * 3) + 5);
  var letters = Math.floor((Math.random() * 3) + 4);
  return new HangmanManager(guesses, letters);
}


var hangman = hangmanGen();

debug.onclick = function() {
  hangman.callRedraw();
}

window.onkeypress = function(event) {
  if (event.keyCode == 13) {
    submit.onclick();
  }
}


submit.onclick = function() {
  if (hangman.getGuessCount() == 0) {
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
}

tryagain.onclick = function() {
  location.reload();
}

window.onload = function() {
  guesschar.focus();
}

//console.log(hangman.words());
console.log(hangman.getActivePattern());

