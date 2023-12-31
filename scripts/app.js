/* DECLARATION CONSTANTE ET VARIABLE */

const m = document.getElementById('minutes');
const s = document.getElementById('secondes');
const semicolon = document.getElementById('semicolon');

const start = document.getElementById('start');

let cycle = document.getElementById('nb_cycle');
let ts = document.getElementById('type_session');

let startTimer; 
let cmpt_cycle = 0;

/* AJOUT D'UN ECOUTEUR SUR MA CONSTANTE "START" POUR LANCER LE TIMER */

start.addEventListener('click', () => {
    if (startTimer === undefined) {
        startTimer = setInterval(timer, 1000);
        start.innerHTML = "reset"
    }

    if(start.innerHTML == "reset" && start.addEventListener('click', () => {
        resetTimer();
    })){
    }
});

/* FONCTION PERMETANT L'ECOULEMENT DU TIMER AVEC "setInterval" DANS L'ECOUTEUR */

function timer() {
    if (s.innerHTML != 0) {
        s.innerHTML--;
    } else if (m.innerHTML != 0 && s.innerHTML == 0) {
        s.innerHTML = 59;
        m.innerHTML--;
    }

    /* MET EN ROUGE LES SECONDES SI EN DESSOUS DE 10 SECONDES */

    if(m.innerHTML == 0 && s.innerHTML <= 10){
        s.style.color = "red";
        m.style.color = "red";
        semicolon.style.color = "red";
    } else {
        s.style.color = "white";
        m.style.color = "white";
        semicolon.style.color = "white";
    }

    /* GESTION DE LA PHASE DE REPOS ET DE TRAVAIL */

    if(m.innerHTML == 0 && s.innerHTML == 0){
        if(cmpt_cycle % 2 == 0){
            m.innerHTML = 5;
            s.innerHTML = "00";
            ts.innerHTML = "Repos";
            cmpt_cycle++;
        } else {
            m.innerHTML = 25;
            s.innerHTML = "00";
            ts.innerHTML = "Travail";
            cmpt_cycle++;
        }
        cycle.innerHTML = cmpt_cycle;
        
        /* CECI SERT POUR METTRE AU PLURIEL LE MOT CYCLE */

        if(cmpt_cycle > 1){
            document.getElementById('pluriel').innerHTML = " cycles"
        }
    }
}

/* FONCTION SERVANT A REFRESH LA PAGE */

function resetTimer() {
    location.reload();
}
