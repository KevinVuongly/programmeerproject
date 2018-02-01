/*
    Kevin Vuong
    10730141

    This file contains interactivity functions needed for the scatterplot.
*/

var marginscatter = {top: 70, right: 30, bottom: 30, left: 60},
    widthscatter = 600 - marginscatter.left - marginscatter.right,
    heightscatter = 400 - marginscatter.top - marginscatter.bottom;

// initial ranges of data, needed for radar chart
var ranges = {
    minGDP: 0,
    maxGDP: 0,
    minSalary: 0,
    maxSalary: 0,
    minSpendings: 0,
    maxSpendings: 0,
    minScience: 0,
    maxScience: 0,
    minReading: 0,
    maxReading: 0,
    minMath: 0,
    maxMath: 0,
    minAccumulated: 0,
    maxAccumulated: 0
}

var datapoints = ["Education spendings", "GDP per capita", "Teacher salaries"];

// initial regression information
var rangeRegression = {
    x: "Accumulated",
    y: "Spendings",
    minX: 0,
    maxX: 0
}

// returns the parameter if condition holds
function getMinimum(point) {
    return point > 0;
}

// calculate the regression line according to data provided
function calcLinear(data, info){

    var pts = [];

    data.forEach(function(d,i){
        var obj = {};
        obj.x = Number(d[info.x]);
        obj.y = Number(d[info.y]);
        obj.mult = obj.x * obj.y;

        if (obj.mult > 0) {
            pts.push(obj)
        }
    });

    var n = pts.length

    var sum = 0;
    var xSum = 0;
    var ySum = 0;
    var sumSq = 0;

    pts.forEach(function(pt){
        sum = sum + pt.mult;
        xSum = xSum + pt.x;
        ySum = ySum + pt.y;
        sumSq = sumSq + (pt.x * pt.x);
    });

    var a = sum * n;
    var b = xSum * ySum;
    var c = sumSq * n;
    var d = xSum * xSum;

    var m = (a - b) / (c - d);

    var b = (ySum - m * xSum) / n;

    var y1 = m * info.minX + b,
        y2 = m * info.maxX + b;

    if (isNaN(y1) || isNaN(y2)) {
        return {
            ptA : {
                x: 0,
                y: 0
            },
            ptB : {
                x: 0,
                y: 0
            }
        }
    }
    else {
        return {
            ptA : {
                x: info.minX,
                y: y1
            },
            ptB : {
                x: info.maxX,
                y: y2
            }
        }
    }
}

// updates scatterplot according to the parameters provided
function updateScatter(id, x, y, d) {
    d3.selectAll(id)
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
            // if PISA score is unknown of the country, don't draw scatterpoint
            if (isNaN(d.Accumulated)) { return 0; }

            // if the variable value is unknown e.g. has the value of 0, don't draw scatterpoint
            if (selectValue == datapoints[0]) {
                if (d.Spendings == 0) { return 0; }
            }
            else if (selectValue == datapoints[1]) {
                if (d.GDP == 0) { return 0; }
            }
            else {
                if (d.Salary == 0) { return 0; }
            }

            return 3;
        });
}

// draws the regression
function drawRegression(id, points) {
    d3.select(id)
        .transition()
        .duration(250)
        .attr("x1", points.x(points.ptA.x))
        .attr("y1", points.y(points.ptA.y))
        .attr("x2", points.x(points.ptB.x))
        .attr("y2", points.y(points.ptB.y));
}
