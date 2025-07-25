import { useState } from 'react';
import ChessPiece from './ChessPiece.jsx';
import { PIECE_TYPES, COLORS } from '../lib/chess.js';

export default function PiecePalette({ 
  puzzle,
  board,
  className = ""
}) {
  const [draggedPiece, setDraggedPiece] = useState(null);

  if (!puzzle) return null;

  // Calculate how many pieces of each type are currently on the board
  const usedPieces = {};
  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const piece = board[rank][file];
      if (piece) {
        const key = `${piece.type}_${piece.color}`;
        usedPieces[key] = (usedPieces[key] || 0) + 1;
      }
    }
  }

  // Calculate available pieces for each type
  const availablePieces = [];
  for (const req of puzzle.requirements) {
    if (req.type !== 'empty') {
      const key = `${req.type}_${req.color}`;
      const used = usedPieces[key] || 0;
      const total = req.count * 8; // Each rank/file needs this many
      const available = total - used;
      
      if (available > 0) {
        availablePieces.push({
          type: req.type,
          color: req.color,
          available,
          total
        });
      }
    }
  }

  const handleDragStart = (e, pieceInfo) => {
    const piece = { 
      type: pieceInfo.type, 
      color: pieceInfo.color,
      isUserPlaced: true 
    };
    setDraggedPiece(piece);
    e.dataTransfer.setData('application/json', JSON.stringify(piece));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragEnd = () => {
    setDraggedPiece(null);
  };

  const groupedPieces = availablePieces.reduce((groups, piece) => {
    const colorKey = piece.color;
    if (!groups[colorKey]) {
      groups[colorKey] = [];
    }
    groups[colorKey].push(piece);
    return groups;
  }, {});

  return (
    <div className={`bg-white rounded-lg border-2 border-gray-300 p-4 ${className}`}>
      <h3 className="text-lg font-bold mb-3">Available Pieces</h3>
      
      {Object.entries(groupedPieces).map(([color, pieces]) => (
        <div key={color} className="mb-4">
          <h4 className="text-md font-semibold mb-2 capitalize">
            {color} Pieces
          </h4>
          
          <div className="grid grid-cols-2 gap-2">
            {pieces.map((pieceInfo) => (
              <div
                key={`${pieceInfo.type}_${pieceInfo.color}`}
                className="flex items-center space-x-2 p-2 bg-gray-50 rounded border hover:bg-gray-100 cursor-grab active:cursor-grabbing"
                draggable={true}
                onDragStart={(e) => handleDragStart(e, pieceInfo)}
                onDragEnd={handleDragEnd}
              >
                <ChessPiece
                  piece={{ type: pieceInfo.type, color: pieceInfo.color }}
                  size="small"
                  isDragging={draggedPiece?.type === pieceInfo.type && draggedPiece?.color === pieceInfo.color}
                  className="pointer-events-none"
                />
                <div className="text-sm">
                  <div className="font-medium capitalize">{pieceInfo.type}</div>
                  <div className="text-gray-600">
                    {pieceInfo.available}/{pieceInfo.total}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {availablePieces.length === 0 && (
        <div className="text-gray-500 text-center py-4">
          All pieces placed!
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-600">
        Drag pieces to the board to place them.
        Double-click user-placed pieces on the board to remove them.
        Fixed pieces (with blue dot) cannot be moved.
      </div>
    </div>
  );
}

