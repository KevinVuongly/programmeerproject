/*
    Kevin Vuong
    10730141

    This file contains the general visualization of the website.

    Code used for the world map:
    http://bl.ocks.org/micahstubbs/01529b106c93f9b649c4006de5c79b80
*/

var marginworld = {top: 50, right: 20, bottom: 30, left: 30},
     widthworld = 650 - marginworld.left - marginworld.right,
     heightworld = 600 - marginworld.top - marginworld.bottom;

var color = d3.scale.threshold()
    .domain([1150,1200,1290,1380,1450,1520,1550,1580,1650])
    .range(["rgb(72,0,0)", "rgb(103,0,13)", "rgb(165,15,21)",
            "rgb(203,24,29)", "rgb(239,59,44)", "rgb(251,106,74)",
            "rgb(252,146,114)", "rgb(252,187,161)", "rgb(254,224,210)"]);

var pisaById2015 = [],
    pisaById2012 = [],
    GDPById2015 = [],
    GDPById2012 = [],
    spendingsById2015 = [],
    spendingsById2012 = [],
    salaryById2015 = [],
    salaryById2012 = [],
    readingsById2015 = [],
    readingsById2012 = [],
    scienceById2015 = [],
    scienceById2012 = [],
    mathById2015 = [],
    mathById2012 = [];

document.addEventListener("DOMContentLoaded", function() {

    // Set tooltips
    var format = d3.format(","),
        tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                    if (format(d.Accumulated) != "NaN")
                    {
                        return "<strong>Country: </strong><span class='details'>"
                        + d.properties.name + "<br></span>"
                        + "<strong>PISA score: </strong><span class='details'>"
                        + format(d.Accumulated) +"</span>";
                    }
                    else
                    {
                        return "<strong>Country: </strong><span class='details'>"
                        + d.properties.name + "<br></span><strong>PISA score: \
                        </strong><span class='details'>Unknown</span>";
                    }
                });

    // set worldmap
    var svg = d3.select("body")
        .append("div")
        .attr("class", "col-lg-12 col-md-12 col-sm-12 col-xs-12");

    var worldmap = svg.append("div")
            .attr("class", "worldmap")
            .append("svg")
            .attr("width", widthworld)
            .attr("height", heightworld);

    var projection = d3.geo.mercator()
        .scale(80)
        .translate( [widthworld / 2 - 20, 340]);

    var path = d3.geo.path().projection(projection);

    var g = worldmap.append("g").attr("class", "countries");

    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 8])
        .on("zoom", zoomed);

    worldmap.append("text")
        .attr("class", "worldmapTitle")
        .attr("x", (widthworld / 2))
        .attr("y", 40)
        .attr("text-anchor", "middle")
        .style("font-size", "36px")
        .text("Accumulated PISA score per country");

    worldmap.append("text")
        .attr("class", "year")
        .attr("x", widthworld - 70)
        .attr("y", 150)
        .attr("text-anchor", "middle")
        .style("font-size", "60px")
        .text("2015");

    // set slider
    var svgslider = svg.append("div")
        .attr("class","slider")
        .append("svg")
        .attr("width", 150)
        .attr("height", 50);

    // initialize scatterplot
    var x = d3.scale.linear().range([0, widthscatter]);
    var y = d3.scale.linear().range([heightscatter, 0]);

    var xAxis = d3.svg.axis().scale(x).orient("bottom");
    var yAxis = d3.svg.axis().scale(y).orient("left");

    var mbars = d3.select("body")
        .append("div")
        .attr("id", "mbars")
        .attr("class", "col-lg-6 col-md-6 col-sm-6 col-xs-12")

    // set rangeRegression.y for scatterplot
    var select = mbars.append("select")
      	.attr("class","select")

    var options = select.selectAll("option")
    	.data(datapoints).enter()
    	.append("option")
    	.text(function (d) { return d; });

    var svgscatter = mbars.append("div")
        .attr("class", "scatterplot")
        .append("svg")
        .attr("width", widthscatter + marginscatter.left + marginscatter.right)
        .attr("height", heightscatter + marginscatter.top + marginscatter.bottom)
        .append("g")
        .attr("transform", "translate(" + marginscatter.left
               + "," + marginscatter.top + ")");

    svgscatter.call(tip);
    worldmap.call(tip);
    worldmap.call(zoom);
    worldmap.call(zoom.event);

    queue()
        .defer(d3.json, "../data/world_countries.json")
        .defer(d3.csv, "../data/2015.csv")
        .defer(d3.csv, "../data/2012.csv")
        .await(ready);

    // draws front-end
    function ready(error, data, info2015, info2012) {
        if (error) throw error;

        // rework data for visualizations
        info2015.forEach(function(d) {
             pisaById2015[d.id] = +d.Accumulated;
             GDPById2015[d.id] = +d.GDP;
             spendingsById2015[d.id] = +d.Spendings;
             salaryById2015[d.id] = +d.Salary;
             readingsById2015[d.id] = +d.Reading;
             scienceById2015[d.id] = +d.Science;
             mathById2015[d.id] = +d.Math;
         })

        info2012.forEach(function(d) {
             pisaById2012[d.id] = +d.Accumulated;
             GDPById2012[d.id] = +d.GDP;
             spendingsById2012[d.id] = +d.Spendings;
             salaryById2012[d.id] = +d.Salary;
             readingsById2012[d.id] = +d.Reading;
             scienceById2012[d.id] = +d.Science;
             mathById2012[d.id] = +d.Math;
         })

         data.features.forEach(function(d) {
             d.Accumulated = pisaById2015[d.id];
             d.GDP = GDPById2015[d.id];
             d.Spendings = spendingsById2015[d.id];
             d.Salary = salaryById2015[d.id];
             d.Reading = readingsById2015[d.id];
             d.Science = scienceById2015[d.id];
             d.Math = mathById2015[d.id];
         })

        // set ranges for radar chart score calculations
        ranges = {
            minGDP: radarChart.createMin(GDPById2012, GDPById2015),
            maxGDP: radarChart.createMax(GDPById2012, GDPById2015),
            minSalary: radarChart.createMin(salaryById2012, salaryById2015),
            maxSalary: radarChart.createMax(salaryById2012, salaryById2015),
            minSpendings: radarChart.createMin(spendingsById2012, spendingsById2015),
            maxSpendings: radarChart.createMax(spendingsById2012, spendingsById2015),
            minScience: radarChart.createMin(scienceById2012, scienceById2015),
            maxScience: radarChart.createMax(scienceById2012, scienceById2015),
            minReading: radarChart.createMin(readingsById2012, readingsById2015),
            maxReading: radarChart.createMax(readingsById2012, readingsById2015),
            minMath: radarChart.createMin(mathById2012, mathById2015),
            maxMath: radarChart.createMax(mathById2012, mathById2015),
            minAccumulated: radarChart.createMin(pisaById2012, pisaById2015),
            maxAccumulated: radarChart.createMax(pisaById2012, pisaById2015)
        }

        // draw world map
        g.selectAll("path")
            .data(data.features)
        .enter().append("path")
            .attr("d", path)
            .style("fill", function(d) { return color(pisaById2015[d.id]); })
            .style("opacity", 0.8)
            .style("stroke","black")
            .style("stroke-width", 0.7)
            .on("mouseover",function(d){
                tip.show(d);

                d3.select(this)
                    .style("opacity", 1)
                    .style("stroke","white")
                    .style("stroke-width", 2);
            })
            .on("mouseout", function(d){
                tip.hide(d);

                d3.select(this)
                    .style("opacity", 0.8)
                    .style("stroke", "black")
                    .style("stroke-width", 0.7);
            })
            .on("click", function(d) {

                $('html,body').animate({
                    scrollTop: $("#chart").offset().top},
                    'slow');

                updateData(data.features, slider.value());

                // remember country, needed when updating radarchart for slider
                currentCountry = {
                    id: d.id,
                    name: d.properties.name,
                    color2012: pisaById2012[d.id],
                    color2015: pisaById2015[d.id],
                    slider: slider.value(),
                    GDP: d.GDP,
                    Salary: d.Salary,
                    Spendings: d.Spendings,
                    Science: d.Science,
                    Reading: d.Reading,
                    Math: d.Math
                };

                updateRadarValues("#radarTitle", currentCountry);

                radarChart.draw("#chart", dradar, mycfg);
            });

        // construct legend for world map
        var legend = worldmap.selectAll(".legend")
            .data(color.domain())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i)
            { return "translate(0," + Number(heightworld / 2 + 100 - i * 20) + ")"; });

        legend.append("rect")
            .attr("x", widthworld - 18)
            .attr("width", function(d, i) {
                if (i == color.domain().length - 1) { return 0; }
                else { return 18; }
            })
            .attr("height", function(d, i) {
                if (i == color.domain().length - 1) { return 0; }
                else { return 21; }
            })
            .style("opacity", 0.8)
            .style("fill", color);

        legend.append("text")
            .attr("x", widthworld - 23)
            .attr("y", 21)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d; });

        // draw scatterplot
        x.domain(d3.extent(info2015, function(d)
                 { return pisaById2015[d.id]; })).nice();
        y.domain(d3.extent(info2015, function(d)
                 { return spendingsById2015[d.id]; })).nice();

        // initial regression line
        var year = info2015,
            yearPoint = 1;

        var line = {
            x: x,
            y: y,
            ptA: 0,
            ptB: 0
        }

        rangeRegression.minX = ranges.minAccumulated[yearPoint];
        rangeRegression.maxX = ranges.maxAccumulated[yearPoint];

        var lg = calcLinear(info2015, rangeRegression);

        svgscatter.append("line")
	        .attr("class", "regression")
            .attr("stroke-width", 2)
            .attr("stroke", "black")
	        .attr("x1", x(lg.ptA.x))
	        .attr("y1", y(lg.ptA.y))
	        .attr("x2", x(lg.ptB.x))
	        .attr("y2", y(lg.ptB.y));

        svgscatter.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + heightscatter + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("id", "xlabel")
            .attr("x", widthscatter)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text("PISA accumulated score");

        svgscatter.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("id", "ylabel")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Spendings in millions($)");

        svgscatter.selectAll(".dot")
            .data(data.features)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", function (d) {
                if (isNaN(d.Accumulated) || d.Spendings == 0) {
                    return 0;
                }
                else {
                    return 3;
                }
            })
            .attr("cx", function(d) {
                if (isNaN(d.Accumulated)) {
                    return 0;
                }
                else {
                    return x(d.Accumulated);
                }
            })
            .attr("cy", function(d) {
                if (isNaN(d.Accumulated)) {
                    return 0;
                }
                else {
                    return y(d.Spendings);
                }
            })
            .style("fill", function(d) { return color(d.Accumulated); })
            .style("opacity", 0.8)
            .on("mouseover", function(d) {
                tip.show(d)

                d3.select(this)
                    .attr("r", 8);

            })
            .on("mouseout", function(d) {
                tip.hide(d)

                d3.select(this)
                    .attr("r", 3);
            })
            .on("click", function(d) {
                updateData(data.features, slider.value());

                // remember country, needed when updating radarchart for slider
                currentCountry = {
                    id: d.id,
                    name: d.properties.name,
                    color2012: pisaById2012[d.id],
                    color2015: pisaById2015[d.id],
                    slider: slider.value(),
                    GDP: d.GDP,
                    Salary: d.Salary,
                    Spendings: d.Spendings,
                    Science: d.Science,
                    Reading: d.Reading,
                    Math: d.Math
                };

                updateRadarValues("#radarTitle", currentCountry);

                radarChart.draw("#chart", dradar, mycfg);
            });

        svgscatter.append("text")
            .attr("class", "scatterTitle")
            .attr("x", (widthscatter / 2))
            .attr("y", 0 - (marginscatter.top / 2) + 10)
            .attr("text-anchor", "middle")
            .style("font-size", "24px")
            .text(datapoints[0]);

        // update scatterplot according to dropdown
        select.data(data.features)
            .on("change", function(d) {
                selectValue = d3.select("select")
                    .property("value");

                if (selectValue == datapoints[0]) {
                    y.domain(d3.extent(data.features, function(d)
                             { return d.Spendings; })).nice();

                    d3.select(".scatterTitle")
                        .text(datapoints[0]);

                    d3.select("#ylabel")
                        .text("Education spendings in millions($)");

                    rangeRegression.y = "Spendings";
                }
                else if (selectValue == datapoints[1]) {
                    y.domain(d3.extent(data.features, function(d)
                             { return d.GDP; })).nice();

                    d3.select(".scatterTitle")
                        .text(datapoints[1]);

                    d3.select("#ylabel")
                        .text("GDP per capita($)");

                    rangeRegression.y = "GDP";
                }
                else {
                    y.domain(d3.extent(data.features, function(d)
                             { return d.Salary; })).nice();

                    d3.select(".scatterTitle")
                        .text(datapoints[2]);

                    d3.select("#ylabel")
                        .text("Teacher salaries in annual earnings($)")

                    rangeRegression.y = "Salary";
                }

                lg = calcLinear(year, rangeRegression);

                line.ptA = lg.ptA;
                line.ptB = lg.ptB;

                drawRegression(".regression", line);

                updateScatter(".dot", x, y, d);

                svgscatter.select(".y.axis")
                    .transition()
                    .duration(250)
                    .call(yAxis);
            });

        // call slider
        var slider = new simpleSlider();

        slider.width(100).x(30).y(10).value(1).event(function(){
            if (slider.value() <= 0.5) {
                data.features.forEach(function(d) {
                    d.Accumulated = pisaById2012[d.id];
                    d.GDP = GDPById2012[d.id];
                    d.Spendings = spendingsById2012[d.id];
                    d.Salary = salaryById2012[d.id];
                    d.Reading = readingsById2012[d.id];
                    d.Science = scienceById2012[d.id];
                    d.Math = mathById2012[d.id];
                });

                d3.select(".year")
                    .text("2012");

                year = info2012;
                yearPoint = 0;

                currentCountry.GDP = GDPById2012[currentCountry.id];
                currentCountry.Salary = salaryById2012[currentCountry.id];
                currentCountry.Spendings = spendingsById2012[currentCountry.id];
                currentCountry.Science = scienceById2012[currentCountry.id];
                currentCountry.Reading = readingsById2012[currentCountry.id];
                currentCountry.Math = mathById2012[currentCountry.id];
            }
            else {
                data.features.forEach(function(d) {
                    d.Accumulated = pisaById2015[d.id];
                    d.GDP = GDPById2015[d.id];
                    d.Spendings = spendingsById2015[d.id];
                    d.Salary = salaryById2015[d.id];
                    d.Reading = readingsById2015[d.id];
                    d.Science = scienceById2015[d.id];
                    d.Math = mathById2015[d.id];
                });

                d3.select(".year")
                    .text("2015");

                year = info2015;
                yearPoint = 1;

                currentCountry.GDP = GDPById2015[currentCountry.id];
                currentCountry.Salary = salaryById2015[currentCountry.id];
                currentCountry.Spendings = spendingsById2015[currentCountry.id];
                currentCountry.Science = scienceById2015[currentCountry.id];
                currentCountry.Reading = readingsById2015[currentCountry.id];
                currentCountry.Math = mathById2015[currentCountry.id];
            }

            // reset domain of regression line according to current year
            rangeRegression.minX = ranges.minAccumulated[yearPoint];
            rangeRegression.maxX = ranges.maxAccumulated[yearPoint];

            currentCountry.slider = slider.value();

            updateRadarValues("#radarTitle", currentCountry);

            d3.selectAll("path")
                .data(data.features)
                .transition()
                .duration(250)
                .style("fill", function(d) { return color(d.Accumulated); });

            // update scatterplot to date
            selectValue = d3.select("select")
                .property("value");

            x.domain(d3.extent(data.features, function(d)
                     { return d.Accumulated; })).nice();

            if (selectValue == datapoints[0]) {
                y.domain(d3.extent(data.features, function(d)
                         { return d.Spendings; })).nice();

                rangeRegression.y = "Spendings";
            }
            else if (selectValue == datapoints[1]) {
                y.domain(d3.extent(data.features, function(d)
                         { return d.GDP; })).nice();

                rangeRegression.y = "GDP";
            }
            else {
                y.domain(d3.extent(data.features, function(d)
                         { return d.Salary; })).nice();

                rangeRegression.y = "Salary";
            }

            lg = calcLinear(year, rangeRegression);

            line.ptA = lg.ptA;
            line.ptB = lg.ptB;

            drawRegression(".regression", line);

            updateScatter(".dot", x, y, data.features);

            svgscatter.select(".x.axis")
                .transition()
                .duration(250)
                .call(xAxis);

            svgscatter.select(".y.axis")
                .transition()
                .duration(250)
                .call(yAxis);

            radarChart.draw("#chart", dradar, mycfg);
        });

        svgslider.call(slider);

        // container to show country on radar chart
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

    	radarChart.draw("#chart", dradar, mycfg);
    }

    // updates the data formatting according to the data that is summoned for
    function updateData(data, sliderValue) {
        if (sliderValue <= 0.5){
            data.forEach(function(d) {
                d.Accumulated = pisaById2012[d.id];
                d.GDP = GDPById2012[d.id];
                d.Spendings = spendingsById2012[d.id];
                d.Salary = salaryById2012[d.id];
                d.Reading = readingsById2012[d.id];
                d.Science = scienceById2012[d.id];
                d.Math = mathById2012[d.id];
            })
        }
        else {
            data.forEach(function(d) {
                d.Accumulated = pisaById2015[d.id];
                d.GDP = GDPById2015[d.id];
                d.Spendings = spendingsById2015[d.id];
                d.Salary = salaryById2015[d.id];
                d.Reading = readingsById2015[d.id];
                d.Science = scienceById2015[d.id];
                d.Math = mathById2015[d.id];
            })
        }
    }

    // updates the relevant values to get it ready for a new drawing of the radar chart
    function updateRadarValues(id, country) {
        d3.select(id)
            .text(country.name);

        if (country.slider <= 0.5) {
            cfg.color = color(country.color2012);
            dradar[0][0].value = (country.GDP - ranges.minGDP[0]) / (ranges.maxGDP[0] - ranges.minGDP[0]);
            dradar[0][1].value = (country.Salary - ranges.minSalary[0]) / (ranges.maxSalary[0] - ranges.minSalary[0]);
            dradar[0][2].value = (country.Spendings - ranges.minSpendings[0]) / (ranges.maxSpendings[0] - ranges.minSpendings[0]);
            dradar[0][3].value = (country.Science - ranges.minScience[0]) / (ranges.maxScience[0] - ranges.minScience[0]);
            dradar[0][4].value = (country.Reading - ranges.minReading[0]) / (ranges.maxReading[0] - ranges.minReading[0]);
            dradar[0][5].value = (country.Math - ranges.minMath[0]) / (ranges.maxMath[0] - ranges.minMath[0]);
        }
        else {
            cfg.color = color(country.color2015);
            dradar[0][0].value = (country.GDP - ranges.minGDP[1]) / (ranges.maxGDP[1] - ranges.minGDP[1]);
            dradar[0][1].value = (country.Salary - ranges.minSalary[1]) / (ranges.maxSalary[1] - ranges.minSalary[1]);
            dradar[0][2].value = (country.Spendings - ranges.minSpendings[1]) / (ranges.maxSpendings[1] - ranges.minSpendings[1]);
            dradar[0][3].value = (country.Science - ranges.minScience[1]) / (ranges.maxScience[1] - ranges.minScience[1]);
            dradar[0][4].value = (country.Reading - ranges.minReading[1]) / (ranges.maxReading[1] - ranges.minReading[1]);
            dradar[0][5].value = (country.Math - ranges.minMath[1]) / (ranges.maxMath[1] - ranges.minMath[1]);
        }

        for (i = 0; i < dradar[0].length; i++) {
            if (dradar[0][i].value < 0 || isNaN(dradar[0][i].value)) {
                dradar[0][i].value = 0;
            }
        }
    }

    // changes the pan and zooming of the world map
    function zoomed() {
        g.attr("transform",
        "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }
})
