// Margins
var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40
    },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate (" + margin.left + "," + margin.top + ")");

// Code for tooltip from: https://bl.ocks.org/alandunning/274bf248fd0f362d64674920e85c1eb7
var tooltip = d3.select("body").append("div").attr("class", "toolTip");

// Scaled Y for vertical chart
var y = d3.scaleLinear()
    .range([height, 0]); // Remember: up / down are flipped !

// ScaleBand function to split the range into bins
var x = d3.scaleBand()
    .range([0, width]).padding([0.1]); // The last parameter adds padding

// Label positioning
var xAxis = d3.axisBottom().scale(x); // Positions the labels under the xAxis
var yAxis = d3.axisLeft().scale(y); // Positions the labels to the left of the yAxisPositions the labels to the left of the yAxis

// Add title to chart
chart.append("text")
    .attr("x", (width / 2))
    .attr("y", 0 + (margin.top / 2))
    .attr("text-anchor", "middle")
    .text("Relative Frequency of Letters in the English Alphabet");

// Load Data
d3.csv("/data/data.csv").then(function (data) 
{
    // Domains
    x.domain(data.map(function (d) 
    {
        return d.letter;
    }));
    y.domain([0, d3.max(data, function (d) {
        return d.frequency;
    })]);

    // Add x axis to chart
    chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate (0, " + height + ")")
        .call(xAxis);

    // Add Y Axis to chart
    chart.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    // Add bars and data to chart
    chart.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
            return x(d.letter);
        })
        .attr("y", function (d) {
            return y(d.frequency);
        })
        .attr("height", function (d) {
            return height - y(d.frequency);
        })
        .attr("width", x.bandwidth())
        // Mouse over for tooltip
        .on("mousemove", function (d) {
            tooltip
                .style("left", d3.event.pageX - 50 + "px")
                .style("top", d3.event.pageY - 70 + "px")
                .style("display", "inline-block")
                .html("Frequency: " + "<div class='frequencyText'>" + (d.frequency) + "</div>");
        })
        .on("mouseout", function (d) {
            tooltip.style("display", "none");
        });
});