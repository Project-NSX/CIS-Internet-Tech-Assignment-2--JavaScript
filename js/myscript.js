var data = [4, 8, 15, 16, 23, 42];

// // Div Chart:
// var x = d3.scaleLinear()
//     .domain([0, d3.max(data)])
//     . range([0, 430]);

// d3.select(".chart ")
//     .selectAll("div")
//     .data(data)
//     .enter().append("div")
//     .style("width", function(d) { return x(d) + "px"; }) 
//     .text ( function (d) { return d; }) ;

// SVG Chart
// var width = 420 ,
// barHeight = 20;

// var x = d3.scaleLinear ()
//     .domain([0, d3.max(data)])
//     .range([0, width]) ;

// var chart = d3.select (".chart ")
//     .attr("width", width)
//     .attr("height", barHeight * data.length);

// var bar = chart.selectAll ("g")
//     .data(data)
//     .enter().append("g")
//     .attr("transform", function(d, i) { return "translate(0," + i * barHeight +")";});

// bar.append("rect")
//     .attr("width", x)
//     .attr("height", barHeight - 1);

// bar.append("text")
//     .attr("x", function(d) { return x (d) - 3;})
//     .attr("y", barHeight / 2)
//     .attr("dy", ".35em")
//     .text(function(d) {return d; }) ;





// Data Driven SVG Chart
var margin = { top: 20 , right: 20 , bottom: 30 , left: 40} ,
width = 960 - margin.left - margin.right ,
height = 500 - margin.top - margin.bottom;

var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom )
    .append("g")
    .attr("transform", "translate (" + margin.left + "," + margin.top +")") ;

var y = d3.scaleLinear()
    .range([height, 0]) ; // Remember: up / down are flipped !

var x = d3.scaleBand()
    .range([0, width]).padding([0.1]); // The last parameter adds padding

var xAxis = d3.axisBottom().scale(x); // Positions the labels under the xAxis
var yAxis = d3.axisLeft().scale(y); // Positions the labels to the left of the yAxisPositions the labels to the left of the yAxis

d3.csv("/data/data.csv").then(function(data) 
{
    x.domain(data.map(function(d){return d.letter;}));
    y.domain([0, d3.max(data, function(d){return d.frequency;})]);

    chart.append ("g")
        .attr("class", "x axis")
        .attr("transform", "translate (0, " + height + ")")
        .call(xAxis);

    chart.append ("g")
        .attr("class", "y axis")
        .call(yAxis);
        
    chart.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {return x (d.letter);})
        .attr("y", function(d) {return y (d.frequency);})
        .attr("height", function(d) {return height - y (d.frequency);})
        .attr("width", x.bandwidth()) ;

    chart.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 + (margin.top / 2) )
        .attr("text-anchor", "middle")
        .text("Relative Frequency of Letters in the English Alphabet") ;
}) ;




