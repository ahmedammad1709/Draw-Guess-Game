import { JoinRequest } from '@/types/game';

interface JoinRequestModalProps {
  requests: JoinRequest[];
  onApprove: (playerId: string) => void;
  onReject: (playerId: string) => void;
  onClose: () => void;
}

export default function JoinRequestModal({
  requests,
  onApprove,
  onReject,
  onClose
}: JoinRequestModalProps) {
  if (requests.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-800">🔔 Join Requests</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-3">
          {requests.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">👤</span>
                <span className="font-semibold text-gray-800">{request.name}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onApprove(request.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  ✓
                </button>
                <button
                  onClick={() => onReject(request.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  ✗
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
