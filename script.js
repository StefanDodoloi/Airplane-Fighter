let airplane = document.getElementById('airplane');
let totalSeconds = 0;
let points = 0;
let destrEnemies = 0;
let gameOver = false;
const gameContainerWidth = parseInt(window.getComputedStyle(document.getElementById('game-container')).width);
const gameContainer = document.getElementById('game-container');
const airplaneWidth = parseInt(window.getComputedStyle(airplane).width);
airplane.style.left = `${(gameContainerWidth - airplaneWidth) / 2}px`;

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        moveAirplane('left');
    } else if (event.key === 'ArrowRight') {
        moveAirplane('right');
    } else if (event.code === "Space") {
        shoot();
    }
});

function moveAirplane(direction) {
    const currentPosition = parseInt(window.getComputedStyle(airplane).left);
    if (direction === 'left' && currentPosition > 0) {
        airplane.style.left = `${currentPosition - 10}px`;
    } else if (direction === 'right' && currentPosition < gameContainerWidth - 50) {
        airplane.style.left = `${currentPosition + 10}px`;
    }
}

function createEnemy() {
    if (!gameOver) {
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.style.left = `${Math.random() * (gameContainerWidth - 40)}px`;
        gameContainer.appendChild(enemy);
        moveEnemy(enemy);
    }
}

function moveEnemy(enemy) {
    const enemySpeed = 5;
    const moveInterval = setInterval(() => {
        if (!gameOver) {
            const currentPosition = parseInt(window.getComputedStyle(enemy).top);
            if (currentPosition < gameContainer.offsetHeight) {
                enemy.style.top = `${currentPosition + enemySpeed}px`;
            } else {
                enemy.remove();
                points += 1;
                score();
                clearInterval(moveInterval);
            }
            checkCollision(enemy);
        } else {
            clearInterval(moveInterval);
        }
    }, 30);
}

function checkCollision(enemy) {
    const airplaneRect = airplane.getBoundingClientRect();
    const enemyRect = enemy.getBoundingClientRect();
    if (
        airplaneRect.left < enemyRect.right &&
        airplaneRect.right > enemyRect.left &&
        airplaneRect.top < enemyRect.bottom &&
        airplaneRect.bottom > enemyRect.top
    ) {
        gameOver = true;
        gameOverMessage();
    }
}

function timer() {
    if (!gameOver) {
        ++totalSeconds;
        let hour = Math.floor(totalSeconds / 3600);
        let minute = Math.floor((totalSeconds - hour * 3600) / 60);
        let seconds = totalSeconds - (hour * 3600 + minute * 60);
        if(hour < 10)
            hour = '0' + hour;
        if(minute < 10)
            minute = '0' + minute;
        if(seconds < 10)
            seconds = '0' + seconds;
        document.getElementById('timer').innerHTML = 'Time: ' + hour + ':' + minute + ':' + seconds;
        if (totalSeconds % 2 === 0) {
            createEnemy();
        }
    }
}

setInterval(timer, 1000);

function shoot() {
    const bullet = document.createElement('div');
    bullet.classList.add('bullet');
    const airplanePosition = parseInt(window.getComputedStyle(airplane).left);
    const airplaneHeight = parseInt(window.getComputedStyle(airplane).height);
    bullet.style.left = `${airplanePosition + airplaneWidth / 2}px`;
    bullet.style.top = `${gameContainer.offsetHeight - airplaneHeight}px`;
    gameContainer.appendChild(bullet);
    moveBullet(bullet);
}

function moveBullet(bullet) {
    const bulletSpeed = 10;
    const moveInterval = setInterval(() => {
        const currentPosition = parseInt(window.getComputedStyle(bullet).top);
        const enemies = document.querySelectorAll('.enemy');
        enemies.forEach((enemy) => {
            if (checkBulletCollision(bullet, enemy)) {
                enemy.remove();
                clearInterval(moveInterval);
                bullet.remove();
                destrEnemies += 1;
                destroyedEnemy();
            }
        });
        if (currentPosition > 0) {
            bullet.style.top = `${currentPosition - bulletSpeed}px`;
        } else {
            bullet.remove();
            clearInterval(moveInterval);
        }
    }, 30);
}

function checkBulletCollision(bullet, enemy) {
    const bulletRect = bullet.getBoundingClientRect();
    const enemyRect = enemy.getBoundingClientRect();
    return (
        bulletRect.left < enemyRect.right &&
        bulletRect.right > enemyRect.left &&
        bulletRect.top < enemyRect.bottom &&
        bulletRect.bottom > enemyRect.top
    );
}

function score() {
    document.getElementById('score').innerHTML = 'Score: ' + points;
}

score();

function destroyedEnemy() {
    document.getElementById('destroyedEnemy').innerHTML = 'Destroyed enemies: ' + destrEnemies;
}

destroyedEnemy();

function gameOverMessage() {
    document.getElementById('gameOver').innerHTML = 'GAME OVER!';
}
