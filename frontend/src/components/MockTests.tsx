import React, { useState } from 'react';
import { Clock, Play, Award, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';
import { Question } from '../types';

interface MockTestsProps {
  questions: Question[];
}

const MockTests: React.FC<MockTestsProps> = ({ questions }) => {
  const [activeTest, setActiveTest] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const mockTests = [
    {
      id: '1',
      title: 'UTME Practice Test 1',
      type: 'UTME',
      subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology'],
      questions: 60,
      duration: 60,
      difficulty: 'Medium',
      description: 'Comprehensive practice test covering all subjects'
    },
    {
      id: '2',
      title: 'Mathematics Focus Test',
      type: 'Subject',
      subjects: ['Mathematics'],
      questions: 20,
      duration: 30,
      difficulty: 'Hard',
      description: 'Advanced mathematics questions for intensive practice'
    },
    {
      id: '3',
      title: 'Science Combined Test',
      type: 'POST-UTME',
      subjects: ['Physics', 'Chemistry', 'Biology'],
      questions: 45,
      duration: 45,
      difficulty: 'Medium',
      description: 'Post-UTME style questions for science subjects'
    }
  ];

  const recentScores = [
    { test: 'UTME Practice Test 1', score: 85, date: '2024-01-15', time: '45 min' },
    { test: 'Mathematics Focus', score: 92, date: '2024-01-14', time: '28 min' },
    { test: 'Science Combined', score: 78, date: '2024-01-13', time: '42 min' }
  ];

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTest = (testId: string) => {
    setActiveTest(testId);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setTimeLeft(3600);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answerIndex
    }));
  };

  const handleSubmitTest = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.slice(0, 20).forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / 20) * 100);
  };

  if (activeTest && !showResults) {
    const question = questions[currentQuestion % questions.length];
    
    return (
      <div className="max-w-4xl mx-auto">
        {/* Test Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div>
              <h1 className="text-xl font-bold text-[#1A282E]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                UTME Practice Test 1
              </h1>
              <p className="text-[#5C6A71]">Question {currentQuestion + 1} of 20</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-[#1A282E]">
                <Clock className="w-5 h-5" />
                <span className="font-mono font-bold text-lg">{formatTime(timeLeft)}</span>
              </div>
              <button
                onClick={handleSubmitTest}
                className="bg-[#069D73] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#3EC9A0] transition-colors"
              >
                Submit Test
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="px-4 py-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#069D73] h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / 20) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-[#5C6A71] bg-gray-100 px-2 py-1 rounded">
                {question.subject}
              </span>
              <span className={`text-sm px-2 py-1 rounded ${
                question.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {question.difficulty}
              </span>
            </div>
            <h2 className="text-lg font-medium text-[#1A282E] mb-4">
              {question.text}
            </h2>
          </div>

          <div className="space-y-3 mb-6">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-4 text-left rounded-lg border transition-all ${
                  answers[currentQuestion] === index
                    ? 'border-[#069D73] bg-[#B5F0DF] text-[#1A282E]'
                    : 'border-gray-200 hover:border-[#069D73] hover:bg-gray-50'
                }`}
              >
                <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                {option}
              </button>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="px-4 py-2 text-[#5C6A71] border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentQuestion(Math.min(19, currentQuestion + 1))}
              disabled={currentQuestion === 19}
              className="px-4 py-2 bg-[#069D73] text-white rounded-lg hover:bg-[#3EC9A0] transition-colors disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const isPass = score >= 50;
    
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
            isPass ? 'bg-[#069D73]' : 'bg-red-500'
          }`}>
            {isPass ? (
              <CheckCircle2 className="w-10 h-10 text-white" />
            ) : (
              <AlertCircle className="w-10 h-10 text-white" />
            )}
          </div>
          
          <h2 className="text-3xl font-bold text-[#1A282E] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Test Completed!
          </h2>
          
          <div className="text-4xl font-bold mb-4" style={{
            color: isPass ? '#069D73' : '#ef4444'
          }}>
            {score}%
          </div>
          
          <p className={`text-lg mb-6 ${isPass ? 'text-[#069D73]' : 'text-red-600'}`}>
            {isPass ? 'Congratulations! You passed!' : 'Keep practicing to improve your score.'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-[#1A282E]">{Object.keys(answers).length}</p>
              <p className="text-sm text-[#5C6A71]">Questions Answered</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-[#069D73]">{Math.round((score / 100) * 20)}</p>
              <p className="text-sm text-[#5C6A71]">Correct Answers</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-[#FFD542]">45:23</p>
              <p className="text-sm text-[#5C6A71]">Time Spent</p>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setActiveTest(null)}
              className="px-6 py-3 border border-gray-300 text-[#1A282E] rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Tests
            </button>
            <button
              onClick={() => {
                setShowResults(false);
                setCurrentQuestion(0);
                setAnswers({});
              }}
              className="px-6 py-3 bg-[#069D73] text-white rounded-lg hover:bg-[#3EC9A0] transition-colors"
            >
              Retake Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#1A282E] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Mock Tests & Practice
        </h1>
        <p className="text-[#5C6A71]">
          Simulate real exam conditions with timed CBT-style practice tests
        </p>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#1A282E]">Average Score</h3>
            <TrendingUp className="w-5 h-5 text-[#069D73]" />
          </div>
          <div className="text-3xl font-bold text-[#069D73] mb-2">85%</div>
          <p className="text-sm text-[#5C6A71]">+12% from last week</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#1A282E]">Tests Completed</h3>
            <Award className="w-5 h-5 text-[#FFD542]" />
          </div>
          <div className="text-3xl font-bold text-[#1A282E] mb-2">12</div>
          <p className="text-sm text-[#5C6A71]">This month</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#1A282E]">Study Time</h3>
            <Clock className="w-5 h-5 text-[#3EC9A0]" />
          </div>
          <div className="text-3xl font-bold text-[#1A282E] mb-2">8.5h</div>
          <p className="text-sm text-[#5C6A71]">This week</p>
        </div>
      </div>

      {/* Available Tests */}
      <div>
        <h2 className="text-xl font-semibold text-[#1A282E] mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Available Practice Tests
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTests.map((test) => (
            <div key={test.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-[#1A282E] mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {test.title}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded ${
                    test.type === 'UTME' ? 'bg-[#B5F0DF] text-[#069D73]' :
                    test.type === 'POST-UTME' ? 'bg-[#FFF2B3] text-[#FFD542]' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {test.type}
                  </span>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  test.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                  test.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {test.difficulty}
                </span>
              </div>
              
              <p className="text-[#5C6A71] text-sm mb-4">{test.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#5C6A71]">Questions:</span>
                  <span className="font-medium text-[#1A282E]">{test.questions}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#5C6A71]">Duration:</span>
                  <span className="font-medium text-[#1A282E]">{test.duration} min</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#5C6A71]">Subjects:</span>
                  <span className="font-medium text-[#1A282E]">{test.subjects.length}</span>
                </div>
              </div>
              
              <button
                onClick={() => handleStartTest(test.id)}
                className="w-full bg-[#069D73] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#3EC9A0] transition-colors flex items-center justify-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>Start Test</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Results */}
      <div>
        <h2 className="text-xl font-semibold text-[#1A282E] mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Recent Results
        </h2>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#5C6A71] uppercase tracking-wider">
                    Test Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#5C6A71] uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#5C6A71] uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#5C6A71] uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentScores.map((result, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-[#1A282E]">{result.test}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        result.score >= 80 ? 'bg-green-100 text-green-800' :
                        result.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {result.score}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[#5C6A71]">
                      {result.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[#5C6A71]">
                      {new Date(result.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockTests;