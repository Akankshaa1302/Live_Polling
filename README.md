
# Real-Time Classroom Polling App

Welcome to the Real-Time Classroom Polling App! This is an interactive web platform that allows teachers to conduct live polls, gather instant feedback from students, and display live results in real-time.

---

## ✨ Features

- 👩‍🏫 Teacher dashboard to create and manage live polls
- 🎓 Student dashboard for participating in polls
- 🧠 Students can only see live results *after* submitting their answer or when the poll ends
- ⏳ Countdown timer for active polls
- 📈 Real-time poll result visualization
- 💬 Live chat feature for student-teacher interaction
- 👢 Kick students from session (teacher only)
- 🕓 Poll history view for reviewing past questions and results
- 🚫 Prevents chat message duplication
- 🕒 "Waiting for poll" screen shown when no active poll exists

---

## 🚀 Getting Started

### 📦 Prerequisites

Make sure you have [Node.js](https://nodejs.org/en/) installed on your system.

### 🔧 Installation

Install the dependencies:

```bash
npm install
```

### 🧪 Running Locally

Start the development server:

```bash
npm run dev
```

Open your browser and navigate to:

```
http://localhost:5173/
```

---

## 📂 Folder Structure (Key)

```
├── src/
│   ├── components/        # Reusable UI and feature components
│   ├── store/             # Zustand store for global state and socket handling
│   ├── pages/             # Teacher and Student Dashboards
│   └── App.tsx            # Main application routing
├── server/                # Backend (Socket.IO + Express)
```

---

## ⚙️ Technologies Used

- React
- Zustand (State management)
- Socket.IO (WebSocket real-time communication)
- Tailwind CSS
- Framer Motion
- TypeScript

---

## 📌 To-Do / Improvements

- Authentication system for students/teachers
- Export poll history as CSV
- Session persistence via database
- Enhanced UI for mobile devices

---

If you are satisfied with the result, you can finally build the project for release with:

```
npm run build
```
