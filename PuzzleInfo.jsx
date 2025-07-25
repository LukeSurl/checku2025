import { getRequirementText } from '../lib/puzzles.js';
import { validatePuzzle } from '../lib/chess.js';

export default function PuzzleInfo({ 
  puzzle, 
  board,
  className = ""
}) {
  if (!puzzle) return null;

  const validation = validatePuzzle(board, puzzle.requirements);
  const completedRanks = validation.rankStatus.filter(Boolean).length;
  const completedFiles = validation.fileStatus.filter(Boolean).length;
  const totalProgress = (completedRanks + completedFiles) / 16 * 100;

  return (
    <div className={`bg-white rounded-lg border-2 border-gray-300 p-4 ${className}`}>
      <div className="space-y-4">
        {/* Puzzle header */}
        <div>
          <h2 className="text-xl font-bold text-blue-600">{puzzle.name}</h2>
          <p className="text-gray-600 text-sm mt-1">{puzzle.description}</p>
        </div>

        {/* Requirements */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Requirements</h3>
          <div className="bg-blue-50 p-3 rounded border">
            <p className="text-sm">
              Each rank (row) and file (column) must contain exactly:
            </p>
            <p className="text-sm font-medium mt-1">
              {getRequirementText(puzzle.requirements)}
            </p>
          </div>
        </div>

        {/* Progress indicator */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Progress</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{Math.round(totalProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${totalProgress}%` }}
              ></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="flex justify-between">
                  <span>Ranks Complete:</span>
                  <span className={completedRanks === 8 ? 'text-green-600 font-bold' : ''}>
                    {completedRanks}/8
                  </span>
                </div>
              </div>
              <div>
                <div className="flex justify-between">
                  <span>Files Complete:</span>
                  <span className={completedFiles === 8 ? 'text-green-600 font-bold' : ''}>
                    {completedFiles}/8
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* King safety status */}
        <div>
          <h3 className="text-lg font-semibold mb-2">King Safety</h3>
          <div className={`p-2 rounded text-sm font-medium ${
            validation.kingSafety 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {validation.kingSafety ? '✓ No kings in check' : '✗ One or more kings in check'}
          </div>
        </div>

        {/* Success message */}
        {validation.isComplete && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <div className="flex items-center">
              <span className="text-2xl mr-2">🎉</span>
              <div>
                <div className="font-bold">Congratulations!</div>
                <div className="text-sm">You have successfully solved the puzzle!</div>
              </div>
            </div>
          </div>
        )}

        {/* Rules reminder */}
        <div className="text-xs text-gray-500 border-t pt-3">
          <p><strong>Rules:</strong></p>
          <ul className="list-disc list-inside space-y-1 mt-1">
            <li>Each rank and file must contain exactly the required pieces</li>
            <li>No kings may be in check</li>
            <li>Pawns attack diagonally in their normal directions</li>
            <li>There is only one solution</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

