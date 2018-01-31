var marginscatter = {top: 20, right: 30, bottom: 30, left: 60},
    widthscatter = 600 - marginscatter.left - marginscatter.right,
    heightscatter = 400 - marginscatter.top - marginscatter.bottom;

var datapoints = ["Education spendings", "GDP per capita", "Teacher salaries"];

function getMinimum(point) {
    return point > 0;
}

function calcLinear(data, x, y, minX, maxX){

    var pts = [];

    data.forEach(function(d,i){
        var obj = {};
        obj.x = Number(d[x]);
        obj.y = Number(d[y]);
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

    var y1 = m * minX + b,
        y2 = m * maxX + b;

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
                x: minX,
                y: y1
            },
            ptB : {
                x: maxX,
                y: y2
            }
        }
    }
}

function drawRegression(id, x, y, points) {
    d3.select(id)
        .transition()
        .duration(250)
        .attr("x1", x(points.ptA.x))
        .attr("y1", y(points.ptA.y))
        .attr("x2", x(points.ptB.x))
        .attr("y2", y(points.ptB.y));
}

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
}
