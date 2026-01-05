import { Notification } from '@/types/game';

interface GameNotificationsProps {
  notifications: Notification[];
}

export default function GameNotifications({ notifications }: GameNotificationsProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg shadow-lg animate-slide-in ${
            notification.type === 'success'
              ? 'bg-green-500 text-white'
              : notification.type === 'error'
                ? 'bg-red-500 text-white'
                : notification.type === 'warning'
                  ? 'bg-orange-500 text-white'
                  : 'bg-blue-500 text-white'
          }`}
        >
          <div className="font-semibold">{notification.message}</div>
        </div>
      ))}
    </div>
  );
}
