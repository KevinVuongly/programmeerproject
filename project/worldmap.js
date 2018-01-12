document.addEventListener("DOMContentLoaded", function() {

    var format = d3.format(",");

    // Set tooltips
    var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                  return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>PISA score: </strong><span class='details'>" + format(d.Accumulated) +"</span>";
                })

    var margin = {top: 20, right: 20, bottom: 30, left: 30},
                width = 600 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;

    var color = d3.scale.threshold()
        .domain([1150,1200,1290,1380,1450,1500,1520,1560,1580,1650])
        .range(["rgb(135,0,0)", "rgb(196,0,0)", "rgb(255,34,0)",
                "rgb(250,138,10)", "rgb(250,226,10)", "rgb(202,250,10)",
                "rgb(115,242,18)","rgb(4,179,16)","rgb(7,129,17)","rgb(9,80,5)"]);

    var path = d3.geo.path();

    var svg = d3.select("body")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append('g')
                .attr('class', 'map');

    var projection = d3.geo.mercator()
                       .scale(80)
                      .translate( [width / 2, 300]);

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
          .style('stroke', 'white')
          .style('stroke-width', 1.5)
          .style("opacity",0.8)
          // tooltips
            .style("stroke","white")
            .style('stroke-width', 0.3)
            .on('mouseover',function(d){
              tip.show(d);

              d3.select(this)
                .style("opacity", 1)
                .style("stroke","white")
                .style("stroke-width",3);
            })
            .on('mouseout', function(d){
              tip.hide(d);

              d3.select(this)
                .style("opacity", 0.8)
                .style("stroke","white")
                .style("stroke-width",0.3);
            });

      svg.append("path")
          .datum(topojson.mesh(data.features, function(a, b) { return a.id !== b.id; }))
           // .datum(topojson.mesh(data.features, function(a, b) { return a !== b; }))
          .attr("class", "names")
          .attr("d", path);
    }
})
