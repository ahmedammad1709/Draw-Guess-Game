import { Player } from '@/types/game';

interface PlayerListProps {
  players: Player[];
  currentDrawerId: string | null;
  currentPlayerId: string;
}

export default function PlayerList({ players, currentDrawerId, currentPlayerId }: PlayerListProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-4">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        👥 Players ({players.length}/6)
      </h3>

      <div className="space-y-2">
        {players.map((player) => (
          <div
            key={player.id}
            className={`p-3 rounded-lg border-2 transition-all ${
              player.id === currentDrawerId
                ? 'bg-yellow-100 border-yellow-400'
                : player.id === currentPlayerId
                  ? 'bg-blue-100 border-blue-400'
                  : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {player.id === currentDrawerId ? '🎨' : '👤'}
                </span>
                <div>
                  <div className="font-semibold text-gray-800">
                    {player.name}
                    {player.isHost && (
                      <span className="ml-2 text-xs bg-purple-500 text-white px-2 py-0.5 rounded">
                        HOST
                      </span>
                    )}
                    {player.id === currentPlayerId && (
                      <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-0.5 rounded">
                        YOU
                      </span>
                    )}
                  </div>
                  {player.id === currentDrawerId && (
                    <div className="text-xs text-yellow-700 font-medium">Drawing...</div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-purple-600">{player.score}</div>
                <div className="text-xs text-gray-500">points</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
