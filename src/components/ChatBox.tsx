import { useState, useEffect, useRef } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { ChatMessage } from '@/types/game';

interface ChatBoxProps {
  roomId: string;
  currentPlayerId: string;
  isDrawer: boolean;
  disabled: boolean;
}

export default function ChatBox({ roomId, currentPlayerId, isDrawer, disabled }: ChatBoxProps) {
  const { socket } = useSocket();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket) return;

    socket.on('chat:message', (message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('guess:correct', (data: any) => {
      const correctMessage: ChatMessage = {
        id: Date.now().toString(),
        playerId: 'system',
        playerName: 'System',
        message: `🎉 ${data.playerName} guessed the word!`,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, correctMessage]);
    });

    return () => {
      socket.off('chat:message');
      socket.off('guess:correct');
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputMessage.trim() || !socket || disabled) return;

    socket.emit('chat:message', {
      roomId,
      message: inputMessage.trim()
    });

    setInputMessage('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 h-[600px] flex flex-col">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        💬 Chat {isDrawer ? '(Drawing)' : '(Guess!)'}
      </h3>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded-lg ${
              msg.playerId === 'system'
                ? 'bg-green-100 text-green-800 text-center font-bold'
                : msg.playerId === currentPlayerId
                  ? 'bg-blue-100 text-blue-800 ml-4'
                  : 'bg-gray-100 text-gray-800 mr-4'
            }`}
          >
            {msg.playerId !== 'system' && (
              <div className="text-xs font-semibold mb-1">{msg.playerName}</div>
            )}
            <div className="text-sm">{msg.message}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={isDrawer ? "You're drawing..." : 'Type your guess...'}
          disabled={disabled || isDrawer}
          className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          maxLength={100}
        />
        <button
          type="submit"
          disabled={disabled || isDrawer || !inputMessage.trim()}
          className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-bold"
        >
          Send
        </button>
      </form>

      {isDrawer && !disabled && (
        <div className="mt-2 text-center text-sm text-gray-600">
          You cannot chat while drawing
        </div>
      )}
    </div>
  );
}
