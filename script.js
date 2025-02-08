const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 600;

// 🚀 Jugador
const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    color: "white",
    speed: 5,
    dx: 0
};

// 👾 Enemigos
const enemies = [];
const rows = 3, cols = 6;

for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        enemies.push({
            x: j * 70 + 50,
            y: i * 50 + 30,
            width: 40,
            height: 40,
            color: "red",
        });
    }
}

// 🔫 Disparos
const bullets = [];

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

function drawBullets() {
    bullets.forEach(bullet => {
        ctx.fillStyle = "yellow";
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

// 🔥 Mover el jugador
function movePlayer() {
    player.x += player.dx;
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

// 🔥 Mover disparos
function moveBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y -= 5;
        if (bullet.y < 0) bullets.splice(index, 1);
    });
}

// 📌 Detectar colisión entre disparos y enemigos
function checkCollisions() {
    bullets.forEach((bullet, bIndex) => {
        enemies.forEach((enemy, eIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                enemies.splice(eIndex, 1);
                bullets.splice(bIndex, 1);
            }
        });
    });
}

// 🎮 Controles del jugador
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") player.dx = -player.speed;
    if (e.key === "ArrowRight") player.dx = player.speed;
    if (e.key === " ") {
        bullets.push({
            x: player.x + player.width / 2 - 2.5,
            y: player.y,
            width: 5,
            height: 10,
        });
    }
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") player.dx = 0;
});

// 🔄 Bucle del juego
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawEnemies();
    drawBullets();
    movePlayer();
    moveBullets();
    checkCollisions();
    requestAnimationFrame(update);
}

// 🚀 Iniciar el juego
update();