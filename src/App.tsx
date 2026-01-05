import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SocketProvider } from '@/contexts/SocketContext';
import HomePage from '@/pages/HomePage';
import JoinRoomPage from '@/pages/JoinRoomPage';
import GameRoomPage from '@/pages/GameRoomPage';

export default function App() {
  return (
    <SocketProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/join/:roomId" element={<JoinRoomPage />} />
          <Route path="/room/:roomId" element={<GameRoomPage />} />
        </Routes>
      </BrowserRouter>
    </SocketProvider>
  );
}
