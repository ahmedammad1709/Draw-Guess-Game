import { Player } from '@/types/game';

interface ScoreboardProps {
  players: Player[];
}

export default function Scoreboard({ players }: ScoreboardProps) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-3">
      {sortedPlayers.map((player, index) => (
        <div
          key={player.id}
          className={`flex items-center justify-between p-4 rounded-lg ${
            index === 0
              ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white'
              : index === 1
                ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800'
                : index === 2
                  ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white'
                  : 'bg-gray-100 text-gray-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold">
              {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
            </div>
            <div>
              <div className="font-bold">{player.name}</div>
              {player.isHost && (
                <div className="text-xs opacity-75">Host</div>
              )}
            </div>
          </div>
          <div className="text-2xl font-bold">{player.score}</div>
        </div>
      ))}
    </div>
  );
}
