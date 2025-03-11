const progressCircle = document.querySelector('.progress-ring__progress');
const timerDisplay = document.querySelector('.timer-display');
const startBtn = document.querySelector('.start-btn');
const pauseBtn = document.querySelector('.pause-btn');
const stopBtn = document.querySelector('.stop-btn');
const addTimeBtn = document.querySelector('.add-time-btn');
const darkModeToggle = document.querySelector('.dark-mode-toggle');

let timeLeft = 25 * 60; // Initial 25 minutes
let timerId = null;
const fullDashArray = 879;
let isPaused = false;
let isBreak = false;
let sessionIndex = 0;
const sessionDurations = [25 * 60, 45 * 60, 90 * 60]; // Work: 25, 45, 90 minutes
const breakDurations = [5 * 60, 10 * 60, 15 * 60]; // Breaks: 5, 10, 15 minutes

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function updateProgress() {
    const totalTime = isBreak ? breakDurations[sessionIndex] : sessionDurations[sessionIndex];
    const progress = ((totalTime - timeLeft) / totalTime) * fullDashArray;
    progressCircle.style.strokeDashoffset = progress;
}

function startTimer() {
    if (!timerId) {
        timerId = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimerDisplay();
                updateProgress();
            } else {
                clearInterval(timerId);
                timerId = null;
                if (isBreak) {
                    // End of break, move to next session
                    isBreak = false;
                    sessionIndex++;
                    if (sessionIndex < sessionDurations.length) {
                        timeLeft = sessionDurations[sessionIndex];
                        startTimer(); // Auto-start next session
                    } else {
                        // All sessions complete
                        timerDisplay.textContent = 'Done';
                        timeLeft = 0;
                    }
                } else {
                    // End of work session, start break
                    isBreak = true;
                    timeLeft = breakDurations[sessionIndex];
                    startTimer(); // Auto-start break
                }
                updateTimerDisplay();
                updateProgress();
                pauseBtn.textContent = 'Pause';
                pauseBtn.classList.remove('resume');
                isPaused = false;
            }
        }, 1000);
    }
}

startBtn.addEventListener('click', () => {
    if (!timerId) {
        startTimer();
        pauseBtn.textContent = 'Pause';
        pauseBtn.classList.remove('resume');
        isPaused = false;
    }
});

pauseBtn.addEventListener('click', () => {
    if (timerId && !isPaused) {
        clearInterval(timerId);
        timerId = null;
        pauseBtn.textContent = 'Resume';
        pauseBtn.classList.add('resume');
        isPaused = true;
    } else if (isPaused) {
        startTimer();
        pauseBtn.textContent = 'Pause';
        pauseBtn.classList.remove('resume');
        isPaused = false;
    }
});

stopBtn.addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
    timeLeft = sessionDurations[0]; // Reset to 25 minutes
    sessionIndex = 0;
    isBreak = false;
    updateTimerDisplay();
    updateProgress();
    pauseBtn.textContent = 'Pause';
    pauseBtn.classList.remove('resume');
    isPaused = false;
});

addTimeBtn.addEventListener('click', () => {
    timeLeft += 10 * 60;
    updateTimerDisplay();
    updateProgress();
});

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    updateTimerDisplay();
    updateProgress();
});

const quoteBox = document.getElementById('quote');

const quotes = [
    "Stay focused and never give up!",
    "Small steps every day lead to big results.",
    "Your time is precious, use it wisely.",
    "Discipline beats motivation.",
    "Every minute counts, make it count!",
    "Success is built one session at a time.",
    "The harder you work, the luckier you get.",
    "Start strong, finish stronger.",
    "Don't stop when you're tired, stop when you're done.",
];

function updateQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteBox.textContent = quotes[randomIndex];
}

setInterval(updateQuote, 300000);

updateQuote();
