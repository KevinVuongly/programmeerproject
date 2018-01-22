var margin = {top: 50, right: 20, bottom: 30, left: 30},
             width = 650 - margin.left - margin.right,
             height = 600 - margin.top - margin.bottom;

var color = d3.scale.threshold()
    .domain([1150,1200,1290,1380,1450,1520,1550,1580,1650])
    .range(["rgb(72,0,0)", "rgb(103,0,13)", "rgb(165,15,21)",
            "rgb(203,24,29)", "rgb(239,59,44)", "rgb(251,106,74)",
            "rgb(252,146,114)", "rgb(252,187,161)", "rgb(254,224,210)"]);

var format = d3.format(",");

var slider = new simpleSlider();

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
