const gameContainer = document.getElementById('game');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
let score = 0;
let gameOver = false;
let isFrozen = false;
let timeLeft = 30; // 30 секунд

function createStar() {
    if (gameOver) return;

    const star = document.createElement('div');
    star.classList.add('star');

    // Теперь берем ширину окна, чтобы учитывать только видимую область
    const gameWidth = window.innerWidth;

    // Генерация позиции x в пределах видимой области
    const x = Math.random() * (gameWidth - 100); // 100 - ширина звездочки
    const y = -40;
    star.style.left = `${x}px`;
    star.style.top = `${y}px`;

    gameContainer.appendChild(star);

    function animateStar() {
        if (isFrozen) {
            requestAnimationFrame(animateStar);
            return;
        }

        const currentTop = parseFloat(star.style.top);
        if (currentTop < window.innerHeight) {
            star.style.top = `${currentTop + 7}px`;
            requestAnimationFrame(animateStar);
        } else {
            star.remove();
        }
    }

    animateStar();

    star.addEventListener('touchstart', (event) => {
        event.preventDefault(); // предотвращаем нежелательные действия браузера
    
        // Логика аналогична обработчику click
        const rect = star.getBoundingClientRect();
        const touchX = event.touches[0].clientX - rect.left;
        const touchY = event.touches[0].clientY - rect.top;
    
        if (touchX >= 0 && touchX <= rect.width && touchY >= 0 && touchY <= rect.height) {
            if (gameOver) return;
            score++;
            scoreDisplay.textContent = `Score: ${score}`;
            star.classList.add('clicked');
    
            const starCenterX = rect.left + rect.width / 2;
            const starCenterY = rect.top + rect.height / 2;
            createParticles(starCenterX, starCenterY);
    
            setTimeout(() => {
                star.remove();
            }, 500);
        }
    });
}

function createParticles(centerX, centerY) {
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        const xOffset = (Math.random() - 0.5) * 100;
        const yOffset = (Math.random() - 0.5) * 100;
        
        particle.style.left = `${centerX - 2.5}px`; // Центрируем частицу
        particle.style.top = `${centerY - 2.5}px`;  // Центрируем частицу
        particle.style.setProperty('--x', `${xOffset}px`);
        particle.style.setProperty('--y', `${yOffset}px`);

        gameContainer.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 700); // Убираем частицы после завершения анимации
    }
}

function createBomb() {
    if (gameOver) return;

    const bomb = document.createElement('div');
    bomb.classList.add('bomb');

    // Определяем ширину окна
    const gameWidth = window.innerWidth;

    // Генерация позиции x в пределах видимой области
    const x = Math.random() * (gameWidth - 100); // 100 - это ширина бомбы
    const y = -40;
    bomb.style.left = `${x}px`;
    bomb.style.top = `${y}px`;

    gameContainer.appendChild(bomb);

    function animateBomb() {
        if (isFrozen) {
            requestAnimationFrame(animateBomb);
            return;
        }

        const currentTop = parseFloat(bomb.style.top);
        if (currentTop < window.innerHeight) {
            bomb.style.top = `${currentTop + 10}px`;
            requestAnimationFrame(animateBomb);
        } else {
            bomb.remove();
        }
    }

    animateBomb();

    bomb.addEventListener('touchstart', (event) => {
        event.preventDefault();

        const rect = bomb.getBoundingClientRect();
        const touchX = event.touches[0].clientX - rect.left;
        const touchY = event.touches[0].clientY - rect.top;

        if (touchX >= 0 && touchX <= rect.width && touchY >= 0 && touchY <= rect.height) {
            if (gameOver) return;
            endGame();
        }
    });
}

function createFreeze() {
    if (gameOver) return;

    const freeze = document.createElement('div');
    freeze.classList.add('freeze');

    // Определяем ширину окна
    const gameWidth = window.innerWidth;

    // Генерация позиции x в пределах видимой области
    const x = Math.random() * (gameWidth - 100); // 100 - это ширина объекта freeze
    const y = -40;
    freeze.style.left = `${x}px`;
    freeze.style.top = `${y}px`;

    gameContainer.appendChild(freeze);

    function animateFreeze() {
        if (isFrozen) {
            requestAnimationFrame(animateFreeze);
            return;
        }

        const currentTop = parseFloat(freeze.style.top);
        if (currentTop < window.innerHeight) {
            freeze.style.top = `${currentTop + 7}px`;
            requestAnimationFrame(animateFreeze);
        } else {
            freeze.remove();
        }
    }

    animateFreeze();

    freeze.addEventListener('touchstart', (event) => {
        event.preventDefault();

        const rect = freeze.getBoundingClientRect();
        const touchX = event.touches[0].clientX - rect.left;
        const touchY = event.touches[0].clientY - rect.top;

        if (touchX >= 0 && touchX <= rect.width && touchY >= 0 && touchY <= rect.height) {
            if (gameOver) return;
            isFrozen = true;
            setTimeout(() => {
                isFrozen = false;
            }, 4000);
            freeze.remove();
        }
    });
}

function spawnItems() {
    const spawnInterval = setInterval(() => {
        if (gameOver) {
            clearInterval(spawnInterval);
            return;
        }

        if (!isFrozen) {  // Если не активен эффект Freeze, продолжаем генерацию
            createStar();
            if (Math.random() < 0.2) {
                createBomb();
            }
            if (Math.random() < 0.05) {
                createFreeze();
            }
        }
    }, 300);
}

function startTimer() {
    const timerInterval = setInterval(() => {
        if (timeLeft > 0 && !gameOver) {
            timeLeft--;
            timerDisplay.textContent = `Time: ${timeLeft}s`;
        } else {
            clearInterval(timerInterval);
            if (!gameOver) {
                endGame(); // Завершаем игру и передаем очки в основную игру
            }
        }
    }, 1000);
}

function startGame() {
    // Перезапускаем все переменные и элементы игры
    score = 0;
    gameOver = false;
    isFrozen = false;
    timeLeft = 30;
    gameContainer.innerHTML = '';
    scoreDisplay.textContent = 'Score: 0';
    timerDisplay.textContent = 'Time: 30s';
    spawnItems();
    startTimer();
}

function loadDropStylesheet() {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'css/drop.css';
    document.head.appendChild(link);
}

function endGame() {
    gameOver = true;
    gameContainer.innerHTML = '';

    // Передача очков в основную игру
    convertScoreToCoins(score);

    // Открываем модальное окно для "Мусормэн"
    openModal('modal-04');

    // Закрываем игру и возвращаемся на главную страницу кликера
    closeGameAndReturnToMain();
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        modal.classList.add('modal-active');
    }
}

function convertScoreToCoins(score) {
    // Находим значение clickValue из основной игры (например, через localStorage)
    const clickValue = parseInt(localStorage.getItem('clickValue')) || 1;

    // Рассчитываем количество монет по формуле (очки + 10) * clickValue
    const coinsEarned = (score + 10) * clickValue;
    document.getElementById('drop-game-profit').innerHTML = `<img src="images/profit-01.svg" alt=""> ${coinsEarned} +`;
    // Передаем заработанные монеты в основную игру
    let totalMoney = parseInt(localStorage.getItem('totalMoney')) || 0;
    totalMoney += coinsEarned;
    localStorage.setItem('totalMoney', totalMoney);
}


function closeGameAndReturnToMain() {
    // Скрываем контейнер игры
    document.getElementById('game-container').style.display = 'none';
    
    // Показываем основную секцию кликера
    document.querySelector('.profit-area').style.display = 'block';
}

// document.getElementById('start-game').addEventListener('click', function(e) {
//     e.preventDefault();
//     // Подключаем стили для игры
//     loadDropStylesheet();
    
//     // Скрываем другие элементы и показываем игру
//     document.querySelector('.profit-area').style.display = 'none';
//     document.getElementById('game-container').style.display = 'block';
    
//     // Если нужно перезапускать игру при каждом нажатии
//     if (typeof startGame === 'function') {
//         startGame();
//     }
// })

window.onload = () => {
    loadDropStylesheet();
};
