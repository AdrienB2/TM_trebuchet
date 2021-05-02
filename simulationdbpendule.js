// librairie de simulation d'un trebuchet à 3 degrés de liberté
// se base sur une modélisation de lagrange
// les acc. angulaires sont déterminées pour chaque itération
// à partir de la résolution d'un système d'équation linéaaire
// pour obtenir l'estimation numérique du pas suivant (méthode d'Euler)
// la fonction getSimulationTr permet d'obtenir un tableau des valeurs sur
// entre un temps t1 et t2



var alpha  =0;
var gamma  =0;
var beta   =0;
var d1alpha=0;
var d1gamma=0;
var d1beta =0;

var m1=10;
var m2=10;
var m3=10;

var l1=10;
var l2=10;
var l3=10;
var l4=10;
var l5=10;

var rdata=new Array();
var vdata=new Array();
var adata=new Array();
var pdata=new Array();
var xdata=new Array();
var ydata=new Array();

var g=9.81;

// paramètres
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
 d1alpha=d1alpha0;
 d1gamma=d1gamma0;
 d1beta =d1beta0;
 simdata= new Array();
};


// Effectue le calcul pour un increment de temps dt
// r est un array(), dt intervale de temps

function  simulationStep(t, dt) {
 // ----- Calcul des coefficient de la matrice T -------
 // a1*d2alpha + b1*d2beta + c1*d2gamma = d1

  var mu=10;
  d2alpha =  (g*(Math.sin(alpha)*Math.cos(beta-alpha)-mu*Math.sin(beta))-(l2*d1alpha*d1alpha+l1*d1beta*d1beta*Math.cos(beta-alpha))*Math.sin(beta-alpha))/(l1*(mu-Math.cos(beta-alpha)*Math.cos(beta-alpha)));
  d2beta  =  (mu*g*(Math.sin(beta)*Math.cos(beta-alpha)-Math.sin(alpha))+(mu*l1*d1beta*d1beta+l2*d1alpha*d1alpha*Math.cos(beta-alpha))*Math.sin(beta-alpha))/(l2*(mu-Math.cos(beta-alpha)*Math.cos(beta-alpha)));
  d2gamma =0;

 // ------ calcul des nouvelles vitesse et positions Euler , approx 1er ordre : x = x0 + dx/dt(t0) * dt ----- //
 d1alpha = d1alpha + dt*d2alpha;
 d1beta  = d1beta  + dt*d2beta;
 d1gamma = d1gamma + dt*d2gamma;
 alpha   = alpha + dt*d1alpha + 0.5*d2alpha*Math.pow(dt,2);
 beta    = beta  + dt*d1beta + 0.5*d2beta*Math.pow(dt,2);
 gamma   = gamma + dt*d1gamma;

 console.log(alpha+","+beta+","+gamma+" "+Math.sin(alpha));

 adata.push([t,d2alpha,d2beta,d2gamma]);
 vdata.push([t,d1alpha,d1beta,d1gamma]);
 rdata.push([t,alpha,beta,gamma]);

 var x = Math.floor(l1*Math.sin(alpha)+l2*Math.sin(beta));
 var y = Math.floor(-l1*Math.cos(alpha)-l2*Math.cos(beta));

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







