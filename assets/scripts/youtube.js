/* https://www.freecodecamp.org/news/build-a-wordle-clone-in-javascript/ */
var level = sessionStorage.getItem("level");
var publicCount = document.querySelector('#count')

var wordOne = document.querySelector("#word-one")
var wordOnePlayer = document.querySelector("#word-one-player")


var wordCounter = 0;
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

function updateWord(){
    if (wordCounter < 10){
        levelPath = "levelOneNEW"
    } else if ((wordCounter >= 10) && (wordCounter<20)){
        levelPath = "levelTwoNEW"
    }else if ((wordCounter >= 20) && (wordCounter<100)){
        levelPath = "levelThreeNEW"
    }
    wordLst = genYoutubeWordLst()
    path = `assets/audio/${levelPath}`;
    resetPlayer(playerLst);
    activeWord = wordLst[wordCounter];
    wordOnePlayer.src = `${path}/${wordLst[wordCounter]}.mp3`
    //console.log(`levelPath: ${levelPath}\nWord Counter: ${wordCounter}.\nActive Word: ${activeWord}`)

    publicCount.textContent = `Words Spelled: ${wordCounter}`
}

function endGame(){
    sessionStorage.setItem("submissionLst", submissionLst)
    sessionStorage.setItem("correctSpellingLst",correctSpellingLst)
    sessionStorage.setItem("level", level)

    window.location.replace("practice_results.html");
}

// CHECK IF GUESS IS CORRECT
function checkGuess() {
    correctSpellingLst.push(`<td>${activeWord}</td>`)
    if (attemptStr.toLowerCase() == activeWord.toLowerCase()) {
        submissionLst.push(`<td>${attemptStr}</td>`)
        wordCounter += 1;

        stopSound(activePlayer[1]);

        updatePlayer(playerLst, activePlayer)

        // DEACTIVATE WORD
        activeWord = null;
        activePlayer = null;


        // RECURSIVE CALL FOR NEW WORD
        updateWord();
    } else {
        submissionLst.push(`<td class="error">${attemptStr}</td>`)
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
