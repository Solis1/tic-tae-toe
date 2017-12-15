const humanPlayer = "O";
const computerPlayer = "X";
const winCombos = [
        [0, 1,  2],
        [3, 4,  5],
        [6, 7,  8],
        [0, 3,  6],
        [1, 4,  7],
        [2, 5,  8],
        [0, 4,  8],
        [6, 4 , 2]
    ];
var originBoard;

$(document).ready(function(){
    
    $("#replay").on("click", startGame);
    $(".cell").on("click", turnClick);
    startGame();
});

function startGame(){
    originBoard = Array.from(Array(9).keys());
    $(".cell").text("");
    $(".cell").css("background-color", "transparent");
    $(".cell").on("click" , turnClick);
}

function turnClick(square){
    if(typeof originBoard[square.target.id] == "number"){
        turn(square.target.id, humanPlayer);
        if(!checkWin(originBoard, humanPlayer) && !checkTie()) turn(bestSpot(), computerPlayer);  
    }
}

function turn(squareId, player){
    originBoard[squareId] = player;
    $("#"+squareId).text(player);
    let gameWon = checkWin(originBoard, player);
    if(gameWon) gameOver(gameWon);
}

function checkWin(board, player){
    let plays = board.reduce((a, e, i) =>
                            (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for(let  [index, win] of winCombos.entries()){
        if(win.every(elem => plays.indexOf(elem) > -1)){
            gameWon = {index: index, player: player};
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon){
    for(let index of winCombos[gameWon.index]){
        if(gameWon.player == humanPlayer){
            $("#"+index).css("background-color", "blue");  
        }else{
            $("#"+index).css("background-color", "red");
        }
    }
    $(".cell").off("click");
    declareWinner(gameWon.player == humanPlayer ? "Usted Ganó :)" : "Usted Perdio :(");
}

function declareWinner(who){
    $('.modal').modal('show');
    $(".modal-body").text(who);
}

function emptySquares(){
    return originBoard.filter(s => typeof s == "number");
}

function bestSpot(){
    return minimax(originBoard, computerPlayer).index;
}

function checkTie(){
    if(emptySquares().length == 0){
        $(".cell").css("background-color", "green");
        $(".cell").off("click");
         declareWinner("Juego Empatado!");
        return true;
    }else{
        return false;
    }
}


function minimax(newBoard, player){
    var availSpots = emptySquares(newBoard);
    
    if(checkWin(newBoard, humanPlayer)){
        return {score: -10};
    }else if(checkWin(newBoard, computerPlayer)){
        return {score: 10};
    }else if (availSpots.length === 0){
        return {score: 0};
    }
    
    var moves = [];
    var bestMove;
    
    availSpots.forEach(function(elem){
        var move = {};
        move.index = newBoard[elem];
        newBoard[elem] = player;
        
        if(player == computerPlayer){
            var result = minimax(newBoard, humanPlayer);
            move.score  = result.score;
        }else{
            var result = minimax(newBoard, computerPlayer);
            move.score = result.score;
        }

            newBoard[elem] = move.index;
            moves.push(move);
        });
        if(player === computerPlayer){
            var bestScore = -10000;
            moves.forEach(function(elem, index){
                if(elem.score > bestScore){
                    bestScore = elem.score;
                    bestMove = index;
                }
            });                  
        }else{
            var bestScore =  10000;
            moves.forEach(function(elem, index){
                if(elem.score < bestScore){
                    bestScore = elem.score;
                    bestMove = index;
                }
            });     
        }
    return moves[bestMove];
}








