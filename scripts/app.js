const m = document.getElementById('minutes');
const s = document.getElementById('secondes');

const start = document.getElementById('start');

let startTimer;

start.addEventListener('click', () => {
    if (startTimer === undefined) {
        startTimer = setInterval(timer, 20);
    } else {
        alert("Pomodoro déjà actif !");
    }
});

function timer(){
    if(s.innerHTML != 0){
        s.innerHTML--;
    } else if (m.innerHTML != 0 && s.innerHTML == 0){
        m.innerHTML--;
        s.innerHTML = 59;
    }
}