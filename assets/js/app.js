
function makeResponsive () {

// Set scatter parameters
var svgWidth = window.innerHeight;
var svgHeight = window.innerWidth;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group, and shift the latter by left and top margins.
var svg = d3
  .select(".scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("data.csv")
  .then(function(demoData) {

    // Parse Data/Cast as numbers
    // ==============================
    demoData.forEach(function(d) {
        d.state = d.state;
        d.abbr = d.abbr;
        d.age = +d.age;
        d.smokes = +d.smokes;
        // d.smokesLow = +d.smokesLow;
        // d.smokesHigh = +d.smokesHigh;
    });

// Data correctly pulls    
// console.log(demoData);

    // Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([20, d3.max(demoData, d => d.smokes)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(demoData, d => d.age)])
      .range([height, 0]);

    // Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
      .data(demoData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.smokes))
      .attr("cy", d => yLinearScale(d.age))
      // need text for abbrevs
      .attr("r", "15")
      .attr("fill", "grey")
      .attr("opacity", ".5");

    // Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.abbr}<br>Age: ${d.age}<br>Smokes: ${d.smokes}`);
      });

    // Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(d) {
      toolTip.show(d, this);
    })
      // onmouseout event
      .on("mouseout", function(d, i) {
        toolTip.hide(d);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Age");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Smokes)");
  });
}
// Add event listener for window size changes  
// makeResponsive ();
// d3.select(window).on("resize", makeResponsive);