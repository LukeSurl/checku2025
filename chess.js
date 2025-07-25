// Chess piece types and utilities for Checku puzzle game

export const PIECE_TYPES = {
  KING: 'king',
  QUEEN: 'queen',
  ROOK: 'rook',
  BISHOP: 'bishop',
  KNIGHT: 'knight',
  PAWN: 'pawn'
};

export const COLORS = {
  WHITE: 'white',
  BLACK: 'black'
};

// FEN character mappings
export const FEN_PIECES = {
  'K': { type: PIECE_TYPES.KING, color: COLORS.WHITE },
  'Q': { type: PIECE_TYPES.QUEEN, color: COLORS.WHITE },
  'R': { type: PIECE_TYPES.ROOK, color: COLORS.WHITE },
  'B': { type: PIECE_TYPES.BISHOP, color: COLORS.WHITE },
  'N': { type: PIECE_TYPES.KNIGHT, color: COLORS.WHITE },
  'P': { type: PIECE_TYPES.PAWN, color: COLORS.WHITE },
  'k': { type: PIECE_TYPES.KING, color: COLORS.BLACK },
  'q': { type: PIECE_TYPES.QUEEN, color: COLORS.BLACK },
  'r': { type: PIECE_TYPES.ROOK, color: COLORS.BLACK },
  'b': { type: PIECE_TYPES.BISHOP, color: COLORS.BLACK },
  'n': { type: PIECE_TYPES.KNIGHT, color: COLORS.BLACK },
  'p': { type: PIECE_TYPES.PAWN, color: COLORS.BLACK }
};

// Reverse mapping for FEN generation
export const PIECE_TO_FEN = Object.fromEntries(
  Object.entries(FEN_PIECES).map(([fen, piece]) => [
    `${piece.type}_${piece.color}`, fen
  ])
);

// Parse FEN string to board state
export function parseFEN(fen, markAsFixed = true) {
  const board = Array(8).fill(null).map(() => Array(8).fill(null));
  const ranks = fen.split(' ')[0].split('/');
  
  for (let rank = 0; rank < 8; rank++) {
    let file = 0;
    for (const char of ranks[rank]) {
      if (char >= '1' && char <= '8') {
        file += parseInt(char);
      } else if (FEN_PIECES[char]) {
        board[rank][file] = { 
          ...FEN_PIECES[char], 
          isUserPlaced: !markAsFixed 
        };
        file++;
      }
    }
  }
  
  return board;
}

// Generate FEN string from board state
export function generateFEN(board) {
  const ranks = [];
  
  for (let rank = 0; rank < 8; rank++) {
    let rankStr = '';
    let emptyCount = 0;
    
    for (let file = 0; file < 8; file++) {
      const piece = board[rank][file];
      if (piece) {
        if (emptyCount > 0) {
          rankStr += emptyCount;
          emptyCount = 0;
        }
        rankStr += PIECE_TO_FEN[`${piece.type}_${piece.color}`];
      } else {
        emptyCount++;
      }
    }
    
    if (emptyCount > 0) {
      rankStr += emptyCount;
    }
    
    ranks.push(rankStr);
  }
  
  return ranks.join('/') + ' w - - 0 1';
}

// Check if a king is in check
export function isKingInCheck(board, kingColor) {
  // Find the king position
  let kingPos = null;
  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const piece = board[rank][file];
      if (piece && piece.type === PIECE_TYPES.KING && piece.color === kingColor) {
        kingPos = { rank, file };
        break;
      }
    }
    if (kingPos) break;
  }
  
  if (!kingPos) return false;
  
  // Check if any enemy piece can attack the king
  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const piece = board[rank][file];
      if (piece && piece.color !== kingColor) {
        if (canPieceAttack(board, { rank, file }, kingPos, piece)) {
          return true;
        }
      }
    }
  }
  
  return false;
}

// Check if a piece can attack a target square
function canPieceAttack(board, from, to, piece) {
  const rankDiff = to.rank - from.rank;
  const fileDiff = to.file - from.file;
  const absRankDiff = Math.abs(rankDiff);
  const absFileDiff = Math.abs(fileDiff);
  
  switch (piece.type) {
    case PIECE_TYPES.PAWN:
      const direction = piece.color === COLORS.WHITE ? -1 : 1;
      return rankDiff === direction && absFileDiff === 1;
      
    case PIECE_TYPES.ROOK:
      if (rankDiff === 0 || fileDiff === 0) {
        return isPathClear(board, from, to);
      }
      return false;
      
    case PIECE_TYPES.BISHOP:
      if (absRankDiff === absFileDiff) {
        return isPathClear(board, from, to);
      }
      return false;
      
    case PIECE_TYPES.QUEEN:
      if (rankDiff === 0 || fileDiff === 0 || absRankDiff === absFileDiff) {
        return isPathClear(board, from, to);
      }
      return false;
      
    case PIECE_TYPES.KNIGHT:
      return (absRankDiff === 2 && absFileDiff === 1) || 
             (absRankDiff === 1 && absFileDiff === 2);
      
    case PIECE_TYPES.KING:
      return absRankDiff <= 1 && absFileDiff <= 1;
      
    default:
      return false;
  }
}

// Check if path between two squares is clear
function isPathClear(board, from, to) {
  const rankStep = Math.sign(to.rank - from.rank);
  const fileStep = Math.sign(to.file - from.file);
  
  let currentRank = from.rank + rankStep;
  let currentFile = from.file + fileStep;
  
  while (currentRank !== to.rank || currentFile !== to.file) {
    if (board[currentRank][currentFile]) {
      return false;
    }
    currentRank += rankStep;
    currentFile += fileStep;
  }
  
  return true;
}

// Count pieces in a rank or file
export function countPiecesInLine(board, isRank, index) {
  const pieces = {};
  
  for (let i = 0; i < 8; i++) {
    const piece = isRank ? board[index][i] : board[i][index];
    if (piece) {
      const key = `${piece.type}_${piece.color}`;
      pieces[key] = (pieces[key] || 0) + 1;
    }
  }
  
  return pieces;
}

// Validate if current board state meets puzzle requirements
export function validatePuzzle(board, requirements) {
  const validation = {
    rankStatus: Array(8).fill(true),
    fileStatus: Array(8).fill(true),
    rankCounts: Array(8).fill(null),
    fileCounts: Array(8).fill(null),
    kingSafety: true,
    isComplete: true
  };
  
  // Check each rank and file
  for (let i = 0; i < 8; i++) {
    const rankPieces = countPiecesInLine(board, true, i);
    const filePieces = countPiecesInLine(board, false, i);
    
    validation.rankCounts[i] = getLineCounts(rankPieces, requirements);
    validation.fileCounts[i] = getLineCounts(filePieces, requirements);
    
    validation.rankStatus[i] = validateLineRequirements(rankPieces, requirements);
    validation.fileStatus[i] = validateLineRequirements(filePieces, requirements);
    
    if (!validation.rankStatus[i] || !validation.fileStatus[i]) {
      validation.isComplete = false;
    }
  }
  
  // Check king safety
  const whiteKingInCheck = isKingInCheck(board, COLORS.WHITE);
  const blackKingInCheck = isKingInCheck(board, COLORS.BLACK);
  
  if (whiteKingInCheck || blackKingInCheck) {
    validation.kingSafety = false;
    validation.isComplete = false;
  }
  
  return validation;
}

// Get counts for each requirement in a line
function getLineCounts(actualPieces, requirements) {
  return requirements.map(req => {
    if (req.type === 'empty') {
      // Count empty squares
      const totalPieces = Object.values(actualPieces).reduce((sum, count) => sum + count, 0);
      return 8 - totalPieces;
    } else {
      const key = `${req.type}_${req.color}`;
      return actualPieces[key] || 0;
    }
  });
}

// Check if a line (rank/file) meets the requirements
function validateLineRequirements(actualPieces, requirements) {
  for (const req of requirements) {
    if (req.type === 'empty') {
      // Check empty squares
      const totalPieces = Object.values(actualPieces).reduce((sum, count) => sum + count, 0);
      const emptySquares = 8 - totalPieces;
      if (emptySquares !== req.count) {
        return false;
      }
    } else {
      const key = `${req.type}_${req.color}`;
      const actual = actualPieces[key] || 0;
      if (actual !== req.count) {
        return false;
      }
    }
  }
  return true;
}

