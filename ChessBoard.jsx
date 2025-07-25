import { useState } from 'react';
import ChessSquare from './ChessSquare.jsx';
import { validatePuzzle, isKingInCheck, COLORS } from '../lib/chess.js';

export default function ChessBoard({ 
  board, 
  puzzle,
  onBoardChange,
  className = ""
}) {
  const [draggedPiece, setDraggedPiece] = useState(null);

  // Validate current board state
  const validation = puzzle ? validatePuzzle(board, puzzle.requirements) : null;

  const handlePieceDrop = (rank, file, piece) => {
    if (!onBoardChange) return;

    const newBoard = board.map(row => [...row]);
    newBoard[rank][file] = { ...piece, isUserPlaced: true };
    onBoardChange(newBoard);
    
    setDraggedPiece(null);
  };

  const handlePieceRemove = (rank, file) => {
    if (!onBoardChange) return;

    const newBoard = board.map(row => [...row]);
    newBoard[rank][file] = null;
    onBoardChange(newBoard);
  };

  const handlePieceMove = (fromRank, fromFile, toRank, toFile) => {
    if (!onBoardChange) return;

    const newBoard = board.map(row => [...row]);
    const piece = newBoard[fromRank][fromFile];
    
    if (piece && piece.isUserPlaced) {
      newBoard[fromRank][fromFile] = null;
      newBoard[toRank][toFile] = piece;
      onBoardChange(newBoard);
    }
  };

  // Check if a king is in check and should glow red
  const isKingInCheckGlow = (piece, rank, file) => {
    if (!piece || piece.type !== 'king') return false;
    return isKingInCheck(board, piece.color);
  };

  // Get status for rank/file indicators
  const getRankFileStatus = (index, isRank) => {
    if (!validation) return 'yellow';
    
    const status = isRank ? validation.rankStatus[index] : validation.fileStatus[index];
    const counts = isRank ? validation.rankCounts[index] : validation.fileCounts[index];
    
    // Check if any piece type has too many
    const hasTooMany = Object.values(counts).some((count, i) => {
      const required = puzzle.requirements[i]?.count || 0;
      return count > required;
    });
    
    if (hasTooMany) return 'red';
    if (status) return 'green';
    return 'yellow';
  };

  return (
    <div className={`inline-block ${className}`}>
      {/* Board status indicators */}
      {validation && (
        <div className="mb-4 space-y-2">
          {/* King safety indicator */}
          <div className={`text-sm font-medium ${validation.kingSafety ? 'text-green-600' : 'text-red-600'}`}>
            Kings: {validation.kingSafety ? '✓ Safe' : '✗ In Check'}
          </div>
          
          {/* Completion status */}
          {validation.isComplete && (
            <div className="text-lg font-bold text-green-600 animate-pulse">
              🎉 Puzzle Solved!
            </div>
          )}
        </div>
      )}

      {/* Chess board with row indicators */}
      <div className="flex items-center">
        {/* Chess board grid */}
        <div className="grid grid-cols-8 gap-0 border-2 border-gray-800 w-fit">
          {board.map((rank, rankIndex) =>
            rank.map((piece, fileIndex) => {
              const isLight = (rankIndex + fileIndex) % 2 === 0;
              const isHighlighted = validation && (!validation.rankStatus[rankIndex] || !validation.fileStatus[fileIndex]);
              const isKingGlowing = isKingInCheckGlow(piece, rankIndex, fileIndex);

              return (
                <ChessSquare
                  key={`${rankIndex}-${fileIndex}`}
                  rank={rankIndex}
                  file={fileIndex}
                  piece={piece}
                  isLight={isLight}
                  isValidDrop={true} // Allow dropping on any square
                  isHighlighted={isHighlighted}
                  isKingInCheck={isKingGlowing}
                  onPieceDrop={handlePieceDrop}
                  onPieceRemove={handlePieceRemove}
                  onPieceMove={handlePieceMove}
                />
              );
            })
          )}
        </div>

        {/* Row indicators (right side) - colored dots */}
        {validation && (
          <div className="ml-2 flex flex-col">
            {validation.rankStatus.map((isValid, index) => {
              const status = getRankFileStatus(index, true);
              const dotColor = {
                'green': 'bg-green-500',
                'yellow': 'bg-yellow-500',
                'red': 'bg-red-500'
              }[status];
              
              return (
                <div
                  key={index}
                  className="w-16 h-16 flex items-center justify-center"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${dotColor}`}
                    title={`Rank ${8 - index}: ${status === 'green' ? 'Complete' : status === 'red' ? 'Too many pieces' : 'Incomplete'}`}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Column indicators (bottom) - colored dots */}
      {validation && (
        <div className="mt-2 flex">
          {validation.fileStatus.map((isValid, index) => {
            const status = getRankFileStatus(index, false);
            const dotColor = {
              'green': 'bg-green-500',
              'yellow': 'bg-yellow-500',
              'red': 'bg-red-500'
            }[status];
            
            return (
              <div
                key={index}
                className="w-16 h-6 flex items-center justify-center"
              >
                <div
                  className={`w-2 h-2 rounded-full ${dotColor}`}
                  title={`File ${String.fromCharCode(97 + index)}: ${status === 'green' ? 'Complete' : status === 'red' ? 'Too many pieces' : 'Incomplete'}`}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Required pieces list (underneath the board) */}
      {puzzle && (
        <div className="mt-4 p-4 bg-blue-50 rounded border">
          <h3 className="text-md font-semibold mb-2">Required in each rank and file:</h3>
          <div className="text-sm">
            {puzzle.requirements.map((req, index) => {
              if (req.type === 'empty') {
                return (
                  <span key={index} className="inline-block mr-4 mb-1">
                    {req.count} empty squares
                  </span>
                );
              } else {
                const colorName = req.color === COLORS.WHITE ? 'white' : 'black';
                const pieceName = req.type;
                const plural = req.count > 1 ? 's' : '';
                return (
                  <span key={index} className="inline-block mr-4 mb-1">
                    {req.count} {colorName} {pieceName}{plural}
                  </span>
                );
              }
            })}
          </div>
        </div>
      )}
    </div>
  );
}

