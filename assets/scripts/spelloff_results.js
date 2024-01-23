var submissionLst = sessionStorage.getItem("submissionLst").split(",")
var typos = document.querySelector("#typos")
var numCorrect = sessionStorage.getItem('numCorrect')
var correctSpellingLst = sessionStorage.getItem("correctSpellingLst").split(",")
var summary = document.querySelector("#summary")

innerStr = ''

for (var i = 0; i<submissionLst.length; i++){
    innerStr += `
    <tr>
        <td>${i+1}</td>
        ${correctSpellingLst[i]}
        ${submissionLst[i]}
    </tr>
    `
}

typos.innerHTML = innerStr;
summary.innerText = `You spelled ${numCorrect} words correctly.`