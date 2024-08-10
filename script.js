const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

const tileSize = 15; // Размер плитки
const rows = 21;
const cols = 19;
canvas.width = cols * tileSize;
canvas.height = rows * tileSize;

const pacManImage = new Image();
pacManImage.src = 'images/pacman.png';

const ghostImages = {
    pink: new Image(),
    cyan: new Image(),
    orange: new Image(),
    scared: new Image()
};

ghostImages.pink.src = 'images/pink_ghost.png';
ghostImages.cyan.src = 'images/cyan_ghost.png';
ghostImages.orange.src = 'images/orange_ghost.png';
ghostImages.scared.src = 'images/scared_ghost.png';

const foodImage = new Image();
foodImage.src = 'images/food.png';

const powerUpImage = new Image();
powerUpImage.src = 'images/powerup.png';

const pacMan = {
    x: tileSize,
    y: tileSize,
    dx: 0,
    dy: 0,
    speed: tileSize / 8,
    size: tileSize,
    poweredUp: false,
    powerUpTimer: 0,
    powerUpDuration: 250
};

const ghosts = [
    { x: tileSize * (cols - 2), y: tileSize, dx: tileSize / 8, dy: 0, color: 'pink', image: ghostImages.pink, scared: false },
    { x: tileSize, y: tileSize * (rows - 2), dx: tileSize / 8, dy: 0, color: 'cyan', image: ghostImages.cyan, scared: false },
    { x: tileSize * (cols - 2), y: tileSize * (rows - 2), dx: tileSize / 8, dy: 0, color: 'orange', image: ghostImages.orange, scared: false }
];

let mouthToggleCounter = 0;
const mouthToggleLimit = 10;
let gameOver = false;

const food = [];
const walls = [];
const powerUps = [];
const map = Array.from({ length: rows }, () => Array(cols).fill('#'));
const keys = {};

// Добавим логику для управления с помощью свайпов
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

canvas.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
});

canvas.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) {
            pacMan.nextDirection = { dx: pacMan.speed, dy: 0, direction: 'right' }; // Свайп вправо
        } else {
            pacMan.nextDirection = { dx: -pacMan.speed, dy: 0, direction: 'left' }; // Свайп влево
        }
    } else {
        if (diffY > 0) {
            pacMan.nextDirection = { dx: 0, dy: pacMan.speed, direction: 'down' }; // Свайп вниз
        } else {
            pacMan.nextDirection = { dx: 0, dy: -pacMan.speed, direction: 'up' }; // Свайп вверх
        }
    }
}

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === 'ArrowUp') pacMan.nextDirection = { dx: 0, dy: -pacMan.speed, direction: 'up' };
    if (e.key === 'ArrowDown') pacMan.nextDirection = { dx: 0, dy: pacMan.speed, direction: 'down' };
    if (e.key === 'ArrowLeft') pacMan.nextDirection = { dx: -pacMan.speed, dy: 0, direction: 'left' };
    if (e.key === 'ArrowRight') pacMan.nextDirection = { dx: pacMan.speed, dy: 0, direction: 'right' };
});

window.addEventListener('keyup', (e) => {
    delete keys[e.key];
});

function createRandomMaze() {
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function isValid(x, y) {
        return x > 0 && y > 0 && x < cols - 1 && y < rows - 1;
    }

    function carvePassagesFrom(cx, cy, grid) {
        const directions = [
            { dx: 1, dy: 0 },
            { dx: -1, dy: 0 },
            { dx: 0, dy: 1 },
            { dx: 0, dy: -1 }
        ];
        shuffle(directions);

        for (let direction of directions) {
            const nx = cx + direction.dx * 2;
            const ny = cy + direction.dy * 2;

            if (isValid(nx, ny) && grid[ny][nx] === '#') {
                grid[ny][nx] = '.';
                grid[cy + direction.dy][cx + direction.dx] = '.';
                carvePassagesFrom(nx, ny, grid);
            }
        }
    }

    map[1][1] = '.';
    carvePassagesFrom(1, 1, map);

    // Ensure Pac-Man has a starting position
    pacMan.x = tileSize;
    pacMan.y = tileSize;

    // Ensure the map has cycles by connecting random points
    for (let i = 0; i < 20; i++) {
        const x = 2 * Math.floor(Math.random() * ((cols - 1) / 2)) + 1;
        const y = 2 * Math.floor(Math.random() * ((rows - 1) / 2)) + 1;

        if (map[y][x] === '.') {
            const directions = [
                { dx: 1, dy: 0 },
                { dx: -1, dy: 0 },
                { dx: 0, dy: 1 },
                { dx: 0, dy: -1 }
            ];
            shuffle(directions);

            for (let direction of directions) {
                const nx = x + direction.dx;
                const ny = y + direction.dy;
                if (isValid(nx, ny) && map[ny][nx] === '#') {
                    map[ny][nx] = '.';
                    break;
                }
            }
        }
    }
}

function createWorld() {
    createRandomMaze();

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const tile = map[row][col];
            if (tile === '#') {
                walls.push({ x: col * tileSize, y: row * tileSize });
            } else if (tile === '.') {
                if (Math.random() < 0.15) { // Вероятность появления еды
                    food.push({ x: col * tileSize + tileSize / 2, y: row * tileSize + tileSize / 2 });
                } else if (Math.random() < 0.02) { // Вероятность появления усиливающей конфеты
                    powerUps.push({ x: col * tileSize + tileSize / 2, y: row * tileSize + tileSize / 2 });
                }
            }
        }
    }
}

function drawWorld() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw walls
    context.fillStyle = '#1E90FF';
    walls.forEach(wall => {
        context.fillRect(wall.x, wall.y, tileSize, tileSize);
    });

    // Draw food
    food.forEach(f => {
        context.drawImage(foodImage, f.x - tileSize / 4, f.y - tileSize / 4, tileSize / 2, tileSize / 2);
    });

    // Draw power-ups
    powerUps.forEach(p => {
        context.drawImage(powerUpImage, p.x - tileSize / 4, p.y - tileSize / 4, tileSize / 2, tileSize / 2);
    });

    // Draw Pac-Man using image
    context.drawImage(pacManImage, pacMan.x, pacMan.y, pacMan.size, pacMan.size);

    // Draw ghosts using images
    ghosts.forEach(ghost => {
        if (ghost.scared) {
            context.drawImage(ghostImages.scared, ghost.x, ghost.y, tileSize, tileSize);
        } else {
            context.drawImage(ghost.image, ghost.x, ghost.y, tileSize, tileSize);
        }
    });

    if (++mouthToggleCounter > mouthToggleLimit) {
        pacMan.mouthOpen = !pacMan.mouthOpen;
        mouthToggleCounter = 0;
    }
}

function canMove(x, y) {
    return !walls.some(wall => x < wall.x + tileSize &&
                               x + tileSize > wall.x &&
                               y < wall.y + tileSize &&
                               y + tileSize > wall.y);
}

function detectCollision() {
    for (let ghost of ghosts) {
        if (Math.abs(pacMan.x - ghost.x) < tileSize / 2 &&
            Math.abs(pacMan.y - ghost.y) < tileSize / 2) {
            if (ghost.scared) {
                ghost.x = tileSize * (cols - 2);
                ghost.y = tileSize;
                ghost.scared = false;
            } else {
                return true;
            }
        }
    }
    return false;
}

function showGameOver() {
    const gameOverContainer = document.createElement('div');
    gameOverContainer.id = 'gameOverContainer';

    const gameOverText = document.createElement('h1');
    gameOverText.textContent = 'Game Over';

    const restartButton = document.createElement('button');
    restartButton.id = 'restartButton';
    restartButton.textContent = 'Restart';
    restartButton.addEventListener('click', () => {
        location.reload();
    });

    gameOverContainer.appendChild(gameOverText);
    gameOverContainer.appendChild(restartButton);

    document.body.appendChild(gameOverContainer);
}

function update() {
    if (gameOver) return;

    if (pacMan.nextDirection) {
        const newX = pacMan.x + pacMan.nextDirection.dx;
        const newY = pacMan.y + pacMan.nextDirection.dy;

        if (canMove(newX, newY)) {
            pacMan.dx = pacMan.nextDirection.dx;
            pacMan.dy = pacMan.nextDirection.dy;
            pacMan.direction = pacMan.nextDirection.direction;
            pacMan.nextDirection = null;
        }
    }

    const nextX = pacMan.x + pacMan.dx;
    const nextY = pacMan.y + pacMan.dy;

    if (canMove(nextX, nextY)) {
        pacMan.x = nextX;
        pacMan.y = nextY;
    } else {
        pacMan.dx = 0;
        pacMan.dy = 0;
    }

    // Update ghosts
    ghosts.forEach(ghost => {
        const ghostNextX = ghost.x + ghost.dx;
        const ghostNextY = ghost.y + ghost.dy;

        if (!canMove(ghostNextX, ghostNextY)) {
            // Simple AI for ghost to turn randomly
            const possibleDirections = [
                { dx: ghost.dx, dy: -ghost.dy },
                { dx: -ghost.dx, dy: ghost.dy },
                { dx: ghost.dy, dy: ghost.dx },
                { dx: -ghost.dy, dy: -ghost.dx }
            ];

            let newDirection = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];

            while (!canMove(ghost.x + newDirection.dx, ghost.y + newDirection.dy)) {
                newDirection = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
            }

            ghost.dx = newDirection.dx;
            ghost.dy = newDirection.dy;
        } else {
            ghost.x = ghostNextX;
            ghost.y = ghostNextY;
        }
    });

    // Check for collision with ghosts
    if (detectCollision()) {
        gameOver = true;
        showGameOver();
        return;
    }

    // Eating food
    for (let i = 0; i < food.length; i++) {
        if (Math.abs(pacMan.x + pacMan.size / 2 - food[i].x) < tileSize / 2 &&
            Math.abs(pacMan.y + pacMan.size / 2 - food[i].y) < tileSize / 2) {
            food.splice(i, 1);
            break;
        }
    }

    // Eating power-ups
    for (let i = 0; i < powerUps.length; i++) {
        if (Math.abs(pacMan.x + pacMan.size / 2 - powerUps[i].x) < tileSize / 2 &&
            Math.abs(pacMan.y + pacMan.size / 2 - powerUps[i].y) < tileSize / 2) {
            powerUps.splice(i, 1);
            pacMan.poweredUp = true;
            pacMan.powerUpTimer = pacMan.powerUpDuration;
            ghosts.forEach(ghost => ghost.scared = true);
            break;
        }
    }

    // Power-up timer
    if (pacMan.poweredUp) {
        pacMan.powerUpTimer--;
        if (pacMan.powerUpTimer <= 0) {
            pacMan.poweredUp = false;
            ghosts.forEach(ghost => ghost.scared = false);
        }
    }
}

function gameLoop() {
    update();
    drawWorld();
    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
}

window.createWorld();
window.gameLoop();
