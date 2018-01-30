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
