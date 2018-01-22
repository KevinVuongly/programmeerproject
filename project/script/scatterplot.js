/*  Name: Kevin Vuong
 *  Student number: 10730141
 */

// wait until DOM content is loaded
document.addEventListener("DOMContentLoaded", function() {

    // Set tooltips
    var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                    return "<strong>Country: </strong><span class='details'>"
                    + d.name + "<br></span>"
                    + "<strong>PISA score: </strong><span class='details'>"
                    + format(d.Accumulated) +"</span>";
                });

    // width and height of barchart
    var margin = {top: 20, right: 30, bottom: 30, left: 50},
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // scale x
    var x = d3.scale.linear().range([0, width]);

    // scale y
    var y = d3.scale.linear().range([height, 0]);

    // add x-axis
    var xAxis = d3.svg.axis().scale(x).orient("bottom");

    // add y-axis
    var yAxis = d3.svg.axis().scale(y).orient("left");

    // add svg element
    var svg = d3.select("body").append("div")
        .attr("class", "col-lg-6 col-md-6 col-sm-6 col-xs-12")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

    queue()
        .defer(d3.csv, "data/2015.csv")
        .defer(d3.csv, "data/2012.csv")
        .await(ready);

    function ready(error, info2015, info2012) {
        if (error) throw error;

        info2015.forEach(function(d) {
            d.Accumulated = +d.Accumulated;
            d.Spendings = +d.Spendings;
            d.GDP = +d.GDP;
            d.Salary = +d.Salary;
        })

        info2012.forEach(function(d) {
            d.Accumulated = +d.Accumulated;
            d.Spendings = +d.Spendings;
            d.GDP = +d.GDP;
            d.Salary = +d.Salary;
        })

        // construct domain and range
        x.domain(d3.extent(info2015, function(d)
                 { return d.Accumulated; })).nice();
        y.domain(d3.extent(info2015, function(d)
                 { return d.Spendings; })).nice();

         // add x-axis
         svg.append("g")
             .attr("class", "x axis")
             .attr("transform", "translate(0," + height + ")")
             .call(xAxis)
             .append("text")
             .attr("class", "label")
             .attr("x", width)
             .attr("y", -6)
             .style("text-anchor", "end")
             .text("PISA accumulated score");

         // add y-axis
         svg.append("g")
             .attr("class", "y axis")
             .call(yAxis)
             .append("text")
             .attr("class", "label")
             .attr("transform", "rotate(-90)")
             .attr("y", 6)
             .attr("dy", ".71em")
             .style("text-anchor", "end")
             .text("Spendings in millions($)");

         // draw scatterplot
         svg.selectAll(".dot")
             .data(info2015)
             .enter().append("circle")
             .attr("class", "dot")
             .attr("r", 3)
             .attr("cx", function(d) { return x(d.Accumulated); })
             .attr("cy", function(d) { return y(d.Spendings); })
             .style("fill", function(d) { return color(d.Accumulated); })
             .on("mouseover", function(d) {
                 tip.show(d)
             })
             .on("mouseout", function(d) {
                 tip.hide(d)
             });

         // construct tooltip
         var tooltip = svg.append("g")
             .attr("class", "tooltip")
             .style("display", "none");

         // add atributes to tooltip
         tooltip.append("text")
             .attr("x", 15)
             .attr("dy", "1.2em")
             .style("fontsize", "1.25em")
             .attr("font-weight", "bold");

         // add title to the scatterplot
         svg.append("text")
              .attr("x", (width / 2))
              .attr("y", 0 - (margin.top / 2) + 10)
              .attr("text-anchor", "middle")
              .style("font-size", "24px")
              .text("Spendings");
    }
})
