import React, { useState } from 'react';
import { Play, Clock, CheckCircle2, BookOpen, Volume2, ArrowRight } from 'lucide-react';
import { MicroLesson, Question } from '../types';

interface LessonsProps {
  lessons: MicroLesson[];
}

const Lessons: React.FC<LessonsProps> = ({ lessons }) => {
  const [selectedLesson, setSelectedLesson] = useState<MicroLesson | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(false);

  const handleStartLesson = (lesson: MicroLesson) => {
    setSelectedLesson(lesson);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setLessonCompleted(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (selectedLesson && currentQuestion < selectedLesson.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setLessonCompleted(true);
    }
  };

  const handleBackToLessons = () => {
    setSelectedLesson(null);
    setLessonCompleted(false);
  };

  if (selectedLesson) {
    if (lessonCompleted) {
      return (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-center">
            <div className="w-16 h-16 bg-[#069D73] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#1A282E] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Lesson Completed!
            </h2>
            <p className="text-[#5C6A71] mb-6">
              Great job! You've completed "{selectedLesson.title}". Keep up the excellent work!
            </p>
            <button
              onClick={handleBackToLessons}
              className="bg-[#069D73] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#3EC9A0] transition-colors"
            >
              Back to Lessons
            </button>
          </div>
        </div>
      );
    }

    const question = selectedLesson.questions[currentQuestion];
    const isCorrect = selectedAnswer === question.correctAnswer;

    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Lesson Header */}
          <div className="bg-gradient-to-r from-[#069D73] to-[#3EC9A0] p-6 text-white">
            <button
              onClick={handleBackToLessons}
              className="text-[#B5F0DF] hover:text-white mb-4 flex items-center text-sm"
            >
              ← Back to Lessons
            </button>
            <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {selectedLesson.title}
            </h1>
            <p className="text-[#B5F0DF]">{selectedLesson.subject}</p>
          </div>

          {/* Lesson Content */}
          {currentQuestion === 0 && !showExplanation && (
            <div className="p-6">
              <div className="mb-6">
                <p className="text-[#1A282E] leading-relaxed">{selectedLesson.content}</p>
              </div>
              
              {selectedLesson.audioNote && (
                <div className="mb-6 p-4 bg-[#FFF9D6] rounded-lg border border-[#FFD542]">
                  <div className="flex items-center space-x-3">
                    <Volume2 className="w-5 h-5 text-[#FFD542]" />
                    <span className="text-[#1A282E] font-medium">Audio Note Available</span>
                    <button className="flex items-center space-x-2 bg-[#FFD542] text-[#1A282E] px-3 py-1 rounded-md text-sm hover:bg-[#FFE373] transition-colors">
                      <Play className="w-4 h-4" />
                      <span>Play</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Practice Questions */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[#1A282E]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Practice Question {currentQuestion + 1} of {selectedLesson.questions.length}
              </h3>
              <div className="text-sm text-[#5C6A71]">
                {selectedLesson.duration} min lesson
              </div>
            </div>

            <div className="mb-6">
              <p className="text-[#1A282E] font-medium mb-4">{question.text}</p>
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => !showExplanation && handleAnswerSelect(index)}
                    disabled={showExplanation}
                    className={`w-full p-4 text-left rounded-lg border transition-all ${
                      selectedAnswer === index
                        ? showExplanation
                          ? index === question.correctAnswer
                            ? 'border-[#069D73] bg-[#B5F0DF] text-[#1A282E]'
                            : 'border-red-300 bg-red-50 text-red-800'
                          : 'border-[#069D73] bg-[#B5F0DF] text-[#1A282E]'
                        : showExplanation && index === question.correctAnswer
                        ? 'border-[#069D73] bg-[#B5F0DF] text-[#1A282E]'
                        : 'border-gray-200 hover:border-[#069D73] hover:bg-gray-50'
                    }`}
                  >
                    <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {showExplanation && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isCorrect ? 'bg-[#069D73]' : 'bg-red-500'
                  }`}>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className={`font-medium mb-2 ${
                      isCorrect ? 'text-[#069D73]' : 'text-red-600'
                    }`}>
                      {isCorrect ? 'Correct!' : 'Incorrect'}
                    </p>
                    <p className="text-[#5C6A71]">{question.explanation}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <div></div>
              {!showExplanation ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className="bg-[#069D73] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#3EC9A0] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <span>Submit Answer</span>
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="bg-[#069D73] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#3EC9A0] transition-colors flex items-center space-x-2"
                >
                  <span>
                    {currentQuestion < selectedLesson.questions.length - 1 ? 'Next Question' : 'Complete Lesson'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#1A282E] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Daily Micro-Lessons
        </h1>
        <p className="text-[#5C6A71]">
          Bite-sized lessons designed to help you master key concepts
        </p>
      </div>

      {/* Today's Lesson */}
      <div className="bg-gradient-to-r from-[#069D73] to-[#3EC9A0] rounded-lg p-6 text-white">
        <div className="flex items-center space-x-2 mb-2">
          <BookOpen className="w-5 h-5" />
          <span className="text-sm font-medium">Today's Focus</span>
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Ready for your next lesson?
        </h2>
        <p className="text-[#B5F0DF]">
          Continue building your knowledge with personalized content
        </p>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#1A282E] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {lesson.title}
                </h3>
                <p className="text-[#5C6A71] text-sm mb-2">{lesson.subject}</p>
                <p className="text-[#5C6A71] text-sm line-clamp-2">
                  {lesson.content.substring(0, 120)}...
                </p>
              </div>
              {lesson.completed && (
                <CheckCircle2 className="w-6 h-6 text-[#069D73] flex-shrink-0 ml-2" />
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-[#5C6A71]">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{lesson.duration} min</span>
                </div>
                <div className="flex items-center space-x-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{lesson.questions.length} questions</span>
                </div>
              </div>
              <button
                onClick={() => handleStartLesson(lesson)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  lesson.completed
                    ? 'bg-gray-100 text-[#5C6A71] hover:bg-gray-200'
                    : 'bg-[#069D73] text-white hover:bg-[#3EC9A0]'
                }`}
              >
                <Play className="w-4 h-4" />
                <span>{lesson.completed ? 'Review' : 'Start'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Lessons;