var fname = '3esl.txt';
var outputname = 'test-dictionary.js';
var fs = require('fs');

var data = fs.readFileSync(fname, 'ascii').toLowerCase().split('\r\n');

var filtered = [];

for (var i = 0; i < data.length; i++) {
  var el = data[i];
  if (el.indexOf(' ') < 0 && el.indexOf('\'') < 0 && el.indexOf('-') < 0 && el.length > 1 && el.indexOf('.') < 0) {
    filtered.push(el);
  } else {
    console.log('didnt push ' + el);
  }
}

if (filtered.indexOf('amusement park') >= 0) {
  console.log('didnt remove spaces');
}

if (filtered.indexOf('able-bodied') >= 0) {
  console.log('didnt remove dashes');
}

if (filtered.indexOf('abc\'s') >= 0) {
  console.log('didnt remove apostrophe');
}

// console.log(filtered.join("\',\'"))
fs.writeFileSync(outputname, 'dictionary = [\'' + filtered.join('\',\'') + '\']');

