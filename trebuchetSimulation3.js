// librairie de simulation d'un trebuchet à 3 degrés de liberté
// se base sur une modélisation de lagrange
// les acc. angulaires sont déterminées pour chaque itération
// à partir de la résolution d'un système d'équation linéaaire
// pour obtenir l'estimation numérique du pas suivant (méthode d'Euler)
// la fonction getSimulationTr permet d'obtenir un tableau des valeurs sur
// entre un temps t1 et t2



var alpha   =0;
var gamma   =0;
var beta    =0;
var d1alpha =0;
var d1gamma =0;
var d1beta  =0;

var m1=10;
var m2=10;
var m3=10;

var l1=10;
var l2=10;
var l3=10;
var l4=10;
var l5=10;

var adata=new Array();

var pdata=new Array();
var xdata=new Array();
var ydata=new Array();

var p2data=new Array();
var x2data=new Array();
var y2data=new Array();

var p3data=new Array();
var x3data=new Array();
var y3data=new Array();

var p4data=new Array();
var x4data=new Array();
var y4data=new Array();


var g=9.81;

// paramètres
function  paramInit(m_1,m_2,l_1,l_2,l_3,l_4,l_5) {
 m1=m_1;
 m2=m_2;
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
 simdata = new Array();
};


// Effectue le calcul pour un increment de temps dt
// r est un array(), dt intervale de temps

function  simulationStep(t, dt,i) {
 // ----- Calcul des coefficient de la matrice T -------
 // c11*d2alpha + c12*d2beta + c13*d2gamma = w1
 var c11 = -m1*Math.pow(l1,2) + 2*m1*l1*l4*Math.cos(gamma) - m2*Math.pow(l2,2) - m1*Math.pow(l4,2) - m2*Math.pow(l2,2) + 2*m2*l2*l5*Math.cos(beta) - Math.pow(l5,2)*m2;
 var c12 = m1*l4*(l1*Math.cos(beta) - l4);
 var c13 = -m2*l5*(l2*Math.cos(gamma)-l5);
 var  w1 = g*(m1*(l1*Math.sin(alpha)-l4*Math.sin(gamma+alpha))-m2*(l2*Math.sin(alpha)+l5*Math.sin(beta-alpha))) + m1*l1*l4*(2*d1alpha+d1beta)*Math.sin(beta)*d1beta + m2*l2*l5*(2*d1alpha-d1gamma)*Math.sin(gamma)*d1gamma;
 // c21*d2alpha + c22*d2beta + c23*d2gamma = w2
 var c21 = c12;
 var c22 = -m1*Math.pow(l4,2);
 var c23 = 0;
 var  w2 = l4*m1*(g*Math.sin(beta-alpha)-l1*Math.sin(gamma)*Math.pow(d1alpha,2));
 // c31*d2alpha + c32*d2beta + c33*d2gamma = w3
 var c31 = l5*m2*(-l2*Math.cos(gamma) + l5);
 var c32 = 0;
 var c33 = -m2*Math.pow(l5,2);
 var  w3 = m2*l5*(g*Math.sin(gamma-alpha)-l2*Math.sin(gamma)*Math.pow(d1alpha,2));
 

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

/*
 alpha=alpha-6.28*Math.floor(alpha/6.28);
 beta =beta -6.28*Math.floor(beta/6.28);
 gamma=gamma-6.28*Math.floor(gamma/6.28);
*/

// console.log(alpha+","+beta+","+gamma);

// rdata.push([t,alpha,beta,gamma]);

var x = (-l2*Math.sin(alpha)-l5*Math.sin(beta-alpha));
var y = (l2*Math.cos(alpha)+l3-l5*Math.cos(beta-alpha));

var x2 = (l1*Math.sin(alpha)-l4*Math.sin(gamma+alpha));
var y2 = (l3-l1*Math.cos(alpha)+l4*Math.cos(gamma+alpha));

var x3 = (-l2*Math.sin(alpha));
var y3 = (l3+l2*Math.cos(alpha));

var x4 = (l1*Math.sin(alpha));
var y4 = (l3-l1*Math.cos(alpha));



// console.log(t+" "+x+" "+y);

 y=alpha;
 adata.push({t,y});

 pdata.push({x,y});
 ydata.push({t,y});
 y=x;
 xdata.push({t,y}); 

 x=x2;
 y=y2;
 p2data.push({x,y});
 y2data.push({t,y});
 x2data.push({t,y}); 

 x=x3;
 y=y3;
 p3data.push({x,y});
 y3data.push({t,y});
 x3data.push({t,y}); 

 x=x4;
 y=y4;
 p4data.push({x,y});
 y4data.push({t,y});
 x4data.push({t,y}); 

 //vdata.push([t,d1alpha,d1beta,d1gamma]);
};



function startSimulation(dt,nb) {
 var t=0;
 for(var i=0;i<nb;i++) {
   simulationStep(t,dt,i);
   t = t + 1*dt;
 };
}


function getSimAngleAdata() {return adata;}

function getSimdata() {return pdata;}
function getSimXdata() {return xdata;}
function getSimYdata() {return ydata;}

function getSimP2data() {return p2data;}
function getSimX2data() {return x2data;}
function getSimY2data() {return y2data;}

function getSimP3data() {return p3data;}
function getSimX3data() {return x3data;}
function getSimY3data() {return y3data;}

function getSimP4data() {return p4data;}
function getSimX4data() {return x4data;}
function getSimY4data() {return y4data;}









