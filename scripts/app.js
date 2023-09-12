// Sélection des éléments HTML par leur ID

const m = document.getElementById('minutes');
const s = document.getElementById('secondes');
const pmInput = document.getElementById('choixMinutesP');
const wmInput = document.getElementById('choixMinutesT');
const semicolon = document.getElementById('semicolon');
const start = document.getElementById('start');
const cycle = document.getElementById('nb_cycle');
const ts = document.getElementById('type_session');
const choix = document.getElementById('choix');
const sendValue = document.getElementById('confirm');
const showChoice = document.getElementById('showChoice');
const showMinutesChoiceW = document.getElementById('temps_work');
const showMinutesChoiceP = document.getElementById('temps_pause');
const app = document.getElementById('app');

let startTimer;
let isSend = false;
let cmpt_cycle = -1; // Compteur de cycle
showChoice.style.visibility = "hidden"; // S'affiche quand le timer est lancer


// Si le compteur de cycle est à 0 ou s'il n'y a aucun cycle, affiche "rien" dans le type de session
if (cmpt_cycle === 0 || cycle.innerHTML == "aucun") {
    ts.innerHTML = "rien";
}

// Récupérer les valeurs des champs d'entrée depuis le stockage local au chargement de la page 
window.addEventListener('load', () => {
    // Récupérer les valeurs depuis le localStorage ou utiliser des valeurs par défaut
    const savedPm = localStorage.getItem('choixMinutesP') || '5';
    const savedWm = localStorage.getItem('choixMinutesT') || '25';

    // Remplir les champs d'entrée avec les valeurs récupérées
    pmInput.value = savedPm;
    wmInput.value = savedWm;
    isSend = true; // Marquer comme valeurs déjà envoyées
});

// Ajout d'un écouteur a ma constante start, lance le pomdoro en cas de clique

start.addEventListener('click', () => {
    if (isSend == false) {
        alert('Vous devez envoyer vos valeurs !');
    } else {
        showChoice.style.visibility = "visible";
        choix.style.visibility = "hidden";
        sendValue.style.visibility = "hidden";
        showMinutesChoiceP.innerHTML = pmInput.value;
        showMinutesChoiceW.innerHTML = wmInput.value;

        if (startTimer === undefined) {
            startTimer = setInterval(timer, 1000); // Utilisation de 1000ms pour chaque seconde
            start.innerHTML = "reset";
        }

        // Change le boutton start en reset
        if (start.innerHTML == "reset") {
            start.addEventListener('click', () => {
                resetTimer();
            });
        }
    }
});

// Fonction permettant l'écoulement du timer via la constante start et son écouteur et la méthode "setInterval()""
function timer() {
    let minutes = parseInt(m.innerHTML);
    let secondes = parseInt(s.innerHTML);
    let pm = parseInt(pmInput.value);
    let wm = parseInt(wmInput.value);

    if (secondes > 0) {
        secondes--;
    } else if (minutes > 0) {
        minutes--;
        secondes = 59;
    }

    // Formatage des minutes et des secondes avec deux chiffres
    let formattedMinutes = minutes.toString().padStart(2, '0');
    let formattedSecondes = secondes.toString().padStart(2, '0');

    // Mettre à jour les éléments HTML
    m.innerHTML = formattedMinutes;
    s.innerHTML = formattedSecondes;

    // Met en rouge les secondes et minutes si < 00:10
    if (minutes === 0 && secondes <= 10) {
        s.style.color = "red";
        m.style.color = "red";
        semicolon.style.color = "red";
    } else {
        s.style.color = "white";
        m.style.color = "white";
        semicolon.style.color = "white";
    }

    //  Gestion de la phase de travail et de repos
    if (minutes === 0 && secondes === 0) {
        if (cmpt_cycle % 2 === 0) {
            formattedMinutes = pm.toString().padStart(2, '0');
            ts.innerHTML = "Repos";
            ts.style.color = "blue";
        } else {
            formattedMinutes = wm.toString().padStart(2, '0');
            ts.innerHTML = "Travail";
            ts.style.color = "green";
        }
        
        // Incrémente et met à jour le compteur
        cmpt_cycle++;
        cycle.innerHTML = cmpt_cycle;

        // Ceci sert a mettre au pluriel le mot "cycle"
        if (cmpt_cycle > 1) {
            document.getElementById('pluriel').innerHTML = " cycles";
        }

        // Mettre à jour les éléments HTML avec les minutes formatées
        m.innerHTML = formattedMinutes;
        s.innerHTML = "00"; // Réinitialiser les secondes à 00

        // Joue un bruit de cloche quand on passe a une autre session
        let audio = new Audio("audio/cloche.mp3")
        audio.play();
    }
}

//  Fonction servant à raffraichir la page

function resetTimer() {
    // Effacer les valeurs stockées dans le localStorage lorsque vous réinitialisez le timer
    localStorage.removeItem('choixMinutesP');
    localStorage.removeItem('choixMinutesT');
    location.reload();
}

// Méthode servant a récupérer le valeur des inputs et les attribués
function getValue() {
    //  Récupère les valeurs des inputes
    const pmValue = pmInput.value;
    const wmValue = wmInput.value;

    // Vérifier si les valeurs sont numériques et positives avant de les stocker
    if (!isNaN(pmValue) && !isNaN(wmValue) && pmValue > 0 && wmValue > 0) {
        // Stocker les valeurs dans le localStorage
        localStorage.setItem('choixMinutesP', pmValue);
        localStorage.setItem('choixMinutesT', wmValue);
        isSend = true;
    } else {
        alert('Veuillez entrer des valeurs valides et positives.');
    }
}
