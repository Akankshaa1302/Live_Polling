import express from 'express';
import http from 'http';
import { Server as socketIo } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const server = http.createServer(app);
const io = new socketIo(server, {
  cors: {
    origin: '*',  // Adjust if frontend runs elsewhere
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// In-memory data store
let currentPoll = null;
let pollHistory = [];
let students = new Map();
let chatMessages = [];
let teacherSocket = null;

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Teacher connects
  socket.on('join-teacher', () => {
    teacherSocket = socket;
    socket.join('teacher');

    // Send current data
    socket.emit('poll-history', pollHistory);
    socket.emit('chat-messages', chatMessages);
    console.log('Teacher joined');
  });

  // Student connects
  socket.on('join-student', (studentName) => {
    students.set(socket.id, {
      id: socket.id,
      name: studentName,
      hasAnswered: false
    });

    socket.join('students');
    socket.emit('student-joined', { id: socket.id, name: studentName });

    if (currentPoll && currentPoll.isActive) {
      socket.emit('new-poll', currentPoll);
    }

    socket.emit('chat-messages', chatMessages);
    io.to('teacher').emit('student-list', Array.from(students.values()));

    console.log('Student joined:', studentName);
  });

  // Create a new poll
  socket.on('create-poll', (pollData) => {
    const pollId = uuidv4();
    currentPoll = {
      id: pollId,
      question: pollData.question,
      options: pollData.options,
      timeLimit: pollData.timeLimit || 60,
      createdAt: new Date(),
      answers: [],
      isActive: true
    };

    // Reset answers
    students.forEach(s => s.hasAnswered = false);

    io.to('students').emit('new-poll', currentPoll);
    io.to('teacher').emit('poll-created', currentPoll);
    console.log('New poll created:', currentPoll.question);

    // Auto close after time limit
    setTimeout(() => {
      if (currentPoll && currentPoll.id === pollId) {
        closePoll();
      }
    }, currentPoll.timeLimit * 1000);
  });

  // Student submits answer
  socket.on('submit-answer', (answerData) => {
    if (!currentPoll || !currentPoll.isActive) return socket.emit('error', 'No active poll');

    const student = students.get(socket.id);
    if (!student) return socket.emit('error', 'Student not found');
    if (student.hasAnswered) return socket.emit('error', 'Already answered');

    currentPoll.answers.push({
      studentId: socket.id,
      studentName: student.name,
      answer: answerData.answer,
      timestamp: new Date()
    });

    student.hasAnswered = true;

    const results = calculateResults(currentPoll);
    io.emit('poll-results', results);

    const allAnswered = Array.from(students.values()).every(s => s.hasAnswered);
    if (allAnswered) closePoll();

    console.log('Answer submitted by:', student.name);
  });

  // Chat
  socket.on('send-message', (messageData) => {
    const student = students.get(socket.id);
    const isTeacher = socket.rooms.has('teacher');

    const message = {
      id: uuidv4(),
      text: messageData.text,
      sender: isTeacher ? 'Teacher' : (student ? student.name : 'Unknown'),
      isTeacher: isTeacher,
      timestamp: new Date()
    };

    chatMessages.push(message);
    io.emit('new-message', message);
  });

  // Kick student
  socket.on('kick-student', (studentId) => {
    const studentSocket = io.sockets.sockets.get(studentId);
    if (studentSocket) {
      studentSocket.emit('kicked');
      studentSocket.disconnect();
    }
    students.delete(studentId);
    io.to('teacher').emit('student-list', Array.from(students.values()));
  });

  // Return poll history
  socket.on('get-poll-history', () => {
    socket.emit('poll-history', pollHistory);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    if (students.has(socket.id)) {
      const student = students.get(socket.id);
      students.delete(socket.id);
      io.to('teacher').emit('student-list', Array.from(students.values()));
      console.log('Student disconnected:', student.name);
    }

    if (socket === teacherSocket) {
      teacherSocket = null;
      console.log('Teacher disconnected');
    }
  });
});

function closePoll() {
  if (!currentPoll) return;

  currentPoll.isActive = false;
  currentPoll.closedAt = new Date();

  const results = calculateResults(currentPoll);
  const pollWithResults = { ...currentPoll, results };

  pollHistory.push(pollWithResults);
  io.emit('poll-closed', results);
  console.log('Poll closed:', currentPoll.question);

  currentPoll = null;
}

function calculateResults(poll) {
  const counts = {};
  poll.options.forEach(opt => { counts[opt] = 0; });

  poll.answers.forEach(({ answer }) => {
    if (counts[answer] !== undefined) counts[answer]++;
  });

  const totalAnswers = poll.answers.length;
  const percentages = {};
  poll.options.forEach(opt => {
    percentages[opt] = totalAnswers ? Math.round((counts[opt] / totalAnswers) * 100) : 0;
  });

  return {
    pollId: poll.id,
    question: poll.question,
    options: poll.options,
    counts,
    percentages,
    totalAnswers,
    totalStudents: students.size
  };
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
