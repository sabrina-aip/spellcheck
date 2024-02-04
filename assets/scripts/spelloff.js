/* https://www.freecodecamp.org/news/build-a-wordle-clone-in-javascript/ */
var publicCount = document.querySelector('#count')

var wordOne = document.querySelector("#word-one")
var wordOnePlayer = document.querySelector("#word-one-player")

var wordCounter = 0;
var numCorrect = 0;
var attemptStr = '';
var levelPath;

var results = '';
var submissionLst = [];
var correctSpellingLst = [];
var wrongSubmission = '';
var playerLst = [[wordOne, wordOnePlayer]];

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

// PROMPT MANAGEMENT

wordOne.addEventListener("click", (e) => {
    activePlayer = [wordOne, wordOnePlayer];
    updatePlayer(playerLst, activePlayer)
})


checkLevel("youtube")
