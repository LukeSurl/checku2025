import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import ChessBoard from './components/ChessBoard.jsx';
import PiecePalette from './components/PiecePalette.jsx';
import { PUZZLES } from './lib/puzzles.js';
import { parseFEN, generateFEN } from './lib/chess.js';
import './App.css';

function App() {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [board, setBoard] = useState(() => {
    return parseFEN(PUZZLES[0].startingFEN);
  });
  const [showSolution, setShowSolution] = useState(false);

  const currentPuzzle = PUZZLES[currentPuzzleIndex];

  // Reset board when puzzle changes
  useEffect(() => {
    const newBoard = parseFEN(currentPuzzle.startingFEN);
    setBoard(newBoard);
    setShowSolution(false);
  }, [currentPuzzleIndex, currentPuzzle]);

  const handlePuzzleChange = (index) => {
    setCurrentPuzzleIndex(index);
  };

  const handleBoardChange = (newBoard) => {
    setBoard(newBoard);
  };

  const handleReset = () => {
    const newBoard = parseFEN(currentPuzzle.startingFEN);
    setBoard(newBoard);
    setShowSolution(false);
  };

  const handleShowSolution = () => {
    if (showSolution) {
      // Hide solution - go back to starting state
      const newBoard = parseFEN(currentPuzzle.startingFEN);
      setBoard(newBoard);
      setShowSolution(false);
    } else {
      // Show solution - mark all pieces as user-placed for visual clarity
      const solutionBoard = parseFEN(currentPuzzle.solutionFEN, false);
      setBoard(solutionBoard);
      setShowSolution(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">Checku Puzzle Solver</h1>
          <p className="text-blue-100 mt-1">
            A hybrid of chess and sudoku - solve the puzzle by placing pieces correctly!
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto p-4">
        {/* Controls */}
        <div className="mb-6 bg-white rounded-lg border-2 border-gray-300 p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Puzzle selector */}
            <div className="flex items-center space-x-2">
              <label className="font-medium">Puzzle:</label>
              <select 
                value={currentPuzzleIndex}
                onChange={(e) => handlePuzzleChange(parseInt(e.target.value))}
                className="border border-gray-300 rounded px-3 py-1"
              >
                {PUZZLES.map((puzzle, index) => (
                  <option key={puzzle.id} value={index}>
                    {puzzle.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Action buttons */}
            <div className="flex space-x-2">
              <Button onClick={handleReset} variant="outline">
                Reset Puzzle
              </Button>
              <Button 
                onClick={handleShowSolution}
                variant={showSolution ? "destructive" : "secondary"}
              >
                {showSolution ? 'Hide Solution' : 'Show Solution'}
              </Button>
            </div>
          </div>

          {showSolution && (
            <div className="mt-3 p-2 bg-yellow-100 border border-yellow-400 rounded text-yellow-800 text-sm">
              <strong>Solution displayed!</strong> This is the correct solution for {currentPuzzle.name}.
            </div>
          )}
        </div>

        {/* Game layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left panel - Piece palette only */}
          <div className="lg:col-span-1">
            <PiecePalette 
              puzzle={currentPuzzle}
              board={board}
            />
          </div>

          {/* Right panel - Chess board (now includes required pieces underneath) */}
          <div className="lg:col-span-3 flex justify-center">
            <ChessBoard
              board={board}
              puzzle={currentPuzzle}
              onBoardChange={handleBoardChange}
              className="max-w-full"
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-lg border-2 border-gray-300 p-4">
          <h3 className="text-lg font-bold mb-3">How to Play</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Objective</h4>
              <p>
                Fill the 8×8 chess board so that each rank (row) and file (column) 
                contains exactly the required number of each piece type.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Controls</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Drag pieces from the palette to the board</li>
                <li>Double-click pieces on the board to remove them</li>
                <li>Green squares indicate valid placement areas</li>
                <li>Red highlighting shows constraint violations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Rules</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>No kings may be in check</li>
                <li>Each puzzle has exactly one solution</li>
                <li>Pawns attack diagonally as in chess</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Features</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Real-time validation and progress tracking</li>
                <li>FEN import/export for custom puzzles</li>
                <li>Solution viewing for learning</li>
                <li>Multiple difficulty levels</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 mt-8">
        <div className="max-w-7xl mx-auto text-center text-sm">
          <p>
            <strong>Checku</strong> puzzle game created by <strong>Luke Surl</strong>. 
            Copyright © 2013 Luke Surl. All rights reserved.
          </p>
          <p className="mt-2">
            Web implementation built with React and Tailwind CSS.
            Chess piece images from Wikipedia (Wikimedia Commons).
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

