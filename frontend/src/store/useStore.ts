import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

interface Student {
  id: string;
  name: string;
  hasAnswered: boolean;
}

interface Poll {
  id: string;
  results: any;
  question: string;
  options: string[];
  timeLimit: number;
  createdAt: Date;
  answers: any[];
  isActive: boolean;
}

interface PollResults {
  pollId: string;
  question: string;
  options: string[];
  counts: Record<string, number>;
  percentages: Record<string, number>;
  totalAnswers: number;
  totalStudents: number;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: string;
  isTeacher: boolean;
  timestamp: Date;
}

interface AppState {
  socket: Socket | null;
  isConnected: boolean;

  userRole: 'teacher' | 'student' | null;
  studentName: string;
  studentId: string;

  currentPoll: Poll | null;
  pollResults: PollResults | null;
  pollHistory: Poll[];
  hasAnswered: boolean;
  timeRemaining: number;

  students: Student[];
  chatMessages: ChatMessage[];
  isChatOpen: boolean;

  connect: () => void;
  disconnect: () => void;
  joinAsTeacher: () => void;
  joinAsStudent: (name: string) => void;
  createPoll: (question: string, options: string[], timeLimit?: number) => void;
  submitAnswer: (answer: string) => void;
  sendMessage: (text: string) => void;
  kickStudent: (studentId: string) => void;
  toggleChat: () => void;
  setTimeRemaining: (time: number) => void;
}

export const useStore = create<AppState>((set, get) => ({
  socket: null,
  isConnected: false,

  userRole: null,
  studentName: '',
  studentId: '',

  currentPoll: null,
  pollResults: null,
  pollHistory: [],
  hasAnswered: false,
  timeRemaining: 0,

  students: [],
  chatMessages: [],
  isChatOpen: false,

  connect: () => {
    const { socket: existingSocket } = get();
    if (existingSocket && existingSocket.connected) return;

  const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;
const socket = io(BACKEND_URL);

    socket.on('connect', () => {
      set({ socket, isConnected: true });
    });

    socket.on('disconnect', () => {
      set({ isConnected: false });
    });

    socket.on('student-joined', (data) => {
      set({ studentId: data.id, studentName: data.name });
    });

    socket.on('new-poll', (poll) => {
      set({
        currentPoll: poll,
        hasAnswered: false,
        timeRemaining: poll.timeLimit,
        pollResults: null,
      });
    });

    socket.on('poll-created', (poll) => {
      set({
        currentPoll: poll,
        hasAnswered: false,
        timeRemaining: poll.timeLimit,
        pollResults: null,
      });
    });

    socket.on('poll-results', (results) => {
      set({ pollResults: results });
    });

    socket.on('poll-closed', (results) => {
      set({
        pollResults: results,
        currentPoll: null,
        timeRemaining: 0,
      });
    });

    socket.on('poll-history', (history) => {
      set({ pollHistory: history });
    });

    socket.on('student-list', (students) => {
      set({ students });
    });

    // Remove listeners before adding to prevent multiple triggers
    socket.removeAllListeners('chat-messages');
    socket.on('chat-messages', (messages: ChatMessage[]) => {
      set({ chatMessages: messages });
    });

    socket.removeAllListeners('new-message');
    socket.on('new-message', (message: ChatMessage) => {
      set((state) => {
        // Prevent duplicate messages using ID check
        if (state.chatMessages.some((m) => m.id === message.id)) {
          return {};
        }
        return { chatMessages: [...state.chatMessages, message] };
      });
    });

    socket.on('kicked', () => {
      alert('You have been removed from the session by the teacher.');
      window.location.reload();
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  joinAsTeacher: () => {
    const { socket } = get();
    if (socket) {
      socket.emit('join-teacher');
      set({ userRole: 'teacher' });
    }
  },

  joinAsStudent: (name: string) => {
    const { socket } = get();
    if (socket) {
      socket.emit('join-student', name);
      set({ userRole: 'student', studentName: name });
      sessionStorage.setItem('studentName', name);
    }
  },

  createPoll: (question, options, timeLimit = 60) => {
    const { socket } = get();
    if (socket) {
      socket.emit('create-poll', { question, options, timeLimit });
    }
  },

  submitAnswer: (answer) => {
    const { socket } = get();
    if (socket) {
      socket.emit('submit-answer', { answer });
      set({ hasAnswered: true });
    }
  },

  sendMessage: (text) => {
    const { socket } = get();
    if (socket) {
      socket.emit('send-message', { text });
    }
  },

  kickStudent: (studentId) => {
    const { socket } = get();
    if (socket) {
      socket.emit('kick-student', studentId);
    }
  },

  toggleChat: () => {
    set((state) => ({ isChatOpen: !state.isChatOpen }));
  },

  setTimeRemaining: (time) => {
    set({ timeRemaining: time });
  },
}));
