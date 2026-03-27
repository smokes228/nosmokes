// Ключ для хранения времени старта в localStorage
const START_TIME_KEY = 'timer_start_time';

// Элементы DOM
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const statusMessage = document.getElementById('statusMessage');

// Функция для форматирования чисел (добавление нуля впереди)
function formatNumber(num) {
    return num.toString().padStart(2, '0');
}

// Функция обновления отображения времени
function updateTimerDisplay(days, hours, minutes, seconds) {
    daysEl.textContent = formatNumber(days);
    hoursEl.textContent = formatNumber(hours);
    minutesEl.textContent = formatNumber(minutes);
    secondsEl.textContent = formatNumber(seconds);
}

// Функция расчёта разницы во времени
function calculateTimeDifference(startDate) {
    const now = new Date();
    const diffMs = now - startDate;

    // Расчёт дней, часов, минут, секунд
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
}

// Функция запуска таймера
function startTimer() {
    // Получаем сохранённое время старта или устанавливаем текущее
    let startTime = localStorage.getItem(START_TIME_KEY);

    if (!startTime) {
        // Первый запуск — сохраняем текущее время
        startTime = new Date().toISOString();
        localStorage.setItem(START_TIME_KEY, startTime);
        statusMessage.textContent = 'Таймер запущен! Отсчёт начался.';
    } else
