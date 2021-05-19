//canvas
var simulation = document.getElementById('simulation');
simulation.width = window.innerWidth * .9;
simulation.height = window.innerHeight;

var ctx = simulation.getContext("2d");

var simDT = 0.01;

function start() {
    var m1           = parseFloat(document.getElementById("m1").value);
    var m2           = parseFloat(document.getElementById("m2").value);
    var l1           = parseFloat(document.getElementById("shortArm").value);
    var l2           = parseFloat(document.getElementById("longArm").value);
    var l3           = parseFloat(document.getElementById("pivotHeight").value);
    var l4           = parseFloat(document.getElementById("weightLenth").value);
    var l5           = parseFloat(document.getElementById("fronde").value);
    var releaseAngle = parseFloat(document.getElementById("a").value);

    releaseAngle = releaseAngle * Math.PI / 180 + Math.PI / 2;

    paramInit(m1, m2, l1, l2, l3, l4, l5);
    simulationInit(Math.PI/2, 0, Math.PI/2, 0, 0, 0);
    startSimulation(simDT, releaseAngle);
    var i = 0;
    var numberOfStepBefore = getRData().length - 1;
    var numberOfStep = 1000;
    var animInterval = setInterval(function () {
        if (i < numberOfStep) {
            i += 1;
            // if (i > numberOfStepBefore) { 
            //     frame(numberOfStepBefore, { x: 10, y: 10 });
            // }
            frame(i, { x: a.x, y: a.y });
        }
        else {
            clearInterval(animInterval);
        }
    }, simDT * 100)
 
}

function frame(i, pos) {
    var angles = getRData();
    var alpha = angles[i][1];
    var beta = angles[i][2];
    var gamma = angles[i][3];
    ctx.clearRect(0, 0, simulation.height, simulation.width);
    draw(alpha, beta, gamma, i, pos);
}

var a = {};
//affiche le trebuchet
function draw(alpha, beta, gamma, i, pos) {
    var ang1 = -(alpha - Math.PI / 2); //convertit l'angle donné par les calcules pour facilité l'afficahge
    var ang2 = beta - alpha;
    var ang3 = gamma - alpha;

    var c = { x: l2 + l5, y: simulation.height - l3 };
    // console.log(getSimdata()[i].y)
    // var b = { x: c.x + getSimP3data()[i].x, y: c.y + l3 - getSimP3data()[i].y };
    // var a = { x: b.x+ getSimdata()[i].x, y: b.y + getSimdata()[i].y };

    // var d = { x: c.x + getSimP4data()[i].x, y: c.y + l3 - getSimP4data()[i].y };
    // var e = { x: d.x + getSimP2data()[i].x, y: d.y - getSimP2data()[i].y };

    var b = { x: c.x - Math.cos(ang1) * l2, y: c.y - Math.sin(ang1) * l2 };
    a = { x: b.x - l5 * Math.sin(ang2), y: b.y + l5 * Math.cos(ang2) };
    var d = { x: c.x + Math.cos(ang1) * l1, y: c.y + Math.sin(ang1) * l1 };
    var e = { x: d.x + l4 * Math.sin(ang3), y: d.y + l4 * Math.cos(ang3) };


    ctx.lineWidth = 2;
    ctx.clearRect(0, 0, simulation.width, simulation.height);
    ctx.beginPath();
    ctx.moveTo(c.x - 25, simulation.height);
    ctx.lineTo(c.x, c.y); 
    ctx.lineTo(c.x + 25, simulation.height); 
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.lineTo(d.x, d.y);
    ctx.lineTo(e.x, e.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 5, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#000';
    ctx.fill();
}