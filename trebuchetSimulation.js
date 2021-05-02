// librairie de simulation d'un trebuchet à 3 degrés de liberté
// se base sur une modélisation de lagrange
// les acc. angulaires sont déterminées pour chaque itération
// à partir de la résolution d'un système d'équation linéaaire
// pour obtenir l'estimation numérique du pas suivant (méthode d'Euler)
// la fonction getSimulationTr permet d'obtenir un tableau des valeurs sur
// entre un temps t1 et t2



var alpha = 0;
var gamma = 0;
var beta = 0;
var d1alpha = 0;
var d1gamma = 0;
var d1beta = 0;

var m1 = 10;
var m2 = 10;
var m3 = 10;

var l1 = 10;
var l2 = 10;
var l3 = 10;
var l4 = 10;
var l5 = 10;

var rdata = new Array(); // création de tableau pour les angles
var vdata = new Array(); // vitesse
var adata = new Array(); // accéleration
var pdata = new Array(); // position 
var xdata = new Array(); // sur x
var ydata = new Array(); // sur y

var g = 9.81;

// fonction pas très utile
function  paramInit(m_1,m_2,m_3,l_1,l_2,l_3,l_4,l_5) {
 m1=m_1;
 m2=m_2;
 m3=m_3;
 l1=l_1;
 l2=l_2;
 l3=l_3;
 l4=l_4;
 l5=l_5;
};

// initialisation
function  simulationInit(alpha0, beta0, gamma0, d1alpha0, d1beta0, d1gamma0) {
 alpha = alpha0;
 gamma = gamma0;
 beta  = beta0;
 d1alpha = d1alpha0;
 d1gamma = d1gamma0;
 d1beta = d1beta0;
 rdata = new Array(); // création de tableau pour les angles
 vdata = new Array(); // vitesse
 adata = new Array(); // accéleration
 pdata = new Array(); // position 
 xdata = new Array(); // sur x
 ydata = new Array(); // sur y
};


// Effectue le calcul pour un incrément de temps dt
// r est un array(), dt un intervalle de temps

function  simulationStep(t, dt) {
 // ----- Calcul des coefficients de la matrice T -------
 // a1*d2alpha + b1*d2beta + c1*d2gamma = d1
 var a1 = - m1*l1^2 - m2*l2^2 - m1*l4^2 - m2*l5^2 + 2*m1*l1*l4*Math.cos(gamma) + 2*m2*l2*l5*Math.cos(beta)
 var b1 = m2*l5*(l5 - l2*Math.cos(beta))
 var c1 = m1*l4*(l1*Math.cos(gamma) - l4)
 var d1 = m1*g*(l1*Math.sin(alpha) - l4*Math.sin(gamma + alpha)) - m2*g*(l2*Math.sin(alpha) + l5*Math.sin(beta-alpha)) + m1*l1*l4*Math.sin(gamma)*(2*d1alpha + d1gamma)*d1gamma + m2*l2*l5*Math.sin(beta)*(2*d1alpha - d1beta)*d1beta
 // a2*d2alpha + b2*d2beta + c2*d2gamma = d2
 var a2 = b1
 var b2 = - m2*l5^2
 var c2 = 0
 var d2 = m2*l5*(g*Math.sin(beta - alpha) - l2*Math.sin(beta)*d1alpha^2)
 // a3*d2alpha + b3*d2beta + c3*d2gamma = d3
 var a3 = c1
 var b3 = 0
 var c3 = - m1*l4^2
 var d3 = m1*l4*(g*Math.sin(gamma - alpha) - l1*Math.sin(gamma)*d1alpha);

 // ----- inverse de T ------- //
 var T =  new Array();
 T = [[a1,b1,c1],[a2,b2,c2],[a3,b3,c3]];
 var I =  new Array();
 I = matrix_invert(T);

 //------- calcul des  nouvelles accélérations avec I ---//
 d2alpha = I[0][0]*d1 + I[0][1]*d2 + I[0][2]*d3; // les chiffres [0][1] correspondent à la position dans les lignes/colonnes
 d2beta  = I[1][0]*d1 + I[1][1]*d2 + I[1][2]*d3;
 d2gamma = I[2][0]*d1 + I[2][1]*d2 + I[2][2]*d3;
 // document.write(d2alpha + " " + d2beta + "<br>"); // Déboguage pour voir si les calculs marchent

 // ------ calcul des nouvelles vitesse et positions Euler , approx 1er ordre : x = x0 + dx/dt(t0) * dt ----- //
 d1alpha = d1alpha + dt*d2alpha;
 d1beta  = d1beta  + dt*d2beta;
 d1gamma = d1gamma + dt*d2gamma;
 alpha   = alpha + dt*d1alpha;
 beta    = beta  + dt*d1beta;
 gamma   = gamma + dt*d1gamma;


 adata.push([t,d2alpha,d2beta,d2gamma]); // On rajoute les nouvelles valeurs dans les tableaux
 vdata.push([t,d1alpha,d1beta,d1gamma]);
 rdata.push([t,alpha,beta,gamma]);

 var x = Math.floor(-l2*Math.sin(alpha)-l5*Math.sin(beta-alpha));
 var y = Math.floor(l3+l2*Math.cos(alpha)-l5*Math.cos(beta-alpha));


 pdata.push({x,y});
 xdata.push({t,x});
 ydata.push({t,y});
};



function startSimulation(dt,tmax) {
 var t=0;
 for(var i=0;i<1000;i++) {
   simulationStep(t,dt);
   if (t>tmax) break;
   t = t + 1*dt;
 };
}


function getSimdata() {return pdata;}

function getSimXdata() {return xdata;}

function getSimYdata() {return ydata;}

function getSimAngledata() {return rdata;}

function getSimAngleVdata() {return vdata;}

function getSimAngleAdata() {return adata;}







