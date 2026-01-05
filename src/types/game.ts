// Frontend types (mirrors server types)

export interface Player {
  id: string;
  name: string;
  score: number;
  isHost: boolean;
  hasDrawn: boolean;
}

export interface JoinRequest {
  id: string;
  name: string;
}

export interface DrawingData {
  type: 'start' | 'draw' | 'end';
  x: number;
  y: number;
  color?: string;
  size?: number;
}

export interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  message: string;
  timestamp: number;
}

export enum GameState {
  WAITING = 'waiting',
  PLAYING = 'playing',
  FINISHED = 'finished'
}

export interface GameRoom {
  id: string;
  host: string;
  players: Player[];
  gameState: GameState;
  currentDrawer: string | null;
  currentWord: string | null;
  roundNumber: number;
  roundTimer: number;
  joinRequests: JoinRequest[];
  drawingData: DrawingData[];
  chatMessages: ChatMessage[];
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: number;
}
