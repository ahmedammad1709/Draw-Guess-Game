import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useSocket } from '@/contexts/SocketContext';

export default function JoinRoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const [status, setStatus] = useState<'requesting' | 'waiting' | 'approved' | 'rejected'>('requesting');
  const [error, setError] = useState('');

  const playerName = location.state?.playerName || '';

  useEffect(() => {
    if (!socket || !roomId || !playerName) {
      navigate('/');
      return;
    }

    // Request to join room
    socket.emit('room:join:request', { roomId, playerName }, (response: any) => {
      if (response.success) {
        setStatus('waiting');
      } else {
        setError(response.error || 'Failed to join room');
        setStatus('rejected');
      }
    });

    // Listen for approval
    socket.on('join:approved', (data: any) => {
      setStatus('approved');
      navigate(`/room/${roomId}`, {
        state: { playerName, isHost: false }
      });
    });

    // Listen for rejection
    socket.on('join:rejected', () => {
      setStatus('rejected');
      setError('Host rejected your request');
    });

    return () => {
      socket.off('join:approved');
      socket.off('join:rejected');
    };
  }, [socket, roomId, playerName, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center">
        {status === 'requesting' && (
          <>
            <div className="text-6xl mb-6">⏳</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Requesting to Join...
            </h2>
            <p className="text-gray-600">
              Sending request to room {roomId}
            </p>
          </>
        )}

        {status === 'waiting' && (
          <>
            <div className="text-6xl mb-6 animate-bounce">🎮</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Waiting for Approval
            </h2>
            <p className="text-gray-600 mb-6">
              The host is reviewing your request to join room <strong>{roomId}</strong>
            </p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
            </div>
          </>
        )}

        {status === 'rejected' && (
          <>
            <div className="text-6xl mb-6">❌</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Request Rejected
            </h2>
            <p className="text-gray-600 mb-6">
              {error || 'Unable to join the room'}
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-8 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              Back to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}
