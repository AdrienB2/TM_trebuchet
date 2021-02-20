function lancer() {
    var yi = parseFloat(document.getElementById('yi').value);
    var vx = parseFloat(document.getElementById('vx').value);
    var vy = parseFloat(document.getElementById('vy').value);
    var ay = parseFloat(document.getElementById('a').value);

    var elem = document.querySelector('.circle'); 
    var simulation = document.querySelector('.simulation'); 
    var t = 0;
    var interval = setInterval(frame, 10);
    elem.style.display = "block";
    function frame() {
        x = vx * t/100;
        y = simulation.clientHeight - ((0.5 * ay * (t/100) ** 2) + (vy * (t/100)) + yi);
        if (y > simulation.clientHeight) {
            clearInterval(interval);
            elem.style.display = "none";
        }
        else {
            elem.style.left = x + 'px';
            elem.style.top = y + 'px';
            t += 10;
        }
    }
}