var submissionLst = sessionStorage.getItem("submissionLst").split(",")
var typos = document.querySelector("#typos")
var level = sessionStorage.getItem('level')
var correctSpellingLst = sessionStorage.getItem("correctSpellingLst").split(",")
var summary = document.querySelector("#summary")

innerStr = ''

for (var i = 0; i<submissionLst.length; i++){
    innerStr += `
    <tr>
        <td>${submissionLst.length - i}</td>
        ${correctSpellingLst[submissionLst.length-i-1]}
        ${submissionLst[submissionLst.length-i-1]}
    </tr>
    `
}

typos.innerHTML = innerStr;
summary.innerText = `You spelled ${submissionLst.length-1} ${level} level words correctly.`