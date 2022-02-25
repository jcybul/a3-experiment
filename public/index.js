
const userId = Math.floor(1000000000 * Math.random());
let questionNumber = -1;
let flag = true;
let graphType = "n/a";
let correctAnswer = 0;
let numberCorrect = 0;

function sendResults(data) {
    return fetch("/api/results", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
    .then(console.log);
}


function submitAnswer(event) {
    if (event) {
        event.preventDefault();
    }
    
    const textField = document.getElementById("answer");
    const feedback = document.getElementById("feedback");
    const location = document.getElementById("location");
    const share = document.createElement("button");
    

    if (textField.value === "") {
        feedback.innerHTML = "<b>\u{1f615}</b> You need to enter a value";
        return;
    }

    const answer = parseInt(textField.value);

    if (answer < 0 || answer > 100) {
        feedback.innerHTML = "Please enter a value within bounds";
        return;
    }

    feedback.innerHTML = "";

    if (questionNumber < 63) {
        sendResults({
            answer,
            timestamp: new Date().getTime(),
            userId,
            graphType,
            questionNumber,
            correctAnswer,
        });
    }

    if (questionNumber >= 2 && questionNumber < 63) {
        location.innerHTML = `<b>${questionNumber-2}/60<b>`;
    
        if (questionNumber >= 3){
            if (!Number.isInteger(correctAnswer)) {
                feedback.innerHTML = "<b>\u{1f620} A developer did not return a valid correct answer for this graph</b>";
            } else if (userId % 2 == 0) {
                const err = Math.abs(correctAnswer - answer);

                if (err < 10) {
                    feedback.innerHTML = "<b>\u{1f600} Congratulations, you were within 10% of the correct answer!<b>";
                    numberCorrect +=1;
                } else {
                    feedback.innerHTML = `<b>\u2639 You were ${err}% away from the correct answer of ${correctAnswer}%<b>`;
                }
            } else {
                const err = Math.abs(correctAnswer - answer);

                if (err < 10) {
                    numberCorrect +=1;
                } 
            }
        }
    
    }

    textField.value = ""; 

    if (questionNumber < 63) {
        buildNextGraph();
    } else if (questionNumber === 63) {
        share.innerHTML = "Copy Results!";
        document.body.appendChild(share);
        share.addEventListener("click", function () {
            const copyText = "I guessed " + numberCorrect + "/60 correct! " +
            "Link: https://meggitt.dev";
            navigator.clipboard.writeText(copyText);
        })
        document.getElementById("graphContainer").outerHTML = "";
        document.getElementById("answer").outerHTML = "";
        document.getElementById("submit").outerHTML = "";
        feedback.innerHTML = `<b>Thank you for participating! Your total score was ${numberCorrect}/60<b>`;
        questionNumber++;
    } else {
        feedback.innerHTML = `<b>Thank you for participating! Your total score was ${numberCorrect}/60<b>`;
    }
    
}

window.onload = function() {
    const submitButton = document.getElementById("submit");
    submitButton.onclick = submitAnswer;

    buildNextGraph();
}

function fixFormEnter(event) {
    if (event.key === "Enter") {
        submitAnswer();
    }
    
    return event.key !== "Enter";
}

function buildBarGraph(svg,flag) {

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

    if(flag){
        var margin = {top: 25, right: 25, bottom: 100, left: 25},
            width = 300 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;
    } else {
        var margin = {top: 25, right: 25, bottom: 25, left: 25},
            width = 300 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;
    }

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
                return "#FFFFFF00";
            }
        })
        .attr('stroke', '#000000');

    var difference = genData[tempB] / genData[tempA];
    var actDifference = Math.floor(difference * 100);
    // console.log("A%B: " + actDifference);

    if(flag){
        svg.append("text")
            .attr("x", 40)
            .attr("y", 210)
            .text("Here we have a Bar Graph");

        svg.append("text")
            .attr("x", 25)
            .attr("y", 230)
            .text("The larger value A is dark gray");

        svg.append("text")
            .attr("x", 20)
            .attr("y", 250)
            .text("The smaller value B is light gray");

        svg.append("text")
            .attr("x", 25)
            .attr("y", 270)
            .text("B is " + actDifference + "% of A. Report " + actDifference + " below:");
    }

    return actDifference;
}

function buildAreaGraph(svg,flag) {

    if(flag){
        var margin = {top: 25, right: 25, bottom: 100, left: 25},
            width = 300 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;
    } else {
        var margin = {top: 25, right: 25, bottom: 25, left: 25},
            width = 300 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;
    }

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
    var actDifference = Math.floor(difference * 100);
    // console.log("A%B: " + actDifference);

    if(flag){
        svg.append("text")
            .attr("x", 15)
            .attr("y", 210)
            .style("font-size", "14px")
            .text("Here we have a Stacked Area Graph");

        svg.append("text")
            .attr("x", 0)
            .attr("y", 225)
            .style("font-size", "14px")
            .text("The larger (dataset) at point X is dark gray");

        svg.append("text")
            .attr("x", 0)
            .attr("y", 240)
            .style("font-size", "14px")
            .text("The smaller (dataset) at point X is light gray");

        svg.append("text")
            .attr("x", 0)
            .attr("y", 255)
            .style("font-size", "14px")
            .text("The top color is stacked on the bottom color");

        svg.append("text")
            .attr("x", 0)
            .attr("y", 270)
            .style("font-size", "14px")
            .text("Y value of light gray at X is " + actDifference + "% of dark gray");

        svg.append("text")
            .attr("x", 60)
            .attr("y", 285)
            .style("font-size", "14px")
            .text("Report " + actDifference + " below:");
    }
    return actDifference;
}


function buildBubbleGraph(svg,flag) {
    // set the dimensions and margins of the graph
    
    if(flag){
        var margin = {top: 25, right: 25, bottom: 100, left: 25},
            width = 300 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;
    } else {
        var margin = {top: 25, right: 25, bottom: 25, left: 25},
            width = 300 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;
    }

    function getRandomInt(i){
        let r = Math.floor(Math.random() * i)
        if(r < 5){
            r =+ 5;
        }
        return r;
    }

    if(!flag){
        data = []
        var A;
        var B;

        for (let i = 0; i < 10; i++) {
            if (i == 0){
                temp = {
                    "xd": getRandomInt(40),
                    "yd": getRandomInt(50),
                    "color":"A"
                }
            } else if (i == 1){
                temp = {
                    "xd": getRandomInt(40),
                    "yd": getRandomInt(50),
                    "color": "A"
                }
                if (data[0].yd < temp.yd){
                    data[0].color = "B"
                    A = temp.yd;
                    B = data[0].yd;
                } else {
                    temp.color ="B"
                    B = temp.yd;
                    A = data[0].yd;
                }
            } else {
                temp = {
                    "xd": getRandomInt(40),
                    "yd": getRandomInt(50),
                    "color": ""
                }
            }
            data[i] = temp
        }
    } else {
        data = []
        data[0] = {"xd": 4,"yd": 40,"color": "A","text":"This is the larger bubble!"}
        data[1] = {"xd": 4,"yd": 10,"color": "B","text":"This bubble is 25% of the other!" }
        A = 40
        B = 10
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

    svg.selectAll(".dodo")
        .data(data)
        .enter()
        .append("text")
        // Add your code below this line
        .text((d) => d.text)
        .attr("x", function(d) { return x(d.xd)+10; })
        .attr("y", function(d) { return y(d.yd)-5; })

    var difference = B / A;
    var actDifference = Math.floor(difference * 100);
    // console.log("A%B: " + actDifference);
    
    if(flag){
        svg.append("text")
            .attr("x", 30)
            .attr("y", 210)
            .style("font-size", "14px")
            .text("Here we have a Bubble Graph");

        svg.append("text")
            .attr("x", 0)
            .attr("y", 230)
            .style("font-size", "14px")
            .text("The dark gray point has a larger Y value/size");

        svg.append("text")
            .attr("x", 0)
            .attr("y", 250)
            .style("font-size", "14px")
            .text("The light gray point has a smaller Y value/size");

        svg.append("text")
            .attr("x", 0)
            .attr("y", 270)
            .style("font-size", "14px")
            .text("The value of light gray is " + actDifference + "% of the dark gray");

        svg.append("text")
            .attr("x", 60)
            .attr("y", 290)
            .style("font-size", "14px")
            .text("Report " + actDifference + " below:");
    }
    
    return actDifference;

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
    if(questionNumber > 2){
        flag = false;
    }
    
    // Build new graph in container and get the correct answer after it has been randomly generated
    correctAnswer = builder(svg,flag);
    graphType = name;

    if (!Number.isInteger(correctAnswer)) {
        console.log(`Expected ${name} graph builder to return the correct answer (integer % between 0-100)!`);
    }
}      

