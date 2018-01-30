document.addEventListener("DOMContentLoaded", function() {

    // Set tooltips
    var tip = d3.tip()
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

    // set dropdown for scatterplot
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
        .attr("transform", "translate(" + marginscatter.left + "," + marginscatter.top + ")");

    svgscatter.call(tip);
    worldmap.call(tip);
    worldmap.call(zoom);
    worldmap.call(zoom.event);

    queue()
        .defer(d3.json, "../data/world_countries.json")
        .defer(d3.csv, "../data/2015.csv")
        .defer(d3.csv, "../data/2012.csv")
        .await(ready);

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

    function ready(error, data, info2015, info2012) {
        if (error) throw error;

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

        var minGDP = [Math.min.apply(null, Object.values(GDPById2012).filter(getMinimum)),
                      Math.min.apply(null, Object.values(GDPById2015).filter(getMinimum))],
            maxGDP = [Math.max.apply(null, Object.values(GDPById2012)),
                      Math.max.apply(null, Object.values(GDPById2015))],
            minSalary = [Math.min.apply(null, Object.values(salaryById2012).filter(getMinimum)),
                         Math.min.apply(null, Object.values(salaryById2015).filter(getMinimum))],
            maxSalary = [Math.max.apply(null, Object.values(salaryById2012)),
                         Math.max.apply(null, Object.values(salaryById2015))],
            minSpending = [Math.min.apply(null, Object.values(spendingsById2012).filter(getMinimum)),
                           Math.min.apply(null, Object.values(spendingsById2015).filter(getMinimum))],
            maxSpending = [Math.max.apply(null, Object.values(spendingsById2012)),
                           Math.max.apply(null, Object.values(spendingsById2015))],
            minScience = [Math.min.apply(null, Object.values(scienceById2012)),
                          Math.min.apply(null, Object.values(scienceById2015))],
            maxScience = [Math.max.apply(null, Object.values(scienceById2012)),
                          Math.max.apply(null, Object.values(scienceById2015))],
            minReading = [Math.min.apply(null, Object.values(readingsById2012)),
                          Math.min.apply(null, Object.values(readingsById2015))],
            maxReading = [Math.max.apply(null, Object.values(readingsById2012)),
                          Math.max.apply(null, Object.values(readingsById2015))],
            minMath = [Math.min.apply(null, Object.values(mathById2012)),
                       Math.min.apply(null, Object.values(mathById2015))],
            maxMath = [Math.max.apply(null, Object.values(mathById2012)),
                       Math.max.apply(null, Object.values(mathById2015))],
            minAccumulated = [Math.min.apply(null, Object.values(pisaById2012)),
                              Math.min.apply(null, Object.values(pisaById2015))],
            maxAccumulated = [Math.max.apply(null, Object.values(pisaById2012)),
                              Math.max.apply(null, Object.values(pisaById2015))];

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
                d3.select("#radarTitle")
                    .text(d.properties.name);

                if (slider.value() <= 0.5) {
                    cfg.color = color(pisaById2012[d.id]);
                    dradar[0][0].value = (d.GDP - minGDP[0]) / (maxGDP[0] - minGDP[0]);
                    dradar[0][1].value = (d.Salary - minSalary[0]) / (maxSalary[0] - minSalary[0]);
                    dradar[0][2].value = (d.Spendings - minSpending[0]) / (maxSpending[0] - minSpending[0]);
                    dradar[0][3].value = (d.Science - minScience[0]) / (maxScience[0] - minScience[0]);
                    dradar[0][4].value = (d.Reading - minReading[0]) / (maxReading[0] - minReading[0]);
                    dradar[0][5].value = (d.Math - minMath[0]) / (maxMath[0] - minMath[0]);
                }
                else {
                    cfg.color = color(pisaById2015[d.id]);
                    dradar[0][0].value = (d.GDP - minGDP[1]) / (maxGDP[1] - minGDP[1]);
                    dradar[0][1].value = (d.Salary - minSalary[1]) / (maxSalary[1] - minSalary[1]);
                    dradar[0][2].value = (d.Spendings - minSpending[1]) / (maxSpending[1] - minSpending[1]);
                    dradar[0][3].value = (d.Science - minScience[1]) / (maxScience[1] - minScience[1]);
                    dradar[0][4].value = (d.Reading - minReading[1]) / (maxReading[1] - minReading[1]);
                    dradar[0][5].value = (d.Math - minMath[1]) / (maxMath[1] - minMath[1]);
                }

                for (i = 0; i < dradar[0].length; i++) {
                    if (dradar[0][i].value < 0 || isNaN(dradar[0][i].value)) {
                        dradar[0][i].value = 0;
                    }
                }

                RadarChart.draw("#chart", dradar, mycfg);

                currentCountry = {
                    id: d.id,
                };
            });

        // construct legend
        var legend = worldmap.selectAll(".legend")
            .data(color.domain())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i)
            { return "translate(0," + Number(heightworld / 2 + 100 - i * 20) + ")"; });

        // create rectangles for the colors of the legend
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

        // add text to the legend
        legend.append("text")
            .attr("x", widthworld - 23)
            .attr("y", 21)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d; });

        /////////////////
        // SCATTERPLOT //
        /////////////////

        // construct domain and range
        x.domain(d3.extent(info2015, function(d)
                 { return pisaById2015[d.id]; })).nice();
        y.domain(d3.extent(info2015, function(d)
                 { return spendingsById2015[d.id]; })).nice();

        // initial regression line
        var lg = calcLinear(info2015, "Accumulated", "Spendings",
                            minAccumulated[1],
                            maxAccumulated[1]);

        svgscatter.append("line")
	        .attr("class", "regression")
            .attr("stroke-width", 2)
            .attr("stroke", "black")
	        .attr("x1", x(lg.ptA.x))
	        .attr("y1", y(lg.ptA.y))
	        .attr("x2", x(lg.ptB.x))
	        .attr("y2", y(lg.ptB.y));

        // add x-axis
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

        // add y-axis
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

        // draw scatterplot
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
                d3.select("#radarTitle")
                    .text(d.properties.name);

                if (slider.value() <= 0.5) {
                    cfg.color = color(pisaById2012[d.id]);
                    dradar[0][0].value = (d.GDP - minGDP[0]) / (maxGDP[0] - minGDP[0]);
                    dradar[0][1].value = (d.Salary - minSalary[0]) / (maxSalary[0] - minSalary[0]);
                    dradar[0][2].value = (d.Spendings - minSpending[0]) / (maxSpending[0] - minSpending[0]);
                    dradar[0][3].value = (d.Science - minScience[0]) / (maxScience[0] - minScience[0]);
                    dradar[0][4].value = (d.Reading - minReading[0]) / (maxReading[0] - minReading[0]);
                    dradar[0][5].value = (d.Math - minMath[0]) / (maxMath[0] - minMath[0]);
                }
                else {
                    cfg.color = color(pisaById2015[d.id]);
                    dradar[0][0].value = (d.GDP - minGDP[1]) / (maxGDP[1] - minGDP[1]);
                    dradar[0][1].value = (d.Salary - minSalary[1]) / (maxSalary[1] - minSalary[1]);
                    dradar[0][2].value = (d.Spendings - minSpending[1]) / (maxSpending[1] - minSpending[1]);
                    dradar[0][3].value = (d.Science - minScience[1]) / (maxScience[1] - minScience[1]);
                    dradar[0][4].value = (d.Reading - minReading[1]) / (maxReading[1] - minReading[1]);
                    dradar[0][5].value = (d.Math - minMath[1]) / (maxMath[1] - minMath[1]);
                }

                for (i = 0; i < dradar[0].length; i++) {
                    if (dradar[0][i].value < 0 || isNaN(dradar[0][i].value)) {
                        dradar[0][i].value = 0;
                    }
                }

                RadarChart.draw("#chart", dradar, mycfg);

                currentCountry = {
                    id: d.id,
                };
            });

        // add initial title to the scatterplot
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

                    if (slider.value() <= 0.5){
                        var lg = calcLinear(info2012, "Accumulated", "Spendings",
                                            minAccumulated[0],
                                            maxAccumulated[0]);
                    }
                    else {
                        var lg = calcLinear(info2015, "Accumulated", "Spendings",
                                            minAccumulated[1],
                                            maxAccumulated[1]);
                    }

                    d3.select(".regression")
                        .transition()
                        .duration(250)
                        .attr("x1", x(lg.ptA.x))
                        .attr("y1", y(lg.ptA.y))
                        .attr("x2", x(lg.ptB.x))
                        .attr("y2", y(lg.ptB.y));
                }
                else if (selectValue == datapoints[1]) {
                    y.domain(d3.extent(data.features, function(d)
                             { return d.GDP; })).nice();

                    d3.select(".scatterTitle")
                        .text(datapoints[1]);

                    d3.select("#ylabel")
                        .text("GDP per capita($)");

                        if (slider.value() <= 0.5){
                            var lg = calcLinear(info2012, "Accumulated", "GDP",
                                                minAccumulated[0],
                                                maxAccumulated[0]);
                        }
                        else {
                            var lg = calcLinear(info2015, "Accumulated", "GDP",
                                                minAccumulated[1],
                                                maxAccumulated[1]);
                        }

                    d3.select(".regression")
                        .transition()
                        .duration(250)
                        .attr("x1", x(lg.ptA.x))
                        .attr("y1", y(lg.ptA.y))
                        .attr("x2", x(lg.ptB.x))
                        .attr("y2", y(lg.ptB.y));
                }
                else {
                    y.domain(d3.extent(data.features, function(d)
                             { return d.Salary; })).nice();

                    d3.select(".scatterTitle")
                        .text(datapoints[2]);

                    d3.select("#ylabel")
                        .text("Teacher salaries in annual earnings($)")

                        if (slider.value() <= 0.5){
                            var lg = calcLinear(info2012, "Accumulated", "Salary",
                                                minAccumulated[0],
                                                maxAccumulated[0]);
                        }
                        else {
                            var lg = calcLinear(info2015, "Accumulated", "Salary",
                                                minAccumulated[1],
                                                maxAccumulated[1]);
                        }

                    d3.select(".regression")
                        .transition()
                        .duration(250)
                        .attr("x1", x(lg.ptA.x))
                        .attr("y1", y(lg.ptA.y))
                        .attr("x2", x(lg.ptB.x))
                        .attr("y2", y(lg.ptB.y));
                }

                d3.selectAll(".dot")
                    .transition()
                    .duration(250)
                    .attr("cy", function(d) {
                        if (isNaN(d.Accumulated)) {
                            return 0;
                        }
                        else {
                            if (selectValue == datapoints[0]) {
                                return y(d.Spendings);
                            }
                            else if (selectValue == datapoints[1]) {
                                return y(d.GDP);
                            }
                            else {
                                return y(d.Salary);
                            }
                        }
                    })
                    .attr("r", function(d) {
                        if (selectValue == datapoints[0]) {
                            if (d.Spendings == 0 || isNaN(d.Accumulated)) {
                                return 0;
                            }
                            else {
                                return 3;
                            }
                        }
                        else if (selectValue == datapoints[1]) {
                            if (d.GDP == 0 || isNaN(d.Accumulated)) {
                                return 0;
                            }
                            else {
                                return 3;
                            }
                        }
                        else {
                            if (d.Salary == 0 || isNaN(d.Accumulated)) {
                                return 0;
                            }
                            else {
                                return 3;
                            }
                        }
                    });

                svgscatter.select(".y.axis")
                    .transition()
                    .duration(250)
                    .call(yAxis);
            });

        var slider = new simpleSlider();

        slider.width(100).x(30).y(10).value(1).event(function(){
            if (slider.value() <= 0.5)
            {
                data.features.forEach(function(d) {
                    d.Accumulated = pisaById2012[d.id];
                    d.GDP = GDPById2012[d.id];
                    d.Spendings = spendingsById2012[d.id];
                    d.Salary = salaryById2012[d.id];
                    d.Reading = readingsById2012[d.id];
                    d.Science = scienceById2012[d.id];
                    d.Math = mathById2012[d.id];
                });

                d3.selectAll("path")
                    .data(data.features)
                    .transition()
                    .duration(250)
                    .style("fill", function(d) { return color(d.Accumulated); });

                d3.select(".year")
                    .text("2012");

                // update scatterplot to date
                selectValue = d3.select("select")
                    .property("value");

                x.domain(d3.extent(data.features, function(d)
                         { return d.Accumulated; })).nice();

                if (selectValue == datapoints[0]) {
                    y.domain(d3.extent(data.features, function(d)
                             { return d.Spendings; })).nice();

                    var lg = calcLinear(info2012, "Accumulated", "Spendings",
                                        minAccumulated[0],
                                        maxAccumulated[0]);
                }
                else if (selectValue == datapoints[1]) {
                    y.domain(d3.extent(data.features, function(d)
                             { return d.GDP; })).nice();

                    var lg = calcLinear(info2012, "Accumulated", "GDP",
                                        minAccumulated[0],
                                        maxAccumulated[0]);
                }
                else {
                    y.domain(d3.extent(data.features, function(d)
                             { return d.Salary; })).nice();

                    var lg = calcLinear(info2012, "Accumulated", "Salary",
                                        minAccumulated[0],
                                        maxAccumulated[0]);
                }

                if (isNaN(lg.ptA.y) || isNaN(lg.ptB.x)) {
                    lg.ptA.x = 0
                    lg.ptA.y = 0
                    lg.ptB.x = 0
                    lg.ptB.y = 0
                }

                d3.select(".regression")
                    .transition()
                    .duration(250)
                    .attr("x1", x(lg.ptA.x))
                    .attr("y1", y(lg.ptA.y))
                    .attr("x2", x(lg.ptB.x))
                    .attr("y2", y(lg.ptB.y));

                d3.selectAll(".dot")
                    .data(data.features)
                    .transition()
                    .duration(250)
                    .attr("cy", function(d) {
                        if (isNaN(d.Accumulated)) {
                            return 0;
                        }
                        else {
                            if (selectValue == datapoints[0]) {
                                return y(d.Spendings);
                            }
                            else if (selectValue == datapoints[1]) {
                                return y(d.GDP);
                            }
                            else {
                                return y(d.Salary);
                            }
                        }
                    })
                    .attr("r", function(d) {
                        if (selectValue == datapoints[0]) {
                            if (d.Spendings == 0 || isNaN(d.Accumulated)) {
                                return 0;
                            }
                            else {
                                return 3;
                            }
                        }
                        else if (selectValue == datapoints[1]) {
                            if (d.GDP == 0 || isNaN(d.Accumulated)) {
                                return 0;
                            }
                            else {
                                return 3;
                            }
                        }
                        else {
                            if (d.Salary == 0 || isNaN(d.Accumulated)) {
                                return 0;
                            }
                            else {
                                return 3;
                            }
                        }
                    });

                svgscatter.select(".x.axis")
                    .transition()
                    .duration(250)
                    .call(xAxis);

                svgscatter.select(".y.axis")
                    .transition()
                    .duration(250)
                    .call(yAxis);

                cfg.color = color(pisaById2012[currentCountry.id]);
                dradar[0][0].value = GDPById2012[currentCountry.id] / (maxGDP[0] - minGDP[0]);
                dradar[0][1].value = salaryById2012[currentCountry.id] / (maxSalary[0] - minSalary[0]);
                dradar[0][2].value = spendingsById2012[currentCountry.id] / (maxSpending[0] - minSpending[0]);
                dradar[0][3].value = (scienceById2012[currentCountry.id] - minScience[0]) / (maxScience[0] - minScience[0]);
                dradar[0][4].value = (readingsById2012[currentCountry.id] - minReading[0]) / (maxReading[0] - minReading[0]);
                dradar[0][5].value = (mathById2012[currentCountry.id] - minMath[0]) / (maxMath[0] - minMath[0]);

                for (i = 0; i < dradar[0].length; i++) {
                    if (dradar[0][i].value < 0 || isNaN(dradar[0][i].value)) {
                        dradar[0][i].value = 0;
                    }
                }

                RadarChart.draw("#chart", dradar, mycfg);
            }
            else
            {
                data.features.forEach(function(d) {
                    d.Accumulated = pisaById2015[d.id];
                    d.GDP = GDPById2015[d.id];
                    d.Spendings = spendingsById2015[d.id];
                    d.Salary = salaryById2015[d.id];
                    d.Reading = readingsById2015[d.id];
                    d.Science = scienceById2015[d.id];
                    d.Math = mathById2015[d.id];
                });

            d3.selectAll("path")
                .data(data.features)
                .transition()
                .duration(250)
                .style("fill", function(d) { return color(d.Accumulated); });

            d3.select(".year")
                .text("2015");

            // update scatterplot to date
            selectValue = d3.select("select")
                .property("value");

            x.domain(d3.extent(data.features, function(d)
                     { return d.Accumulated; })).nice();

            if (selectValue == datapoints[0]) {
                y.domain(d3.extent(data.features, function(d)
                         { return d.Spendings; })).nice();

                var lg = calcLinear(info2015, "Accumulated", "Spendings",
                                    minAccumulated[1],
                                    maxAccumulated[1]);
            }
            else if (selectValue == datapoints[1]) {
                y.domain(d3.extent(data.features, function(d)
                         { return d.GDP; })).nice();

                var lg = calcLinear(info2015, "Accumulated", "GDP",
                                    minAccumulated[1],
                                    maxAccumulated[1]);
            }
            else {
                y.domain(d3.extent(data.features, function(d)
                         { return d.Salary; })).nice();

                var lg = calcLinear(info2015, "Accumulated", "Salary",
                                    minAccumulated[1],
                                    maxAccumulated[1]);
            }

            d3.select(".regression")
                .transition()
                .duration(250)
                .attr("x1", x(lg.ptA.x))
                .attr("y1", y(lg.ptA.y))
                .attr("x2", x(lg.ptB.x))
                .attr("y2", y(lg.ptB.y));

            d3.selectAll(".dot")
                .data(data.features)
                .transition()
                .duration(250)
                .attr("cy", function(d) {
                    if (isNaN(d.Accumulated)) {
                        return 0;
                    }
                    else {
                        if (selectValue == datapoints[0]) {
                            return y(d.Spendings);
                        }
                        else if (selectValue == datapoints[1]) {
                            return y(d.GDP);
                        }
                        else {
                            return y(d.Salary);
                        }
                    }
                })
                .attr("r", function(d) {
                    if (selectValue == datapoints[0]) {
                        if (d.Spendings == 0 || isNaN(d.Accumulated)) {
                            return 0;
                        }
                        else {
                            return 3;
                        }
                    }
                    else if (selectValue == datapoints[1]) {
                        if (d.GDP == 0 || isNaN(d.Accumulated)) {
                            return 0;
                        }
                        else {
                            return 3;
                        }
                    }
                    else {
                        if (d.Salary == 0 || isNaN(d.Accumulated)) {
                            return 0;
                        }
                        else {
                            return 3;
                        }
                    }
                });

            svgscatter.select(".x.axis")
                .transition()
                .duration(250)
                .call(xAxis);

            svgscatter.select(".y.axis")
                .transition()
                .duration(250)
                .call(yAxis);

            cfg.color = color(pisaById2015[currentCountry.id]);
            dradar[0][0].value = GDPById2015[currentCountry.id] / (maxGDP[1] - minGDP[1]);
            dradar[0][1].value = salaryById2015[currentCountry.id] / (maxSalary[1] - minSalary[1]);
            dradar[0][2].value = spendingsById2015[currentCountry.id] / (maxSpending[1] - minSpending[1]);
            dradar[0][3].value = (scienceById2015[currentCountry.id] - minScience[1]) / (maxScience[1] - minScience[1]);
            dradar[0][4].value = (readingsById2015[currentCountry.id] - minReading[1]) / (maxReading[1] - minReading[1]);
            dradar[0][5].value = (mathById2015[currentCountry.id] - minMath[1]) / (maxMath[1] - minMath[1]);

            for (i = 0; i < dradar[0].length; i++) {
                if (dradar[0][i].value < 0 || isNaN(dradar[0][i].value)) {
                    dradar[0][i].value = 0;
                }
            }

            RadarChart.draw("#chart", dradar, mycfg);
            }
        });

        svgslider.call(slider);

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

    	// Call function to draw the Radar chart
    	// Will expect that data is in %'s
    	RadarChart.draw("#chart", dradar, mycfg);
    }

    function zoomed() {
        g.attr("transform",
        "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }

    d3.select(self.frameElement).style("height", heightworld + "px");
})
