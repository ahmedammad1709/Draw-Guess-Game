import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '@/contexts/SocketContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { socket, connected } = useSocket();
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateRoom = () => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!socket || !connected) {
      setError('Not connected to server');
      return;
    }

    setLoading(true);
    setError('');

    socket.emit('room:create', { playerName: playerName.trim() }, (response: any) => {
      setLoading(false);
      if (response.success) {
        navigate(`/room/${response.roomId}`, {
          state: { playerName: playerName.trim(), isHost: true }
        });
      } else {
        setError('Failed to create room');
      }
    });
  };

  const handleJoinRoom = () => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!roomId.trim()) {
      setError('Please enter room ID');
      return;
    }

    navigate(`/join/${roomId.trim().toUpperCase()}`, {
      state: { playerName: playerName.trim() }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            🎨 Draw & Guess
          </h1>
          <p className="text-gray-600">Online Multiplayer Game</p>
        </div>

        {!connected && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg mb-6">
            Connecting to server...
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
              maxLength={20}
            />
          </div>

          <button
            onClick={handleCreateRoom}
            disabled={!connected || loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Creating...' : '🎮 Create Room'}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">OR</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room ID
            </label>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              placeholder="Enter room ID"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors uppercase"
              maxLength={6}
            />
          </div>

          <button
            onClick={handleJoinRoom}
            disabled={!connected || loading}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-4 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            🚪 Join Room
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>2-6 players • Real-time drawing • Chat & Guess</p>
        </div>
      </div>
    </div>
  );
}
