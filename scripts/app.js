const m = document.getElementById('minutes');
const s = document.getElementById('secondes');
const semicolon = document.getElementById('semicolon');

const start = document.getElementById('start');

let cycle = document.getElementById('nb_cycle');
let ts = document.getElementById('type_session');

let startTimer; 
let cmpt_cycle = 0;

start.addEventListener('click', () => {
    if (startTimer === undefined) {
        startTimer = setInterval(timer, 20);
        start.innerHTML = "reset"
    }

    if(start.innerHTML == "reset" && start.addEventListener('click', () => {
        resetTimer();
    })){
    }
});

function timer() {
    if (s.innerHTML != 0) {
        s.innerHTML--;
    } else if (m.innerHTML != 0 && s.innerHTML == 0) {
        s.innerHTML = 59;
        m.innerHTML--;
    }

    if(m.innerHTML == 0 && s.innerHTML <= 10){
        s.style.color = "red";
        m.style.color = "red";
        semicolon.style.color = "red";
    } else {
        s.style.color = "black";
        m.style.color = "black";
        semicolon.style.color = "black";
    }

    if(m.innerHTML == 0 && s.innerHTML == 0){
        if(cmpt_cycle % 2 == 0){
            m.innerHTML = 1;
            s.innerHTML = "00";
            ts.innerHTML = "Repos";
            cmpt_cycle++;
        } else {
            m.innerHTML = 5;
            s.innerHTML = "00";
            ts.innerHTML = "Travail";
            cmpt_cycle++;
        }
        cycle.innerHTML = cmpt_cycle;
    }
}

function resetTimer() {
    location.reload();
}
