//====== VARIABLES ET CONSTANTES ======//

//canvas
const simulation = document.getElementById("simulation");
simulation.width = window.innerWidth * 0.85;
simulation.height = window.innerHeight * 0.9;
const ctx = simulation.getContext("2d");

//inputs (éléments HTML)
const e_m1 = document.getElementById("m1");
const e_m2 = document.getElementById("m2");
const e_mb = document.getElementById("mb");
const e_l1 = document.getElementById("shortArm");
const e_l2 = document.getElementById("longArm");
const e_l3 = document.getElementById("pivotHeight");
const e_l4 = document.getElementById("weightLength");
const e_l5 = document.getElementById("fronde");
const e_ral = document.getElementById("ralenti");

//constantes
const PI = Math.PI;
const simDT = 0.01; //dt en seconde
const tmax = 90; // temps de durée maximale de la simulation (but: éviter un temps de calcul trop long)
const g = 9.81; //accélération gravitationnelle 
const coefTrainee = 0.5; //coefficient de traînée du projectile
const massV_contrepoids = 2500; //masse volumique d'une pierre dite "dure"
const massV_ball = 2500; 
const massV_bois = 970; //masse volumique du sorbier domestique (bois rigide utilisé dans la fabrication de la verge du trébuchet)
const masseVolFluide = 1.225; //masse volumique du fluide dans lequel la simulation évolue (air)
const masseFronde = 0.1; //masse de la fronde
const coefRestitution = 0.5; //coefficient de restitution de la vitesse après les collisions


//variables de simulation
//considérées comme constantes dans le temps
//dimensions du trébuchet
var m1;
var m2;
var mb;
var l1;
var l2;
var l3;
var l4;
var l5;
var lb;

var releaseAngle; //angle de libération
var w; //rotation du boulet

//vitesse et inclinaison du vent
var vvent;
var ivent;

//méthode de résolution
var methode; 

//variables pas constantes dans le temps
var i_release;
var i_continue;
var t; //temps
var i; //itération (pas)

//angles
var alpha;
var gamma;
var beta;

//vitesses angulaires
var d1alpha; 
var d1gamma;
var d1beta;

//accélérations angulaires
var d2alpha;
var d2beta;
var d2gamma;

var xmin = 0;
var xmax = 0;
var ymax = 0;
var scale; //coefficient permettant l'affichage correct de la simulation dans la fenêtre
var currentScale; //coefficient actuel (change en fonction du temps pour permettre le focus sur le trébuchet)
var Rmax; //portée théorique

//listes
var angles = new Array();
var d1angles = new Array();
var d2angles = new Array();
var positionsx = new Array();
var positionsy = new Array();
var vitesses = new Array();
var inclinaisons = new Array();
var ETreb = new Array(); //énergie du trébuchet uniquement
var Energies = new Array(); //énergie totale
var animPoints = new Array(); //variable qui stocke les points à tracer pour les trajectoires

var sauv; //sauvegarde du pas
var ral; //coefficient de ralenti


//booléens
var Pause; //indique si la simulation est en pause ou non
var Ralenti; //indique si la simulation est ralentie ou non
var Erreur; //indique si la simulation est en erreur
var SimulationStatus; //indique si la simulation est lancée ou non
var focusMode = false; //par défaut, on voit toute la trajectoire

var animInterval; //boucle qui affiche l'animation


//====== 0. PETITES ET MOYENNES FONCTIONS ======//

//0.1. fonction pour calculer le maximum et le minimum d'une liste
function miax(liste) {
    let min = liste[0],
        max = liste[0];
    for (let i = 1; i < liste.length; i++) {
        if (liste[i] > max) {
            max = liste[i];
        } else if (liste[i] < min) {
            min = liste[i];
        }
    }
    return [max, min];
}

//0.2. fonction qui donne l'inclinaison
function inc(vx, vy) {
    if (vx >= 0) {
        return (Math.atan(vy / vx) / PI) * 180;
    } else {
        return 180 + (Math.atan(vy / vx) / PI) * 180;
    }
}

//0.3. inversion de matrice (trouvé sur Internet)
function matrix_invert(M) {
    // I use gaussian Elimination to calculate the inverse:
    // (1) 'augment' the matrix (left) by the identity (on the right)
    // (2) Turn the matrix on the left into the identity by elemetry row ops
    // (3) The matrix on the right is the inverse (was the identity matrix)
    // There are 3 elemtary row ops: (I combine b and c in my code)
    // (a) Swap 2 rows
    // (b) Multiply a row by a scalar
    // (c) Add 2 rows

    //if the matrix isn't square: exit (error)
    if (M.length !== M[0].length) {
        return;
    }

    //create the identity matrix (I), and a copy (C) of the original
    var i = 0,
        ii = 0,
        j = 0,
        dim = M.length,
        e = 0,
        t = 0;
    var I = [],
        C = [];
    for (i = 0; i < dim; i += 1) {
        // Create the row
        I[I.length] = [];
        C[C.length] = [];
        for (j = 0; j < dim; j += 1) {
            //if we're on the diagonal, put a 1 (for identity)
            if (i == j) {
                I[i][j] = 1;
            } else {
                I[i][j] = 0;
            }

            // Also, make the copy of the original
            C[i][j] = M[i][j];
        }
    }

    // Perform elementary row operations
    for (i = 0; i < dim; i += 1) {
        // get the element e on the diagonal
        e = C[i][i];

        // if we have a 0 on the diagonal (we'll need to swap with a lower row)
        if (e == 0) {
            //look through every row below the i'th row
            for (ii = i + 1; ii < dim; ii += 1) {
                //if the ii'th row has a non-0 in the i'th col
                if (C[ii][i] != 0) {
                    //it would make the diagonal have a non-0 so swap it
                    for (j = 0; j < dim; j++) {
                        e = C[i][j]; //temp store i'th row
                        C[i][j] = C[ii][j]; //replace i'th row by ii'th
                        C[ii][j] = e; //repace ii'th by temp
                        e = I[i][j]; //temp store i'th row
                        I[i][j] = I[ii][j]; //replace i'th row by ii'th
                        I[ii][j] = e; //repace ii'th by temp
                    }
                    //don't bother checking other rows since we've swapped
                    break;
                }
            }
            //get the new diagonal
            e = C[i][i];
            //if it's still 0, not invertable (error)
            if (e == 0) {
                return;
            }
        }

        // Scale this row down by e (so we have a 1 on the diagonal)
        for (j = 0; j < dim; j++) {
            C[i][j] = C[i][j] / e; //apply to original matrix
            I[i][j] = I[i][j] / e; //apply to identity
        }

        // Subtract this row (scaled appropriately for each row) from ALL of
        // the other rows so that there will be 0's in this column in the
        // rows above and below this one
        for (ii = 0; ii < dim; ii++) {
            // Only apply to other rows (we want a 1 on the diagonal)
            if (ii == i) {
                continue;
            }

            // We want to change this element to 0
            e = C[ii][i];

            // Subtract (the row above(or below) scaled by e) from (the
            // current row) but start at the i'th column and assume all the
            // stuff left of diagonal is 0 (which it should be if we made this
            // algorithm correctly)
            for (j = 0; j < dim; j++) {
                C[ii][j] -= e * C[i][j]; //apply to original matrix
                I[ii][j] -= e * I[i][j]; //apply to identity
            }
        }
    }

    //we've done all operations, C should be the identity
    //matrix I should be the inverse:
    return I;
}

//0.4. calculs des accélérations angulaires
function calculsAccAngu(alpha, beta, gamma, d1alpha, d1beta, d1gamma) {

    // l1 = longueur du bras droit (bras court), l2 = longueur du bras gauche (bras long),
    // l3 = hauteur du pivot, l4 = longueur du contrepoids, l5 = longueur de la fronde
    // alpha = angle entre le bras gauche (l2) et la fronde (l5)
    // beta  = angle entre le mat vertical (l3) et le bras gauche (l2)
    // gamma = angle entre le bras droit (l1) et la longueur du contrepoids (l4)
    // m1 = masse à lancer, m2 = contrepoids, mb = masse de la barre

    var c11 = m1 * (l1 ** 2 + l4 ** 2) + mb * lb ** 2 - 2 * m1 * l1 * l4 * Math.cos(gamma) + m2 * (l2 ** 2 + l5 ** 2) - 2 * m2 * l2 * l5 * Math.cos(beta);
    var c12 = m2 * (-(l5 ** 2) + l2 * l5 * Math.cos(beta));
    var c13 = m1 * (l4 ** 2 - l1 * l4 * Math.cos(gamma));
    var w1 = g * (-m1*l1 + m2 * l2 + mb * lb) * Math.sin(alpha) + g * m2 * l5 * Math.sin(beta - alpha) +
        g * m1 * l4 * Math.sin(gamma + alpha) 
        - d1alpha * (2 * m1 * l1 * l4 * d1gamma * Math.sin(gamma) + 2 * m2 * l2 * l5 * d1beta * Math.sin(beta)) -
        m1 * l1 * l4 * Math.sin(gamma) * d1gamma ** 2 + m2 * l2 * l5 * Math.sin(beta) * d1beta ** 2;
    
    var c21 = m2 * (-(l5 ** 2) + l2 * l5 * Math.cos(beta));
    var c22 = m2 * l5 ** 2;
    var c23 = 0;
    var w2 = m2 * l2 * l5 * Math.sin(beta) * d1alpha ** 2 - g * m2 * l5 * Math.sin(beta - alpha);
    
    var c31 = m1 * (l4 ** 2 - l1 * l4 * Math.cos(gamma));
    var c32 = 0;
    var c33 = m1 * l4 ** 2;
    var w3 = m1 * l1 * l4 * Math.sin(gamma) * d1alpha ** 2 + g * m1 * l4 * Math.sin(gamma + alpha);

    //inverse de la matrice T
    T = [
        [c11, c12, c13],
        [c21, c22, c23],
        [c31, c32, c33],
    ];
    I = matrix_invert(T);

    //calcul des nouvelles accélérations avec I 
    d2alpha = I[0][0] * w1 + I[0][1] * w2 + I[0][2] * w3; 
    d2beta = I[1][0] * w1 + I[1][1] * w2 + I[1][2] * w3;
    d2gamma = I[2][0] * w1 + I[2][1] * w2 + I[2][2] * w3; 
    
    return {
        a: d2alpha,
        b: d2beta,
        c: d2gamma,
    };
}

//====== 1. FONCTIONS POUR LES CALCULS (utilisées dans la fonction "calculate") ======//
//1.1. méthodes d'intégration numérique pour les angles du trébuchet
//1.1.1. méthode d'Euler
function EulerMethod(dt) {
    //calcul des nouvelles vitesses et positions avec approximation du second ordre : x = x0 + dx/dt * dt + 1/2 * d^2x/dt^2 * dt^2
    let p = calculsAccAngu(alpha, beta, gamma, d1alpha, d1beta, d1gamma);
    d2alpha = p.a;
    d2beta = p.b;
    d2gamma = p.c;
    
    //vitesses angulaires de beta et gamma après les collisions
    if(beta + dt*d1beta + 0.5*dt**2*d2beta >= 2*PI||
       beta + dt*d1beta + 0.5*dt**2*d2beta <= 0.01||
       gamma + dt*d1gamma + 0.5*dt**2*d2gamma >= 2*PI||
       gamma + dt*d1gamma + 0.5*dt**2*d2gamma <= 0.01){
        
        if(beta + dt*d1beta + 0.5*dt**2*d2beta >= 2*PI||
           beta + dt*d1beta + 0.5*dt**2*d2beta <= 0.01){
            d1beta *= -coefRestitution;
        };
        if(gamma + dt*d1gamma + 0.5*dt**2*d2gamma >= 2*PI||
           gamma + dt*d1gamma + 0.5*dt**2*d2gamma <= 0.01){
            d1gamma *= -coefRestitution;
        };
        p = calculsAccAngu(alpha, beta, gamma, d1alpha, d1beta, d1gamma);
        d2alpha = p.a;
        d2beta = p.b;
        d2gamma = p.c;
    };
    alpha += dt * d1alpha + 0.5 * Math.pow(dt, 2) * d2alpha;
    beta += dt * d1beta + 0.5 * Math.pow(dt, 2) * d2beta;
    gamma += dt * d1gamma + 0.5 * Math.pow(dt, 2) * d2gamma;
    d1alpha += dt * d2alpha;
    d1beta += dt * d2beta;
    d1gamma += dt * d2gamma;
}
//1.1.2. méthode de Heun
function Heun(dt) {
    let p = calculsAccAngu(alpha, beta, gamma, d1alpha, d1beta, d1gamma);
    let q = calculsAccAngu(
        alpha + d1alpha * dt + (1 / 2) * p.a * dt ** 2,
        beta + d1beta * dt + (1 / 2) * p.b * dt ** 2,
        gamma + d1gamma * dt + (1 / 2) * p.c * dt ** 2,
        d1alpha + p.a * dt,
        d1beta + p.b * dt,
        d1gamma + p.c * dt
    );
    d2alpha = (p.a + q.a) / 2;
    d2beta = (p.b + q.b) / 2;
    d2gamma = (p.c + q.c) / 2;
    if(beta + dt*d1beta + 0.5*dt**2*d2beta >= 2*PI||
       beta + dt*d1beta + 0.5*dt**2*d2beta <= 0.01||
       gamma + dt*d1gamma + 0.5*dt**2*d2gamma >= 2*PI||
       gamma + dt*d1gamma + 0.5*dt**2*d2gamma <= 0.01){
        if(beta + dt*d1beta + 0.5*dt**2*d2beta >= 2*PI||
           beta + dt*d1beta + 0.5*dt**2*d2beta <= 0.01){
            d1beta *= -coefRestitution;
        };
        if(gamma + dt*d1gamma + 0.5*dt**2*d2gamma >= 2*PI||
           gamma + dt*d1gamma + 0.5*dt**2*d2gamma <= 0.01){
            d1gamma *= -coefRestitution;
        };
        p = calculsAccAngu(alpha, beta, gamma, d1alpha, d1beta, d1gamma);
        q = calculsAccAngu(
            alpha + d1alpha * dt + (1 / 2) * p.a * dt ** 2,
            beta + d1beta * dt + (1 / 2) * p.b * dt ** 2,
            gamma + d1gamma * dt + (1 / 2) * p.c * dt ** 2,
            d1alpha + p.a * dt,
            d1beta + p.b * dt,
            d1gamma + p.c * dt
        );
        d2alpha = (p.a + q.a) / 2;
        d2beta = (p.b + q.b) / 2;
        d2gamma = (p.c + q.c) / 2;
    };
    alpha += dt * d1alpha + 0.5 * Math.pow(dt, 2) * d2alpha;
    beta += dt * d1beta + 0.5 * Math.pow(dt, 2) * d2beta;
    gamma += dt * d1gamma + 0.5 * Math.pow(dt, 2) * d2gamma;
    d1alpha += dt * d2alpha;
    d1beta += dt * d2beta;
    d1gamma += dt * d2gamma;
}
//1.1.3. méthode de Runge-Kutta (RK4)
function RungeKutta(dt) {
    let p = calculsAccAngu(alpha, beta, gamma, d1alpha, d1beta, d1gamma);
    let q = calculsAccAngu(alpha + d1alpha*dt/2, beta + d1beta*dt/2, gamma + d1gamma*dt/2, d1alpha + p.a*dt/2, d1beta + p.b*dt/2, d1gamma + p.c*dt/2);
    let r = calculsAccAngu(alpha + d1alpha*dt/2 + 1/2*p.a*(dt/2)**2, beta + d1beta*dt/2 + 1/2*p.b*(dt/2)**2, gamma + d1gamma*dt/2 +1/2*p.c*(dt/2)**2, d1alpha + q.a*dt/2, d1beta + q.b*dt/2, d1gamma + q.c*dt/2);
    let s = calculsAccAngu(alpha + d1alpha*dt + 1/2*q.a*(dt)**2, beta + d1beta*dt + 1/2*q.b*(dt)**2, gamma + d1gamma*dt + 1/2*q.c*(dt)**2, d1alpha + r.a*dt,d1beta + r.b*dt,d1gamma + r.c*dt);
    d2alpha = (p.a + q.a + r.a)/3;
    d2beta = (p.b + q.b + r.b)/3;
    d2gamma = (p.c + q.c + r.c)/3;
    //si beta ou gamma est en dehors de l'intervalle ]0.01,2*PI[, on inverse et diminue (par 2) les vitesses angulaires à chaque collision;
    if(beta + dt*d1beta + 0.5*dt**2*d2beta >= 2*PI||
       beta + dt*d1beta + 0.5*dt**2*d2beta <= 0.01||
       gamma + dt*d1gamma + 0.5*dt**2*d2gamma >= 2*PI||
       gamma + dt*d1gamma + 0.5*dt**2*d2gamma <= 0.01){
        if(beta + dt*d1beta + 0.5*dt**2*d2beta >= 2*PI||
           beta + dt*d1beta + 0.5*dt**2*d2beta <= 0.01){
            d1beta *= -coefRestitution;
        };
        if(gamma + dt*d1gamma + 0.5*dt**2*d2gamma >= 2*PI||
           gamma + dt*d1gamma + 0.5*dt**2*d2gamma <= 0.01){
            d1gamma *= -coefRestitution;
        };
        p = calculsAccAngu(alpha, beta, gamma, d1alpha, d1beta, d1gamma);
        q = calculsAccAngu(alpha + d1alpha*dt/2, beta + d1beta*dt/2, gamma + d1gamma*dt/2, d1alpha + p.a*dt/2, d1beta + p.b*dt/2, d1gamma + p.c*dt/2);
        r = calculsAccAngu(alpha + d1alpha*dt/2 + 1/2*p.a*(dt/2)**2, beta + d1beta*dt/2 + 1/2*p.b*(dt/2)**2, gamma + d1gamma*dt/2 + 1/2*p.c*(dt/2)**2, d1alpha + q.a*dt/2, d1beta + q.b*dt/2, d1gamma + q.c*dt/2);
        s = calculsAccAngu(alpha + d1alpha*dt + 1/2*q.a*(dt)**2, beta + d1beta*dt + 1/2*q.b*(dt)**2, gamma + d1gamma*dt + 1/2*q.c*(dt)**2, d1alpha + r.a*dt, d1beta + r.b*dt, d1gamma + r.c*dt);
        d2alpha = (p.a + q.a + r.a)/3;
        d2beta = (p.b + q.b + r.b)/3;
        d2gamma = (p.c + q.c + r.c)/3;
    };
    alpha   += dt * d1alpha + 0.5 * dt ** 2 * d2alpha;
    beta    += dt * d1beta + 0.5 * dt ** 2 * d2beta;
    gamma   += dt * d1gamma + 0.5 * dt ** 2 *d2gamma;
    d1alpha += dt * ((p.a + 2 * q.a + 2 * r.a + s.a) / 6);
    d1beta  += dt * ((p.b + 2 * q.b + 2 * r.b + s.b) / 6);
    d1gamma += dt * ((p.c + 2 * q.c + 2 * r.c + s.c) / 6);
}

//1.2. balistique
function balistique(vi, incl, xi, yi) {
    let cf = coefTrainee; 
    let rho = masseVolFluide; 
    let v = vi; //vitesse de lancé
    let d = simDT; 
    let m = m2;
    let r = r2;
    let x = xi; //dernière position de x avant le lancer = première position parabolique de x 
    let y = yi;
    let vx = v * Math.cos((incl / 180) * PI);
    let vy = v * Math.sin((incl / 180) * PI);

    let air = PI * r ** 2;
    //let vol = (4 / 3) * PI * r ** 3;
    let inclrel = inc(-vx + vvent * Math.cos((ivent / 180) * PI), -vy + vvent * Math.sin((ivent / 180) * PI));

    function ft(vx, vy) { //force de traînée
        let v = ((-vx + vvent * Math.cos((ivent / 180) * PI)) ** 2 + (-vy + vvent * Math.sin((ivent / 180) * PI)) ** 2) ** 0.5;
        return (cf * rho * air * v ** 2) / 2;
    }

    function fm(vx, vy) { //effet Magnus
        let v = ((-vx + vvent * Math.cos((ivent / 180) * PI)) ** 2 + (-vy + vvent * Math.sin((ivent / 180) * PI)) ** 2) ** 0.5;
        return ((0.5 * PI * rho * r ** 3 * w) / 180) * PI * v;
    }

    function a(vx, vy) { //accélération du projectile dans l'air
        return {
            x: (ft(vx, vy) * Math.cos((inclrel / 180) * PI) - fm(vx, vy) * Math.sin((inclrel / 180) * PI)) /m,
            y: (ft(vx, vy) * Math.sin((inclrel / 180) * PI) - m * g + fm(vx, vy) * Math.cos((inclrel / 180) * PI))/m,
        };
    }

    function RungeKuttaBalistique() {
        let p = a(vx, vy);
        let q = a(vx + p.x * (d / 2), vy + p.y * (d / 2));
        let r = a(vx + q.x * (d / 2), vy + q.y * (d / 2));
        let s = a(vx + r.x * d, vy + r.y * d);
        x += (1 / 2) * ((p.x + q.x + r.x) / 3) * d ** 2 + vx * d;
        y += (1 / 2) * ((p.y + q.y + r.y) / 3) * d ** 2 + vy * d;
        vx += (d * (p.x + 2 * q.x + 2 * r.x + s.x)) / 6;
        vy += (d * (p.y + 2 * q.y + 2 * r.y + s.y)) / 6;
    }

    function EulerBalistique() {
        ax = a(vx, vy).x;
        ay = a(vx, vy).y;
        x += (1 / 2) * ax * d ** 2 + vx * d;
        y += (1 / 2) * ay * d ** 2 + vy * d;
        vx += ax * d;
        vy += ay * d;
    }

    function HeunBalistique() {
        let p = a(vx, vy);
        let q = a(vx + p.x * d, vy + p.y * d);
        ax = (p.x + q.x) / 2;
        ay = (p.y + q.y) / 2;
        x += (1 / 2) * ax * d ** 2 + vx * d;
        y += (1 / 2) * ay * d ** 2 + vy * d;
        vx += ax * d;
        vy += ay * d;
    }
    while (y >= 0 && t <= tmax) {
        switch (methode) {
            case "RungeKutta":
                RungeKuttaBalistique();
                break;
            case "Euler":
                EulerBalistique();
                break;
            default:
                HeunBalistique();
                break;
        }

        v = (vx ** 2 + vy ** 2) ** 0.5;
        vitesses.push(v); 
        incl = inc(vx, vy);
        inclrel = inc(-vx + vvent * Math.cos((ivent / 180) * PI),-vy + vvent * Math.sin((ivent / 180) * PI));

        positionsx.push(x);
        positionsy.push(y);
        inclinaisons.push(incl);

        t += d;
        i += 1;
    }
}

//====== 2. FONCTIONS POUR L'AFFICHAGE (utilisée dans la fonction "Display") ======//
//2.1. affichage du trébuchet et de la trajectoire de la balle
function draw(alpha, beta, gamma, pos, vitesse, Energy, i, scale, xmin) {
    //vide le canvas avant d'afficher la nouvelle frame
    ctx.clearRect(0, 0, simulation.width, simulation.height);

    //calcul des points du trébuchet
    var c = {x: -xmin*1.1*scale, y: simulation.height - scale * l3}
    var b = {
        x: c.x - scale * l2 * Math.sin(alpha),
        y: c.y - scale * l2 * Math.cos(alpha),
    };
    var a = {
        x: b.x - scale * l5 * Math.sin(beta - alpha),
        y: b.y + scale * l5 * Math.cos(beta - alpha),
    };
    var d = {
        x: c.x + scale * l1 * Math.sin(alpha),
        y: c.y + scale * l1 * Math.cos(alpha),
    };
    var e = {
        x: d.x - scale * l4 * Math.sin(gamma + alpha),
        y: d.y - scale * l4 * Math.cos(gamma + alpha),
    };

    //affichage du trébuchet
    //pied
    ctx.lineWidth = 0.4 * scale;
    ctx.strokeStyle = colors.trebuchetColor1;
    ctx.beginPath();
    ctx.moveTo(c.x - (l3 / 3) * scale, simulation.height);
    ctx.lineTo(c.x, c.y + 0.55 * scale);
    ctx.lineTo(c.x + (l3 / 3) * scale, simulation.height);
    ctx.stroke();

    //barre
    ctx.beginPath();
    ctx.moveTo(b.x, b.y);
    ctx.lineTo(d.x, d.y);
    ctx.stroke();

    //fronde et longueur du contrepoids
    ctx.lineWidth = 0.3 * scale;
    ctx.strokeStyle = colors.trebuchetColor2;
    ctx.beginPath();
    ctx.moveTo(b.x, b.y);
    ctx.lineTo(a.x, a.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(d.x, d.y);
    ctx.lineTo(e.x, e.y);
    ctx.stroke();

    //point de pivot principal et autres points de pivot
    ctx.fillStyle = colors.trebuchetColor3;
    ctx.beginPath();
    ctx.arc(b.x, b.y, 0.22 * scale, 0, 2 * PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(c.x, c.y, 0.33 * scale, 0, 2 * PI);
    ctx.arc(d.x, d.y, 0.22 * scale, 0, 2 * PI);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = colors.trebuchetColor2;
    ctx.arc(a.x, a.y, 0.14 * scale, 0, 2 * PI);
    ctx.fill();

    //masses
    ctx.beginPath();
    ctx.fillStyle = colors.masseColor;
    ctx.arc(e.x, e.y, 1.5 * r1 * scale, 0, 2 * PI);
    ctx.fill();

    //affichage du projectile
    ctx.beginPath();
    ctx.fillStyle = colors.projectilColor;
    ctx.arc(
        (-xmin * 1.1 + pos.x) * scale,
        simulation.height - pos.y * scale,
        5 * r2 * scale, 0, 2 * PI);
    ctx.fill();

    //sol
    ctx.strokeStyle = colors.groundColor;
    ctx.lineWidth = scale;
    ctx.beginPath();
    ctx.moveTo(0, simulation.height);
    ctx.lineTo(simulation.width, simulation.height);
    ctx.stroke();

    //affichage des points précédents
    if (animPoints.length > 0) {
        for (let k = 0; k < animPoints.length; k++) {
            ctx.beginPath();
            ctx.fillStyle = colors.previousPath1;
            ctx.arc(
                (-xmin * 1.1 + animPoints[k].x) * scale,
                simulation.height - animPoints[k].y * scale, 0.8, 0, 2 * PI);
            ctx.fill();
        }
    }
    if (i >= positionsx.length - 1) {
        for (var k = 0; k < positionsx.length;) {
            ctx.beginPath();
            ctx.fillStyle = colors.previousPath2;
            k = k + 5;
            ctx.arc(
                (-xmin * 1.1 + positionsx[k]) * scale,
                simulation.height - positionsy[k] * scale, 1.2, 0, 2 * PI);
            ctx.fill();
            animPoints.push({
                x: positionsx[k],
                y: positionsy[k],
            });
        }
    }

    //affichage des données
    
    /*if (l2 + l5 + r2 > l1 + l4 + r1) {
        document.getElementById("xposLabel").innerText = (pos.x - (l2 + l5 + r2)).toFixed(3);
    } else {
        document.getElementById("xposLabel").innerText = (pos.x - (l1 + l4 + r1)).toFixed(3);
    }*/
    
    document.getElementById("xposLabel").innerText = pos.x.toFixed(3);

    document.getElementById("yposLabel").innerText = pos.y.toFixed(3);

    document.getElementById("speedLabel").innerText = vitesse.toFixed(3);

    document.getElementById("RmaxLabel").innerText = (Rmax).toFixed(3);

    document.getElementById("timeLabel").innerText = (simDT * i).toFixed(3);
    
    //angles alpha, beta, gamma du trébuchet
    document.getElementById("alphaLabel").innerText = (((alpha % 2) * PI * 180) / PI).toFixed(3);
    document.getElementById("betaLabel").innerText = (((beta % 2) * PI * 180) / PI).toFixed(3);
    document.getElementById("gammaLabel").innerText = (((gamma % 2) * PI * 180) / PI).toFixed(3);
    document.getElementById("energieLabel").innerText = Energy.toFixed(3);

    //affichage de la flèche indiquant le sens du vent
    if (vvent != 0) {
        ctx.fillStyle = colors.directionVentColor;
        ctx.font = "15px Trebuchet MS";
        ctx.fillText("Direction du vent", 35, 35);
        
        if (vvent > 0) {
            canvas_arrow(90, 90, 75, (ivent / 180) * PI);
        } else {
            canvas_arrow(90, 90, 75, (ivent / 180) * PI + PI);
        }
    }

}

//affichage d'une flèche sur le canvas
function canvas_arrow(centerx, centery, length, angle) {

    let endangle = PI / 6;
    let endlength = 15;

    ctx.lineWidth = 4;
    ctx.strokeStyle = colors.directionVentColor;
    ctx.beginPath();
    ctx.moveTo(
        centerx - (Math.cos(angle) * length) / 2,
        centery + (Math.sin(angle) * length) / 2
    );

    let endx = centerx + (Math.cos(angle) * length) / 2;
    let endy = centery - (Math.sin(angle) * length) / 2;

    ctx.lineTo(endx, endy);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(
        endx + Math.cos(PI + angle - endangle) * endlength,
        endy - Math.sin(PI + angle - endangle) * endlength
    );
    ctx.lineTo(endx, endy);
    ctx.lineTo(
        endx + Math.cos(angle + endangle - PI) * endlength,
        endy - Math.sin(angle + endangle - PI) * endlength
    );
    ctx.stroke();
}
//====== 3. FONCTIONS PRINCIPALES ======//
//3.1. fonction faisant la simulation
function calculate() {
    //SIMULATION DU TREBUCHET//
    //initialisation de la simulation
    d1alpha = 0;
    d1gamma = 0;
    d1beta = 0;
    r1 = ((3 * m1) / (4 * PI * massV_contrepoids)) ** (1 / 3);
    r2 = ((3 * m2) / (4 * PI * massV_ball)) ** (1 / 3);

    //simulation du trébuchet
    m2 += masseFronde;
    while (beta - alpha - PI / 2 < releaseAngle && t <= tmax) {
        //simulation jusqu'à ce que l'inclinaison de la vitesse corresponde à l'angle de libération
        if(isNaN(alpha)||isNaN(beta)||isNaN(gamma)||isNaN(d1alpha)||isNaN(d1beta)||isNaN(d1gamma)){break}
        //calcul de la première position, vitesse et inclinaison du projectile
        
        /*if (l2 + l5 + r2 > l1 + l4 + r1) {
            var x = l2 + l5 + r2 - l2 * Math.sin(alpha) - l5 * Math.sin(beta - alpha);
        } else {
            var x = l1 + l4 + r1 - l2 * Math.sin(alpha) - l5 * Math.sin(beta - alpha);
        }*/
        
        var x = - l2 * Math.sin(alpha) - l5 * Math.sin(beta - alpha);

        var y = l3 + l2 * Math.cos(alpha) - l5 * Math.cos(beta - alpha);
        
        angles.push({a: alpha, b: beta, c: gamma});
        d1angles.push({a: d1alpha, b: d1beta, c: d1gamma});
        if(i!=0){d2angles.push({a: d2alpha, b: d2beta, c: d2gamma})};

        positionsx.push(x);
        positionsy.push(y);

        vitesses.push((l2 ** 2 * d1alpha ** 2 + l5 ** 2 * (d1beta - d1alpha) ** 2 + 2 * l2 * l5 * d1alpha * (d1beta - d1alpha) * Math.cos(beta)) ** 0.5);
        inclinaisons.push(inc(-l2 * d1alpha * Math.cos(alpha) - l5 * (d1beta - d1alpha) * Math.cos(beta - alpha), -l2 * d1alpha * Math.sin(alpha) + l5 * (d1beta - d1alpha) * Math.sin(beta - alpha)));
        
        E = (1 / 2) * (m1 * (l1 ** 2 + l4 ** 2) + mb * lb ** 2 - 2 * m1 * l1 * l4 * Math.cos(gamma) + m2 * (l2 ** 2 + l5 ** 2) - 2 * m2 * l2 * l5 * Math.cos(beta)) * d1alpha ** 2 +
            (1 / 2) * m1 * l4 ** 2 * d1gamma ** 2 + (1 / 2) * m2 * l5 ** 2 * d1beta ** 2 + m1 * (l4 ** 2 - l1 * l4 * Math.cos(gamma)) * d1alpha * d1gamma +
            m2 * (-(l5 ** 2) + l2 * l5 * Math.cos(beta)) * d1alpha * d1beta + g *(-m1 * l1 + m2 * l2 + mb * lb) * Math.cos(alpha) - g * m2 * l5 * Math.cos(beta - alpha) +
            g * m1 * l4 * Math.cos(gamma + alpha)+ g*(m1+m2+mb) * l3;
        ETreb.push(E);
        
        switch (methode) {
            case "RungeKutta":
                RungeKutta(simDT, true);
                break;
            case "Euler":
                EulerMethod(simDT, true);
                break;
            default:
                Heun(simDT, true);
        }
        t += simDT;
        i += 1;
    }
    m2 = Math.abs(e_m2.value);
    t -= simDT;
    i -= 1;
    i_release = i;

    //calculs de la portée
    Rmax = (2*vitesses[i_release]**2*Math.cos(inclinaisons[i_release]*Math.PI/180)*Math.sin(inclinaisons[i_release]*Math.PI/180))/g;

    //SIMULATION DE LA BALISTIQUE//
    balistique(vitesses[i_release], inclinaisons[i_release], positionsx[i_release], positionsy[i_release]);

    //fonction si l'on veut que le trébuchet continue à bouger pendant que la balle est en chute libre
    i_continue = i_release;
    m2 = masseFronde;

    while (i_continue < i && (l3 + l2 * Math.cos(alpha) - l5 * Math.cos(beta - alpha) >= 0)) {
        if(isNaN(alpha)||isNaN(beta)||isNaN(gamma)||isNaN(d1alpha)||isNaN(d1beta)||isNaN(d1gamma)){break}
        i_continue += 1;
        switch (methode) {
            case "RungeKutta":
                RungeKutta(simDT);
                break;
            case "Euler":
                EulerMethod(simDT);
                break;
            default:
                Heun(simDT);
        }
        //ajout dans les listes
        angles.push({a: alpha, b: beta, c: gamma});
        d1angles.push({a: d1alpha, b: d1beta, c: d1gamma});
        d2angles.push({a: d2alpha, b: d2beta, c: d2gamma});

        E = (1 / 2) * (m1 * (l1 ** 2 + l4 ** 2) + mb * lb ** 2 - 2 * m1 * l1 * l4 * Math.cos(gamma) + m2 * (l2 ** 2 + l5 ** 2) - 2 * m2 * l2 * l5 * Math.cos(beta)) * d1alpha ** 2 +
            (1 / 2) * m1 * l4 ** 2 * d1gamma ** 2 + (1 / 2) * m2 * l5 ** 2 * d1beta ** 2 + m1 * (l4 ** 2 - l1 * l4 * Math.cos(gamma)) * d1alpha * d1gamma +
            m2 * (-(l5 ** 2) + l2 * l5 * Math.cos(beta)) * d1alpha * d1beta + g *(-m1 * l1 + m2 * l2 + mb * lb) * Math.cos(alpha) - g * m2 * l5 * Math.cos(beta - alpha) +
            g * m1 * l4 * Math.cos(gamma + alpha) + g*(m1+m2+mb)*l3;

        ETreb.push(E);
    }
    m2 = Math.abs(e_m2.value);

    //calcul de l'énergie totale
    for(let a = 0 ; a <= i ; a++){
        if(a <= i_release){
            Energies.push(ETreb[a]);
        }else{
            if(a <= i_continue){
                Energies.push(ETreb[a] + (1 / 2) * m2 * vitesses[a] ** 2 + m2 * g * positionsy[a]);
            }else{
                let b=1;
                while(isNaN(ETreb[ETreb.length - b])){
                    b+=1;
                };
                Energies.push(ETreb[ETreb.length - b] + (1 / 2) * m2 * vitesses[a] ** 2 + m2 * g * positionsy[a]);
            };
        }
    }
}

//3.2. fonction pour trouver le bon coefficient d'affichage
function Scale() {
    //calcul du coefficient de zoom pour l'affichage
    if (xmin > miax(positionsx)[1]) {
        xmin = miax(positionsx)[1];
    }
    
    /*if (xmin < 0) {
        if (xmin > miax(positionsx)[1]) {
            xmin = miax(positionsx)[1];
        }
    } else {
        xmin = 0;
    }*/
    
    if(xmax < l1+l2+l4+l5){
        xmax = l1+l2+l4+l5
    };
    if (xmax < miax(positionsx)[0]) {
        xmax = miax(positionsx)[0];
    };
    if (ymax < miax(positionsy)[0]) {
        ymax = miax(positionsy)[0];
    };
    
    /*if (l1 + l4 + r1 < l2 + l5 + r2) {
        if (xmax < l2 + l5 + r2) {
            xmax = l2 + l5 + r2;
        }
        if (ymax < l3 + l2 + l5 + r2) {
            ymax = l3 + l2 + l5 + r2;
        }
    } else {
        if (xmax < l1 + l4 + r1) {
            xmax = l1 + l4 + r1;
        }
        if (ymax < l3 + l1 + l4 + r1) {
            ymax = l1 + l4 + r1;
        }
    }*/
    
    var cx = simulation.width / (1.1 * (xmax - xmin));
    var cy = simulation.height / (1.1 * ymax);
    scale = (cx <= cy) ? cx : cy;
}

//3.3. affichage du résultat sur le canvas//
function displaySim(i, slowMotion) {
    //crée la boucle d'animation
    animInterval = setInterval(() => {
        //si la simulation n'est pas finie
        if (i < positionsx.length) {
            if (i <= i_continue) {
                currentAlpha = angles[i].a;
                currentBeta = angles[i].b;
                currentgamma = angles[i].c;
            };
            
            //calcul du coefficient de zoom du trébuchet
            var trebuchetScale = (simulation.width / (l1 + l2 + l4 + l5)) <= (simulation.height / (l2 + l3 + l5)) ? (simulation.width / (l1 + l2 + l4 + l5)) : (simulation.height / (l2 + l3 + l5));

            //zoom sur le trébuchet si le projectile n'est pas encore lancé ou si le focus mode est activé
            if (i <= i_release || focusMode) {
                currentScale = trebuchetScale;
                //appelle la fonction qui dessine la frame sur la canvas
                draw(currentAlpha,currentBeta,currentgamma,{x: positionsx[i], y: positionsy[i]},vitesses[i],Energies[i],i,currentScale, -(l1+l2+l4+l5));
            } else {
                //sinon, on diminue le scale petit-à-petit jusqu'à ce qu'il affiche toute la simulation
                if (scale < currentScale-5) {
                    currentScale -= 5;
                }
                else {
                    currentScale = scale;
                }
                //appelle la fonction qui dessine la frame sur la canvas
                draw(currentAlpha,currentBeta,currentgamma,{x: positionsx[i], y: positionsy[i]},vitesses[i],Energies[i],i,currentScale, xmin);
            }
            
            //incrémente la variable i pour afficher la frame suivante au prochain tour de boucle
            i += 1;
            sauv = i; //sauvegarde l'itération (utile pour la pause ou le ralenti)
        }
        //si la simulation est finie
        else {
            //réactive les boutons qui avaient été désactivés dans la fonction startSim()
            document.getElementById("btnStart").disabled = false;
            document.getElementById("btnPause").disabled = true;
            document.getElementById("btnStop").disabled = true;
            document.getElementById("btnSlowMotion").disabled = true;
            document.getElementById("resolutions").disabled = false;
            //arrête la boucle qui affiche les frames
            clearInterval(animInterval);
            SimulationStatus = false;
            //affiche les graphiques sur l'autre onglet
            drawGraph();
        }
    }, simDT * 1000 * slowMotion);
}

//3.4. fonction qui vérifie et modifie les données avant le lancement de la simulation
function Initialisation() {
    //récupération des donnée du formulaire
    m1 = Math.abs(e_m1.value);
    m2 = Math.abs(e_m2.value);
    mb = Math.abs(e_mb.value);
    l1 = Math.abs(e_l1.value);
    l2 = Math.abs(e_l2.value);
    l3 = Math.abs(e_l3.value);
    l4 = Math.abs(e_l4.value);
    l5 = Math.abs(e_l5.value);
    lb = (l2 - l1) / 2;

    vvent = document.getElementById("vvent").value;
    ivent = document.getElementById("ivent").value;

    releaseAngle = document.getElementById("a").value;
    w = document.getElementById("w").value;

    methode = document.getElementById("resolutions").value;

    //modifie les valeurs dans le formulaire car elle ont peut-être changé (valeur absolue)
    e_m1.value = m1;
    e_m2.value = m2;
    e_mb.value = mb;
    e_l1.value = l1;
    e_l2.value = l2;
    e_l3.value = l3;
    e_l4.value = l4;
    e_l5.value = l5;
    
    //met les variable à 0 (elles peuvent ne pas être à 0 si on a déjà fait une simulation)
    t = 0;
    i = 0;
    positionsx = [];
    positionsy = [];
    vitesses = [];
    angles = [];
    inclinaisons = [];
    ETreb = [];
    Energies = [];

    Pause = false;
    Ralenti = false;
    Erreur = false;
    SimulationStatus = true;
    ral = 1;

    //remet les textes corrects dans les boutons
    document.getElementById("btnSlowMotion").value = "Ralenti";
    document.getElementById("btnPause").value = "Pause";

    //vérifie la validité des valeurs
    if (l3 / l2 > 1) {
        window.alert( "Valeur.s aberrante.s ou impossible.s. La simulation ne peut pas fonctionner.");
        Erreur = true;
    }
    alpha = PI - Math.acos(l3 / l2);
    beta = Math.asin(l3 / l2);
    gamma = Math.acos(l3 / l2);

    if (releaseAngle <= -180 ||
        releaseAngle >= 360 ||
        m1 == 0 ||
        m2 == 0 ||
        mb == 0 ||
        l1 == 0 ||
        l2 == 0 ||
        l3 == 0 ||
        l4 == 0 ||
        l5 == 0) {
        window.alert("Valeurs aberrantes ou impossibles. La simulation ne peut pas fonctionner.");
        Erreur = true;
    }
    //conversion de degrés en radians
    releaseAngle *= PI / 180;
}

//====== 4. FONCTIONS POUR LES BOUTONS ======//
//4.1. lance la simulation
function startSim() {
    //initialise la simulation
    Initialisation();
    //vérifie qu'il n'y ait pas d'erreur. S'il n'y en a pas, on calcule et on lance la simulation
    if (!Erreur) {
        calculate();
        Scale();
        //désactive les boutons pendant la simulation
        document.getElementById("resolutions").disabled = true;
        document.getElementById("btnStart").disabled = true;
        document.getElementById("btnStop").disabled = false;
        document.getElementById("btnPause").disabled = false;
        document.getElementById("btnSlowMotion").disabled = false;
        document.getElementById("resolutions").disabled = false;
        
        displaySim(0, ral);
        e_ral.innerHTML = `Ralenti: ${ral}x`;;
    } else {
        //sinon en arrête
        return;
    }
}

//4.2. stoppe la simulation
function Stop() {
    //arrête la boucle de l'animation et réactive les boutons
    clearInterval(animInterval);
    
    document.getElementById("btnStart").disabled = false;
    document.getElementById("resolutions").disabled = false;
    document.getElementById("btnStop").disabled = true;
    document.getElementById("btnPause").disabled = true;
    document.getElementById("btnSlowMotion").disabled = true;
    
    SimulationStatus = false;
    drawGraph();
}

//4.3. arrête ou relance la simulation
function OnOff() {

    document.getElementById("btnPause").disabled = true;
    document.getElementById("btnSlowMotion").disabled = true;
    document.getElementById("btnStop").disabled = true;

    if (Pause == false) {
        Pause = true;
        clearInterval(animInterval);
        document.getElementById("btnPause").value = "Continue";
    } else if (Pause == true) {
        displaySim(sauv, ral);
        Pause = false;
        document.getElementById("btnPause").value = "Pause";
    }

    document.getElementById("btnPause").disabled = false;
    document.getElementById("btnSlowMotion").disabled = false;
    document.getElementById("btnStop").disabled = false;
}

//4.4. ralenti
//4.4.1. ralentit la simulation
function slowMotion() {

    document.getElementById("btnPause").disabled = true;
    document.getElementById("btnSlowMotion").disabled = true;
    document.getElementById("btnStop").disabled = true;

    if (Pause == false) {
        if (Ralenti == false) {
            clearInterval(animInterval);
            ral = Math.abs(document.getElementById("ralenticurseur").value);
            displaySim(sauv, ral);
            Ralenti = true;
            document.getElementById("btnSlowMotion").value = "Normal";
        } else if (Ralenti == true) {
            clearInterval(animInterval);
            ral = 1;
            displaySim(sauv, ral);
            Ralenti = false;
            document.getElementById("btnSlowMotion").value = "Ralenti";
        }
    } else if (Pause == true) {
        if (Ralenti == false) {
            ral = Math.abs(document.getElementById("ralenticurseur").value);
            Ralenti = true;
            document.getElementById("btnSlowMotion").value = "Normal";
        } else if (Ralenti == true) {
            ral = 1;
            Ralenti = false;
            document.getElementById("btnSlowMotion").value = "Ralenti";
        }
    }
    e_ral.innerHTML = `Ralenti: ${ral}x`;
    document.getElementById("btnSlowMotion").disabled = false;
    document.getElementById("btnPause").disabled = false;
    document.getElementById("btnStop").disabled = false;
}
//4.4.2. fonction pour le curseur ralenti
function RalentiCursorFunction() {

    ral = Math.abs(document.getElementById("ralenticurseur").value);
    e_ral.innerHTML = `Ralenti: ${ral}x`;

    if (Ralenti == true && Pause == false && SimulationStatus == true) {
        document.getElementById("btnPause").disabled = true;
        document.getElementById("btnSlowMotion").disabled = true;
        document.getElementById("btnStop").disabled = true;

        clearInterval(animInterval);
        displaySim(sauv, ral);

        document.getElementById("btnPause").disabled = false;
        document.getElementById("btnSlowMotion").disabled = false;
        document.getElementById("btnStop").disabled = false;
    }
}

//4.5. redimensionne la simulation
function Resize() {

    simulation.width = window.innerWidth * 0.85;
    simulation.height = window.innerHeight * 0.9;

    var cx = simulation.width / (1.1 * (xmax - xmin));
    var cy = simulation.height / (1.1 * ymax);

    if (cx <= cy) {
        scale = cx;
    } else {
        scale = cy;
    }
    if (Pause == true || SimulationStatus == false) {
        draw(angles[sauv - 1].a, 
             angles[sauv - 1].b, 
             angles[sauv - 1].c, 
             {x: positionsx[sauv - 1], 
              y: positionsy[sauv - 1]}, 
             vitesses[sauv - 1], 
             Energies[sauv - 1], 
             sauv - 1, 
             scale, 
             xmin);
    }
}
window.onresize = function () {
    Resize()
}
//4.6 changement de mode de focalisation
function focusModeChange() {
    focusMode = document.getElementById("focus").checked;
    document.getElementById("focusModeLabel").innerHTML = focusMode?"On":"Off"
    
    /*if (Pause == true || SimulationStatus == false) {
        if(focusMode){
            draw(angles[sauv - 1].a, angles[sauv - 1].b, angles[sauv - 1].c, { x: positionsx[sauv - 1], y: positionsy[sauv - 1]}, vitesses[sauv - 1], Energies[sauv - 1], sauv - 1, trebuchetScale)
        }else{
            draw(angles[sauv - 1].a, angles[sauv - 1].b, angles[sauv - 1].c, { x: positionsx[sauv - 1], y: positionsy[sauv - 1]}, vitesses[sauv - 1], Energies[sauv - 1], sauv - 1, scale)
        };
    };*/
    
};

//====== FIN ======//
