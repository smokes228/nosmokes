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

// Переменная для хранения интервала
let timerInterval;

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

// Основная функция обновления таймера
function updateTimer() {
    const startTimeStr = localStorage.getItem(START_TIME_KEY);
    if (!startTimeStr) return;

    try {
        const startTime = new Date(startTimeStr);
        if (isNaN(startTime)) {
            throw new Error('Invalid date');
        }
        const { days, hours, minutes, seconds } = calculateTimeDifference(startTime);
        updateTimerDisplay(days, hours, minutes, seconds);
    } catch (error) {
        console.error('Ошибка при обработке времени:', error);
        resetTimer();
    }
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
    } else {
        statusMessage.textContent = 'Таймер продолжает работу. Отсчёт идёт...';
    }

    // Останавливаем предыдущий интервал, если он был
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    // Запускаем обновление каждую секунду
    updateTimer(); // Сразу обновляем отображение
    timerInterval = setInterval(updateTimer, 1000);

    // Отключаем кнопку «Старт» после запуска
    startBtn.disabled = true;
    startBtn.textContent = 'Работает...';
}

// Функция сброса таймера
function resetTimer() {
    if (confirm('Вы уверены, что хотите сбросить таймер?')) {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }

        localStorage.removeItem(START_TIME_KEY);
        updateTimerDisplay(0, 0, 0, 0);
        statusMessage.textContent = 'Таймер сброшен. Нажмите «Старт» для нового отсчёта.';

        // Включаем кнопку «Старт»
        startBtn.disabled = false;
        startBtn.textContent = 'Старт';
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Если есть сохранённое время старта, сразу показываем счётчик и запускаем обновление
    if (localStorage.getItem(START_TIME_KEY)) {
        startTimer(); // Запускаем таймер с сохранённым временем
    } else {
        updateTimerDisplay(0, 0, 0, 0); // Показываем нули, если нет данных
    }
});

// Обработчики событий
startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);
