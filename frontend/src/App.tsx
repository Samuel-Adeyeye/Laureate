import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Lessons from './components/Lessons';
import MockTests from './components/MockTests';
import CampusServices from './components/CampusServices';
import Login from './components/Login';
import Signup from './components/Signup';
import { 
  mockUser, 
  mockSubjects, 
  mockMicroLessons, 
  mockAnalytics, 
  mockCampusServices,
  sampleQuestions,
  initializeDefaultUsers
} from './data/mockData';

// Initialize default users on app start
initializeDefaultUsers();

function AppContent() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard analytics={mockAnalytics} subjects={mockSubjects} />;
      case 'lessons':
        return <Lessons lessons={mockMicroLessons} />;
      case 'tests':
        return <MockTests questions={sampleQuestions} />;
      case 'campus':
        return <CampusServices services={mockCampusServices} />;
      default:
        return <Dashboard analytics={mockAnalytics} subjects={mockSubjects} />;
    }
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#069D73] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#5C6A71]">Loading...</p>
        </div>
      </div>
    );
  }

  // Show authentication pages if not authenticated
  if (!isAuthenticated) {
    if (authMode === 'login') {
      return <Login onSwitchToSignup={() => setAuthMode('signup')} />;
    } else {
      return <Signup onSwitchToLogin={() => setAuthMode('login')} />;
    }
  }

  // Show main application if authenticated
  return (
    <Layout 
      activeView={activeView} 
      onViewChange={setActiveView}
      user={user || mockUser}
    >
      {renderContent()}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;