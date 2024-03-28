document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('startButton').addEventListener('click', function() {
        // Hide the start button
        this.style.display = 'none';

        // Show the AI and ONLINE buttons with a transition
        var buttonsContainer = document.getElementById('buttonsContainer');
        buttonsContainer.className = 'visible';
    });

    document.getElementById('aiButton').addEventListener('click', function() {
        // Hide the AI button button
        this.style.display = 'none';

        // Show the AI and ONLINE buttons with a transition
        var buttonsContainer = document.getElementById('difficultyLevel');
        buttonsContainer.className = 'visible';
        var onlineButton = document.getElementById('onlineButton');
        // Hide the online button
        onlineButton.style.display = 'none';
    });

    document.getElementById('easyButton').addEventListener('click', function() {
        // Hide the difficulty level buttons
        var difficultyLevel = document.getElementById('difficultyLevel');
        difficultyLevel.className = 'hidden';
    
        // Show the game board and score board
        var gameContainer = document.getElementById('gameContainer');
        gameContainer.className = 'visible';
    
        // Hide the AYO logo and Board logo
        var logo = document.querySelector('.logo');
        var board = document.querySelector('.board');
        logo.style.display = 'none';
        board.style.display = 'none';
        // Show AI the score board
        var scoreBoard = document.getElementById('AIscoreBoard');
        scoreBoard.className = 'visible';

        // Show AI the score board
        var scoreBoard = document.getElementById('PlayerscoreBoard');
        scoreBoard.className = 'visible';
        document.body.classList.add('backgroundImage');
    });
});
