import React, { useState, useEffect, useCallback } from "react";

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [audioContext, setAudioContext] = useState(null);

  useEffect(() => {
    setAudioContext(new (window.AudioContext || window.webkitAudioContext)());
  }, []);

  const playVictorySound = useCallback(() => {
    if (audioContext) {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.5);
    }
  }, [audioContext]);

  const calculateWinner = useCallback((squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  }, []);

  useEffect(() => {
    const newWinner = calculateWinner(board);
    if (newWinner) {
      setWinner(newWinner);
      playVictorySound();
    } else if (board.every(Boolean)) {
      setWinner("draw");
    }
  }, [board, calculateWinner]);

  const handleClick = (i) => {
    if (winner || board[i]) return;
    const newBoard = board.slice();
    newBoard[i] = xIsNext ? "X" : "O";
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
  };

  const renderSquare = (i) => (
    <button
      className={`w-20 h-20 text-4xl font-bold border-4 border-indigo-600 rounded-lg 
                  ${
                    board[i]
                      ? board[i] === "X"
                        ? "text-pink-500"
                        : "text-blue-500"
                      : "text-transparent"
                  }
                  ${!board[i] && !winner ? "hover:bg-indigo-100" : ""} 
                  transition-all duration-300 ease-in-out transform ${
                    board[i] ? "scale-100" : "scale-90"
                  }`}
      onClick={() => handleClick(i)}
    >
      {board[i]}
    </button>
  );

  const status = winner
    ? winner === "draw"
      ? "It's a draw!"
      : `Winner: ${winner}`
    : `Next player: ${xIsNext ? "X" : "O"}`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
      <h1 className="text-4xl font-bold text-indigo-800 mb-8">Tic Tac Toe</h1>
      <div className="mb-4 text-2xl font-bold text-indigo-700">{status}</div>
      <div className="grid grid-cols-3 gap-2 bg-white p-4 rounded-xl shadow-lg">
        {[...Array(9)].map((_, i) => renderSquare(i))}
      </div>
      <button
        onClick={resetGame}
        className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-full font-semibold 
                   flex items-center hover:bg-indigo-700 transition-colors duration-300 ease-in-out"
      >
        Play Again
      </button>
    </div>
  );
};

export default TicTacToe;
