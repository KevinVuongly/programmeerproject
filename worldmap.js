document.addEventListener("DOMContentLoaded", function() {

    // Set tooltips
    var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                  return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>Population: </strong><span class='details'>" + d.population +"</span>";
                })

    var margin = {top: 20, right: 20, bottom: 30, left: 30},
                width = 500 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;

    var color = d3.scale.threshold()
        .domain([10000,100000,500000,1000000,5000000,10000000,50000000,100000000,500000000,1500000000])
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
        .defer(d3.tsv, "world_population.tsv")
        .await(ready);

    function ready(error, data, population) {
      var populationById = {};

      population.forEach(function(d) { populationById[d.id] = +d.population; });


      svg.append("g")
          .attr("class", "countries")
        .selectAll("path")
          .data(data.features)
        .enter().append("path")
          .attr("d", path)
          .style("fill", function(d) { return color(populationById[d.id]); })
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
