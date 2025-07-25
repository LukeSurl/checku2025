import { useState } from 'react';
import ChessPiece from './ChessPiece.jsx';

export default function ChessSquare({ 
  rank, 
  file, 
  piece, 
  isLight,
  isValidDrop = false,
  isHighlighted = false,
  isKingInCheck = false,
  onPieceDrop,
  onPieceRemove,
  onPieceMove,
  className = ""
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (onPieceDrop) {
      try {
        const pieceData = JSON.parse(e.dataTransfer.getData('application/json'));
        const sourceSquare = e.dataTransfer.getData('text/plain');
        
        if (sourceSquare) {
          // Moving piece from another square
          const [sourceRank, sourceFile] = sourceSquare.split(',').map(Number);
          if (onPieceMove) {
            onPieceMove(sourceRank, sourceFile, rank, file);
          }
        } else {
          // Placing new piece from palette
          onPieceDrop(rank, file, pieceData);
        }
      } catch (error) {
        console.error('Error parsing dropped piece data:', error);
      }
    }
  };

  const handleDoubleClick = () => {
    if (piece && piece.isUserPlaced && onPieceRemove) {
      onPieceRemove(rank, file);
    }
  };

  const handlePieceDragStart = (e) => {
    if (piece && piece.isUserPlaced) {
      // Allow dragging user-placed pieces
      e.dataTransfer.setData('application/json', JSON.stringify(piece));
      e.dataTransfer.setData('text/plain', `${rank},${file}`);
      e.dataTransfer.effectAllowed = 'move';
    } else {
      // Prevent dragging fixed pieces
      e.preventDefault();
    }
  };

  const squareColor = isLight ? 'bg-amber-100' : 'bg-amber-800';
  const borderColor = isHighlighted ? 'border-blue-500 border-2' : 'border-gray-400 border';
  const dropIndicator = isDragOver ? 'bg-green-200 border-green-500 border-2' : '';
  
  // King in check glow effect
  const kingCheckGlow = isKingInCheck ? 'shadow-lg shadow-red-500 animate-pulse' : '';

  return (
    <div
      className={`
        w-16 h-16 flex items-center justify-center relative
        ${squareColor}
        ${borderColor}
        ${dropIndicator}
        ${kingCheckGlow}
        transition-all duration-200
        ${className}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDoubleClick={handleDoubleClick}
      title={
        piece 
          ? `${piece.color} ${piece.type}${piece.isUserPlaced ? ' (user placed - double-click to remove or drag to move)' : ' (fixed piece)'}` 
          : `${String.fromCharCode(97 + file)}${8 - rank} - Drop pieces here`
      }
    >
      {piece && (
        <div
          draggable={piece.isUserPlaced}
          onDragStart={handlePieceDragStart}
          className={piece.isUserPlaced ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}
        >
          <ChessPiece 
            piece={piece}
            size="medium"
            className={`
              ${isKingInCheck ? 'filter drop-shadow-lg' : ''}
            `}
          />
        </div>
      )}
      
      {/* Coordinate labels */}
      {rank === 7 && (
        <div className="absolute bottom-0 right-1 text-xs text-gray-600 font-mono">
          {String.fromCharCode(97 + file)}
        </div>
      )}
      {file === 0 && (
        <div className="absolute top-1 left-1 text-xs text-gray-600 font-mono">
          {8 - rank}
        </div>
      )}
      
      {/* Visual indicator for fixed pieces */}
      {piece && !piece.isUserPlaced && (
        <div className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full" 
             title="Fixed piece (cannot be moved)"></div>
      )}
    </div>
  );
}

