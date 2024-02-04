var level = sessionStorage.getItem("level");
var publicCount = document.querySelector('#total-count')
var publicCorrectCount = document.querySelector('#correct-count')
var endGameBtn = document.querySelector('#end-game-btn')

var wordOne = document.querySelector("#word-one")
var wordOnePlayer = document.querySelector("#word-one-player")

var wordCounter = 0;
var numCorrect = 0;
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
    if (level == "easy"){
        wordLst = shuffle(easyWords)
        levelPath = "levelOneNEW"
    } else if (level == "medium"){
        wordLst = shuffle(mediumWords)
        levelPath = "levelTwoNEW"
    } else if (level == "hard"){
        wordLst = shuffle(hardWords)
        levelPath = "levelThreeNEW"
    } else {
        window.location.replace("ahshit.html");   
    }
    path = `assets/audio/${levelPath}`;
    updateWord();
}

function updateWord(){
    resetPlayer(playerLst);
    activeWord = wordLst[wordCounter];
    wordOnePlayer.src = `${path}/${wordLst[wordCounter]}.mp3`
    publicCount.innerHTML = `${wordCounter}<br>total words`
    publicCorrectCount.innerHTML = `${5-(wordCounter - numCorrect)}<br>lives remaining`

}

function endGame(){
    sessionStorage.setItem("submissionLst", submissionLst)
    sessionStorage.setItem("correctSpellingLst",correctSpellingLst)
    sessionStorage.setItem("level", level)
    sessionStorage.setItem("numCorrect", numCorrect)

    window.location.replace("practice_results.html");
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
        activePlayer = null;


        // RECURSIVE CALL FOR NEW WORD
        updateWord();
    } else {
        submissionLst.push(`<td class="error">${attemptStr}</td>`)

        wordCounter += 1;

        stopSound(activePlayer[1]);

        updatePlayer(playerLst, activePlayer)

        // DEACTIVATE WORD
        activePlayer = null;


        // RECURSIVE CALL FOR NEW WORD
        updateWord();
    }

    if ((wordCounter - numCorrect) == 5) {
        endGame();
        return
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


checkLevel(level)
