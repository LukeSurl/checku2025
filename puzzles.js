// Checku puzzle data extracted from the PDF

import { PIECE_TYPES, COLORS } from './chess.js';

export const PUZZLES = [
  {
    id: 1,
    name: "Puzzle #1",
    description: "Fill the board such that each rank and file contains exactly the following:",
    requirements: [
      { type: PIECE_TYPES.KING, color: COLORS.WHITE, count: 1 },
      { type: PIECE_TYPES.KING, color: COLORS.BLACK, count: 1 },
      { type: PIECE_TYPES.ROOK, color: COLORS.WHITE, count: 2 },
      { type: PIECE_TYPES.PAWN, color: COLORS.WHITE, count: 1 },
      { type: PIECE_TYPES.PAWN, color: COLORS.BLACK, count: 1 },
      { type: 'empty', color: null, count: 2 }
    ],
    startingFEN: "1R4PK/2KPk3/R6k/1P1R3p/pk2RR2/4RK2/6KR/K1kp2RR w - - 0 1",
    solutionFEN: "1R1RpkPK/R1KPkpR1/RK2PRpk/1PRRK1kp/pkPKRR2/kpR1RK1P/PRpk2KR/K1kp1PRR w - - 0 1"
  },
  {
    id: 2,
    name: "Puzzle #2", 
    description: "Fill the board such that each rank and file contains exactly the following:",
    requirements: [
      { type: PIECE_TYPES.KING, color: COLORS.WHITE, count: 1 },
      { type: PIECE_TYPES.KING, color: COLORS.BLACK, count: 1 },
      { type: PIECE_TYPES.ROOK, color: COLORS.BLACK, count: 1 },
      { type: PIECE_TYPES.BISHOP, color: COLORS.BLACK, count: 1 },
      { type: PIECE_TYPES.KNIGHT, color: COLORS.WHITE, count: 1 },
      { type: PIECE_TYPES.KNIGHT, color: COLORS.BLACK, count: 1 },
      { type: 'empty', color: null, count: 2 }
    ],
    startingFEN: "4b3/1N1n1bk1/N3n3/1kn2K1r/n1r3K1/K1k2r1n/5k1K/bK4n1 w - - 0 1",
    solutionFEN: "k1K1bnrN/rN1nKbk1/NrbKn2k/1knb1KNr/n1rk1NKb/Kbk1Nr1n/1n1NrkbK/bKNrk1n1 w - - 0 1"
  },
  {
    id: 3,
    name: "Puzzle #3",
    description: "Fill the board such that each rank and file contains exactly the following:",
    requirements: [
      { type: PIECE_TYPES.KING, color: COLORS.WHITE, count: 1 },
      { type: PIECE_TYPES.KING, color: COLORS.BLACK, count: 1 },
      { type: PIECE_TYPES.BISHOP, color: COLORS.WHITE, count: 1 },
      { type: PIECE_TYPES.BISHOP, color: COLORS.BLACK, count: 1 },
      { type: 'empty', color: null, count: 4 }
    ],
    startingFEN: "5bB1/BK2b3/K2B3b/3K3k/2K3k1/8/2b3K1/2k2K2 w - - 0 1",
    solutionFEN: "4kbBK/BK1kb3/K2B1k1b/b1BK3k/1bK2Bk1/kB2K1b1/1kb3KB/2kbBK2 w - - 0 1"
  }
];

// Get available pieces for a puzzle (pieces that can be placed)
export function getAvailablePieces(puzzle) {
  const pieces = [];
  
  for (const req of puzzle.requirements) {
    if (req.type !== 'empty') {
      for (let i = 0; i < req.count * 8; i++) { // 8 copies for each rank/file
        pieces.push({
          type: req.type,
          color: req.color,
          id: `${req.type}_${req.color}_${i}`
        });
      }
    }
  }
  
  return pieces;
}

// Get requirement text for display
export function getRequirementText(requirements) {
  const parts = [];
  
  for (const req of requirements) {
    if (req.type === 'empty') {
      parts.push(`${req.count} empty squares`);
    } else {
      const colorName = req.color === COLORS.WHITE ? 'white' : 'black';
      const pieceName = req.type;
      const plural = req.count > 1 ? 's' : '';
      parts.push(`${req.count} ${colorName} ${pieceName}${plural}`);
    }
  }
  
  return parts.join(', ');
}

