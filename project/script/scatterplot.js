function getMinimum(point) {
    return point > 0;
}

function calcLinear(data, x, y, minX, maxY){
    /////////
    //SLOPE//
    /////////

    // Get just the points
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

    // Let n = the number of data points
    var n = pts.length

    // Let a equal n times the summation of all x-values multiplied by their corresponding y-values
    // Let b equal the sum of all x-values times the sum of all y-values
    // Let c equal n times the sum of all squared x-values
    // Let d equal the squared sum of all x-values
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

    // Plug the values that you calculated for a, b, c, and d into the following equation to calculate the slope
    // slope = m = (a - b) / (c - d)
    var m = (a - b) / (c - d);

    /////////////
    //INTERCEPT//
    /////////////

    // Let e equal the sum of all y-values
    var e = ySum;

    // Let f equal the slope times the sum of all x-values
    var f = m * xSum;

    // Plug the values you have calculated for e and f into the following equation for the y-intercept
    // y-intercept = b = (e - f) / n
    var b = (e - f) / n;

    // return an object of two points
    // each point is an object with an x and y coordinate
    return {
        ptA : {
            x: minX,
            y: m * minX + b
        },
        ptB : {
            y: maxY,
            x: (maxY - b) / m
        }
    }
}
