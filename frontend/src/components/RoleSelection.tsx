import React, { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { GraduationCap, Users } from "lucide-react";

interface RoleSelectionProps {
  onRoleSelect: (role: 'teacher' | 'student') => void;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({ onRoleSelect }) => {
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | null>('student');

  const roles = [
    {
      id: "student",
      title: "I'm a Student",
      description: "Join live polls and participate in real-time discussions with your class.",
      icon: GraduationCap,
      gradient: "from-blue-500 to-purple-600"
    },
    {
      id: "teacher",
      title: "I'm a Teacher",
      description: "Create polls, manage students, and view live results in real-time.",
      icon: Users,
      gradient: "from-purple-500 to-pink-600"
    },
  ];

  const handleContinue = () => {
    if (selectedRole) {
      onRoleSelect(selectedRole);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-row justify-center w-full min-h-screen">
      <div className="w-full max-w-[1440px] relative py-16">
        <motion.div 
          className="flex flex-col items-center gap-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-none shadow-lg">
              <img
                className="w-4 h-4"
                alt="Vector"
                src="/vector.svg"
              />
              <span className="font-semibold text-sm">Live Polling System</span>
            </span>
          </motion.div>

          {/* Heading */}
          <motion.div 
            className="flex flex-col items-center gap-6 max-w-[800px] text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
              Welcome to the{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Interactive Polling
              </span>{" "}
              Experience
            </h1>
            <p className="text-xl text-gray-600 font-medium leading-relaxed">
              Choose your role to begin creating engaging polls or participating in real-time discussions
            </p>
          </motion.div>

          {/* Role Selection Cards */}
          <motion.div 
            className="flex flex-wrap justify-center gap-8 w-full max-w-[900px]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {roles.map((role, index) => {
              const Icon = role.icon;
              return (
                <motion.div
                  key={role.id}
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Card
                    className={`w-[400px] h-[180px] cursor-pointer transition-all duration-300 ${
                      selectedRole === role.id
                        ? "border-2 border-indigo-500 shadow-xl bg-gradient-to-br from-white to-indigo-50"
                        : "border border-gray-200 shadow-md hover:shadow-lg bg-white"
                    }`}
                    onClick={() => setSelectedRole(role.id as "student" | "teacher")}
                  >
                    <CardContent className="flex flex-col h-full justify-center gap-4 p-8">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${role.gradient} shadow-lg`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="font-bold text-2xl text-gray-900">
                          {role.title}
                        </h2>
                      </div>
                      <p className="text-gray-600 text-base leading-relaxed">
                        {role.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Continue Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Button 
              onClick={handleContinue}
              disabled={!selectedRole}
              className="w-[280px] h-[60px] rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Continue as {selectedRole === 'student' ? 'Student' : 'Teacher'}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};