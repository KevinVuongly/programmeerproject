document.addEventListener("DOMContentLoaded", function() {

	d3.select("body")
		.append("div")
		.attr("class", "col-lg-6 col-md-6 col-sm-6 col-xs-12")
	    .append("div")
	    .attr("id", "body")
	    .append("div")
	    .attr("id", "chart")

	var w = 300,
		h = 300;

	//Data
	var d = [
			  [
				{axis:"GDP per resident",value:0.59},
				{axis:"Teacher Salaries",value:0.56},
				{axis:"Education Spendings",value:0.42},
				{axis:"Science",value:0.34},
				{axis:"Readings",value:0.48},
				{axis:"Mathematics",value:0.50}
			  ]
			];

	//Options for the Radar chart, other than default
	var mycfg = {
	  w: w,
	  h: h,
	  maxValue: 1,
	  levels: 2,
	  ExtraWidthX: 300
	}

	//Call function to draw the Radar chart
	//Will expect that data is in %'s
	RadarChart.draw("#chart", d, mycfg);

	////////////////////////////////////////////
	/////////// Initiate legend ////////////////
	////////////////////////////////////////////

	var svg = d3.select('#body')
		.selectAll('svg')
		.append('svg')
		.attr("width", w+300)
		.attr("height", h)
})
