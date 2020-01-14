let countdown;
let count=0;
let isPomodoro = false;
let isRunning = false;

const pomodoroProgress = document.querySelectorAll('.pomodoro');

const durationSliders = document.querySelectorAll('.duration__slider');
const pomodoroDuration = document.querySelector('.pomodoro__duration');
const shortDuration = document.querySelector('.short__break__duration');
const longDuration = document.querySelector('.long__break__duration');

const start = document.querySelector('.start__btn');
const restart = document.querySelector('.restart__btn');
const clear = document.querySelector('.clear__btn');

const timerDisplay = document.querySelector('.countdown__timer');
const timerState = document.querySelector('.countdown__state');
const timerProgress = document.querySelector('.timer--progress');

function handleSlide() {
  this.previousElementSibling.firstElementChild.innerText = this.value;
}

function displayProgressBar(total, remaining) {
  const radius = timerProgress.r.baseVal.valueInSpecifiedUnits;
  const circumference = Math.PI * 2 * radius;
  const offset = (circumference / total) * remaining;

  timerProgress.style.cssText = `stroke-dasharray: ${circumference}rem; stroke-dashoffset: ${circumference * (8 - (count * 2 - (isPomodoro ? 0 : 1))) - (circumference - offset)}rem`;
}

function displayTimeLeft(totalSeconds) {
  let seconds = totalSeconds;

  const minutes = Math.floor(seconds / 60).toString().padStart(2,'0');
  seconds %= 60;
  seconds = seconds.toString().padStart(2,'0');
  const display = `${minutes}:${seconds}`;

  timerDisplay.textContent = display;
  document.title = display;
}

function clearSet() {
  clearInterval(countdown);
  count = 0;

  pomodoroProgress.forEach(el => {
    el.classList.remove('pomodoro-start');
    el.classList.remove('pomodoro-active');
    el.classList.remove('pomodoro-active-break');
    el.classList.remove('pomodoro-done');
    el.classList.remove('pomodoro-next');
  });

  timerState.classList.remove('countdown__state-work');
  timerState.classList.remove('countdown__state-break');

  timerDisplay.textContent = "00:00";
  timerProgress.style.cssText = `stroke-dasharray: 75.4rem; stroke-dashoffset: 603.2rem`

  isPomodoro = false;
  isRunning = false;
  return;
}

function timer(seconds) {
  clearInterval(countdown);

  const now = Date.now();
  const then = now + seconds * 1000;
  const totalSeconds = seconds;
  displayTimeLeft(seconds);
  displayProgressBar(totalSeconds, seconds);

  if (count === 0) {
    pomodoroProgress[count].classList.add('pomodoro-start');
    pomodoroProgress[count].classList.add('pomodoro-active');
    pomodoroProgress[count + 1].classList.add('pomodoro-next');
  } else if (count === 3 && isPomodoro) {
    pomodoroProgress[count - 1].classList.remove('pomodoro-active-break');
    pomodoroProgress[count-1].classList.remove('pomodoro-active');
    pomodoroProgress[count-1].classList.add('pomodoro-done');
    pomodoroProgress[count].classList.remove('pomodoro-next');
    pomodoroProgress[count].classList.add('pomodoro-active');
  } else if (isPomodoro) {
    pomodoroProgress[count - 1].classList.remove('pomodoro-active-break');
    pomodoroProgress[count-1].classList.remove('pomodoro-active');
    pomodoroProgress[count-1].classList.add('pomodoro-done');
    pomodoroProgress[count].classList.remove('pomodoro-next');
    pomodoroProgress[count].classList.add('pomodoro-active');
    pomodoroProgress[count + 1].classList.add('pomodoro-next');
  } else {
    pomodoroProgress[count - 1].classList.add('pomodoro-active-break');
  }

  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);

    if (secondsLeft <= 0) {

      isPomodoro ? (count++, startTimer((count < 4 ? shortDuration : longDuration).value * 60)) :
       count < 4 ? startTimer(pomodoroDuration.value * 60) :
                   clearSet();
    } else {
      displayTimeLeft(secondsLeft);
      displayProgressBar(totalSeconds, secondsLeft);
    }
  }, 1000);
}

function startTimer(seconds) {
  isPomodoro = !isPomodoro;
  timerState.classList.toggle('countdown__state-break');
  timerState.classList.toggle('countdown__state-work');
  timer(seconds);
}

function startSet() {
  count = 0;
  isPomodoro = false;
  isRunning = true;
  timerState.classList.remove('countdown__state-work');
  timerState.classList.add('countdown__state-break');
  startTimer(pomodoroDuration.value * 60);
}

function restartPomodoro() {
  if (isRunning) timer(pomodoroDuration.value * 60);
}

durationSliders.forEach(slider => {
  slider.previousElementSibling.firstElementChild.innerText = slider.value;
  slider.addEventListener('input', handleSlide);
});
start.addEventListener('click', startSet);
restart.addEventListener('click', restartPomodoro);
clear.addEventListener('click', clearSet);