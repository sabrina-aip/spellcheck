const KEYBOARD_EL = document.querySelector("#keyboard")
const attempt = document.querySelector("#attempt-box")

var lastActiveWord = null;
var activeWord = null;
var activePlayer = null;
var attemptStr = '';

var wordLst;

KEYBOARD_EL.innerHTML = `<div id="keyboard-cont">
	<div class="first-row">
	<button class="keyboard-button boxed" id="q">Q</button>
	<button class="keyboard-button boxed" id="w">W</button>
	<button class="keyboard-button boxed" id="e">E</button>
	<button class="keyboard-button boxed" id="r">R</button>
	<button class="keyboard-button boxed" id="t">T</button>
	<button class="keyboard-button boxed" id="y">Y</button>
	<button class="keyboard-button boxed" id="u">U</button>
	<button class="keyboard-button boxed" id="i">I</button>
	<button class="keyboard-button boxed" id="o">O</button>
	<button class="keyboard-button boxed" id="p" >P</button>
	</div>
	<div class="second-row">
	<button class="keyboard-button boxed" id="a">A</button>
	<button class="keyboard-button boxed" id="s">S</button>
	<button class="keyboard-button boxed" id="d">D</button>
	<button class="keyboard-button boxed" id="f">F</button>
	<button class="keyboard-button boxed" id="g">G</button>
	<button class="keyboard-button boxed" id="h">H</button>
	<button class="keyboard-button boxed" id="j">J</button>
	<button class="keyboard-button boxed" id="k">K</button>
	<button class="keyboard-button boxed" id="l">L</button>
	</div>
	<div class="third-row">
	<button class="keyboard-button boxed" id="z">Z</button>
	<button class="keyboard-button boxed" id="x">X</button>
	<button class="keyboard-button boxed" id="c">C</button>
	<button class="keyboard-button boxed" id="v">V</button>
	<button class="keyboard-button boxed" id="b">B</button>
	<button class="keyboard-button boxed" id="n">N</button>
	<button class="keyboard-button boxed" id="m">M</button>
	<button class="keyboard-button boxed fa fa-delete-left" style="line-height:1.5" id="Backspace"></button>
	</div>
	<div class="fourth-row">
	<button class="keyboard-button boxed" id="Enter">submit</button>
	</div>
	</div>`

// STOP PLAYING SOUND
function stopSound(soundObj) {
	soundObj.pause();
	soundObj.currentTime = 0;
}

// UPDATE ATTEMPT STR UPON KEYPRESS
function insertLetter(pressedKey) {
	pressedKey = pressedKey.toUpperCase()
	attemptStr = attemptStr + pressedKey;
	attempt.focus();
	attempt.value = attemptStr;
	attempt.scrollLeft = attempt.scrollWidth;
}

// DELETE A LETER
function deleteLetter () {
	if (attemptStr.length > 0) {
		attemptStr = attemptStr.slice(0,-1);
	}
	attempt.value = attemptStr;
}

// CHECK IF GUESS IS CORRECT
function guessPreprocess(){
	if (lastActiveWord != null && activeWord == null) {
		activeWord = lastActiveWord;
		guessPreprocess()
		return;
	} else if (activePlayer == null) {
		console.log("Attempted guess without word selected.");
		attemptStr = '';
		attempt.value = attemptStr;
		return;
	} else if (attemptStr == '') {
		console.log("Empty string submitted as guess. Ignoring that.");
		return;
	} else {
		checkGuess();
	}
}

// update players to reflect their current status
function updatePlayer(playerLst, activePlayer) {
	if (activePlayer[0].classList.contains("clicked")) {
		stopSound(activePlayer[1]);
		activePlayer[0].classList.remove("clicked","fa-circle-stop");
		activePlayer[0].classList.add("fa-play-circle");

		lastActiveWord = activeWord;

		// DEACTIVATE WORD
		activeWord = null;
		activePlayer = null;

		return;
	}

	playerLst.forEach((player) => {
		if (!player[0].classList.contains("submitted") && player[0] != activePlayer[0]) {
			player[0].classList.remove("clicked", "fa-circle-stop");
			stopSound(player[1]);
		} else if (!player[0].classList.contains("submitted") && player[0] == activePlayer[0]) {
			activePlayer[0].classList.add("clicked","fa-circle-stop");
			activePlayer[1].play();
		}
	})
	return;
}

function resetPlayer(playerLst) {
	playerLst.forEach((player) => {
		player[0].style.backgroundColor = null;
		player[0].classList.remove("clicked", "fa-xmark","fa-check", "fa-circle-stop", "submitted")
		player[0].classList.add("fa-play-circle")
	})
}

// LINK ONSCREEN KEYBOARD FUNCTIONALITY TO KEYPRESSS
document.getElementById('keyboard-cont').addEventListener('click', (e) => {
	const target = e.target;

	if (!target.classList.contains('keyboard-button')) {
		return;
	}

	const key = target.id;

	if (key === 'Backspace') {
		deleteLetter();
	} else if (key === 'Enter') {
		guessPreprocess();
	} else { // every other key
		insertLetter(key);
	}

	target.classList.add('clicked');
	setTimeout(() => {
		target.classList.remove('clicked');
	}, 50);
	//document.querySelector(`#${pressedKey.toLowerCase()}`).classList.add("clicked")
	//document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}))
})

// KEYPRESS TYPING LISTENER
document.addEventListener('keydown', (e) => {
	let pressedKey = String(e.key);
	let found = pressedKey.match(/[a-z]/gi);

	if (pressedKey === 'Enter') {
		document.querySelector('#Enter').classList.add('clicked')
		guessPreprocess();
	} else if (pressedKey === 'Backspace') {
		document.querySelector('#Backspace').classList.add('clicked')
		deleteLetter()
	} else if (found && pressedKey.length === 1) {
		document.querySelector(`#${pressedKey.toLowerCase()}`).classList.add('clicked');
		insertLetter(pressedKey);
	}
})

document.addEventListener('keyup', (e) => {
	let pressedKey = String(e.key)
	let found = pressedKey.match(/[a-z]/gi)

	if (pressedKey === 'Enter' || pressedKey === 'Backspace') {
		document.querySelector(`#${pressedKey}`).classList.remove('clicked');
	} else if (found && pressedKey.length === 1) {
		document.querySelector(`#${pressedKey.toLowerCase()}`).classList.remove('clicked');
	}
});
