var simulation = document.getElementById('simulation');
simulation.width = window.innerWidth;
simulation.height = window.innerHeight - 100;

var ctx = simulation.getContext("2d");

function drawTrebuchet(ang) {
    
    var l5 = parseFloat(document.getElementById('fronde').value);
    var l2 = parseFloat(document.getElementById('longArm').value);
    var l1 = parseFloat(document.getElementById('shortArm').value);
    var l4 = parseFloat(document.getElementById('weightLenth').value);
    var l3 = parseFloat(document.getElementById('pivotHeight').value);

    var c = { x: l2 + 200, y: simulation.height - l3 };
    var b = { x: c.x - Math.cos(ang * Math.PI / 180) * l2, y: c.y - Math.sin(ang * Math.PI / 180) * l2 };
    var a = { x: b.x, y: b.y + l5 };
    var d = { x: c.x + Math.cos(ang * Math.PI / 180) * l1, y: c.y + Math.sin(ang * Math.PI / 180) * l1 };
    var e = { x: d.x, y: d.y + l4 };

    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#fff";
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
}
drawTrebuchet(0);
isRotating = false;
var rotInt;
function rotate() {
    if (!isRotating) {
        angle = 0;
        stopAngle = 45;
        rotInt = setInterval(function () {
            drawTrebuchet(angle);
            angle += 1;
        }, 10)
        isRotating = true;
    } else {
        clearInterval(rotInt);
        isRotating = false;
    }
    
}
function lancer() {
    var yi = parseFloat(document.getElementById('yi').value);
    var v = parseFloat(document.getElementById('v').value);
    var ay = parseFloat(document.getElementById('g').value);
    var a = parseFloat(document.getElementById('a').value);

    var vy = v * Math.cos(a * Math.PI / 180);
    var vx = v * Math.cos(a * Math.PI / 180)

    var startButton = document.getElementById("startBtn");
    startButton.disabled = true;
    var t = 0;

    var pos = [];
    var interval = setInterval(frame, 10);
    function frame() {
        x = vx * t/100;
        y = simulation.clientHeight - ((0.5 * ay * (t/100) ** 2) + (vy * (t/100)) + yi);
        if (y > simulation.clientHeight) {
            clearInterval(interval);
            startButton.disabled = false;
        }
        else {
            ctx.clearRect(0, 0, simulation.width, simulation.height);
            pos.push([x, y]);
            ctx.moveTo(pos[0].x, pos[0].y);
            ctx.beginPath();
            for (let i = 1; i < pos.length; i++) {
                const element = pos[i];
                ctx.lineTo(element[0], element[1]);
            }
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = "#1CC1BC";
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(x, y, 10, 0, 2 * Math.PI, false); //forme du rond
            ctx.fillStyle = '#fff'; //couleur, remplissage et épaisseur 
            ctx.fill();
            t += 10;
        }
    }
}