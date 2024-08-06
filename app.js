const $circle = document.querySelector('#circle');
const $score = document.querySelector('#score');
const $autoUpgrade = document.querySelector('#auto-upgrade');
const $clickUpgrade = document.querySelector('#click-upgrade');
const $upgradeButton = document.querySelector('#upgrade-button');
const $upgrades = document.querySelector('#upgrades');
const $closeUpgrades = document.querySelector('#close-upgrades');
const pacManGameContainer = document.getElementById('pacman-game-container');
const startPacManButton = document.getElementById('start-pacman-button');

let clickValue = 1;
let autoCollecting = false;
let autoCollectValue = 1;
let autoCollectCost = 100;

function start() {
  setScore(getScore());
  setImage();
}

function setScore(score) {
  localStorage.setItem('score', score);
  $score.textContent = score;
}

function setImage() {
  if (getScore() >= 50) {
    $circle.setAttribute('src', './assets/lizzard.png');
  }
}

function getScore() {
  return Number(localStorage.getItem('score')) ?? 0;
}

function addScore(value) {
  setScore(getScore() + value);
  setImage();
}

function autoCollect() {
  if (autoCollecting) {
    addScore(autoCollectValue);
    setTimeout(autoCollect, 1000);
  }
}

$circle.addEventListener('click', (event) => {
  const rect = $circle.getBoundingClientRect();

  const offfsetX = event.clientX - rect.left - rect.width / 2;
  const offfsetY = event.clientY - rect.top - rect.height / 2;

  const DEG = 40;

  const tiltX = (offfsetY / rect.height) * DEG;
  const tiltY = (offfsetX / rect.width) * -DEG;

  $circle.style.setProperty('--tiltX', `${tiltX}deg`);
  $circle.style.setProperty('--tiltY', `${tiltY}deg`);

  setTimeout(() => {
    $circle.style.setProperty('--tiltX', `0deg`);
    $circle.style.setProperty('--tiltY', `0deg`);
  }, 300);

  const plusOne = document.createElement('div');
  plusOne.classList.add('plus-one');
  plusOne.textContent = `+${clickValue}`;
  plusOne.style.left = `${event.clientX - rect.left}px`;
  plusOne.style.top = `${event.clientY - rect.top}px`;

  $circle.parentElement.appendChild(plusOne);

  addScore(clickValue);

  setTimeout(() => {
    plusOne.remove();
  }, 2000);
});

$autoUpgrade.addEventListener('click', () => {
  const score = getScore();
  if (score >= autoCollectCost) {
    setScore(score - autoCollectCost);
    if (!autoCollecting) {
      autoCollecting = true;
      autoCollect();
      $autoUpgrade.textContent = `Купить мусоросборщики (Стоимость: ${autoCollectCost * 2})`;
    } else {
      autoCollectValue += 1;
      autoCollectCost *= 2;
      $autoUpgrade.textContent = `Купить мусоросборщики (Стоимость: ${autoCollectCost})`;
    }
  }
});

$clickUpgrade.addEventListener('click', () => {
  const score = getScore();
  if (score >= 50) {
    setScore(score - 50);
    clickValue += 1;
  }
});

$upgradeButton.addEventListener('click', () => {
  $upgrades.classList.toggle('show');
});

$closeUpgrades.addEventListener('click', () => {
  $upgrades.classList.remove('show');
});

startPacManButton.addEventListener('click', () => {
  pacManGameContainer.style.display = 'block';
  document.querySelector('.game').style.display = 'none';
  startPacManGame();
});

function startPacManGame() {
  if (window.createWorld && window.gameLoop) {
    window.createWorld();
    window.gameLoop();
  } else {
    console.error("Pac-Man game functions are not defined.");
  }
}

start();
