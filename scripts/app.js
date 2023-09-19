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
const body = document.getElementsByTagName('body');
const deleteLocalStorageButton = document.getElementById('deleteLocalStorage'); // Bouton pour supprimer les données du stockage local
const clocheCheckbox = document.getElementById('clocheCheckbox'); // Gestion de la cloche (activation/désactivation)
const texteCliquable = document.getElementById('texteCliquable');
const texteOutil = document.getElementById('text_outil');
const boutons = document.getElementById('boutons');
const accelererTemps = document.getElementById('accelererTemps');
const jouerMusique = document.getElementById('jouerMusique');

let clocheActive = false;
let startTimer;
let isSend = false;
let estOk = false;
let cmpt_cycle = 0; // Compteur de cycle
let timerInterval;
let cmpt_tmp = 0;

// Gestion de la musique
let musiqueEnLecture = false;
let audio_music = new Audio("audio/pomodoro.mp3");

// Masquer les éléments au départ
showChoice.style.visibility = "hidden"; // S'affiche quand le timer est lancer
titleProgressBar.style.visibility = "hidden";
containerProgressBar.style.visibility = "hidden";
texteOutil.style.visibility = "hidden";
texteCliquable.style.visibility = "hidden";

const savedPm = localStorage.getItem('choixMinutesP') || '5';
const savedWm = localStorage.getItem('choixMinutesT') || '25';

pmInput.value = savedPm;
wmInput.value = savedWm;

if(savedWm < 10) {
    m.innerHTML = "0" + savedWm;
} else {
    m.innerHTML = savedWm;
}

if(savedWm < 10){
    document.title = "0" + savedWm + " : 00 - Pomodoro en JS !";
} else {
    document.title = savedWm + " : 00 - Pomodoro en JS !";
}

if (cmpt_cycle === 0 && !isSend) {
    ts.innerHTML = "Rien";
    ts.style.backgroundColor = "gray";
} 

wmInput.addEventListener('change', () => {
    if(wmInput.value < 10) {
        m.innerHTML = "0" + wmInput.value;
    } else {
        m.innerHTML = wmInput.value;
    }

    if(wmInput.value < 10){
        document.title = "0" + wmInput.value + " : 00 - Pomodoro Timer"
    } else {
        document.title = wmInput.value + " : 00 - Pomodoro Timer"
    }
});

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
    if(estOk){
        // Récupérez les valeurs des champs d'entrée
        const pmValue = parseInt(pmInput.value);
        const wmValue = parseInt(wmInput.value);
    
        // Vérifiez si les valeurs sont positives
        if (cmpt_cycle === 0 && !isSend) {
            ts.innerHTML = "Rien";
        } else {
            ts.innerHTML = "Travail";
            ts.style.backgroundColor = "#CC0000";
            body[0].style.background = "#FF5F42"
            body[0].classList.add('change-background-wtor');
        }
    
        if (isSend == false) {
            alert('Vous devez envoyer vos valeurs !');
        } else {
            showChoice.style.visibility = "visible";
            choix.style.visibility = "hidden";
            sendValue.style.visibility = "hidden";
            showMinutesChoiceP.innerHTML = pmValue;
            showMinutesChoiceW.innerHTML = wmValue;
            
            if(wmValue > 1){
                document.getElementById('pluriel_w').innerHTML = "minutes";
            } else {
                document.getElementById('pluriel_w').innerHTML = "minute";
            }

            if(pmValue > 1){
                document.getElementById('pluriel_p').innerHTML = "minutes";
            } else {
                document.getElementById('pluriel_p').innerHTML = "minute";
            }

            if (startTimer === undefined) {
                startTimer = setInterval(timer, 1000); // Utilisation de 1000ms pour chaque seconde
                start.innerHTML = "reset";
            }
    
            // Change le bouton start en reset
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
    } else {
        alert('Il y a une erreur dans votre saisie !');
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
            ts.style.backgroundColor = "green";
            body[0].style.backgroundColor = "#00D600"; 
            body[0].classList.remove('change-background-wtor');
            body[0].classList.remove('change-background-gtor');
            body[0].classList.add('change-background-rtog');
        } else {
            formattedMinutes = wm.toString().padStart(2, '0');
            ts.innerHTML = "Travail";
            ts.style.backgroundColor = "#CC0000";
            body[0].style.backgroundColor = "#CC0000";
            body[0].classList.remove('change-background-rtog');
            body[0].classList.add('change-background-gtor');
        }
        
        // Incrémente et met à jour le compteur
        cmpt_cycle++;
        cycle.innerHTML = cmpt_cycle;

        // Ceci sert à mettre au pluriel le mot "cycle"
        if (cmpt_cycle > 1) {
            document.getElementById('pluriel').innerHTML = " cycles";
        }

        // Mettre à jour les éléments HTML avec les minutes formatées
        m.innerHTML = formattedMinutes;
        s.innerHTML = "00"; // Réinitialiser les secondes à 00
    }

    if(minutes == 0 && secondes == 0){
        sonnerCloche();
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

// Fonction pour sonner la cloche si elle est activée
function sonnerCloche() {
    if (clocheActive) {
        let audio_cloche = new Audio("audio/cloche.mp3");
        audio_cloche.play();
    }
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
        estOk = true;
    } else {
        estOk = false;
        alert('Veuillez entrer des nombres entiers positifs !');
    }
}

// Gestion du clic sur "texteCliquable"
texteCliquable.addEventListener('click', () => {
    if (cmpt_tmp % 2 == 0) {
        boutons.style.visibility = 'visible';
        boutons.style.display = 'block';
        document.getElementById('flecheDirection').textContent = "▲  ▲  ▲"
        cmpt_tmp++;
    } else {
        boutons.style.visibility = 'hidden';
        document.getElementById('flecheDirection').textContent = "▼  ▼  ▼"
        cmpt_tmp++;
    }
});

jouerMusique.addEventListener('click', () => {
    if (musiqueEnLecture) {
        audio_music.pause();
        musiqueEnLecture = false;
        jouerMusique.textContent = "Lire la musique";
    } else {
        audio_music.play();
        musiqueEnLecture = true;
        jouerMusique.textContent = "Couper la musique";
    }
});

clocheCheckbox.addEventListener('change', () => {
    clocheActive = clocheCheckbox.checked;
});

deleteLocalStorageButton.addEventListener('click', () => {
    localStorage.clear();
    location.reload();
});

// Bouton pour accélérer le temps (minutes et secondes)
accelererTemps.addEventListener('click', () => {
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    m.innerHTML = "00";
    s.innerHTML = "03";
});




