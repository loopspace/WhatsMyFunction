var fn;
var guesses = [];
var cguesses = 0;
var points = 100;
var score = 0;
var tries = 0;

var prng = new Math.seedrandom();

function init() {
    var btn = document.getElementById('instbtn');
    btn.addEventListener('click',toggleInstructions);

    btn = document.getElementById('submit');
    btn.addEventListener('click',submitGuess);

    var pred = document.getElementById('predict');
    pred.addEventListener('input',checkPredict);
    checkPredict_aux(pred);

    var sel = document.getElementById('level');
    sel.addEventListener('change', reset);
    
    setFunction();
}

function toggleInstructions(e) {
    e.preventDefault();
    var inst = document.getElementById('instructions');
    inst.classList.toggle('hide');
    if (inst.classList.contains('hide')) {
	e.target.textContent = 'Show instructions';
    } else {
	e.target.textContent = 'Hide instructions';
    }
}

function checkPredict(e) {
    checkPredict_aux(e.target);
}

function checkPredict_aux(elt) {
    var ptxt = document.getElementById('pred');
    var itxt = document.getElementById('inpt');
    if (elt.value == "") {
	itxt.classList.remove('hide');
	ptxt.classList.add('hide');
    } else {
	ptxt.classList.remove('hide');
	itxt.classList.add('hide');
    }
}

function submitGuess() {
    var pelt = document.getElementById('pred');
    var ielt = document.getElementById('inpt');
    ielt.classList.remove('hide');
    pelt.classList.add('hide');

    var ptxt = document.getElementById('predict');
    var itxt = document.getElementById('guess');
    var ival = parseFloat(itxt.value);
    if (isNaN(ival)) {
	itxt.value = '';
	ptxt.value = '';
	return;
    }
    var oval = fn(ival);
    var isGuess;
    var guess = [];
    var pts = 0;
    guess[0] = ival;
    if (ptxt.value == "") {
	isGuess = true;
	pts = 5;
    } else {
	isGuess = false;
	pval = parseFloat(ptxt.value);
	if (pval != oval) {
	    pts = 10;
	}
    }
    if (isNaN(oval)) {
	pts += 5;
    }
    for (var i = 0; i < guesses.length; i++) {
	if (
	    guesses[i][0] == ival
		&&
		(isGuess || guesses[i][1] == pval)
	) {
	    tempMessage("You've already tried that");
	    itxt.value = '';
	    ptxt.value = '';
	    return;
	}
    }
    
    var tbdy = document.getElementById('guesses');
    var row = tbdy.insertRow();
    var cell = row.insertCell(0);
    var txt = document.createTextNode(ival);
    cell.appendChild(txt);
    cell = row.insertCell(1);
    txt = document.createTextNode('⟼');
    cell.appendChild(txt);
    cell = row.insertCell(2);

    if (isGuess) {
	txt = document.createTextNode(oval);
	cell.classList.add('guess');
	guess[1] = oval;
    } else {
	txt = document.createTextNode(pval);
	guess[1] = pval;
	if (pval != oval) {
	    cguesses = 0;
	    cell.classList.add('incorrect');
	} else {
	    cell.classList.add('correct');
	    cguesses += 1;
	}
    }
    guesses.push(guess);
    cell.appendChild(txt);

    itxt.value = '';
    ptxt.value = '';
    
    points -= pts;
    setElement('points',points);
    
    if (points < 0) {
	doLose();
    }
    if (cguesses == 5) {
	doWin();
    }
    
}

var parameters = [
    ["-5:10", "-5:10", "0", "0", "1", "0", "0"],
    ["-5:10", "-5:10", "-5:10", "0", "1", "0", "0"],
    ["-5:10", "-5:10", "-5:10", "-5:10", "1", "0", "0"],
    ["1", "0", "0", "0", "-5:10", "-5:10", "0"],
    ["1", "0", "0", "0", "-5:10", "-5:10", "-5:10"],
]

function setFunction() {
    var sel = document.getElementById('level');
    var lvl = sel.value;

    var p = [0,0,0,0,0,0,0];

    while (p.reduce( (a,c) => a + Math.abs(c) ) == 0 || p.slice(4).reduce( (a,c) => a + Math.abs(c) ) == 0) {
    
	for (var i = 0; i < 7; i++) {
	    p[i] = randomFromRange(parameters[lvl][i], prng());
	}
    }
    fn = function(x) {
	return (p[3] * x * x * x + p[2] * x * x + p[1] * x + p[0])/(p[6] * x * x + p[5] * x + p[4]);
    }

    tempMessage('Start guessing!');
}

function tempMessage(m) {
    var msg = document.getElementById('message');
    var msgdiv = document.getElementById('msgdiv');
    msg.innerHTML = '';
    var txt = document.createTextNode(m);
    msg.appendChild(txt);
    msgdiv.classList.remove('hide');
    window.setTimeout(function() {msgdiv.classList.add('hide')},3000);
}

function setElement(id,v) {
    var elt = document.getElementById(id);
    var txt = document.createTextNode(v);
    elt.innerHTML = '';
    elt.appendChild(txt);
}

function doLose() {
    tempMessage('Out of points, bad luck!');
    window.setTimeout(reset,4000);
}

function doWin() {
    tempMessage('That\'s five in a row.  Congratulations!');
    score += points;
    setElement('score',score);
    window.setTimeout(reset,4000);
}

function reset() {
    points = 100;
    tries += 1;
    guesses = [];
    cguesses = 0;
    setElement('points',points);
    setElement('tries',tries);
    var tbdy = document.getElementById('guesses');
    tbdy.innerHTML = '';
    setFunction();
    
}

window.addEventListener('load',init,false);

/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
*/

// Closure
(function() {
  /**
   * Decimal adjustment of a number.
   *
   * @param {String}  type  The type of adjustment.
   * @param {Number}  value The number.
   * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
   * @returns {Number} The adjusted value.
   */
  function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (value === null || isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // If the value is negative...
    if (value < 0) {
      return -decimalAdjust(type, -value, exp);
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }

  // Decimal round
  if (!Math.round10) {
    Math.round10 = function(value, exp) {
      return decimalAdjust('round', value, exp);
    };
  }
  // Decimal floor
  if (!Math.floor10) {
    Math.floor10 = function(value, exp) {
      return decimalAdjust('floor', value, exp);
    };
  }
  // Decimal ceil
  if (!Math.ceil10) {
    Math.ceil10 = function(value, exp) {
      return decimalAdjust('ceil', value, exp);
    };
  }

    // Significant figures round
  if (!Math.roundsf) {
    Math.roundsf = function(value, exp) {
      return decimalAdjust('round', value, Math.floor(Math.log10(Math.abs(value))) + 1 - exp);
    };
  }
  //  Significant figures floor
  if (!Math.floorsf) {
      Math.floorsf = function(value, exp) {
	return decimalAdjust('floor', value, Math.floor(Math.log10(Math.abs(value))) + 1 - exp);
    };
  }
  //  Significant figures ceil
  if (!Math.ceilsf) {
    Math.ceilsf = function(value, exp) {
      return decimalAdjust('ceil', value, Math.floor(Math.log10(Math.abs(value))) + 1 - exp);
    };
  }
})();

/*
Select a random number from a list.
The list is comma separated, each entry is either a number or a range.
Ranges are denoted by a:b and are inclusive.
Optionally, an entry can end in 'xN' to denote that that entry should be considered to be copied N times.
*/

function randomFromRange(s,p) {
    var sel = s.split(',');
    var len = [];
    var ranges = [];
    var total = 0;
    var range;
    var mult;
    var matches;
    var start;
    var end;
    var chosen;
    for (var i = 0; i < sel.length; i++) {
	if (sel[i].search('x') != -1) {
	    matches = sel[i].match(/(.*)x\s*(\d+)/);
	    range = matches[1];
	    mult = parseInt(matches[2]);
	} else {
	    range = sel[i];
	    mult = 1;
	}
	if (range.search(':') !== -1) {
	    matches = range.match(/(-?\d+)\s*:\s*(-?\d+)/);
	    start = parseInt(matches[1],10);
	    end = parseInt(matches[2],10);
	} else {
	    start = parseInt(range,10);
	    end = parseInt(range,10);
	}
	ranges.push([start,end - start + 1,mult]);
	total += (end - start + 1)*mult;
	len.push(total);
    }
    p = Math.floor(p*total + 1);

    for (var i = 0; i < len.length; i++) {
	if (len[i] >= p) {
	    chosen = i;
	    break;
	}
    }

    p -= len[chosen-1] || 0;
    p = p%ranges[chosen][1];
    p += ranges[chosen][0];

    return p;
}
