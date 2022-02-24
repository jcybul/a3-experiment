
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

    buildNextGraph();
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

    var tempA = Math.floor(Math.random() * 4);
    var tempB = Math.floor(Math.random() * 4);
    if (tempA == tempB){
        tempB = ((tempB + 1) % 4);
    }
    if (genData[tempA] >= genData[tempB]){
        
    }
    console.log(tempA + " " + tempB);

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

function buildAreaGraph(svg) {
    var margin = {top: 25, right: 25, bottom: 25, left: 25},
    width = 300 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    // var svg = d3.select("#graphContainer")
    // .append("svg")
    //     .attr("width", width + margin.left + margin.right)
    //     .attr("height", height + margin.top + margin.bottom)
    // .append("g")
    //     .attr("transform",
    //         "translate(" + margin.left + "," + margin.top + ")");

    // Generate random data
    const nSamples = 10;
    const data = [];

    for (let i = 0; i < nSamples; i++) {
        for (const series of ["seriesA", "seriesB"]) {
            data.append({
                year: i,
                height: Math.random(),
                name: series,
                
            });
        }
    }

    
    //Read the data
    d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered.csv", function(data) {

    // group the data: one array for each value of the X axis.
    var sumstat = d3.nest()
        .key(function(d) { return d.year;})
        .entries(data);

    // Stack the data: each group will be represented on top of each other
    var mygroups = ["Helen", "Amanda", "Ashley"] // list of group names
    var mygroup = [1,2,3] // list of group names
    var stackedData = d3.stack()
        .keys(mygroup)
        .value(function(d, key){
        return d.values[key].n
        })
        (sumstat)

    // Add X axis --> it is a date format
    var x = d3.scaleLinear()
        .domain(d3.extent(data, function(d) { return d.year; }))
        .range([ 0, width ]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(5));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return +d.n; })*1.2])
        .range([ height, 0 ]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // color palette
    var color = d3.scaleOrdinal()
        .domain(mygroups)
        .range(['#F2F2F2','#BDBDBD','#080808'])

    // Show the areas
    svg
        .selectAll("mylayers")
        .data(stackedData)
        .enter()
        .append("path")
        .style("fill", function(d) { name = mygroups[d.key-1] ;  return color(name); })
        .attr("d", d3.area()
            .x(function(d, i) { return x(d.data.key); })
            .y0(function(d) { return y(d[0]); })
            .y1(function(d) { return y(d[1]); })
        )

})
}

function buildBubbleGraph(svg) {
        // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 300- margin.left - margin.right,
    height = 300- margin.top - margin.bottom;

    // // append the svg object to the body of the page
    // var svg = d3.select("#my_dataviz")
    // .append("svg")
    // .attr("width", width + margin.left + margin.right)
    // .attr("height", height + margin.top + margin.bottom)
    // .append("g")
    // .attr("transform",
    //     "translate(" + margin.left + "," + margin.top + ")");


    function getRandomInt(i){
        return Math.floor(Math.random() * i);
    }

    data = []

    for (let i = 0; i < 8; i++) {

      temp = {
        "x": getRandomInt(20),
        "y": getRandomInt(20),
        "size": getRandomInt(7)
      }
     data[i] = temp
    }

    console.log(data)

    // Add X axis
    var x = d3.scaleLinear()
    .domain([0, 4000])
    .range([ 0, width ]);
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
    .domain([0, 500000])
    .range([ height, 0]);
    svg.append("g")
    .call(d3.axisLeft(y));

    // Add dots
    svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return x(d.x); } )
    .attr("cy", function (d) { return y(d.y); } )
    .attr("r", function (d) { return 1*(d.size)})
    .style("fill", "#69b3a2")
    
}

function buildNextGraph() {
    const graphBuilders = [
        ["bar", buildBarGraph],
        ["area", buildAreaGraph],
        ["bubble", buildBubbleGraph],
    ];
    
    questionNumber += 1;
    const [name, builder] = graphBuilders[questionNumber % graphBuilders.length];
    console.log(`Building new ${name} graph!`);
    
    // Clear previous graph (if any) and add new svg
    d3.select('#graphContainer').html("");
    const svg = d3.select('#graphContainer').append("svg");
    
    // Build new graph in container and get the correct answer after it has been randomly generated
    correctAnswer = builder(svg);
    graphType = name;

    if (!Number.isInteger(correctAnswer)) {
        console.log(`Expected ${name} graph builder to return the correct answer (integer % between 0-100)!`);
    }
}      

