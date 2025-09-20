import { User, StudyPlan, Subject, MicroLesson, Question, MockTest, TestResult, Analytics, CampusService, AuthUser } from '../types';

export const mockUser: User = {
  id: '1',
  name: 'Adebayo Johnson',
  email: 'adebayo.johnson@email.com',
  phone: '+2348012345678',
  targetUniversity: 'University of Lagos',
  subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology'],
  currentLevel: 'SS3',
  studyGoal: 'Medicine and Surgery',
  createdAt: new Date('2024-01-15')
};

export const mockAuthUser: AuthUser = {
  id: '1',
  name: 'Adebayo Johnson',
  email: 'adebayo.johnson@email.com',
  phone: '+2348012345678',
  password: 'password123',
  targetUniversity: 'University of Lagos',
  subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology'],
  currentLevel: 'SS3',
  studyGoal: 'Medicine and Surgery',
  createdAt: new Date('2024-01-15'),
  isVerified: true
};

// Initialize default users in localStorage if not exists
export const initializeDefaultUsers = () => {
  const existingUsers = localStorage.getItem('laureate_users');
  if (!existingUsers) {
    const defaultUsers = [mockAuthUser];
    localStorage.setItem('laureate_users', JSON.stringify(defaultUsers));
  }
};

export const mockSubjects: Subject[] = [
  {
    id: '1',
    name: 'Mathematics',
    code: 'MTH',
    color: '#069D73',
    progress: 75,
    topics: [
      { id: '1', title: 'Algebra', completed: true, difficulty: 'medium', estimatedTime: 45 },
      { id: '2', title: 'Geometry', completed: true, difficulty: 'hard', estimatedTime: 60 },
      { id: '3', title: 'Calculus', completed: false, difficulty: 'hard', estimatedTime: 90 },
      { id: '4', title: 'Statistics', completed: false, difficulty: 'medium', estimatedTime: 50 }
    ]
  },
  {
    id: '2',
    name: 'Physics',
    code: 'PHY',
    color: '#FFD542',
    progress: 60,
    topics: [
      { id: '5', title: 'Mechanics', completed: true, difficulty: 'medium', estimatedTime: 55 },
      { id: '6', title: 'Waves and Optics', completed: false, difficulty: 'hard', estimatedTime: 70 },
      { id: '7', title: 'Electricity', completed: false, difficulty: 'medium', estimatedTime: 65 }
    ]
  },
  {
    id: '3',
    name: 'Chemistry',
    code: 'CHM',
    color: '#3EC9A0',
    progress: 45,
    topics: [
      { id: '8', title: 'Organic Chemistry', completed: false, difficulty: 'hard', estimatedTime: 80 },
      { id: '9', title: 'Inorganic Chemistry', completed: false, difficulty: 'medium', estimatedTime: 60 }
    ]
  },
  {
    id: '4',
    name: 'Biology',
    code: 'BIO',
    color: '#FFE373',
    progress: 80,
    topics: [
      { id: '10', title: 'Cell Biology', completed: true, difficulty: 'medium', estimatedTime: 50 },
      { id: '11', title: 'Genetics', completed: true, difficulty: 'hard', estimatedTime: 75 },
      { id: '12', title: 'Ecology', completed: false, difficulty: 'easy', estimatedTime: 40 }
    ]
  }
];

export const mockMicroLessons: MicroLesson[] = [
  {
    id: '1',
    title: 'Quadratic Equations',
    subject: 'Mathematics',
    content: 'A quadratic equation is a polynomial equation of degree 2. The general form is ax² + bx + c = 0, where a ≠ 0. These equations can be solved using factoring, completing the square, or the quadratic formula.',
    audioNote: '/audio/quadratic-intro.mp3',
    duration: 15,
    questions: [
      {
        id: '1',
        text: 'What is the discriminant of x² - 5x + 6 = 0?',
        options: ['1', '25', '5', '-1'],
        correctAnswer: 0,
        explanation: 'The discriminant is b² - 4ac = (-5)² - 4(1)(6) = 25 - 24 = 1',
        difficulty: 'medium',
        subject: 'Mathematics',
        topic: 'Quadratic Equations',
        year: 2023
      }
    ],
    completed: false,
    scheduledDate: new Date()
  },
  {
    id: '2',
    title: 'Cell Division',
    subject: 'Biology',
    content: 'Cell division is the process by which cells reproduce. There are two main types: mitosis (for growth and repair) and meiosis (for gamete formation). Understanding these processes is crucial for genetics and development.',
    duration: 20,
    questions: [
      {
        id: '2',
        text: 'How many daughter cells are produced in mitosis?',
        options: ['2', '4', '8', '1'],
        correctAnswer: 0,
        explanation: 'Mitosis produces 2 genetically identical diploid daughter cells',
        difficulty: 'easy',
        subject: 'Biology',
        topic: 'Cell Division'
      }
    ],
    completed: true,
    scheduledDate: new Date(Date.now() - 86400000)
  }
];

export const mockAnalytics: Analytics = {
  overallProgress: 65,
  strongSubjects: ['Biology', 'Mathematics'],
  weakSubjects: ['Chemistry', 'Physics'],
  studyStreak: 7,
  weeklyProgress: [45, 52, 58, 61, 65, 68, 65],
  recentScores: [78, 82, 75, 88, 91, 85, 79],
  timeSpentToday: 120,
  lessonsCompleted: 23,
  testsCompleted: 8
};

export const mockCampusServices: CampusService[] = [
  {
    id: '1',
    type: 'announcement',
    title: 'UTME Registration Deadline Extended',
    description: 'The Joint Admissions and Matriculation Board (JAMB) has extended the UTME registration deadline to March 31st, 2024.',
    priority: 'high',
    date: new Date(),
    actionRequired: true
  },
  {
    id: '2',
    type: 'fee',
    title: 'School Fee Payment Reminder',
    description: 'Your school fee payment is due in 5 days. Click to make payment.',
    priority: 'high',
    date: new Date(Date.now() + 432000000),
    actionRequired: true
  },
  {
    id: '3',
    type: 'location',
    title: 'Faculty of Medicine',
    description: 'College of Medicine Building, University of Lagos',
    priority: 'medium',
    date: new Date(),
    location: {
      name: 'Faculty of Medicine, UNILAG',
      coordinates: [6.5158, 3.3909],
      mapLink: 'https://maps.google.com/?q=6.5158,3.3909'
    }
  }
];

export const sampleQuestions: Question[] = [
  {
    id: '1',
    text: 'If 2^(x+1) = 8, what is the value of x?',
    options: ['1', '2', '3', '4'],
    correctAnswer: 1,
    explanation: '2^(x+1) = 8 = 2^3, so x+1 = 3, therefore x = 2',
    difficulty: 'medium',
    subject: 'Mathematics',
    topic: 'Indices',
    year: 2023
  },
  {
    id: '2',
    text: 'Which of the following is NOT a greenhouse gas?',
    options: ['Carbon dioxide', 'Methane', 'Nitrogen', 'Water vapor'],
    correctAnswer: 2,
    explanation: 'Nitrogen (N₂) makes up 78% of the atmosphere but is not a greenhouse gas as it does not absorb infrared radiation effectively',
    difficulty: 'easy',
    subject: 'Biology',
    topic: 'Environmental Science'
  },
  {
    id: '3',
    text: 'What is the pH of pure water at 25°C?',
    options: ['6', '7', '8', '9'],
    correctAnswer: 1,
    explanation: 'Pure water has a pH of 7 at 25°C, making it neutral (neither acidic nor basic)',
    difficulty: 'easy',
    subject: 'Chemistry',
    topic: 'Acids and Bases'
  },
  {
    id: '4',
    text: 'A ball is thrown vertically upward. At the highest point of its trajectory, what is its acceleration?',
    options: ['0 m/s²', '9.8 m/s² downward', '9.8 m/s² upward', 'Variable'],
    correctAnswer: 1,
    explanation: 'Throughout its flight, the ball experiences constant gravitational acceleration of 9.8 m/s² downward, even at the highest point where velocity is zero',
    difficulty: 'medium',
    subject: 'Physics',
    topic: 'Kinematics'
  }
];