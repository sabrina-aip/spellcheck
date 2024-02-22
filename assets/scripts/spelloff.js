/* https://www.freecodecamp.org/news/build-a-wordle-clone-in-javascript/ */
const KEYBOARD_EL = document.querySelector("#keyboard")
const attempt = document.querySelector("#attempt-box")
var publicCount = document.querySelector('#count')

var wordOne = document.querySelector("#word-one")
var wordOnePlayer = document.querySelector("#word-one-player")

var lastActiveWord = null;

var wordCounter = 0;
var numCorrect = 0;
var attemptStr = '';
var activeWord = null;
var activePlayer = null;
var wordLst;
var levelPath;

var results = '';
var submissionLst = [];
var correctSpellingLst = [];
var wrongSubmission = '';
var playerLst = [[wordOne, wordOnePlayer]];

KEYBOARD_EL.innerHTML = `<div id="keyboard-cont">
    <div class="first-row">
        <button class="keyboard-button boxed" id="q">Q</button>
        <button class="keyboard-button boxed" id="q">W</button>
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
    <div class="fourthsrow">
        <button class="keyboard-button boxed" id="Enter">submit</button>
    </div>
</div>`

// CHECK LEVEL 
function checkLevel(level){
    resetPlayer(playerLst);
    attempt.value=attemptStr;
    updateWord();
}

var wordLst = genSpellOffWordLst()

function updateWord(){
    levelPath = "levelThreeNEW"
    path = `assets/audio/${levelPath}`;
    resetPlayer(playerLst);
    activeWord = wordLst[wordCounter];
    wordOnePlayer.src = `${path}/${wordLst[wordCounter]}.mp3`
    //console.log(`levelPath: ${levelPath}\nWord Counter: ${wordCounter}.\nActive Word: ${activeWord}`)

    publicCount.textContent = `Words Remaining: ${25 - wordCounter}`
}

function endGame(){
    sessionStorage.setItem("submissionLst", submissionLst)
    sessionStorage.setItem("correctSpellingLst",correctSpellingLst)
    sessionStorage.setItem("numCorrect", numCorrect);
    window.location.replace("spelloff_results.html");
}

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

function guessPreprocess() {
    if (lastActiveWord != null && activeWord==null) {
        activeWord = lastActiveWord;
        checkGuess()
        return;
    } else if (activeWord == null) {
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

// CHECK IF GUESS IS CORRECT
function checkGuess() {
    correctSpellingLst.push(`<td>${activeWord}</td>`)
    if (attemptStr.toLowerCase() == activeWord.toLowerCase()) {
        submissionLst.push(`<td>${attemptStr}</td>`)
        wordCounter += 1;
        numCorrect += 1;

        stopSound(activePlayer[1]);

        updatePlayer(playerLst, activePlayer)

        // DEACTIVATE WORD
        //activeWord = null;
        activePlayer = null;


        // RECURSIVE CALL FOR NEW WORD
        updateWord();
    } else {
        submissionLst.push(`<td class="error">${attemptStr}</td>`)
        wordCounter += 1;

        stopSound(activePlayer[1]);

        updatePlayer(playerLst, activePlayer)

        // DEACTIVATE WORD
        activeWord = null;
        activePlayer = null;

        // RECURSIVE CALL FOR NEW WORD
        updateWord();
    }

    if (wordCounter == 25){
        endGame();
    }
    attemptStr = '';
    attempt.value = attemptStr; 
    return
}

// update players to reflect their current status
function updatePlayer(playerLst, activePlayer) {
    if (activePlayer[0].classList.contains("clicked")) {
        stopSound(activePlayer[1]);
        activePlayer[0].classList.remove("clicked","fa-circle-stop");
        activePlayer[0].classList.add("fa-play-circle");
        
        lastActiveWord = activeWord;

        // DEACTIVATE WORD
        //activeWord = null;
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
// PROMPT MANAGEMENT

wordOne.addEventListener("click", (e) => {
    activePlayer = [wordOne, wordOnePlayer];
    updatePlayer(playerLst, activePlayer)
})


// LINK ONSCREEN KEYBOARD FUNCTIONALITY TO KEYPRESSS
document.getElementById("keyboard-cont").addEventListener("click", (e) => {
    const target = e.target
    
    if (!target.classList.contains("keyboard-button")) {
        return
    }

    let key = target.textContent

    if (target.classList.contains("fa-delete-left")){
        deleteLetter();
        return
        //key = "Backspace"
    }

    if (key==="submit"){
        guessPreprocess();
        return
        //key = "Enter"
    }

    let pressedKey = target.innerText;
    let found = pressedKey.match(/[a-z]/gi)

    if (!found || found.length > 1) {
        return
    } else {
        insertLetter(pressedKey)
        document.querySelector(`#${pressedKey.toLowerCase()}`).classList.add("clicked")
        setTimeout(() => {
            setTimeout(document.querySelector(`#${pressedKey.toLowerCase()}`).classList.remove("clicked"));
            }, 50);
        return;
    }
    //document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}))
})

// KEYPRESS TYPING LISTENER
document.addEventListener("keyup", (e) => {

   let pressedKey = String(e.key)
   let found = pressedKey.match(/[a-z]/gi)

    if (pressedKey === "Enter") {
        document.querySelector(`#${pressedKey}`).classList.add("clicked")
        setTimeout(() => {
            setTimeout(document.querySelector(`#${pressedKey}`).classList.remove("clicked"));
          }, 50);
        guessPreprocess()
        return;
    }

    if (pressedKey === "Backspace" && attemptStr.length != 0) {
        document.querySelector(`#${pressedKey}`).classList.add("clicked")
        setTimeout(() => {
            setTimeout(document.querySelector(`#${pressedKey}`).classList.remove("clicked"));
          }, 50);
        deleteLetter()
        return;
    }

    if (!found || found.length > 1) {
        return
    } else {
        insertLetter(pressedKey)
        document.querySelector(`#${pressedKey.toLowerCase()}`).classList.add("clicked")
        setTimeout(() => {
            setTimeout(document.querySelector(`#${pressedKey.toLowerCase()}`).classList.remove("clicked"));
            }, 50);
        return;
    }
})

checkLevel("youtube")
