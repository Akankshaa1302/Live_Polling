import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../store/useStore";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { 
  Clock, 
  CheckCircle, 
  BarChart3, 
  MessageCircle,
  AlertCircle,
  Users
} from "lucide-react";
import { ChatPopup } from "./ChatPopup";

export const StudentDashboard: React.FC = () => {
  const {
    studentName,
    currentPoll,
    pollResults,
    hasAnswered,
    timeRemaining,
    setTimeRemaining,
    submitAnswer,
    toggleChat
  } = useStore();

  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (currentPoll && !hasAnswered && timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      setTimer(interval);
      
      return () => clearInterval(interval);
    } else if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  }, [currentPoll, hasAnswered, timeRemaining, setTimeRemaining]);

  const handleSubmitAnswer = () => {
    if (selectedAnswer && currentPoll) {
      submitAnswer(selectedAnswer);
      setSelectedAnswer("");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome, {studentName}!
            </h1>
            <p className="text-gray-600">Participate in live polls and discussions</p>
          </div>
          
          <Button
            onClick={toggleChat}
            variant="outline"
            className="flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Chat
          </Button>
        </motion.div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Current Poll */}
          <AnimatePresence mode="wait">
            {currentPoll && !hasAnswered && timeRemaining > 0 ? (
              <motion.div
                key="active-poll"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-2 border-blue-500 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        Active Poll
                      </span>
                      <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                        <Clock className="w-4 h-4" />
                        <span className="font-mono text-lg">
                          {formatTime(timeRemaining)}
                        </span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      {currentPoll.question}
                    </h2>
                    
                    <div className="space-y-3 mb-6">
                      {currentPoll.options.map((option, index) => (
                        <motion.button
                          key={option}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedAnswer(option)}
                          className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                            selectedAnswer === option
                              ? "border-blue-500 bg-blue-50 text-blue-900"
                              : "border-gray-200 hover:border-gray-300 bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full border-2 ${
                              selectedAnswer === option
                                ? "border-blue-500 bg-blue-500"
                                : "border-gray-300"
                            }`}>
                              {selectedAnswer === option && (
                                <div className="w-full h-full rounded-full bg-white scale-50" />
                              )}
                            </div>
                            <span className="font-medium">{option}</span>
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    <Button
                      onClick={handleSubmitAnswer}
                      disabled={!selectedAnswer}
                      className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold text-lg"
                    >
                      Submit Answer
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : currentPoll && (hasAnswered || timeRemaining === 0) ?  (
              <motion.div
                key="answered"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-2 border-green-500 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Answer Submitted
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 text-center">
                    <div className="mb-6">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Thank you for participating!
                      </h2>
                      <p className="text-gray-600">
                        {timeRemaining === 0 ? "Time's up!" : "Your answer has been recorded."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="waiting"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="shadow-lg">
                  <CardContent className="p-12 text-center">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Waiting for Poll
                    </h2>
                    <p className="text-gray-600">
                      Your teacher will start a poll soon. Stay tuned!
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Poll Results */}
          <AnimatePresence>
            {pollResults && (hasAnswered || timeRemaining === 0) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Live Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-4">{pollResults.question}</h3>
                    
                    <div className="space-y-4">
                      {pollResults.options.map((option) => (
                        <div key={option} className="space-y-2">
                          <div className="flex justify-between text-sm font-medium">
                            <span>{option}</span>
                            <span>{pollResults.percentages[option]}% ({pollResults.counts[option]} votes)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <motion.div
                              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${pollResults.percentages[option]}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 text-center">
                        <strong>{pollResults.totalAnswers}</strong> out of <strong>{pollResults.totalStudents}</strong> students have responded
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <ChatPopup />
    </div>
  );
};