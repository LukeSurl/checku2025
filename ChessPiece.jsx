import { PIECE_TYPES, COLORS } from '../lib/chess.js';

// Wikipedia chess piece SVG URLs
const PIECE_IMAGES = {
  [PIECE_TYPES.KING]: {
    [COLORS.WHITE]: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg',
    [COLORS.BLACK]: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg'
  },
  [PIECE_TYPES.QUEEN]: {
    [COLORS.WHITE]: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg',
    [COLORS.BLACK]: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg'
  },
  [PIECE_TYPES.ROOK]: {
    [COLORS.WHITE]: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg',
    [COLORS.BLACK]: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg'
  },
  [PIECE_TYPES.BISHOP]: {
    [COLORS.WHITE]: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg',
    [COLORS.BLACK]: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg'
  },
  [PIECE_TYPES.KNIGHT]: {
    [COLORS.WHITE]: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg',
    [COLORS.BLACK]: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg'
  },
  [PIECE_TYPES.PAWN]: {
    [COLORS.WHITE]: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg',
    [COLORS.BLACK]: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg'
  }
};

export default function ChessPiece({ 
  piece, 
  isDragging = false, 
  onDragStart, 
  onDragEnd,
  className = "",
  size = "large" 
}) {
  if (!piece) return null;

  const imageUrl = PIECE_IMAGES[piece.type]?.[piece.color];
  
  if (!imageUrl) {
    console.warn(`No image found for piece: ${piece.type} ${piece.color}`);
    return null;
  }

  const sizeClasses = {
    small: "w-6 h-6",
    medium: "w-8 h-8", 
    large: "w-10 h-10"
  };

  const handleDragStart = (e) => {
    if (onDragStart) {
      onDragStart(e, piece);
    }
  };

  const handleDragEnd = (e) => {
    if (onDragEnd) {
      onDragEnd(e, piece);
    }
  };

  return (
    <img
      src={imageUrl}
      alt={`${piece.color} ${piece.type}`}
      className={`
        ${sizeClasses[size]}
        ${isDragging ? 'opacity-50 scale-110' : 'opacity-100'}
        ${onDragStart ? 'cursor-grab active:cursor-grabbing' : ''}
        select-none transition-all duration-200
        ${className}
      `}
      draggable={!!onDragStart}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      title={`${piece.color} ${piece.type}`}
    />
  );
}

