
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
    const feedback = document.getElementById("feedback");
    const location = document.getElementById("location");

    if (textField.value === "") {
        feedback.innerHTML = "<b>\u{1f615}</b> You need to enter a value";
        return;
    }

    const answer = parseInt(textField.value);

    if (answer < 0 || answer > 100) {
        feedback.innerHTML = "Please enter a value within bounds";
        return;
    }

    sendResults({
        answer,
        timestamp: new Date().getTime(),
        userId,
        graphType,
        questionNumber,
        correctAnswer,
    });

    location.innerHTML = `<b>${questionNumber}/60%<b>`;
    
    if (!Number.isInteger(correctAnswer)) {
        feedback.innerHTML = "<b>\u{1f620} A developer did not return a valid correct answer for this graph</b>";
    } else if (userId % 2 == 0) {
        const err = Math.abs(correctAnswer - answer);

        if (err < 10) {
            feedback.innerHTML = "<b>\u{1f600} Congratulations, you were within 10% of the correct answer!<b>";
        } else {
            feedback.innerHTML = `<b>\u2639 You were ${err} away from the correct answer of ${correctAnswer}%<b>`;
        }
    }

    textField.value = ""; 
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
    if (genData[tempA] <= genData[tempB]){
        var tempC = tempA;
        tempA = tempB;
        tempB = tempC;
    }

    var margin = {top: 25, right: 25, bottom: 25, left: 25},
        width = 300 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    svg.attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
            
    var x = d3.scaleBand()
        .range([ 0, width ])
        .domain(genData.map(function(d,i) { 
            if(i ==  tempA){
                return "A";
            } else if(i == tempB){
                return "B";
            } else {
                return i+1;
            } 
        }))
        .padding(0.2);
        
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickFormat(x => /[AB]/.test(x) ? x : ""))
    .selectAll("text")
        .style("text-anchor", "end")
        .style("font-weight", "bold");
        
    var y = d3.scaleLinear()
        .domain([0, 100])
        .range([ height, 0]);
        
    svg.append("g")
        .call(d3.axisLeft(y));

    svg.selectAll("mybar")
        .data(genData)
        .enter()
        .append("rect")
        // .attr("x", function(d,i) { return x(i); })
        .attr("x", function(d,i) { 
            if(i ==  tempA){
                return x("A");
            } else if(i == tempB){
                return x("B");
            } else {
                return x(i+1);
            }
        })
        .attr("y", function(d) { return y(d); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d); })
        // .attr("fill", "#FFFFFF")
        .attr("fill", function (d,i) {
            switch(i){
              case tempA:
                return "#666666";
              case tempB:
                return "#AAAAAA";
              default:
                return "#FFFFFF";
            }
        })
        .attr('stroke', '#000000');

    var difference = genData[tempB] / genData[tempA];
    console.log("A%B: " + Math.floor(difference * 100));
    return Math.floor(difference * 100);
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
    
    var mygroups = ["seriesA", "seriesB"] // list of group names
    var mygroup = [0,1] // list of group names
    const nSamples = 10;
    const data = [];

    for (let i = 0; i < nSamples; i++) {
        for (const series of mygroups) {
            data.push({
                year: i,
                n: Math.floor(Math.random() * 100),
                name: series,
            });
        }
    }

    var bottomA = ['#AAAAAAAA','#666666AA', '#333333AA'];
    var topA = ['#333333AA','#666666AA', '#AAAAAAAA'];
    var rangeA = [];

    var tempA = data[10].n //5 A
    var tempB = data[11].n //5 B
    var A;
    var B;
    if (tempA <= tempB){
        rangeA = topA;
        A = tempB;
        B = tempA;
    } else {
        rangeA = bottomA;
        A = tempA;
        B = tempB;
    }
    // Stack the data: each group will be represented on top of each other
    // group the data: one array for each value of the X axis.
    var sumstat = d3.nest()
        .key(function(d) { return d.year;})
        .entries(data);

    var stackedData = d3.stack()
        .keys(mygroup)
        .value(function(d, key){
            return d.values[key].n;
        })
        (sumstat)

    // Add X axis --> it is a date format
    var x = d3.scaleLinear()
        .domain(d3.extent(data, function(d) { return d.year; }))
        .range([ 0, width ]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(2).tickSize(-height).tickFormat(x => /[5]/.test(x) ? "X" : ""));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return +d.n; })*2]) // 1.2
        .range([ height, 0 ]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // color palette
    var color = d3.scaleOrdinal()
        .domain(mygroups)
        .range(rangeA)

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

    var difference = B / A;
    console.log("A%B: " + Math.floor(difference * 100));
    return Math.floor(difference * 100);
}


function buildBubbleGraph(svg) {
        // set the dimensions and margins of the graph
    var margin = {top: 25, right: 25, bottom: 25, left: 25},
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
        let r = Math.floor(Math.random() * i)
        if(r < 5){
            r =+ 5;
        }
        return r;
    }

    data = []
    var A;
    var B;

    for (let i = 0; i < 12; i++) {
        if(i == 0){
            temp = {
                "xd": getRandomInt(40),
                "yd": getRandomInt(50),
                "color": "A"
            }
        } else if(i == 1){
            temp = {
                "xd": getRandomInt(40),
                "yd": getRandomInt(50),
                "color": "A"
            }
            if(data[0].yd < temp.yd){
                data[0].color = "B"
                A = temp.yd;
                B = data[0].yd;
            }
            else{
                temp.color ="B"
                B = temp.yd;
                A = data[0].yd;
            }
        }
        else{
            temp = {
                "xd": getRandomInt(40),
                "yd": getRandomInt(50),
                "color": ""
            }
        }
        data[i] = temp
    }

    // Add X axis
    var x = d3.scaleLinear()
    .domain([0, 40])
    .range([ 0, width ]);
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(0));

    // Add Y axis
    var y = d3.scaleLinear()
    .domain([0, 50])
    .range([ height, 0]);
    svg.append("g")
    .call(d3.axisLeft(y));

    // Add dots
    svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return x(d.xd); } )
    .attr("cy", function (d) { return y(d.yd); } )
    .attr("r", function (d) { return 5+(d.yd*0.2)})
    .style("line", "black")
        .attr("fill", function (d) {
            switch(d.color){
              case "A":
                return "#666666";
              case "B":
                return "#AAAAAA";
              default:
                return "#FFFFFF00";
            }
        })
        .attr('stroke', '#000000')
        .append('text')
        .text(d => d.color)
        .attr('color', 'black')
        .attr('font-size', 15);

    var difference = B / A;
    console.log("A%B: " + Math.floor(difference * 100));
    return Math.floor(difference * 100);

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

