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

    var svg = d3.select("body")
        .append("div")
        .attr("class", "col-lg-12 col-md-12 col-sm-12 col-xs-12");

    var worldmap = svg.append("div")
            .attr("class", "worldmap")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

    var projection = d3.geo.mercator()
        .scale(80)
        .translate( [width / 2 - 20, 340]);

    var path = d3.geo.path().projection(projection);

    var g = worldmap.append("g").attr("class", "countries");

    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 8])
        .on("zoom", zoomed);

    worldmap.append("text")
        .attr("class", "worldmapTitle")
        .attr("x", (width / 2))
        .attr("y", 40)
        .attr("text-anchor", "middle")
        .style("font-size", "36px")
        .text("Accumulated PISA score per country");

    worldmap.append("text")
        .attr("class", "year")
        .attr("x", width - 70)
        .attr("y", 150)
        .attr("text-anchor", "middle")
        .style("font-size", "60px")
        .text("2015");

    var svgslider = svg.append("div")
        .attr("class","slider")
        .append("svg")
        .attr("width", 150)
        .attr("height", 50);

    worldmap.call(tip);
    worldmap.call(zoom);
    worldmap.call(zoom.event);

    queue()
        .defer(d3.json, "data/world_countries.json")
        .defer(d3.csv, "data/2015.csv")
        .defer(d3.csv, "data/2012.csv")
        .await(ready);

    var pisaById2015 = [],
        pisaById2012 = [],
        GDPById2015 = [],
        GDPById2012 = [],
        SpendingsById2015 = [],
        SpendingsById2012 = [],
        SalaryById2015 = [],
        SalaryById2012 = [],
        ReadingsById2015 = [],
        ReadingsById2012 = [],
        ScienceById2015 = [],
        ScienceById2012 = [],
        MathById2015 = [],
        MathById2012 = [];

    function ready(error, data, info2015, info2012) {
        if (error) throw error;

        info2015.forEach(function(d) {
             pisaById2015[d.id] = +d.Accumulated;
             GDPById2015[d.id] = +d.GDP;
             SpendingsById2015[d.id] = +d.Spendings;
             SalaryById2015[d.id] = +d.Salary;
             ReadingsById2015[d.id] = +d.Reading;
             ScienceById2015[d.id] = +d.Science;
             MathById2015[d.id] = +d.Math;
         })

        info2012.forEach(function(d) {
             pisaById2012[d.id] = +d.Accumulated;
             GDPById2012[d.id] = +d.GDP;
             SpendingsById2012[d.id] = +d.Spendings;
             SalaryById2012[d.id] = +d.Salary;
             ReadingsById2012[d.id] = +d.Reading;
             ScienceById2012[d.id] = +d.Science;
             MathById2012[d.id] = +d.Math;
         })

        data.features.forEach(function(d) {
            d.Accumulated = pisaById2015[d.id];
            d.GDP = GDPById2015[d.id];
            d.Spendings = SpendingsById2015[d.id];
            d.Salary = SalaryById2015[d.id];
            d.Reading = ReadingsById2015[d.id];
            d.Science = ScienceById2015[d.id];
            d.Math = MathById2015[d.id];
        })

        var maxGDP = [Math.max.apply(null, Object.values(GDPById2012)),
                      Math.max.apply(null, Object.values(GDPById2015))],
            maxSalary = [Math.max.apply(null, Object.values(SalaryById2012)),
                         Math.max.apply(null, Object.values(SalaryById2015))],
            maxSpending = [Math.max.apply(null, Object.values(SpendingsById2012)),
                           Math.max.apply(null, Object.values(SpendingsById2015))],
            minScience = [Math.min.apply(null, Object.values(ScienceById2012)),
                          Math.min.apply(null, Object.values(ScienceById2015))],
            maxScience = [Math.max.apply(null, Object.values(ScienceById2012)),
                          Math.max.apply(null, Object.values(ScienceById2015))],
            minReading = [Math.min.apply(null, Object.values(ReadingsById2012)),
                          Math.min.apply(null, Object.values(ReadingsById2015))],
            maxReading = [Math.max.apply(null, Object.values(ReadingsById2012)),
                          Math.max.apply(null, Object.values(ReadingsById2015))],
            minMath = [Math.min.apply(null, Object.values(MathById2012)),
                       Math.min.apply(null, Object.values(MathById2015))],
            maxMath = [Math.max.apply(null, Object.values(MathById2012)),
                       Math.max.apply(null, Object.values(MathById2015))];

        g.selectAll("path")
            .data(data.features)
        .enter().append("path")
            .attr("d", path)
            .style("fill", function(d) { return color(pisaById2015[d.id]); })
            .style("opacity", 0.8)
            // tooltips
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
                    dradar[0][0].value = d.GDP / maxGDP[0];
                    dradar[0][1].value = d.Salary / maxSalary[0];
                    dradar[0][2].value = d.Spendings / maxSpending[0];
                    dradar[0][3].value = (d.Science - minScience[0]) / (maxScience[0] - minScience[0]);
                    dradar[0][4].value = (d.Reading - minReading[0]) / (maxReading[0] - minReading[0]);
                    dradar[0][5].value = (d.Math - minMath[0]) / (maxMath[0] - minMath[0]);
                }
                else {
                    cfg.color = color(pisaById2015[d.id]);
                    dradar[0][0].value = d.GDP / maxGDP[1];
                    dradar[0][1].value = d.Salary / maxSalary[1];
                    dradar[0][2].value = d.Spendings / maxSpending[1];
                    dradar[0][3].value = (d.Science - minScience[1]) / (maxScience[1] - minScience[1]);
                    dradar[0][4].value = (d.Reading - minReading[1]) / (maxReading[1] - minReading[1]);
                    dradar[0][5].value = (d.Math - minMath[1]) / (maxMath[1] - minMath[1]);
                }

                for (i = 0; i < dradar[0].length; i++) {
                    if (isNaN(dradar[0][i].value)) {
                        dradar[0][i].value = 0;
                    }
                }

                RadarChart.draw("#chart", dradar, mycfg);
            });

        // construct legend
        var legend = worldmap.selectAll(".legend")
            .data(color.domain())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i)
            { return "translate(0," + Number(height / 2 - 60 + i * 20) + ")"; });

        // create rectangles for the colors of the legend
        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", function(d, i) {
                if (i == color.domain().length - 1) { return 0; }
                else { return 18; }
            })
            .attr("height", function(d, i) {
                if (i == color.domain().length - 1) { return 0; }
                else { return 21; }
            })
            .style("fill", color);

        // add text to the legend
        legend.append("text")
            .attr("x", width - 23)
            .attr("y", 0)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d; });

        slider.width(100).x(30).y(10).value(1).event(function(){
            if (slider.value() <= 0.5)
            {
                data.features.forEach(function(d) {
                    d.Accumulated = pisaById2012[d.id];
                    d.GDP = GDPById2012[d.id];
                    d.Spendings = SpendingsById2012[d.id];
                    d.Salary = SalaryById2012[d.id];
                    d.Reading = ReadingsById2012[d.id];
                    d.Science = ScienceById2012[d.id];
                    d.Math = MathById2012[d.id];
                });

                d3.selectAll("path")
                    .data(data.features)
                    .transition()
                    .duration(250)
                    .style("fill", function(d) { return color(pisaById2012[d.id]); });

                d3.select(".year")
                    .text("2012");
            }
            else
            {
                data.features.forEach(function(d) {
                    d.Accumulated = pisaById2015[d.id];
                    d.GDP = GDPById2015[d.id];
                    d.Spendings = SpendingsById2015[d.id];
                    d.Salary = SalaryById2015[d.id];
                    d.Reading = ReadingsById2015[d.id];
                    d.Science = ScienceById2015[d.id];
                    d.Math = MathById2015[d.id];
                });

            d3.selectAll("path")
                .data(data.features)
                .transition()
                .duration(250)
                .style("fill", function(d) { return color(pisaById2015[d.id]); });

            d3.select(".year")
                .text("2015");
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

    	//Call function to draw the Radar chart
    	//Will expect that data is in %'s
    	RadarChart.draw("#chart", dradar, mycfg);
    }

    function zoomed() {
        g.attr("transform",
        "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }

    d3.select(self.frameElement).style("height", height + "px");
})
