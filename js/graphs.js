//variable avec les temps à afficher sur l'axe x du graphique
let chartTime = [];

//création de tous les graphiques avec la bibliothèqie Chart.js (pour plus d'infos sur le fonctionnement: https://www.chartjs.org/docs/latest/)
let alphaChartCan = document.getElementById("alphaChart").getContext("2d");
var alphaChart = new Chart(alphaChartCan, {
    type: "line",
    data: {
        labels: chartTime,
        datasets: [{
            label: "Alpha",
            data: angles.map(x => x.a),
            fill: false,
            borderColor: "red",
            pointRadius: 0.1,
        }, ],
    },
    options: {
        animation: false,
        scales: {
            y: {
                title: {
                    text: "α [rad]",
                    display: true,
                    align: "center",
                },
            },
            x: {
                title: {
                    text: "Temps [s]",
                    display: true,
                    align: "center",
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
        },
    },
});
let betaChartCan = document.getElementById("betaChart").getContext("2d");
var betaChart = new Chart(betaChartCan, {
    type: "line",
    data: {
        labels: chartTime,
        datasets: [{
            label: "Beta",
            data: angles.map(x=>x.b),
            borderColor: "blue",
            pointRadius: 0,
        }, ],
    },
    options: {
        scales: {
            y: {
                title: {
                    text: "β [rad]",
                    display: true,
                    align: "center",
                },
            },
            x: {
                title: {
                    text: "Temps [s]",
                    display: true,
                    align: "center",
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
        },
    },
});
let gammaChartCan = document.getElementById("gammaChart").getContext("2d");
var gammaChart = new Chart(gammaChartCan, {
    type: "line",
    data: {
        labels: chartTime,
        datasets: [{
            label: "Gamma",
            data: angles.map(x => x.c),
            borderColor: "green",
            pointRadius: 0,
        }, ],
    },
    options: {
        scales: {
            y: {
                title: {
                    text: "γ [rad]",
                    display: true,
                    align: "center",
                },
            },
            x: {
                title: {
                    text: "Temps [s]",
                    display: true,
                    align: "center",
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
        },
    },
});
let xChartCan = document.getElementById("xChart").getContext("2d");
var xChart = new Chart(xChartCan, {
    type: "line",
    data: {
        labels: chartTime,
        datasets: [{
            label: "Position x",
            data: positionsx,
            borderColor: "violet",
            pointRadius: 0,
        }, ],
    },
    options: {
        scales: {
            y: {
                title: {
                    text: "Position sur x [m]",
                    display: true,
                    align: "center",
                },
            },
            x: {
                title: {
                    text: "Temps [s]",
                    display: true,
                    align: "center",
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
        },
    },
});
let yChartCan = document.getElementById("yChart").getContext("2d");
var yChart = new Chart(yChartCan, {
    type: "line",
    data: {
        labels: chartTime,
        datasets: [{
            label: "Position y",
            data: positionsy,
            borderColor: "violet",
            pointRadius: 0,
        }, ],
    },
    options: {
        scales: {
            y: {
                title: {
                    text: "Position sur y [m]",
                    display: true,
                    align: "center",
                },
            },
            x: {
                title: {
                    text: "Temps [s]",
                    display: true,
                    align: "center",
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
        },
    },
});
let speedChartCan = document.getElementById("speedChart").getContext("2d");
var speedChart = new Chart(speedChartCan, {
    type: "line",
    data: {
        labels: chartTime,
        datasets: [{
            label: "vitesse",
            data: vitesses,
            borderColor: "DarkMagenta",
            pointRadius: 0,
        }, ],
    },
    options: {
        scales: {
            y: {
                title: {
                    text: "Vitesse [m/s]",
                    display: true,
                    align: "center",
                },
            },
            x: {
                title: {
                    text: "Temps [s]",
                    display: true,
                    align: "center",
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
        },
    },
});
let energyChartCan = document.getElementById("energyChart").getContext("2d");
var energyChart = new Chart(energyChartCan, {
    type: "line",
    data: {
        labels: chartTime,
        datasets: [{
            label: "énergie",
            data: Energies,
            borderColor: "Orange",
            pointRadius: 0,
        }, ],
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    text: "Energie [J]",
                    display: true,
                    align: "center",
                },
            },
            x: {
                title: {
                    text: "Temps [s]",
                    display: true,
                    align: "center",
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
        },
    },
});

//fonction qui met à jour les graphiques
function drawGraph() {
    chartTime = Array(i).fill().map((_, i) => (i * simDT).toFixed(3));
    
    alphaChart.data.labels = chartTime;
    alphaChart.data.datasets[0].data = angles.map(x => x.a);
    alphaChart.update();

    betaChart.data.labels = chartTime;
    betaChart.data.datasets[0].data = angles.map(x => x.b);
    betaChart.update();

    gammaChart.data.labels = chartTime;
    gammaChart.data.datasets[0].data = angles.map(x => x.c);
    gammaChart.update();

    xChart.data.labels = chartTime;
    xChart.data.datasets[0].data = positionsx;
    xChart.update();

    yChart.data.labels = chartTime;
    yChart.data.datasets[0].data = positionsy;
    yChart.update();

    speedChart.data.labels = chartTime;
    speedChart.data.datasets[0].data = vitesses;
    speedChart.update();

    energyChart.data.labels = chartTime;
    energyChart.data.datasets[0].data = Energies;
    energyChart.update();
}