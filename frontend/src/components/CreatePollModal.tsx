import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { X, Plus, Trash2, Clock } from "lucide-react";

interface CreatePollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (question: string, options: string[], timeLimit: number) => void;
}

export const CreatePollModal: React.FC<CreatePollModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [timeLimit, setTimeLimit] = useState(60);
  const [errors, setErrors] = useState<string[]>([]);

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, ""]);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const validateForm = () => {
    const newErrors: string[] = [];

    if (!question.trim()) {
      newErrors.push("Question is required");
    }

    const validOptions = options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      newErrors.push("At least 2 options are required");
    }

    if (timeLimit < 10 || timeLimit > 300) {
      newErrors.push("Time limit must be between 10 and 300 seconds");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const validOptions = options.filter(opt => opt.trim());
      onSubmit(question.trim(), validOptions, timeLimit);
      
      // Reset form
      setQuestion("");
      setOptions(["", ""]);
      setTimeLimit(60);
      setErrors([]);
    }
  };

  const handleClose = () => {
    setQuestion("");
    setOptions(["", ""]);
    setTimeLimit(60);
    setErrors([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl"
        >
          <Card className="shadow-2xl bg-white dark:bg-zinc-900">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
              <CardTitle className="flex items-center justify-between">
                <span>Create New Poll</span>
                <Button
                  onClick={handleClose}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Question */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Poll Question *
                  </label>
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Enter your poll question..."
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none resize-none"
                    rows={3}
                  />
                </div>

                {/* Time Limit */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Time Limit (seconds) *
                  </label>
                  <input
                    type="number"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(parseInt(e.target.value) || 60)}
                    min="10"
                    max="300"
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Between 10 and 300 seconds</p>
                </div>

                {/* Options */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Answer Options * (minimum 2, maximum 6)
                  </label>
                  <div className="space-y-3">
                    {options.map((option, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-2"
                      >
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                          className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                        />
                        {options.length > 2 && (
                          <Button
                            type="button"
                            onClick={() => removeOption(index)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                  
                  {options.length < 6 && (
                    <Button
                      type="button"
                      onClick={addOption}
                      variant="outline"
                      className="mt-3 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Option
                    </Button>
                  )}
                </div>

                {/* Errors */}
                {errors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <ul className="text-red-600 text-sm space-y-1">
                      {errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    onClick={handleClose}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    Create Poll
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};