var marginworld = {top: 50, right: 20, bottom: 30, left: 30},
             widthworld = 650 - marginworld.left - marginworld.right,
             heightworld = 600 - marginworld.top - marginworld.bottom;

// width and height of barchart
var marginscatter = {top: 20, right: 30, bottom: 30, left: 60},
    widthscatter = 600 - marginscatter.left - marginscatter.right,
    heightscatter = 400 - marginscatter.top - marginscatter.bottom;

var color = d3.scale.threshold()
    .domain([1150,1200,1290,1380,1450,1520,1550,1580,1650])
    .range(["rgb(72,0,0)", "rgb(103,0,13)", "rgb(165,15,21)",
            "rgb(203,24,29)", "rgb(239,59,44)", "rgb(251,106,74)",
            "rgb(252,146,114)", "rgb(252,187,161)", "rgb(254,224,210)"]);

var format = d3.format(",");

const w = 200,
	  h = 200;

// data
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

        var cfg = {
            radius: 5,
            w: 200,
            h: 200,
            factor: 1,
            factorLegend: .85,
            levels: 3,
            maxValue: 0,
            radians: 2 * Math.PI,
            opacityArea: 0.5,
            ToRight: 5,
            TranslateX: 80,
            TranslateY: 30,
            ExtraWidthX: 100,
            ExtraWidthY: 200,
            color: d3.rgb(0, 0, 0)
        };

// options for the Radar chart, other than default
var mycfg = {
  w: w,
  h: h,
  maxValue: 1,
  levels: 2,
  ExtraWidthX: 200
}

var datapoints = ["Education spendings", "GDP per capita", "Teacher salaries"];
