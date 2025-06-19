import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../store/useStore";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { MessageCircle, Send, X, User, GraduationCap } from "lucide-react";

export const ChatPopup: React.FC = () => {
  const {
    isChatOpen,
    toggleChat,
    chatMessages,
    sendMessage,
    userRole,
    studentName,
  } = useStore();

  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message.trim());
      setMessage("");
    }
  };

  if (!isChatOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
        className="fixed right-6 top-6 bottom-6 w-80 z-50"
      >
        <Card className="h-full flex flex-col shadow-2xl border-2 border-gray-200">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex-shrink-0">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Live Chat
              </span>
              <Button
                onClick={toggleChat}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            {/* Messages with scroll */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-400">
              {chatMessages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No messages yet</p>
                  <p className="text-sm">Start the conversation!</p>
                </div>
              ) : (
                chatMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex gap-2 ${
                      (userRole === 'teacher' && msg.isTeacher) ||
                      (userRole === 'student' && msg.sender === studentName)
                        ? 'justify-end'
                        : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] ${
                        (userRole === 'teacher' && msg.isTeacher) ||
                        (userRole === 'student' && msg.sender === studentName)
                          ? 'order-2'
                          : 'order-1'
                      }`}
                    >
                      <div
                        className={`p-3 rounded-lg ${
                          (userRole === 'teacher' && msg.isTeacher) ||
                          (userRole === 'student' && msg.sender === studentName)
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white border shadow-sm'
                        }`}
                      >
                        <div className="flex items-center gap-1 mb-1">
                          {msg.isTeacher ? (
                            <GraduationCap className="w-3 h-3" />
                          ) : (
                            <User className="w-3 h-3" />
                          )}
                          <span className="text-xs font-medium opacity-75">
                            {msg.sender}
                          </span>
                        </div>
                        <p className="text-sm">{msg.text}</p>
                        <p className="text-xs opacity-60 mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t bg-white">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  maxLength={500}
                />
                <Button
                  type="submit"
                  disabled={!message.trim()}
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};
