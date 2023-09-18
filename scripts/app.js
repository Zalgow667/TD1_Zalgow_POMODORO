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
const titleProgressBar = document.getElementById('progress-bar-title');
const containerProgressBar = document.getElementById('progress-bar-container');

let startTimer;
let isSend = false;
let cmpt_cycle = 0; // Compteur de cycle
showChoice.style.visibility = "hidden"; // S'affiche quand le timer est lancer
titleProgressBar.style.visibility = "hidden";
containerProgressBar.style.visibility = "hidden";

/* ------ TEST ------ */

wmInput.addEventListener('change', () => {
    m.innerHTML = wmInput.value;
    document.title = wmInput.value + " : 00 - Pomodoro Timer"
});

const savedPm = localStorage.getItem('choixMinutesP') || '5';
const savedWm = localStorage.getItem('choixMinutesT') || '25';

pmInput.value = savedPm;
wmInput.value = savedWm;

m.innerHTML = savedWm;
document.title = savedWm + " : 00 - Pomodoro en JS !";

/* ------------------ */

if (cmpt_cycle === 0 && !isSend) {
    ts.innerHTML = "Rien";
    ts.style.backgroundColor = "gray";
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

    // Si le compteur de cycle est à 0 ou s'il n'y a aucun cycle, affiche "rien" dans le type de session
    if (cmpt_cycle === 0 && !isSend) {
        ts.innerHTML = "Rien";
    } else {
        ts.innerHTML = "Travail";
        ts.style.backgroundColor = "#CC0000";
    }

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

    titleProgressBar.style.marginTop = "1em";
    titleProgressBar.style.visibility = "visible";
    containerProgressBar.style.visibility = "visible";
    texteCliquable.style.visibility = "visible";
    texteOutil.style.visibility = "visible";

});

document.addEventListener('keydown', () => {
    // Vérifie si la touche appuyé est la barre d'espace (code 32)
    if (event.keyCode === 32) {
        event.preventDefault(); // Empêche le défilement de la page lors de l'appui sur la barre d'espace

        // Si le compteur de cycle est à 0 ou s'il n'y a aucun cycle, affiche "rien" dans le type de session
        if (cmpt_cycle === 0 && !isSend) {
            ts.innerHTML = "Rien";
        } else {
            ts.innerHTML = "Travail";
            ts.style.backgroundColor = "#CC0000"
        }

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

        titleProgressBar.style.marginTop = "1em";
        titleProgressBar.style.visibility = "visible";
        containerProgressBar.style.visibility = "visible";
        texteCliquable.style.visibility = "visible";
        texteOutil.style.visibility = "visible";
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

    // Met à jour le titre de la page quand le timer avance
    document.title = `${formattedMinutes} : ${formattedSecondes} - Pomodoro !`

    // Mettre à jour les éléments HTML
    m.innerHTML = formattedMinutes;
    s.innerHTML = formattedSecondes;

    // Met en rouge les secondes et minutes si < 00:10
    if (minutes === 0 && secondes <= 10) {
        m.classList.add('blinking-text');
        s.classList.add('blinking-text');
        semicolon.classList.add('blinking-text');
    } else {
        m.classList.remove('blinking-text');
        s.classList.remove('blinking-text');
        semicolon.classList.remove('blinking-text');
    }

    //  Gestion de la phase de travail et de repos
    if (minutes === 0 && secondes === 0) {
        if (cmpt_cycle % 2 === 0) {
            formattedMinutes = pm.toString().padStart(2, '0');
            ts.innerHTML = "Repos";
            ts.style.backgroundColor = "green"
        } else {
            formattedMinutes = wm.toString().padStart(2, '0');
            ts.innerHTML = "Travail";
            ts.style.backgroundColor = "#CC0000"
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
    }

    if (minutes === 0 && secondes === 1) {
        let audio = new Audio("audio/cloche.mp3");
        audio.play();
    }

    // Calculez le pourcentage de temps restant
    const totalTime = cmpt_cycle % 2 === 0 ? wm * 60 : pm * 60; // En secondes
    const remainingSeconds = minutes * 60 + secondes;
    const progressPercentage = ((totalTime - remainingSeconds) / totalTime) * 100;

    // Mettez à jour la largeur de la barre de progression
    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = `${progressPercentage}%`;

    // Mettez à jour le texte du pourcentage
    const progressText = document.getElementById('progress-text');
    progressText.textContent = `${progressPercentage.toFixed(2)}%`;
}

//  Fonction servant à raffraichir la page
function resetTimer() {
    // Effacer les valeurs stockées dans le localStorage lorsque vous réinitialisez le timer
    location.reload();
}

// Méthode servant à récupérer le valeur des inputs et les attribués
function getValue() {
    // Récupère les valeurs des inputs
    const pmValue = parseInt(pmInput.value);
    const wmValue = parseInt(wmInput.value);

    // Vérifier si les valeurs sont des nombres entiers positifs
    if (!isNaN(pmValue) && pmValue >= 0 && Number.isInteger(pmValue) &&
        !isNaN(wmValue) && wmValue >= 0 && Number.isInteger(wmValue)) {
        // Stocker les valeurs positives dans le localStorage
        localStorage.setItem('choixMinutesP', pmValue.toString());
        localStorage.setItem('choixMinutesT', wmValue.toString());
        isSend = true;

        // Mettre à jour les champs d'entrée avec les valeurs positives
        pmInput.value = pmValue.toString();
        wmInput.value = wmValue.toString();

        // Mettre à jour l'affichage
        m.innerHTML = wmValue;
    } else {
        pmInput.value = '5'; 
        wmInput.value = '25'; 
        alert('Veuillez entrer des nombres entiers positifs.');
    }
}

const texteCliquable = document.getElementById('texteCliquable');
const texteOutil = document.getElementById('text_outil');
const boutons = document.getElementById('boutons');
const accelererTemps = document.getElementById('accelererTemps');
const jouerMusique = document.getElementById('jouerMusique')
let timerInterval;
let cmpt_tmp = 0;

texteOutil.style.visibility = "hidden";
texteCliquable.style.visibility = "hidden";

texteCliquable.addEventListener('click', () => {
    if(cmpt_tmp % 2 == 0) {
        boutons.style.visibility = 'visible';
        boutons.style.display = 'block';
        cmpt_tmp++;
    } else {
        boutons.style.visibility = 'hidden';
        cmpt_tmp++;
    }
});

jouerMusique.addEventListener('click', () => {
    let audio_music = new Audio("audio/pomodoro.mp3");
    audio_music.play();
});

accelererTemps.addEventListener('click', () => {
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    m.innerHTML = "00";
    s.innerHTML = "11";
});


