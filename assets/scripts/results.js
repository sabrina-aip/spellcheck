var emojiResults = sessionStorage.getItem('emojiResults');
const numWrong = sessionStorage.getItem("numWrong");
const correctSpellingLst = sessionStorage.getItem("correctSpellingLst").split(',');
const submissionLst = sessionStorage.getItem("submissionLst").split(',');
const puzzleNum = sessionStorage.getItem("puzzleNum");
const results = document.querySelector("#results");
const copyBtn = document.querySelector("#copy-btn")
const typos = document.querySelector("#typos")

copyBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    shareableResults = `Spellcheck #${puzzleNum}\n${sessionStorage.getItem('emojiResults').replaceAll("\\n", "\n").replaceAll(" ", "")}`;
    await navigator.clipboard.writeText(shareableResults);
}) 

if (emojiResults != null){
    localStorage.setItem("dailyStatus",true)
}

numRows = correctSpellingLst.length;
test = ''
for (var i=0; i<numRows;i++){
    if (i == 0){
        test+=`
        <tr>
            <td colspan=3 style="text-align: center"><b>EASY WORDS</b></td>
        </tr>
        `
    }
    if (i == 5){
        test+=`
        <tr>
            <td colspan=3 style="text-align: center"><b>MEDIUM WORDS</b></td>
        </tr>
        `
    }
    if (i == 10){
        test+=`
        <tr>
            <td colspan=3 style="text-align: center"><b>HARD WORDS</b></td>
        </tr>
        `
    }
    test += `
    <tr>
        <td>${i+1}</td>
        ${correctSpellingLst[i]}
        ${submissionLst[i]}
    </tr>
    `
}
typos.innerHTML = test;
emojiResults = emojiResults.replaceAll('\\n', '<br>')
results.innerHTML = `${emojiResults}`;
