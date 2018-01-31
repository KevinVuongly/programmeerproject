//Practically all this code comes from https://github.com/alangrafu/radar-chart-d3
//I only made some additions and aesthetic adjustments to make the chart look better
//(of course, that is only my point of view)
//Such as a better placement of the titles at each line end,
//adding numbers that reflect what each circular level stands for
//Not placing the last level and slight differences in color
//
//For a bit of extra information check the blog about it:
//http://nbremer.blogspot.nl/2013/09/making-d3-radar-chart-look-bit-better.html

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

var currentCountry = {
    id: 0,
};

// options for the Radar chart, other than default
var mycfg = {
  w: w,
  h: h,
  maxValue: 1,
  levels: 2,
  ExtraWidthX: 200
}

var radarChart = {
    createMin: function(Id2012, Id2015) {
        return [Math.min.apply(null, Object.values(Id2012).filter(getMinimum)),
                Math.min.apply(null, Object.values(Id2015).filter(getMinimum))];
    },

    createMax: function(Id2012, Id2015) {
        return [Math.max.apply(null, Object.values(Id2012)),
                Math.max.apply(null, Object.values(Id2015))];
    },

    draw: function(id, d, options) {

        if ('undefined' !== typeof options) {
            for (var i in options){
        	    if ('undefined' !== typeof options[i]) {
        	        cfg[i] = options[i];
        	    }
            }
        }

    	cfg.maxValue = Math.max(cfg.maxValue,
            d3.max(d, function(i) {return d3.max(i.map(function(o){return o.value;})); }));

    	var allAxis = (d[0].map(function(i, j) {return i.axis; }));
    	var total = allAxis.length;
    	var radius = cfg.factor * Math.min(cfg.w / 2, cfg.h / 2);
    	var Format = d3.format('%');
    	d3.select(id).select("svg").remove();

    	var g = d3.select(id)
    		.append("svg")
            .attr("class", "radarchart")
    		.attr("width", cfg.w + cfg.ExtraWidthX)
    		.attr("height", cfg.h + cfg.ExtraWidthY)
    		.append("g")
    		.attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");

    	var tooltip;

	    //  circular segments
        for(var j = 0; j < cfg.levels - 1; j++) {
            var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
	        g.selectAll(".levels")
	        .data(allAxis)
            .enter()
            .append("svg:line")
            .attr("x1", function(d, i) {
                return levelFactor * (1 - cfg.factor * Math.sin(i * cfg.radians / total)); })
            .attr("y1", function(d, i) {
                return levelFactor * (1 - cfg.factor * Math.cos(i * cfg.radians / total)); })
            .attr("x2", function(d, i) {
                return levelFactor * (1 - cfg.factor * Math.sin((i + 1) * cfg.radians / total)); })
            .attr("y2", function(d, i) {
                return levelFactor * (1 - cfg.factor * Math.cos((i + 1) * cfg.radians / total)); })
            .attr("class", "line")
            .style("stroke", "grey")
            .style("stroke-opacity", "0.75")
            .style("stroke-width", "0.3px")
            .attr("transform", "translate(" +
                (cfg.w / 2 - levelFactor) + ", " +
                (cfg.h / 2 - levelFactor) + ")");
	    }

	    // text indicating at what % each level is
        for(var j = 0; j < cfg.levels; j++) {
	        var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
	        g.selectAll(".levels")
	        .data([1])
            .enter()
            .append("svg:text")
            .attr("x", function(d) {
                return levelFactor * (1 - cfg.factor * Math.sin(0)); })
            .attr("y", function(d) {
                return levelFactor * (1 - cfg.factor * Math.cos(0)); })
            .attr("class", "legend")
            .style("font-family", "sans-serif")
            .style("font-size", "10px")
            .attr("transform", "translate(" +
                (cfg.w / 2 - levelFactor + cfg.ToRight) + ", " +
                (cfg.h / 2 - levelFactor) + ")")
            .attr("fill", "#737373")
            .text(Format(( j + 1) * cfg.maxValue / cfg.levels));
	    }

        series = 0;

        var axis = g.selectAll(".axis")
            .data(allAxis)
        	.enter()
        	.append("g")
        	.attr("class", "axis");

        axis.append("line")
            .attr("x1", cfg.w / 2)
            .attr("y1", cfg.h / 2)
            .attr("x2", function(d, i) {
                return cfg.w / 2 * (1 - cfg.factor * Math.sin(i * cfg.radians / total)); })
            .attr("y2", function(d, i) {
                return cfg.h / 2 * (1 - cfg.factor * Math.cos(i * cfg.radians / total)); })
            .attr("class", "line")
            .style("stroke", "grey")
            .style("stroke-width", "1px");

        axis.append("text")
            .attr("class", "legend")
            .text(function(d) {return d; })
            .style("font-family", "sans-serif")
            .style("font-size", "11px")
            .attr("text-anchor", "middle")
            .attr("dy", "1.5em")
            .attr("transform", function(d, i) {return "translate(0, -10)"; })
            .attr("x", function(d, i) {return cfg.w / 2 * (1 - cfg.factorLegend * Math.sin(i * cfg.radians / total)) - 60 * Math.sin(i * cfg.radians / total);})
            .attr("y", function(d, i) {return cfg.h / 2 * (1 - Math.cos(i * cfg.radians / total))-20 * Math.cos(i * cfg.radians / total);});

        d.forEach(function(y, x){
	        dataValues = [];
	        g.selectAll(".nodes")
		        .data(y, function(j, i){
		            dataValues.push([
			        cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
			        cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
		        ]);
		    });

        dataValues.push(dataValues[0]);
	    g.selectAll(".area")
	        .data([dataValues])
			.enter()
			.append("polygon")
			.attr("class", "radar-chart-serie"+series)
			.style("stroke-width", "2px")
			.style("stroke", cfg.color)
			.attr("points",function(d) {
			    var str="";
				for(var pti = 0; pti < d.length; pti++) {
			        str = str + d[pti][0] + "," + d[pti][1] + " ";
				}
				return str;
			})
			.style("fill", function(j, i) {return cfg.color; })
			.style("fill-opacity", cfg.opacityArea)
			.on('mouseover', function (d) {
				z = "polygon." + d3.select(this).attr("class");
				g.selectAll("polygon")
				    .transition(200)
				    .style("fill-opacity", 0.1);
				g.selectAll(z)
				    .transition(200)
				    .style("fill-opacity", .7);
		    })
			.on('mouseout', function(){
				g.selectAll("polygon")
				    .transition(200)
				    .style("fill-opacity", cfg.opacityArea);
			 });
	    series++;
        });

	    series = 0;

	    d.forEach(function(y, x){
	        g.selectAll(".nodes")
		        .data(y).enter()
		        .append("svg:circle")
		        .attr("class", "radar-chart-serie"+series)
		        .attr('r', cfg.radius)
		        .attr("alt", function(j) {return Math.max(j.value, 0); })
		        .attr("cx", function(j, i) {
		            dataValues.push([
			            cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
			            cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
		            ]);
		            return cfg.w / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total));
		        })
		    .attr("cy", function(j, i) {
		        return cfg.h / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total));
		    })
		    .attr("data-id", function(j) {return j.axis; })
		    .style("fill", cfg.color).style("fill-opacity", .9)
		    .on('mouseover', function(d) {
			    newX =  parseFloat(d3.select(this).attr('cx')) - 10;
			    newY =  parseFloat(d3.select(this).attr('cy')) - 5;

				tooltip
    				.attr('x', newX)
    				.attr('y', newY)
    				.text(Format(d.value))
    				.transition(200)
    				.style('opacity', 1);

					z = "polygon." + d3.select(this).attr("class");
					g.selectAll("polygon")
						.transition(200)
						.style("fill-opacity", 0.1);
					g.selectAll(z)
						.transition(200)
						.style("fill-opacity", .7);
			})
		    .on('mouseout', function() {
			    tooltip
				    .transition(200)
					.style('opacity', 0);

				g.selectAll("polygon")
    				.transition(200)
    				.style("fill-opacity", cfg.opacityArea);
			})
		    .append("svg:title")
		        .text(function(j){return Math.max(j.value, 0); });

	        series++;
	    });

	    // Tooltip
	    tooltip = g.append('text')
	        .style('opacity', 0)
			.style('font-family', 'sans-serif')
			.style('font-size', '13px');
    },

    updateValues: function(id, name, sliderValue, countryColor2012, countryColor2015, d, ranges) {
        d3.select(id)
            .text(name);

        if (sliderValue <= 0.5) {
            cfg.color = color(countryColor2012);
            dradar[0][0].value = (d.GDP - ranges.minGDP[0]) / (ranges.maxGDP[0] - ranges.minGDP[0]);
            dradar[0][1].value = (d.Salary - ranges.minSalary[0]) / (ranges.maxSalary[0] - ranges.minSalary[0]);
            dradar[0][2].value = (d.Spendings - ranges.minSpendings[0]) / (ranges.maxSpendings[0] - ranges.minSpendings[0]);
            dradar[0][3].value = (d.Science - ranges.minScience[0]) / (ranges.maxScience[0] - ranges.minScience[0]);
            dradar[0][4].value = (d.Reading - ranges.minReading[0]) / (ranges.maxReading[0] - ranges.minReading[0]);
            dradar[0][5].value = (d.Math - ranges.minMath[0]) / (ranges.maxMath[0] - ranges.minMath[0]);
        }
        else {
            cfg.color = color(countryColor2015);
            dradar[0][0].value = (d.GDP - ranges.minGDP[1]) / (ranges.maxGDP[1] - ranges.minGDP[1]);
            dradar[0][1].value = (d.Salary - ranges.minSalary[1]) / (ranges.maxSalary[1] - ranges.minSalary[1]);
            dradar[0][2].value = (d.Spendings - ranges.minSpendings[1]) / (ranges.maxSpendings[1] - ranges.minSpendings[1]);
            dradar[0][3].value = (d.Science - ranges.minScience[1]) / (ranges.maxScience[1] - ranges.minScience[1]);
            dradar[0][4].value = (d.Reading - ranges.minReading[1]) / (ranges.maxReading[1] - ranges.minReading[1]);
            dradar[0][5].value = (d.Math - ranges.minMath[1]) / (ranges.maxMath[1] - ranges.minMath[1]);
        }

        for (i = 0; i < dradar[0].length; i++) {
            if (dradar[0][i].value < 0 || isNaN(dradar[0][i].value)) {
                dradar[0][i].value = 0;
            }
        }
    }
};
