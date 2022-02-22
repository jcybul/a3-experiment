function sendResults(data) {
    // TODO: Send to correct ip
    return fetch("/api/results", {
        method: "POST",
        data: JSON.sstringify(data),
    })
    .then(x => x.json())
    .then(console.log);
}

const userId = Math.floor(1000000000 * Math.random());

function submitAnswer(event) {
    event.preventDefault();

    const textField = document.getElementById("answer");

    sendResults({
        answer: textField.value,
        timestamp: new Date().getTime(),
        id: userId,
    });

}

window.onload = function() {
    const submitButton = document.getElementById("submit");
    submitButton.onclick = submitAnswer;
}

var body = d3.select('body')

body.append('input')
    .attr('type','text')
    .attr('name','guessInput')
    .attr('value','')

genData = d3.range(4).map(Math.random);
console.log(genData);
