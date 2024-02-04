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

var wordOneSubmission = '';
var wordTwoSubmission = '';
var wordThreeSubmission = '';
var wordFourSubmission = '';
var wordFiveSubmission = '';

var wordOneSpelling = '';
var wordTwoSpelling = '';
var wordThreeSpelling = '';
var wordFourSpelling = '';
var wordFiveSpelling = '';

var playerLst = [
    [wordOne, wordOnePlayer, wordOneSpelling, wordOneSubmission],
    [wordTwo, wordTwoPlayer,wordTwoSpelling, wordTwoSubmission],
    [wordThree, wordThreePlayer, wordThreeSpelling, wordThreeSubmission],
    [wordFour, wordFourPlayer, wordFourSpelling, wordFourSubmission],
    [wordFive, wordFivePlayer, wordFiveSpelling, wordFiveSubmission]
];

var results = '';
var numSubmitted;
var numWrong = 0;
var correctSpellingLst = [];
var submissionLst = [];


var dictValue;
// CHECK LEVEL 
function checkLevel(level){
    resetPlayer(playerLst);
	
    attempt.value=attemptStr;
    if (level.textContent == "Level One: Easy") {
        assignSound("levelOneNEW", chooseWords(easyWords))
        dictValue = "levelOne"
    } else if (level.textContent == "Level Two: Medium"){
        assignSound("levelTwoNEW", chooseWords(mediumWords))
        dictValue = "levelTwo"

    } else if (level.textContent == "Level Three: Hard"){
        assignSound("levelThreeNEW", chooseWords(hardWords))
        dictValue = "levelThree"

    } else {
        window.location.replace("ahshit.html");    
	} 
}

// POPULATE PAGE WITH LEVEL APPROPRIATE WORDS
function assignSound(levelPath, words){
	let path = `assets/audio/${levelPath}`;
	try {
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
    nextRoundBtn.innerHTML = `<div></div>`
    checkLevel(level)
    return;
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
        correctSpellingLst.push(player[2])
        submissionLst.push(player[3])
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

function checkGuess() {
    //correctSpellingLst.push(`<td>${activeWord}</td>`);        
    activePlayer[2] = `<td>${activeWord}</td>`

    if ((attemptStr.toLowerCase() == activeWord.toLowerCase())) {
        stopSound(activePlayer[1]);
        activePlayer[0].style.backgroundColor = "#79b15a";
        activePlayer[0].classList.add("submitted", "fa-check");     
        activePlayer[0].classList.remove("clicked","fa-play-circle", "fa-circle-stop","btn");

        // RECORD FOR RESULTS
        activePlayer[3] = `<td>${attemptStr}</td>`
        //submissionLst.push(`<td>${attemptStr}</td>`)

        
        // DEACTIVATE WORD
        activeWord = null;
        activePlayer = null;   
    } else {
        stopSound(activePlayer[1]);
        activePlayer[0].style.backgroundColor = "#d25842";
        activePlayer[0].classList.add("submitted", "fa-xmark"); 
        activePlayer[0].classList.remove("clicked","fa-circle-stop", "fa-play-circle","btn");

        // RECORD FOR RESULTS
        activePlayer[3] = `<td class="error">${attemptStr}</td>`
        //submissionLst.push(`<td class="error">${attemptStr}</td>`)

        // DEACTIVATE WORD
        activeWord = null;
        activePlayer = null;   
    }
    attemptStr = '';
    attempt.value = attemptStr;    
    numSubmitted += 1;

    if (numSubmitted == 5) {
        updateResults();
        showNextRound();
        //nextRound();
    }
    return;
}

var nextRoundBtn = document.querySelector("#next-round-btn")
function showNextRound(){
    if (level.textContent == "Level Three: Hard"){
        nextRoundBtn.innerHTML = `
        <div class="boxed btn"> see results&ensp;<i class="fa fa-arrow-right" style="font-size:10pt;"></i></div>
        `
        return
    }
    else {
        nextRoundBtn.innerHTML = `
        <div class="boxed btn"> go to next round&ensp;<i class="fa fa-arrow-right" style="font-size:10pt;"></i></div>
        `
        return
    }
}

nextRoundBtn.addEventListener("click", (e) =>{
    console.log("going to next round")
    if (level.textContent == "Level Three: Hard"){
        endGame();
        return;
    }
    nextRound();

})


// PROMPT MANAGEMENT

wordOne.addEventListener("click", (e) => {
    activeWord = wordLst[0];
    //activePlayer = [wordOne, wordOnePlayer];
    activePlayer = playerLst[0];
    updatePlayer(playerLst, activePlayer)
})
wordTwo.addEventListener("click", (e) => {
    activeWord = wordLst[1];
    //activePlayer = [wordTwo, wordTwoPlayer];
    activePlayer = playerLst[1];
    updatePlayer(playerLst, activePlayer)
})
wordThree.addEventListener("click", (e) => {
    activeWord = wordLst[2];
    activePlayer = playerLst[2];
    //activePlayer = [wordThree, wordThreePlayer];
    updatePlayer(playerLst, activePlayer)
})
wordFour.addEventListener("click", (e) => {
    activeWord = wordLst[3];
    activePlayer = playerLst[3];
    //activePlayer = [wordFour, wordFourPlayer];
    updatePlayer(playerLst, activePlayer)
})
wordFive.addEventListener("click", (e) => {
    activeWord = wordLst[4];
    activePlayer = playerLst[4];
    //activePlayer = [wordFive, wordFivePlayer];
    updatePlayer(playerLst, activePlayer)
})

checkLevel(level)
