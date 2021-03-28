var simulation = document.getElementById('simulation');
simulation.width = window.innerWidth;
simulation.height = 500;

var c = simulation.getContext("2d");

function drawTrebuchet(a, stopAngle) {
    c.lineWidth = 2.5;
    c.strokeStyle = "#fff";
    c.clearRect(0, 0, simulation.width, simulation.height);
    c.beginPath();
    c.moveTo(200, simulation.height);
    c.lineTo(200, simulation.height - 150); 
    c.stroke();
    c.beginPath();
    c.moveTo(200 - Math.cos(a * Math.PI /180) * 75, simulation.height - 100 - Math.sin(a * Math.PI /180) * 75);
    c.lineTo(200 - Math.cos(a * Math.PI /180) * 75, simulation.height - 150 - Math.sin(a * Math.PI /180) * 75);
    c.lineTo(200 + Math.cos(a * Math.PI /180) * 75, simulation.height - 150 + Math.sin(a * Math.PI /180) * 75);
    c.stroke();
}
drawTrebuchet(0, 0);
function rotate() {
    angle = 0;
    stopAngle = 45;
    var interval = setInterval(function () {
        drawTrebuchet(angle, stopAngle);
        angle += 1;
    }, 10)
    
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
            c.clearRect(0, 0, simulation.width, simulation.height);
            pos.push([x, y]);
            c.moveTo(pos[0].x, pos[0].y);
            c.beginPath();
            for (let i = 1; i < pos.length; i++) {
                const element = pos[i];
                c.lineTo(element[0], element[1]);
            }
            c.lineWidth = 2.5;
            c.strokeStyle = "#1CC1BC";
            c.stroke();
            c.beginPath();
            c.arc(x, y, 10, 0, 2 * Math.PI, false); //forme du rond
            c.fillStyle = '#fff'; //couleur, remplissage et épaisseur 
            c.fill();
            t += 10;
        }
    }
}