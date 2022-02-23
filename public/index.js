
const userId = Math.floor(1000000000 * Math.random());
let questionNumber = -1;
let graphType = "n/a";
let correctAnswer = 0;

function sendResults(data) {
    // TODO: Send to correct ip
    return fetch("/api/results", {
        method: "POST",
        body: JSON.stringify(data),
    })
    .then(x => x.json())
    .then(console.log);
}

function submitAnswer(event) {
    event.preventDefault();

    const textField = document.getElementById("answer");

    sendResults({
        answer: textField.value,
        timestamp: new Date().getTime(),
        userId,
        graphType,
        questionNumber,
        correctAnswer,
    });
}

window.onload = function() {
    const submitButton = document.getElementById("submit");
    submitButton.onclick = submitAnswer;

    console.log("Running window.onload!");
    buildNextGraph();
}


function buildBarGraph(svg) {

    genData = d3.range(4).map(getRandomInt);

    function getRandomInt(){
        return Math.floor(Math.random() * 100);
    }

    var margin = {top: 25, right: 25, bottom: 25, left: 25},
        width = 300 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    svg.attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
            
    var x = d3.scaleBand()
        .range([ 0, width ])
        .domain(genData.map(function(d,i) { return i }))
        .padding(0.2);
        
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
    .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");
        
    var y = d3.scaleLinear()
        .domain([0, 100])
        .range([ height, 0]);
        
    svg.append("g")
        .call(d3.axisLeft(y));

    svg.selectAll("mybar")
        .data(genData)
        .enter()
        .append("rect")
        .attr("x", function(d,i) { return x(i); })
        .attr("y", function(d) { return y(d); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d); })
        .attr("fill", "#FFFFFF")
        .attr('stroke', '#000000');

}

function buildBubbleGraph(svg) {
    
}

function buildNextGraph() {
    const graphBuilders = [
        ["bar", buildBarGraph],
        ["bubble", buildBubbleGraph],
    ];
    
    questionNumber += 1;
    const [name, builder] = graphBuilders[questionNumber % graphBuilders.length];
    console.log(`Building new ${name} graph!`);
    
    // Clear previous graph (if any) and add new svg
    const svg = d3.select('#graphContainer').append("svg");
    
    // Build new graph in container and get the correct answer after it has been randomly generated
    correctAnswer = builder(svg);
    graphType = name;

    if (!Number.isInteger(correctAnswer)) {
        console.log(`Expected ${name} graph builder to return the correct answer (integer % between 0-100)!`);
    }
}      

