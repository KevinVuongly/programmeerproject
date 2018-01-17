document.addEventListener("DOMContentLoaded", function() {

    var format = d3.format(",");

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

    var margin = {top: 50, right: 20, bottom: 30, left: 30},
                 width = 650 - margin.left - margin.right,
                 height = 600 - margin.top - margin.bottom;

    var color = d3.scale.threshold()
        .domain([1150,1200,1290,1380,1450,1520,1550,1580,1650])
        .range(["rgb(72,0,0)", "rgb(103,0,13)", "rgb(165,15,21)", "rgb(203,24,29)",
                "rgb(239,59,44)", "rgb(251,106,74)", "rgb(252,146,114)",
                "rgb(252,187,161)","rgb(254,224,210)", "rgb(255,255,255)"]);

    var svg = d3.select("body")
                .append("div")
                .attr("class", "col-lg-6 col-md-6 col-sm-6 col-xs-12")
                .append("div")
                .attr("id", "worldmap")
                .append("svg")
                .attr("width", width)
                .attr("height", height)

    var projection = d3.geo.mercator()
                       .scale(80)
                       .translate( [width / 2 - 20, 340]);

    var path = d3.geo.path().projection(projection);

    var g = svg.append("g")
               .attr("class", "countries");

    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 8])
        .on("zoom", zoomed);

    svg.append("text")
        .attr("class", "worldmapTitle")
        .attr("x", (width / 2))
        .attr("y", 40)
        .attr("text-anchor", "middle")
        .style("font-size", "36px")
        .text("Accumulated PISA score per country");

    svg.append("text")
        .attr("class", "year")
        .attr("x", width - 70)
        .attr("y", 150)
        .attr("text-anchor", "middle")
        .style("font-size", "60px")
        .text("2015");

    svg.call(tip);
    svg.call(zoom);
    svg.call(zoom.event);

    queue()
        .defer(d3.json, "world_countries.json")
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
        ReadById2015 = [],
        ReadById2012 = [],
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
                                        ReadById2015[d.id] = +d.Reading;
                                        ScienceById2015[d.id] = +d.Science;
                                        MathById2015[d.id] = +d.Math;
                                     });

        info2012.forEach(function(d) {
                                        pisaById2012[d.id] = +d.Accumulated;
                                        GDPById2012[d.id] = +d.GDP;
                                        SpendingsById2012[d.id] = +d.Spendings;
                                        SalaryById2012[d.id] = +d.Salary;
                                        ReadById2012[d.id] = +d.Reading;
                                        ScienceById2012[d.id] = +d.Science;
                                        MathById2012[d.id] = +d.Math;
                                     });

        data.features.forEach(function(d) {
                                            d.Accumulated = pisaById2015[d.id];
                                            d.GDP = GDPById2015[d.id];
                                            d.Spendings = SpendingsById2015[d.id];
                                            d.Salary = SalaryById2015[d.id];
                                            d.Reading = ReadById2015[d.id];
                                            d.Science = ScienceById2015[d.id];
                                            d.Math = MathById2015[d.id];
                                          });

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
            .on("click", function(d){

            });

        // construct legend
        var legend = svg.selectAll(".legend")
            .data(color.domain())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i)
            { return "translate(0," + Number(height / 2 - 60 + i * 20) + ")"; });

        // create rectangles for the colors of the legend
        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 20)
            .style("fill", color);

        // add text to the legend
        legend.append("text")
            .attr("x", width - 23)
            .attr("y", 0)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d; });

        var svgslider = d3.select("body").append("div")
            .attr("class","slider")
            .append("svg")
            .attr("width", 700)
            .attr("height", 50);

        var slider = new simpleSlider();

        slider.width(width).x(30).y(10).value(1).event(function(){
            if (slider.value() <= 0.5)
            {
                data.features.forEach(function(d) { d.Accumulated = pisaById2012[d.id] });

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
                data.features.forEach(function(d) { d.Accumulated = pisaById2015[d.id] });

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
    }

    function zoomed() {
            g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }

    d3.select(self.frameElement).style("height", height + "px");
})
