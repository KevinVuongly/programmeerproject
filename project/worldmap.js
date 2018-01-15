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
                        + d.properties.name + "<br></span>"
                        + "<strong>PISA score: </strong><span class='details'>"
                        + "Unknown" +"</span>";
                    }
                });

    var margin = {top: 50, right: 20, bottom: 30, left: 30},
                 width = 650 - margin.left - margin.right,
                 height = 530 - margin.top - margin.bottom;

    var color = d3.scale.threshold()
        .domain([1150,1200,1290,1380,1450,1520,1560,1580,1650])
        .range(["rgb(72,0,0)", "rgb(103,0,13)", "rgb(165,15,21)", "rgb(203,24,29)",
                "rgb(239,59,44)", "rgb(251,106,74)", "rgb(252,146,114)",
                "rgb(252,187,161)","rgb(254,224,210)", "rgb(255,255,255)"]);

    var svg = d3.select("body")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append('g')
                .attr('class', 'map');

    var projection = d3.geo.mercator()
                       .scale(80)
                       .translate( [width / 2 - 20, 280]);

    var path = d3.geo.path().projection(projection);

    svg.call(tip);

    queue()
        .defer(d3.json, "world_countries.json")
        .defer(d3.csv, "data/PISA2012.csv")
        .await(ready);

    function ready(error, data, pisa) {
        var pisaById = {};

        pisa.forEach(function(d) { pisaById[d.id] = +d.Accumulated; });
        data.features.forEach(function(d) { d.Accumulated = pisaById[d.id] });

        svg.append("g")
            .attr("class", "countries")
        .selectAll("path")
            .data(data.features)
        .enter().append("path")
            .attr("d", path)
            .style("fill", function(d) { return color(pisaById[d.id]); })
            .style('stroke', 'black')
            .style('stroke-width', 2)
            .style("opacity",0.8)
            // tooltips
            .style("stroke","black")
            .style('stroke-width', 1)
            .on('mouseover',function(d){
                tip.show(d);

                d3.select(this)
                .style("opacity", 1)
                .style("stroke","white")
                .style("stroke-width", 3);
            })
            .on('mouseout', function(d){
                tip.hide(d);

                d3.select(this)
                .style("opacity", 0.8)
                .style("stroke","black")
                .style("stroke-width",1);
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
    }
})
