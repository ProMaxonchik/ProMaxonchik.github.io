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

    const x = Math.random() * (window.innerWidth - 1000);
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
            star.style.top = `${currentTop + 5}px`;
            requestAnimationFrame(animateStar);
        } else {
            star.remove();
        }
    }

    animateStar();

    star.addEventListener('click', () => {
        if (gameOver) return;
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        star.classList.add('clicked');
        
        // Определяем центр звездочки для создания частиц
        const starRect = star.getBoundingClientRect();
        const starCenterX = starRect.left + starRect.width / 2 - 470;
        const starCenterY = starRect.top + starRect.height / 2;

        createParticles(starCenterX, starCenterY);
        
        setTimeout(() => {
            star.remove();
        }, 500); // Убираем звездочку после завершения анимации
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

    const x = Math.random() * (window.innerWidth - 1000);
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

    bomb.addEventListener('click', () => {
        if (gameOver) return;
        gameOver = true;
        gameContainer.innerHTML = '';
    });
}

function createFreeze() {
    if (gameOver) return;

    const freeze = document.createElement('div');
    freeze.classList.add('freeze');

    const x = Math.random() * (window.innerWidth - 1000);
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
            freeze.style.top = `${currentTop + 5}px`;
            requestAnimationFrame(animateFreeze);
        } else {
            freeze.remove();
        }
    }

    animateFreeze();

    freeze.addEventListener('click', () => {
        if (gameOver) return;
        isFrozen = true;
        setTimeout(() => {
            isFrozen = false;
        }, 4000);
        freeze.remove();
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
    }, 400);
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

    // Закрываем игру и возвращаемся на главную страницу кликера
    closeGameAndReturnToMain();
}

function convertScoreToCoins(score) {
    // Находим значение clickValue из основной игры (например, через localStorage)
    const clickValue = parseInt(localStorage.getItem('clickValue')) || 1;

    // Рассчитываем количество монет по формуле (очки + 10) * clickValue
    const coinsEarned = (score + 10) * clickValue;

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
