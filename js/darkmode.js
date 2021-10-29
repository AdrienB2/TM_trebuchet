//tabs
const tabs = document.querySelectorAll("[data-tab-target]");
const tabContents = document.querySelectorAll("[data-tab-content]");
tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        const target = document.querySelector(tab.dataset.tabTarget);
        tabContents.forEach((tabContent) => {
            tabContent.classList.remove("active");
        });
        tabs.forEach((tab) => {
            tab.classList.remove("active");
        });
        target.classList.add("active");
        tab.classList.add("active");
        for (let index = 0; index < document.querySelectorAll(".tab").length; index++) {
            const element = document.querySelectorAll(".tab")[index].style;
            element.background = colors.background
        }
        document.getElementsByClassName("active")[0].style.background = colors.background2
    });
});

//variables de couleur
var colors = {}
const darkModeSwitch = document.getElementById("darkModeSwitch")

function switchColorMode(switch2Dark) {
    //définition des couleurs en fonction du mode sombre/claire
    colors = {
        background: switch2Dark ? "#121212" : "#fff",
        background2: switch2Dark ? "#474747" : "#ccc",
        textColor: switch2Dark ? "#fff":"#000",
        trebuchetColor1: switch2Dark ? "Chocolate":"Chocolate",
        trebuchetColor2: switch2Dark ? "Peru":"Peru",
        trebuchetColor3: switch2Dark ? "Saddlebrown":"Saddlebrown",
        masseColor: switch2Dark ? "LightSlateGray":"LightSlateGray",
        groundColor: switch2Dark ? "#00a800":"#00a800",
        projectilColor: switch2Dark ? "LightGray":"DarkSlateGray",
        previousPath1: switch2Dark ? "Violet":"Magenta",
        previousPath2: switch2Dark ? "Magenta":"DarkMagenta",
        directionVentColor: switch2Dark ? "aqua":"#3F85AD",
        speedLabelColor: switch2Dark ? "Magenta":"DarkMagenta",
        alphaLabelColor: switch2Dark ? "red":"red",
        betaLabelColor: switch2Dark ? "DodgerBlue":"blue",
        gammaLabelColor: switch2Dark ? "LightGreen":"green",
        energieLabelColor: switch2Dark ? "orange":"orange",
        RmaxLabelColor: switch2Dark ? "goldenrod":"goldenrod",
    }
    //changement de la couleur de fond et de la couleur des textes
    var htmlELement = document.querySelector("html")
    htmlELement.style.background = colors.background
    htmlELement.style.color = colors.textColor

    //changement de la couleur des textes de données
    document.getElementById("speedLabel2").style.color = colors.speedLabelColor
    document.getElementById("alphaLabel2").style.color = colors.alphaLabelColor
    document.getElementById("betaLabel2").style.color = colors.betaLabelColor
    document.getElementById("gammaLabel2").style.color = colors.gammaLabelColor
    document.getElementById("energieLabel2").style.color = colors.energieLabelColor
    document.getElementById("RmaxLabel2").style.color = colors.RmaxLabelColor
    document.getElementById("tabs").style.borderBottom = `1px solid ${colors.textColor}`
    document.getElementById("menu").style.borderRight = `1px solid ${colors.textColor}`

    //changement de la couleurs des élément du menu
    for (let index = 0; index < document.querySelectorAll(".menuInput").length; index++) {
        const element = document.querySelectorAll(".menuInput")[index].style;
        element.border = `1px solid ${colors.textColor}`
        element.background = colors.background
        element.color = colors.textColor
    }
    
    //changement de la couleur des onglets
    for (let index = 0; index < document.querySelectorAll(".tab").length; index++) {
        const element = document.querySelectorAll(".tab")[index].style;
        element.background = colors.background
    }
    document.getElementsByClassName("active")[0].style.background = colors.background2

    //changement du schéma de trébuchet
    document.getElementById("schema").src = `./trebuchet-schema-${switch2Dark ? "dark":"light"}.png`;
}

//fonction sur le bouton pour passer du mode sombre/claire
function darkModeSwitchChange() {
    switchColorMode(darkModeSwitch.checked)
}

//appelle la fonction au chargement de la page pour appliquer le bon mode en fonction des réglages de l'ordinateur
switchColorMode(window.matchMedia('(prefers-color-scheme: dark)').matches)
//change le bouton au chargement de la page pour qu'il corresponde au mode activé dans les réglages
darkModeSwitch.checked = window.matchMedia('(prefers-color-scheme: dark)').matches
//fonction qui change le mode sombre/claire si le réglage de l'ordinateur est modifié pendant que la page est ouverte
window.matchMedia('(prefers-color-scheme: dark)').addEventListener("change", () => {
    switchColorMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    darkModeSwitch.checked = window.matchMedia('(prefers-color-scheme: dark)').matches
});
