 // Game state variables
 let gameActive = true;
 let currentPlayer = "X";
 let gameState = ["", "", "", "", "", "", "", "", ""];
 let player1Name = "Player 1";
 let player2Name = "Player 2";
 let scores = { player1: 0, player2: 0, draws: 0 };

 // DOM elements
 const setupScreen = document.getElementById('setupScreen');
 const gameScreen = document.getElementById('gameScreen');
 const statusDisplay = document.getElementById('gameStatus');
 const player1Display = document.getElementById('player1Display');
 const player2Display = document.getElementById('player2Display');
 const player1Info = document.getElementById('player1Info');
 const player2Info = document.getElementById('player2Info');

 // Winning conditions
 const winningConditions = [
     [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
     [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
     [0, 4, 8], [2, 4, 6] // Diagonals
 ];

 // Message functions
 const winningMessage = () => `${getCurrentPlayerName()} wins!`;
 const drawMessage = () => `It's a draw!`;
 const currentPlayerTurn = () => `${getCurrentPlayerName()}'s turn`;

 function getCurrentPlayerName() {
     return currentPlayer === "X" ? player1Name : player2Name;
 }

 function startGame() {
     // Get player names or use defaults
     const p1Input = document.getElementById('player1Name').value.trim();
     const p2Input = document.getElementById('player2Name').value.trim();
     
     player1Name = p1Input || "Player 1";
     player2Name = p2Input || "Player 2";

     // Update displays
     player1Display.textContent = player1Name;
     player2Display.textContent = player2Name;
     document.getElementById('player1ScoreLabel').textContent = player1Name;
     document.getElementById('player2ScoreLabel').textContent = player2Name;

     // Show game screen
     setupScreen.classList.add('hidden');
     gameScreen.classList.remove('hidden');

     // Initialize game
     initializeGame();
 }

 function initializeGame() {
     // Add event listeners to cells
     document.querySelectorAll('.cell').forEach(cell => {
         cell.addEventListener('click', handleCellClick);
     });

     updateGameStatus();
     updatePlayerHighlight();
 }

 function handleCellClick(clickedCellEvent) {
     const clickedCell = clickedCellEvent.target;
     const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

     // Check if cell is already taken or game is not active
     if (gameState[clickedCellIndex] !== "" || !gameActive) {
         return;
     }

     // Play the move
     handleCellPlayed(clickedCell, clickedCellIndex);
     handleResultValidation();
 }

 function handleCellPlayed(clickedCell, clickedCellIndex) {
     gameState[clickedCellIndex] = currentPlayer;
     clickedCell.innerHTML = currentPlayer;
     clickedCell.classList.add('taken');
     clickedCell.classList.add(currentPlayer.toLowerCase());
 }

 function handleResultValidation() {
     let roundWon = false;
     let winningCondition = [];

     // Check for win
     for (let i = 0; i < winningConditions.length; i++) {
         const condition = winningConditions[i];
         let a = gameState[condition[0]];
         let b = gameState[condition[1]];
         let c = gameState[condition[2]];
         
         if (a === '' || b === '' || c === '') {
             continue;
         }
         
         if (a === b && b === c) {
             roundWon = true;
             winningCondition = condition;
             break;
         }
     }

     if (roundWon) {
         statusDisplay.innerHTML = winningMessage();
         gameActive = false;
         highlightWinningCells(winningCondition);
         updateScore('win');
         return;
     }

     // Check for draw
     let roundDraw = !gameState.includes("");
     if (roundDraw) {
         statusDisplay.innerHTML = drawMessage();
         gameActive = false;
         updateScore('draw');
         return;
     }

     // Continue game
     handlePlayerChange();
 }

 function handlePlayerChange() {
     currentPlayer = currentPlayer === "X" ? "O" : "X";
     updateGameStatus();
     updatePlayerHighlight();
 }

 function updateGameStatus() {
     statusDisplay.innerHTML = currentPlayerTurn();
 }

 function updatePlayerHighlight() {
     player1Info.classList.toggle('active', currentPlayer === "X");
     player2Info.classList.toggle('active', currentPlayer === "O");
 }

 function highlightWinningCells(winningCondition) {
     winningCondition.forEach(index => {
         document.querySelector(`[data-cell-index="${index}"]`).style.background = 
             'linear-gradient(45deg, #2ecc71, #27ae60)';
     });
 }

 function updateScore(result) {
     if (result === 'win') {
         if (currentPlayer === "X") {
             scores.player1++;
             document.getElementById('player1Score').textContent = scores.player1;
         } else {
             scores.player2++;
             document.getElementById('player2Score').textContent = scores.player2;
         }
     } else if (result === 'draw') {
         scores.draws++;
         document.getElementById('drawScore').textContent = scores.draws;
     }
 }

 function resetRound() {
     gameActive = true;
     currentPlayer = "X";
     gameState = ["", "", "", "", "", "", "", "", ""];
     
     document.querySelectorAll('.cell').forEach(cell => {
         cell.innerHTML = "";
         cell.classList.remove('taken', 'x', 'o');
         cell.style.background = '';
     });
     
     updateGameStatus();
     updatePlayerHighlight();
 }

 function resetGame() {
     // Reset scores
     scores = { player1: 0, player2: 0, draws: 0 };
     document.getElementById('player1Score').textContent = '0';
     document.getElementById('player2Score').textContent = '0';
     document.getElementById('drawScore').textContent = '0';
     
     // Reset round
     resetRound();
     
     // Go back to setup
     gameScreen.classList.add('hidden');
     setupScreen.classList.remove('hidden');
     
     // Clear input fields
     document.getElementById('player1Name').value = '';
     document.getElementById('player2Name').value = '';
 }

 // Add Enter key support for starting game
 document.addEventListener('DOMContentLoaded', function() {
     const inputs = document.querySelectorAll('#player1Name, #player2Name');
     inputs.forEach(input => {
         input.addEventListener('keypress', function(e) {
             if (e.key === 'Enter') {
                 startGame();
             }
         });
     });
 });