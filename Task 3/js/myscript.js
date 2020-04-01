// Sources:
// https://bl.ocks.org/gordlea/27370d1eea8464b04538e6d8ced39e89
// https://bl.ocks.org/d3noob/c506ac45617cf9ed39337f99f8511218
// Code for tooltip from: https://bl.ocks.org/alandunning/274bf248fd0f362d64674920e85c1eb7

// Margins
var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40
    },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Declare D3 chart
var chart = d3
    .select('.chart')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate (' + margin.left + ',' + margin.top + ')');

// Code for tooltip from: https://bl.ocks.org/alandunning/274bf248fd0f362d64674920e85c1eb7
var tooltip = d3.select('body').append('div').attr('class', 'toolTip');

// Scaled Y for vertical chart
var y = d3.scaleLinear().range([height, 0]); // Remember: up / down are flipped !

// ScaleBand function to split the range into bins
var x = d3.scaleBand().range([0, width]).padding([0.1]); // The last parameter adds padding

// Add title to chart
chart
    .append('text')
    .attr('x', width / 2)
    .attr('y', 0 + margin.top / 2)
    .attr('text-anchor', 'middle')
    .text('Relative Frequency of Letters in the English Alphabet');

// gridlines in x axis function
function make_x_gridlines() {
    return d3.axisBottom(x).ticks(5);
}

// gridlines in y axis function
function make_y_gridlines() {
    return d3.axisLeft(y).ticks(5);
}

// Format for use with Y axis
format = d3.format('.0%');

// Load Data
d3.csv('/data/data.csv').then(function (data) {
    // Domains
    x.domain(
        data.map(function (d) {
            return d.letter;
        })
    );
    y.domain([
        0,
        d3.max(data, function (d) {
            return d.frequency;
        })
    ]);

    // 7. d3's line generator
    var line = d3
        .line()
        .x(function (d, i) {
            return x(d.letter);
        }) // set the x values for the line generator
        .y(function (d) {
            return y(d.frequency);
        }) // set the y values for the line generator
        .curve(d3.curveMonotoneX); // apply smoothing to the line

    // Label positioning
    var xAxis = d3.axisBottom().scale(x); // Positions the labels under the xAxis
    var yAxis = d3.axisLeft().scale(y).tickFormat(format); // Positions the labels to the left of the yAxisPositions the labels to the left of the yAxis

    // Add x axis to chart
    chart.append('g').attr('class', 'x axis').attr('transform', 'translate (0, ' + height + ')').call(xAxis);

    // Add Y Axis to chart
    chart.append('g').attr('class', 'y axis').call(yAxis);

    // add the X gridlines
    chart
        .append('g')
        .attr('class', 'grid')
        .attr('transform', 'translate(0,' + height + ')')
        .call(make_x_gridlines().tickSize(-height).tickFormat(''));

    // add the Y gridlines
    chart
        .append('g')
        .attr('class', 'grid')
        .call(make_y_gridlines()
            .tickSize(-width)
            .tickFormat(''));

    // Append the path, bind the data, and call the line generator
    chart
        .append('path')
        .datum(data) // 10. Binds data to the line
        .attr('class', 'line') // Assign a class for styling
        .attr('d', line); // 11. Calls the line generator

    // Appends a circle for each datapoint
    chart
        .selectAll('.dot')
        .data(data)
        .enter()
        .append('circle') // Uses the enter().append() method
        .attr('class', 'dot') // Assign a class for styling
        .attr('cx', function (d, i) {
            return x(d.letter);
        })
        .attr('cy', function (d) {
            return y(d.frequency);
        })
        .attr('r', 5)
        // Tooltip on mouseover
        .on('mouseover', function (d) {
            tooltip
                .style("left", d3.event.pageX - 50 + "px")
                .style("top", d3.event.pageY - 70 + "px")
                .style("display", "inline-block")
                .html("Frequency: " + "<div class='frequencyText'>" + (d.frequency) + "</div>");
        })
        .on('mouseout', function () {
            tooltip.style("display", "none");
        });
});