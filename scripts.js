document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('startButton');
    const aiButton = document.getElementById('aiButton');
    const easyButton = document.getElementById('easyButton');
    const exitButton = document.getElementById('exitButton');
    const exitGameButton = document.getElementById('exitGameButton');
    const restartGameButton = document.getElementById('restartGameButton');
    const optionsMenu = document.getElementById('optionsMenu');

    startButton.addEventListener('click', function() {
        this.style.display = 'none';
        document.getElementById('buttonsContainer').className = 'visible';
    });

    aiButton.addEventListener('click', function() {
        this.style.display = 'none';
        document.getElementById('difficultyLevel').className = 'visible';
        document.getElementById('onlineButton').style.display = 'none';
    });

    easyButton.addEventListener('click', startGame);
    exitButton.addEventListener('click', openOptionsMenu);
    exitGameButton.addEventListener('click', exitGame);
    restartGameButton.addEventListener('click', resetGame);

    optionsMenu.addEventListener('click', function(event) {
        event.stopPropagation();
    });

    document.addEventListener('click', function() {
        optionsMenu.className = 'hidden';
    });
});

function startGame() {
    // Hide the difficulty level buttons
    document.getElementById('difficultyLevel').className = 'hidden';

    // Show the game board and score board
    document.getElementById('gameContainer').className = 'visible';
    document.getElementById('AIscoreBoard').className = 'visible';
    document.getElementById('PlayerscoreBoard').className = 'visible';

    // Hide the AYO logo and Board logo
    document.querySelector('.logo').style.display = 'none';
    document.querySelector('.board').style.display = 'none';

    document.body.classList.add('backgroundImage');
    document.getElementById('exitButton').style.display = 'block';
}

function openOptionsMenu(event) {
    event.stopPropagation();
    document.getElementById('optionsMenu').className = 'visible';
}

function exitGame() {
    location.reload();
    // Reset the game state
}

function resetGame() {
    // Reset the game state
}