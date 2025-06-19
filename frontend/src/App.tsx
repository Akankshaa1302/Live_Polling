import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useStore } from "./store/useStore";
import { RoleSelection } from "./components/RoleSelection";
import { StudentNameInput } from "./components/StudentNameInput";
import { TeacherDashboard } from "./components/TeacherDashboard";
import { StudentDashboard } from "./components/StudentDashboard";

export const App: React.FC = () => {
  const { connect, userRole, joinAsTeacher, joinAsStudent } = useStore();
  const [showNameInput, setShowNameInput] = useState(false);

  useEffect(() => {
    connect();
  }, [connect]);

  const handleRoleSelect = (role: 'teacher' | 'student') => {
    if (role === 'teacher') {
      joinAsTeacher();
    } else {
      // Check if student name is already stored in session
      const storedName = sessionStorage.getItem('studentName');
      if (storedName) {
        joinAsStudent(storedName);
      } else {
        setShowNameInput(true);
      }
    }
  };

  const handleNameSubmit = (name: string) => {
    joinAsStudent(name);
    setShowNameInput(false);
  };

  if (showNameInput) {
    return (
      <>
        <StudentNameInput onNameSubmit={handleNameSubmit} />
        <Toaster position="top-right" />
      </>
    );
  }

  if (!userRole) {
    return (
      <>
        <RoleSelection onRoleSelect={handleRoleSelect} />
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <>
      {userRole === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />}
      <Toaster position="top-right" />
    </>
  );
};