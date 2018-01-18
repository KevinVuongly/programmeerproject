const w = 200,
	  h = 200;

//Data
var dradar = [
		  [
			{axis:"GDP per resident",value:0},
			{axis:"Teacher Salaries",value:0},
			{axis:"Education Spendings",value:0},
			{axis:"Science",value:0},
			{axis:"Readings",value:0},
			{axis:"Mathematics",value:0}
		  ]
		];

//Options for the Radar chart, other than default
var mycfg = {
  w: w,
  h: h,
  maxValue: 1,
  levels: 2,
  ExtraWidthX: 200
}

document.addEventListener("DOMContentLoaded", function() {

	var container = d3.select("body")
		.append("div")
		.attr("class", "col-lg-6 col-md-6 col-sm-6 col-xs-12");

	container.append("div")
		.attr("id", "body")
	    .append("div")
	    .attr("id", "chart");

	container.append("div")
		.attr("id", "country")
		.append("text")
		.attr("id", "radarTitle")
        .style("font-size", "26px")
		.text("Click on a country");

	//Call function to draw the Radar chart
	//Will expect that data is in %'s
	RadarChart.draw("#chart", dradar, mycfg);

})
