interface TimerProps {
  seconds: number;
}

export default function Timer({ seconds }: TimerProps) {
  const isLowTime = seconds <= 10;

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-lg ${
        isLowTime
          ? 'bg-red-500 text-white animate-pulse'
          : 'bg-blue-500 text-white'
      }`}
    >
      <span>⏱️</span>
      <span>{seconds}s</span>
    </div>
  );
}
