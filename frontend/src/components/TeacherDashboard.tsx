import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../store/useStore";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Plus,
  Users,
  BarChart3,
  Clock,
  MessageCircle,
  History,
  UserX,
  X
} from "lucide-react";
import { CreatePollModal } from "./CreatePollModal";
import { ChatPopup } from "./ChatPopup";
import toast from "react-hot-toast";

export const TeacherDashboard: React.FC = () => {
  const {
    currentPoll,
    pollResults,
    students,
    pollHistory,
    createPoll,
    kickStudent,
    isChatOpen,
    toggleChat,
    joinAsTeacher
  } = useStore();

  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Fetch pollHistory on mount
  useEffect(() => {
    joinAsTeacher();
  }, []);

  const canCreatePoll = !currentPoll || !currentPoll.isActive;

  const handleCreatePoll = (question: string, options: string[], timeLimit: number) => {
    createPoll(question, options, timeLimit);
    setShowCreatePoll(false);
    toast.success("Poll created successfully!");
  };

  const handleKickStudent = (studentId: string, studentName: string) => {
    if (confirm(`Are you sure you want to remove ${studentName} from the session?`)) {
      kickStudent(studentId);
      toast.success(`${studentName} has been removed`);
    }
  };

  const getPollStatus = () => {
    if (currentPoll) return currentPoll.isActive ? "Active" : "Closed";
    if (pollHistory.length > 0) return "Closed";
    return "Inactive";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Teacher Dashboard</h1>
            <p className="text-gray-600">Manage your live polling sessions</p>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => setShowHistory(!showHistory)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <History className="w-4 h-4" />
              Poll History
            </Button>

            <Button
              onClick={toggleChat}
              variant="outline"
              className="flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Chat
            </Button>

            <Button
              onClick={() => setShowCreatePoll(true)}
              disabled={!canCreatePoll}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Poll
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-blue-100">Active Students</p>
                  <p className="text-3xl font-bold">{students.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-green-100">Total Polls</p>
                  <p className="text-3xl font-bold">{pollHistory.length}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-purple-100">Poll Status</p>
                  <p className="text-xl font-bold">{getPollStatus()}</p>
                </div>
                <Clock className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Poll */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Current Poll
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentPoll ? (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">{currentPoll.question}</h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Clock className="w-4 h-4" /> Time Limit: {currentPoll.timeLimit}s
                    </p>

                    {pollResults && (
                      <div className="space-y-3">
                        <h4 className="font-medium">Live Results:</h4>
                        {currentPoll.options.map((opt) => (
                          <div key={opt}>
                            <div className="flex justify-between text-sm">
                              <span>{opt}</span>
                              <span>
                                {pollResults.percentages[opt]}% ({pollResults.counts[opt]})
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <motion.div
                                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${pollResults.percentages[opt]}%` }}
                                transition={{ duration: 0.5 }}
                              />
                            </div>
                          </div>
                        ))}
                        <p className="text-sm text-gray-600 mt-2">
                          {pollResults.totalAnswers} of {pollResults.totalStudents} responded
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No active poll</p>
                    <p className="text-sm">Create a poll to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Connected Students */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Connected Students ({students.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {students.length > 0 ? (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {students.map((s) => (
                      <motion.div
                        key={s.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              s.hasAnswered ? "bg-green-500" : "bg-yellow-500"
                            }`}
                          />
                          <span className="font-medium">{s.name}</span>
                        </div>
                        <Button
                          onClick={() => handleKickStudent(s.id, s.name)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <UserX className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No students connected</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Poll Results (History with Stats) */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <History className="w-5 h-5" />
                      Poll Results
                    </span>
                    <Button onClick={() => setShowHistory(false)} variant="ghost" size="sm">
                      <X className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {pollHistory.length > 0 ? (
                    pollHistory.map((poll) => (
                      <div key={poll.id} className="mb-6">
                        <h4 className="font-semibold text-lg">{poll.question}</h4>
                        <p className="text-xs text-gray-500 mb-2">
                          Created: {new Date(poll.createdAt).toLocaleString()}
                        </p>
                        <div className="space-y-2">
                          {poll.results.options.map((opt) => (
                            <div key={opt}>
                              <div className="flex justify-between text-sm">
                                <span>{opt}</span>
                                <span>
                                  {poll.results.percentages[opt]}% ({poll.results.counts[opt]})
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <motion.div
                                  className="bg-purple-500 h-2 rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${poll.results.percentages[opt]}%` }}
                                  transition={{ duration: 0.5 }}
                                />
                              </div>
                            </div>
                          ))}
                          <p className="text-xs text-gray-600 mt-1">
                            {poll.results.totalAnswers} of {poll.results.totalStudents} responded
                          </p>
                        </div>
                        <hr className="my-4" />
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500">
                      No past poll results available
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <CreatePollModal
        isOpen={showCreatePoll}
        onClose={() => setShowCreatePoll(false)}
        onSubmit={handleCreatePoll}
      />
      <ChatPopup />
    </div>
  );
};
