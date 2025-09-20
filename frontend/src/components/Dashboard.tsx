import React from 'react';
import { TrendingUp, Clock, Award, Target, Calendar, BookOpen, CheckCircle2 } from 'lucide-react';
import { Analytics, Subject } from '../types';

interface DashboardProps {
  analytics: Analytics;
  subjects: Subject[];
}

const Dashboard: React.FC<DashboardProps> = ({ analytics, subjects }) => {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#069D73] to-[#3EC9A0] rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Welcome back, Adebayo! 👋
        </h2>
        <p className="text-[#B5F0DF]">
          You're on a {analytics.studyStreak}-day study streak. Keep it up!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#5C6A71]">Overall Progress</p>
              <p className="text-2xl font-bold text-[#1A282E]">{analytics.overallProgress}%</p>
            </div>
            <div className="w-12 h-12 bg-[#B5F0DF] rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[#069D73]" />
            </div>
          </div>
          <div className="mt-4 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-[#069D73] h-2 rounded-full" 
              style={{ width: `${analytics.overallProgress}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#5C6A71]">Study Streak</p>
              <p className="text-2xl font-bold text-[#1A282E]">{analytics.studyStreak} days</p>
            </div>
            <div className="w-12 h-12 bg-[#FFF2B3] rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-[#FFD542]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#5C6A71]">Lessons Completed</p>
              <p className="text-2xl font-bold text-[#1A282E]">{analytics.lessonsCompleted}</p>
            </div>
            <div className="w-12 h-12 bg-[#B5F0DF] rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-[#069D73]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#5C6A71]">Tests Completed</p>
              <p className="text-2xl font-bold text-[#1A282E]">{analytics.testsCompleted}</p>
            </div>
            <div className="w-12 h-12 bg-[#FFF2B3] rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-[#FFD542]" />
            </div>
          </div>
        </div>
      </div>

      {/* Progress Chart and Subject Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-[#1A282E] mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Weekly Progress
          </h3>
          <div className="space-y-4">
            {analytics.weeklyProgress.map((progress, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-[#5C6A71]">Week {index + 1}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#069D73] h-2 rounded-full" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-[#1A282E] w-8">{progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subject Performance */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-[#1A282E] mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Subject Performance
          </h3>
          <div className="space-y-4">
            {subjects.map((subject) => (
              <div key={subject.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: subject.color }}
                  ></div>
                  <span className="text-sm font-medium text-[#1A282E]">{subject.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        width: `${subject.progress}%`,
                        backgroundColor: subject.color 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-[#1A282E] w-8">{subject.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-[#1A282E] mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Today's Study Plan
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#B5F0DF] rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5 text-[#069D73]" />
              <div>
                <p className="font-medium text-[#1A282E]">Complete Mathematics Micro-lesson</p>
                <p className="text-sm text-[#5C6A71]">Quadratic Equations</p>
              </div>
            </div>
            <span className="text-sm text-[#069D73] font-medium">15 min</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-[#5C6A71]" />
              <div>
                <p className="font-medium text-[#1A282E]">Physics Practice Questions</p>
                <p className="text-sm text-[#5C6A71]">Mechanics - 10 questions</p>
              </div>
            </div>
            <span className="text-sm text-[#5C6A71] font-medium">20 min</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Target className="w-5 h-5 text-[#5C6A71]" />
              <div>
                <p className="font-medium text-[#1A282E]">Biology Review</p>
                <p className="text-sm text-[#5C6A71]">Cell Division concepts</p>
              </div>
            </div>
            <span className="text-sm text-[#5C6A71] font-medium">25 min</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;