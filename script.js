const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startButton = document.getElementById('start-button');
const retryButton = document.getElementById('retry-button');
const leftButton = document.getElementById('left-button');
const rightButton = document.getElementById('right-button');
const shootButton = document.getElementById('shoot-button');
const player = document.getElementById('player');
const enemiesContainer = document.getElementById('enemies');
const bulletsContainer = document.getElementById('bullets');

let playerX = 175;
let enemies = [];
let bullets = [];
let lives = 3;
let gameInterval;
let enemyDirection = 1;

startButton.addEventListener('click', startGame);
retryButton.addEventListener('click', startGame);
leftButton.addEventListener('click', moveLeft);
rightButton.addEventListener('click', moveRight);
shootButton.addEventListener('click', shootBullet);

// Detectar si es un dispositivo táctil
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Mostrar controles en dispositivos táctiles
if (isTouchDevice) {
    document.getElementById('controls').style.display = 'block';
}

// Eventos de teclado para escritorio
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        moveLeft();
    } else if (event.key === 'ArrowRight') {
        moveRight();
    } else if (event.key === ' ') {
        shootBullet();
    }
});

function startGame() {
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    gameScreen.style.display = 'block';

    playerX = 175;
    player.style.left = playerX + 'px';
    lives = 3;
    enemies = [];
    bullets = [];
    enemiesContainer.innerHTML = '';
    bulletsContainer.innerHTML = '';

    createEnemies();
    gameInterval = setInterval(updateGame, 100);
}

function createEnemies() {
    for (let i = 0; i < 10; i++) {
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.style.left = (i % 5) * 60 + 'px';
        enemy.style.top = Math.floor(i / 5) * 40 + 'px';
        enemiesContainer.appendChild(enemy);
        enemies.push(enemy);
    }
}

function updateGame() {
    moveEnemies();
    moveBullets();
    checkCollisions();
}

function moveEnemies() {
    let moveDown = false;

    enemies.forEach(enemy => {
        const currentLeft = parseInt(enemy.style.left);
        if (currentLeft + enemyDirection * 10 < 0 || currentLeft + enemyDirection * 10 > 270) {
            moveDown = true;
        }
    });

    if (moveDown) {
        enemyDirection *= -1;
        enemies.forEach(enemy => {
            const currentTop = parseInt(enemy.style.top);
            enemy.style.top = currentTop + 20 + 'px';
        });
    } else {
        enemies.forEach(enemy => {
            const currentLeft = parseInt(enemy.style.left);
            enemy.style.left = currentLeft + enemyDirection * 10 + 'px';
        });
    }
}

function moveBullets() {
    bullets.forEach((bullet, index) => {
        const currentTop = parseInt(bullet.style.top);
        bullet.style.top = currentTop - 10 + 'px';

        // Eliminar bala si sale de la pantalla
        if (currentTop < 0) {
            bullet.remove();
            bullets.splice(index, 1);
        }
    });
}

function checkCollisions() {
    bullets.forEach((bullet, bulletIndex) => {
        const bulletRect = bullet.getBoundingClientRect();

        enemies.forEach((enemy, enemyIndex) => {
            const enemyRect = enemy.getBoundingClientRect();

            if (bulletRect.bottom >= enemyRect.top && bulletRect.top <= enemyRect.bottom &&
                bulletRect.right >= enemyRect.left && bulletRect.left <= enemyRect.right) {
                // Eliminar bala y enemigo
                bullet.remove();
                enemy.remove();
                bullets.splice(bulletIndex, 1);
                enemies.splice(enemyIndex, 1);
            }
        });
    });

    // Verificar colisión entre enemigos y jugador
    enemies.forEach(enemy => {
        const enemyRect = enemy.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();

        if (enemyRect.bottom >= playerRect.top && enemyRect.top <= playerRect.bottom &&
            enemyRect.right >= playerRect.left && enemyRect.left <= playerRect.right) {
            lives--;
            if (lives <= 0) {
                gameOver();
            } else {
                enemy.remove();
                enemies = enemies.filter(e => e !== enemy);
            }
        }
    });
}

function gameOver() {
    clearInterval(gameInterval);
    gameScreen.style.display = 'none';
    gameOverScreen.style.display = 'block';
}

function moveLeft() {
    playerX = Math.max(playerX - 10, 0);
    player.style.left = playerX + 'px';
}

function moveRight() {
    playerX = Math.min(playerX + 10, 350);
    player.style.left = playerX + 'px';
}

function shootBullet() {
    const bullet = document.createElement('div');
    bullet.classList.add('bullet');
    bullet.style.left = playerX + 22.5 + 'px'; // Centrar la bala
    bullet.style.top = '550px'; // Posición inicial
    bulletsContainer.appendChild(bullet);
    bullets.push(bullet);
}
