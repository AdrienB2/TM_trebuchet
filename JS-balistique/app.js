var simulation = document.getElementById('simulation');
simulation.width = window.innerWidth;
simulation.height = 500;

function lancer() {
    var yi = parseFloat(document.getElementById('yi').value);
    var vx = parseFloat(document.getElementById('vx').value);
    var vy = parseFloat(document.getElementById('vy').value);
    var ay = parseFloat(document.getElementById('a').value);

    var startButton = document.getElementById("startBtn");
    startButton.disabled = true;
    var c = simulation.getContext("2d");
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
            console.log(pos);
            c.moveTo(pos[0].x, pos[0].y);
            c.beginPath();
            for (let i = 1; i < pos.length; i++) {
                const element = pos[i];
                console.log(element);
                c.lineTo(Math.floor(element[0]), Math.floor(element[1]));
            }
            c.lineWidth = 2.5;
            c.strokeStyle = "#1CC1BC";
            c.stroke();
            c.beginPath();
            c.arc(Math.floor(x), Math.floor(y), 10, 0, 2 * Math.PI, false); //forme du rond
            c.fillStyle = '#fff'; //couleur, remplissage et épaisseur 
            c.fill();
            t += 10;
        }
    }
}