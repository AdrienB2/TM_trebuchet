//Canvas
var simulation = document.getElementById('simulation');
simulation.width = window.innerWidth * .9;
simulation.height = window.innerHeight;
var ctx = simulation.getContext("2d");

//constantes
var PI = Math.PI;
var simDT = 0.01; //dt en sec
var G = 9.81;

//variables de simulation
var m1 = parseFloat(0);
var m2 = parseFloat(0);
var l1 = parseFloat(0);
var l2 = parseFloat(0);
var l3 = parseFloat(0);
var l4 = parseFloat(0);
var l5 = parseFloat(0);
var releaseAngle = parseFloat(0);

var alpha   = PI/2;
var gamma   = PI/2;
var beta    = 0;
var d1alpha = 0;
var d1gamma = 0;
var d1beta  = 0;
    
var xmax = 0;
var ymax = 0;

var angles = [{ a: alpha, b: beta, c: gamma }];
var positions = new Array();

var scale = 0.0;

//Fonctions faisant la simulation (calculs)
function calculate() {
    //***********************//
    //SIMULATION DU TREBUCHET//
    //***********************//

    //Initialisation de la simulation
    alpha   = PI/2;
    gamma   = PI/2;
    beta    = 0;
    d1alpha = 0;
    d1gamma = 0;
    d1beta  = 0;
    
    //Simulation
    startSimulation(simDT, releaseAngle);


    //****************************//
    //SIMULATION DE LA BALLISTIQUE//
    //****************************//

    let finalPos = positions[positions.length - 1]
    let secondToLastPos = positions[positions.length - 2]
    let finalSpeed = Math.sqrt((finalPos.x - secondToLastPos.x) ** 2 + (finalPos.y - secondToLastPos.y) ** 2) * 100
    ballistique(releaseAngle, 0.5, 1.295, 0.05, finalSpeed, 9.81, simDT , m2, 0, 0, 0, finalPos.x, finalPos.y)
}

//Fonction pour afficher la simulation
function displaySim() {

    //Calcul du coéfficient de zoom pour l'affichage
    var cx = simulation.width / (xmax);
	var cy = simulation.height/(ymax);
	if(cx <= cy){
		scale = cx/(1 + 0.1)
	}else{
	    scale = cy/(1+0.1)
    };
    var numberOfStep = positions.length - 1;
    var numberOfStepBeforeLaunch = angles.length;

    var i = 0;

    //***********************************//
    //AFFICHAGE DU RESULTAT SUR LE CANVAS//
    //***********************************//
    var animInterval = setInterval(function () {
        if (i < numberOfStep) {
            i += 1;
            var currentAlpha;
            var currentBeta;
            var currentGamma;
            var currentPos = { x:positions[i].x + l2 + l5, y: simulation.height - positions[i].y};
            if (i < numberOfStepBeforeLaunch) {
                currentAlpha = angles[i].a;
                currentBeta = angles[i].b;
                currentGamma = angles[i].c;
            } else {
                currentAlpha = angles[angles.length-1].a;
                currentBeta = angles[angles.length-1].b;
                currentGamma = angles[angles.length-1].c;
            }
            ctx.clearRect(0, 0, simulation.height, simulation.width);
            draw(currentAlpha, currentBeta, currentGamma, currentPos);
        }
        else {
            clearInterval(animInterval);
        }
    }, simDT * 100)
}

//Fonction appelée pour lancer une simulation
function startSim() {
    //récupération des donnée du formulaire
    m1 = parseFloat(document.getElementById("m1").value);
    m2 = parseFloat(document.getElementById("m2").value);
    l1 = parseFloat(document.getElementById("shortArm").value);
    l2 = parseFloat(document.getElementById("longArm").value);
    l3 = parseFloat(document.getElementById("pivotHeight").value);
    l4 = parseFloat(document.getElementById("weightLenth").value);
    l5 = parseFloat(document.getElementById("fronde").value);
    releaseAngle = parseFloat(document.getElementById("a").value);
    
    //convertion de l'angle en rad
    releaseAngle = releaseAngle * PI / 180 + PI / 2;
    calculate();
    displaySim()
}

//**************************//
//FUNCTIONS POUR LES CALCULS//
//**************************//

//Trébuchet
function startSimulation(dt, maxAng) {
    var t = 0;
    var i = 0;
    positions = []
    angles = []
    while (beta-alpha < maxAng) {
        simulationStep(t,dt,i);
        t += dt;
        i += 1;
    };
}

function  simulationStep(t, dt,i) {
    // ----- Calcul des coefficient de la matrice T -------
    // c11*d2alpha + c12*d2beta + c13*d2gamma = w1
    var c11 = -m1*Math.pow(l1,2) + 2*m1*l1*l4*Math.cos(gamma) - m2*Math.pow(l2,2) - m1*Math.pow(l4,2) - m2*Math.pow(l2,2) + 2*m2*l2*l5*Math.cos(beta) - Math.pow(l5,2)*m2;
    var c12 = m1*l4*(l1*Math.cos(beta) - l4);
    var c13 = -m2*l5*(l2*Math.cos(gamma)-l5);
    var  w1 = G*(m1*(l1*Math.sin(alpha)-l4*Math.sin(gamma+alpha))-m2*(l2*Math.sin(alpha)+l5*Math.sin(beta-alpha))) + m1*l1*l4*(2*d1alpha+d1beta)*Math.sin(beta)*d1beta + m2*l2*l5*(2*d1alpha-d1gamma)*Math.sin(gamma)*d1gamma;
    // c21*d2alpha + c22*d2beta + c23*d2gamma = w2
    var c21 = c12;
    var c22 = -m1*Math.pow(l4,2);
    var c23 = 0;
    var  w2 = l4*m1*(G*Math.sin(beta-alpha)-l1*Math.sin(gamma)*Math.pow(d1alpha,2));
    // c31*d2alpha + c32*d2beta + c33*d2gamma = w3
    var c31 = l5*m2*(-l2*Math.cos(gamma) + l5);
    var c32 = 0;
    var c33 = -m2*Math.pow(l5,2);
    var  w3 = m2*l5*(G*Math.sin(gamma-alpha)-l2*Math.sin(gamma)*Math.pow(d1alpha,2));
    
    
    // ------ inverse de la matrice T ------- //
    var T =  new Array();
    T = [[c11,c12,c13],[c21,c22,c23],[c31,c32,c33]];
    var I =  new Array();
    I = matrix_invert(T);
    
    //--- calcul des nouvelles accélérations avec I ---//
    d2alpha = I[0][0]*w1 + I[0][1]*w2 + I[0][2]*w3;
    d2beta  = I[1][0]*w1 + I[1][1]*w2 + I[1][2]*w3;
    d2gamma = I[2][0]*w1 + I[2][1]*w2 + I[2][2]*w3;
    /*
     if (d2alpha >6.28) d2alpha=d2alpha-6.28;
     if (d2beta >6.28) d2beta=d2beta -6.28;
     if (d2gamma >6.28) d2gamma=d2gamma-6.28;
     
     if (d2alpha <-6.28) d2alpha=d2alpha+6.28;
     if (d2beta <-6.28) d2beta=d2beta +6.28;
     if (d2gamma <-6.28) d2gamma=d2gamma+6.28;
     */
    
    // ----- calcul des nouvelles vitesse et positions avec méthode Euler, approximation du second ordre : x = x0 + dx/dt * dt + 1/2 * d^2x/dt^2 * dt^2 ----- //
    d1alpha = d1alpha + dt*d2alpha;
    d1beta  = d1beta  + dt*d2beta;
    d1gamma = d1gamma + dt*d2gamma;
    alpha   = alpha + dt*d1alpha + 0.5*Math.pow(dt,2)*d2alpha;
    beta    = beta  + dt*d1beta + 0.5*Math.pow(dt,2)*d2beta;
    gamma   = gamma + dt*d1gamma + 0.5*Math.pow(dt,2)*d2gamma;
    
    
    alpha=alpha-6.28*Math.floor(alpha/6.28);
    beta =beta -6.28*Math.floor(beta/6.28);
    gamma=gamma-6.28*Math.floor(gamma/6.28);
    
    
    //Ajout dans les array
    angles.push({a:alpha, b:beta, c:gamma});
    
    //calcule de la postion du projectile
    var x = (-l2 * Math.sin(alpha) - l5 * Math.sin(beta - alpha));
    var y = (l2*Math.cos(alpha)+l3-l5*Math.cos(beta-alpha));
    positions.push({ x: x, y: y });
};

//Ballistique
function ballistique(angle, coefTrainee, masseVolFluide, r, vi, g, dt, m, vAngu, vvent, ivent, xi, yi) {
	var incl = (angle - PI /2)* 180 /PI; //angle de lancé
    var cf = coefTrainee; //coef trainée
    var p = masseVolFluide; // Masse volumique du fluide
    var v = vi; //vitesse
    var d = dt; // dt
    var w = vAngu; // Vitesse angulaire

    var listex = [];
    var listey = [];
    var listev = [v];
    var listeincl = [incl];
    var x = xi;
    var y = yi;
    var vx = v*Math.cos(incl/180*PI);
    var vy = v*Math.sin(incl/180*PI);
    var vx = vx - vvent*Math.cos(ivent*PI/180)
	var vy = vy - vvent * Math.sin(ivent * PI / 180)
	
	let air = PI*r**2;
	let vol = 4/3*PI*r**3;
    while(y>=0){
        ax=(-ft(v)*Math.cos(incl/180*PI)+fm(v)*Math.sin(incl/180*PI)+fA(vol))/m;
        ay=(-ft(v)*Math.sin(incl/180*PI)-m*g-fm(v)*Math.cos(incl/180*PI))/m;
		x += 1 / 2 * ax * d ** 2 + vx * d;
        listex.push(x);
        y += 1/2*ay*d**2 + vy*d;
        listey.push(y);
        vx += ax*d;
        vy += ay*d;
        v = (vx**2+vy**2)**0.5;
        listev.push(v);
        incl = inc(vx,vy);
		listeincl.push(incl);
        positions.push({ x: x, y: y })
    };
    xmax=Math.abs(Math.max(...listex));
    ymax=Math.abs(Math.max(...listey));
	function inc(vx,v){
			if(vx>=0){
				return (Math.atan(vy/vx)/PI*180);
			}
			else{
				return (180+Math.atan(vy/vx)/PI*180);
			}
	}

	function ft(v) {
		return (cf*p*air*v**2/2)
	}
	function fm(v){
		return (0.5*PI*p*r**3*w/180*PI*v)
	};
	function fA(){
		return (p*vol*g)
	};
};

//Invertion de matrices
function matrix_invert(M){
    // I use Guassian Elimination to calculate the inverse:
    // (1) 'augment' the matrix (left) by the identity (on the right)
    // (2) Turn the matrix on the left into the identity by elemetry row ops
    // (3) The matrix on the right is the inverse (was the identity matrix)
    // There are 3 elemtary row ops: (I combine b and c in my code)
    // (a) Swap 2 rows
    // (b) Multiply a row by a scalar
    // (c) Add 2 rows
    
    //if the matrix isn't square: exit (error)
    if(M.length !== M[0].length){return;}
    
    //create the identity matrix (I), and a copy (C) of the original
    var i=0, ii=0, j=0, dim=M.length, e=0, t=0;
    var I = [], C = [];
    for(i=0; i<dim; i+=1){
        // Create the row
        I[I.length]=[];
        C[C.length]=[];
        for(j=0; j<dim; j+=1){
            
            //if we're on the diagonal, put a 1 (for identity)
            if(i==j){ I[i][j] = 1; }
            else{ I[i][j] = 0; }
            
            // Also, make the copy of the original
            C[i][j] = M[i][j];
        }
    }
    
    // Perform elementary row operations
    for(i=0; i<dim; i+=1){
        // get the element e on the diagonal
        e = C[i][i];
        
        // if we have a 0 on the diagonal (we'll need to swap with a lower row)
        if(e==0){
            //look through every row below the i'th row
            for(ii=i+1; ii<dim; ii+=1){
                //if the ii'th row has a non-0 in the i'th col
                if(C[ii][i] != 0){
                    //it would make the diagonal have a non-0 so swap it
                    for(j=0; j<dim; j++){
                        e = C[i][j];       //temp store i'th row
                        C[i][j] = C[ii][j];//replace i'th row by ii'th
                        C[ii][j] = e;      //repace ii'th by temp
                        e = I[i][j];       //temp store i'th row
                        I[i][j] = I[ii][j];//replace i'th row by ii'th
                        I[ii][j] = e;      //repace ii'th by temp
                    }
                    //don't bother checking other rows since we've swapped
                    break;
                }
            }
            //get the new diagonal
            e = C[i][i];
            //if it's still 0, not invertable (error)
            if(e==0){return}
        }
        
        // Scale this row down by e (so we have a 1 on the diagonal)
        for(j=0; j<dim; j++){
            C[i][j] = C[i][j]/e; //apply to original matrix
            I[i][j] = I[i][j]/e; //apply to identity
        }
        
        // Subtract this row (scaled appropriately for each row) from ALL of
        // the other rows so that there will be 0's in this column in the
        // rows above and below this one
        for(ii=0; ii<dim; ii++){
            // Only apply to other rows (we want a 1 on the diagonal)
            if(ii==i){continue;}
            
            // We want to change this element to 0
            e = C[ii][i];
            
            // Subtract (the row above(or below) scaled by e) from (the
            // current row) but start at the i'th column and assume all the
            // stuff left of diagonal is 0 (which it should be if we made this
            // algorithm correctly)
            for(j=0; j<dim; j++){
                C[ii][j] -= e*C[i][j]; //apply to original matrix
                I[ii][j] -= e*I[i][j]; //apply to identity
            }
        }
    }
    
    //we've done all operations, C should be the identity
    //matrix I should be the inverse:
    return I;
}

//*************************//
//FUNCTION POUR L'AFFICHAGE//
//*************************//

//affiche le trebuchet et la trajectoire de la balle
function draw(alpha, beta, gamma, pos) {
    var ang1 = -(alpha - PI / 2); //convertit l'angle donné par les calcules pour facilité l'afficahge
    var ang2 = beta - alpha;
    var ang3 = gamma - alpha;

    var c = { x: l2 + l5, y: simulation.height - l3};

    var b = { x: c.x - Math.cos(ang1) * l2 , y: c.y - Math.sin(ang1) * l2 };
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
    ctx.arc(pos.x, pos.y, 5, 0, 2 * PI);
    ctx.fillStyle = '#000';
    ctx.fill();
}