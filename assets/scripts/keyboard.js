/* https://www.freecodecamp.org/news/build-a-wordle-clone-in-javascript/ */
const KEYBOARD_EL = document.querySelector("#keyboard")
const attempt = document.querySelector("#attempt-box")
var level = document.querySelector("#level")

var wordOne = document.querySelector("#word-one")
var wordTwo = document.querySelector("#word-two")
var wordThree = document.querySelector("#word-three")
var wordFour = document.querySelector("#word-four")
var wordFive = document.querySelector("#word-five")

var wordOnePlayer = document.querySelector("#word-one-player")
var wordTwoPlayer = document.querySelector("#word-two-player")
var wordThreePlayer = document.querySelector("#word-three-player")
var wordFourPlayer = document.querySelector("#word-four-player")
var wordFivePlayer = document.querySelector("#word-five-player")

var lastActiveWord = null;

var attemptStr = '';
var activeWord = null;
var activePlayer = null;
var results = '';
var numSubmitted;
var numWrong = 0;
var correctSpellingLst = [];
var submissionLst = [];
var playerLst = [[wordOne, wordOnePlayer],[wordTwo, wordTwoPlayer],[wordThree, wordThreePlayer],[wordFour, wordFourPlayer],[wordFive, wordFivePlayer]];

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
    <div class="fourth-row">
        <button class="keyboard-button boxed" id="Enter">submit</button>
    </div>
</div>`

// CHECK LEVEL 
function checkLevel(level){
    resetPlayer(playerLst);
    attempt.value=attemptStr;
    if (level.textContent == "Level One: Easy"){
        assignSound("levelOneNEW", chooseWords(easyWords))
    } else if (level.textContent == "Level Two: Medium"){
        assignSound("levelTwoNEW", chooseWords(mediumWords))
    } else if (level.textContent == "Level Three: Hard"){
        assignSound("levelThreeNEW", chooseWords(hardWords))
    } else {
        window.location.replace("ahshit.html");    
    }
}

// POPULATE PAGE WITH LEVEL APPROPRIATE WORDS
function assignSound(levelPath, words){
    path = `assets/audio/${levelPath}`;

    try{
        // setting neutral values
        wordLst = words;
        numSubmitted = 0;
        activeWord = null;
        activePlayer = null;
        wordOnePlayer.src = `${path}/${words[0]}.mp3`
        wordTwoPlayer.src = `${path}/${words[1]}.mp3`
        wordThreePlayer.src = `${path}/${words[2]}.mp3`
        wordFourPlayer.src = `${path}/${words[3]}.mp3`
        wordFivePlayer.src = `${path}/${words[4]}.mp3`
    } catch(error) {
        console.log(error)
    }         
}

// MOVE TO NEXT ROUND
function nextRound(){
    if (level.textContent == "Level One: Easy"){
        level.textContent = "Level Two: Medium"
    } else if (level.textContent == "Level Two: Medium"){
        level.textContent = "Level Three: Hard"
    } else if (level.textContent == "Level Three: Hard"){
        endGame();
    } else {
        window.location.replace("ahshit.html");    
    }

    checkLevel(level)
}

function endGame(){
    sessionStorage.setItem("numWrong", numWrong);
    sessionStorage.setItem("correctSpellingLst", correctSpellingLst);
    sessionStorage.setItem("submissionLst", submissionLst);
    sessionStorage.setItem("emojiResults", results);
    window.location.replace("results.html");
}

// UPDATE RESULTS
function updateResults(){
    playerLst.forEach((player) => {
        if (player[0].classList.contains("fa-check")) {
            results += "🟩"
        } else if (player[0].classList.contains("fa-xmark")) {
            results += "🟥"
            numWrong += 1;
        }
        results += " "
    })
    results += "\\n"
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

// CHECK IF GUESS IS CORRECT

function guessPreprocess(){
    if ((lastActiveWord != null) & (activeWord==null)) {
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

function checkGuess() {
    correctSpellingLst.push(`<td>${activeWord}</td>`);        

    if ((attemptStr.toLowerCase() == activeWord.toLowerCase())) {
        stopSound(activePlayer[1]);
        activePlayer[0].style.backgroundColor = "#79b15a";
        activePlayer[0].classList.add("submitted", "fa-check");     
        activePlayer[0].classList.remove("clicked","fa-play-circle", "fa-pause-circle","btn");

        // RECORD FOR RESULTS
        submissionLst.push(`<td>${attemptStr}</td>`)
        
        // DEACTIVATE WORD
        activeWord = null;
        activePlayer = null;   
    } else {
        stopSound(activePlayer[1]);
        activePlayer[0].style.backgroundColor = "#d25842";
        activePlayer[0].classList.add("submitted", "fa-xmark"); 
        activePlayer[0].classList.remove("clicked","fa-pause-circle", "fa-play-circle","btn");

        // RECORD FOR RESULTS
        submissionLst.push(`<td class="error">${attemptStr}</td>`)

            
        // DEACTIVATE WORD
        activeWord = null;
        activePlayer = null;   
    }
    attemptStr = '';
    attempt.value = attemptStr;    
    numSubmitted += 1;
    if (numSubmitted == 5) {
        updateResults();
        nextRound();
    }
    return;
}

// update players to reflect their current status
function updatePlayer(playerLst, activePlayer) {
    if (activePlayer[0].classList.contains("clicked")) {
        stopSound(activePlayer[1]);
        activePlayer[0].classList.remove("clicked","fa-pause-circle");
        activePlayer[0].classList.add("fa-play-circle");

        lastActiveWord = activeWord;
        
        // DEACTIVATE WORD
        activeWord = null;
        activePlayer = null;

        return;
    }

    playerLst.forEach((player) => {
        if ((!player[0].classList.contains("submitted")) & player[0] != activePlayer[0]) {
            player[0].classList.remove("clicked", "fa-pause-circle");
            stopSound(player[1]);
        } else if ((!player[0].classList.contains("submitted")) & player[0] == activePlayer[0]) {
            activePlayer[0].classList.add("clicked","fa-pause-circle");
            activePlayer[1].play();
        }
    })
    return;
}

function resetPlayer(playerLst) {
    playerLst.forEach((player) => {
        player[0].style.backgroundColor = null;
        player[0].classList.remove("clicked", "fa-xmark","fa-check", "submitted")
        player[0].classList.add("fa-play-circle")
    })
}

// PROMPT MANAGEMENT

wordOne.addEventListener("click", (e) => {
    activeWord = wordLst[0];
    activePlayer = [wordOne, wordOnePlayer];
    updatePlayer(playerLst, activePlayer)
})
wordTwo.addEventListener("click", (e) => {
    activeWord = wordLst[1];
    activePlayer = [wordTwo, wordTwoPlayer];
    updatePlayer(playerLst, activePlayer)
})
wordThree.addEventListener("click", (e) => {
    activeWord = wordLst[2];
    activePlayer = [wordThree, wordThreePlayer];
    updatePlayer(playerLst, activePlayer)
})
wordFour.addEventListener("click", (e) => {
    activeWord = wordLst[3];
    activePlayer = [wordFour, wordFourPlayer];
    updatePlayer(playerLst, activePlayer)
})
wordFive.addEventListener("click", (e) => {
    activeWord = wordLst[4];
    activePlayer = [wordFive, wordFivePlayer];
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
    insertLetter(pressedKey)
    //document.querySelector(`#${pressedKey.toLowerCase()}`).classList.add("clicked")
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
        guessPreprocess();
        return;
    }

    if (pressedKey === "Backspace" & attemptStr.length != 0) {
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

checkLevel(level)
