import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Clock, 
  FileText, 
  Award, 
  Play, 
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  User,
  Calendar,
  Trophy,
  Target,
  ChevronRight,
  Timer,
  Flag
} from 'lucide-react';

interface Exam {
  id: number;
  title: string;
  description: string;
  duration: number;
  category: string;
  startDate: string;
  endDate: string;
  passingScore: number;
  maxAttempts: number;
  status: 'upcoming' | 'active' | 'completed';
  questions: number;
}

interface Question {
  id: number;
  examId: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

interface ExamAttempt {
  examId: number;
  answers: { [questionId: number]: number };
  timeSpent: number;
  score?: number;
  passed?: boolean;
  submittedAt?: string;
}

const ExamUserPortal: React.FC = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'exam-list' | 'exam-details' | 'taking-exam' | 'results'>('dashboard');
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [questionId: number]: number }>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  const [examResults, setExamResults] = useState<ExamAttempt | null>(null);

  // Sample data (in a real app, this would come from your backend)
  const [exams] = useState<Exam[]>([
    {
      id: 1,
      title: "JavaScript Fundamentals",
      description: "Test your knowledge of JavaScript basics including variables, functions, and control structures.",
      duration: 60,
      category: "Programming",
      startDate: "2025-01-15T09:00",
      endDate: "2025-01-15T23:59",
      passingScore: 60,
      maxAttempts: 1,
      status: "active",
      questions: 30
    },
    {
      id: 2,
      title: "React Development",
      description: "Comprehensive test covering React hooks, components, and state management.",
      duration: 90,
      category: "Web Development",
      startDate: "2025-01-10T10:00",
      endDate: "2025-01-10T23:59",
      passingScore: 70,
      maxAttempts: 1,
      status: "completed",
      questions: 45
    },
    {
      id: 3,
      title: "Python Basics",
      description: "Introduction to Python programming concepts and syntax.",
      duration: 45,
      category: "Programming",
      startDate: "2025-01-20T14:00",
      endDate: "2025-01-20T23:59",
      passingScore: 65,
      maxAttempts: 2,
      status: "upcoming",
      questions: 25
    }
  ]);

  const [questions] = useState<Question[]>([
    {
      id: 1,
      examId: 1,
      question: "What is the correct way to declare a variable in JavaScript?",
      options: ["var name = 'John';", "variable name = 'John';", "v name = 'John';", "declare name = 'John';"],
      correctAnswer: 0,
      explanation: "The 'var' keyword is used to declare variables in JavaScript.",
      difficulty: "easy",
      points: 1
    },
    {
      id: 2,
      examId: 1,
      question: "Which of the following is NOT a JavaScript data type?",
      options: ["String", "Boolean", "Float", "Undefined"],
      correctAnswer: 2,
      explanation: "JavaScript doesn't have a specific 'Float' data type. Numbers are represented as Number type.",
      difficulty: "medium",
      points: 2
    },
    {
      id: 3,
      examId: 1,
      question: "What does the '===' operator do in JavaScript?",
      options: ["Assigns a value", "Compares values only", "Compares values and types", "Creates a function"],
      correctAnswer: 2,
      explanation: "The '===' operator performs strict equality comparison, checking both value and type.",
      difficulty: "medium",
      points: 2
    },
    {
      id: 4,
      examId: 1,
      question: "Which method is used to add an element to the end of an array?",
      options: ["push()", "pop()", "shift()", "unshift()"],
      correctAnswer: 0,
      explanation: "The push() method adds one or more elements to the end of an array.",
      difficulty: "easy",
      points: 1
    },
    {
      id: 5,
      examId: 1,
      question: "What will 'console.log(typeof null)' output?",
      options: ["null", "undefined", "object", "boolean"],
      correctAnswer: 2,
      explanation: "This is a known quirk in JavaScript - typeof null returns 'object'.",
      difficulty: "hard",
      points: 3
    }
  ]);

  // Timer effect
  useEffect(() => {
    if (examStarted && timeRemaining > 0 && !examCompleted) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && examStarted && !examCompleted) {
      handleSubmitExam();
    }
  }, [timeRemaining, examStarted, examCompleted]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const startExam = (exam: Exam) => {
    setSelectedExam(exam);
    const examQuestions = questions.filter(q => q.examId === exam.id);
    setExamQuestions(examQuestions);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setTimeRemaining(exam.duration * 60);
    setExamStarted(true);
    setExamCompleted(false);
    setCurrentView('taking-exam');
  };

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const calculateResults = () => {
    let correctAnswers = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    examQuestions.forEach(question => {
      totalPoints += question.points;
      if (userAnswers[question.id] === question.correctAnswer) {
        correctAnswers++;
        earnedPoints += question.points;
      }
    });

    const score = Math.round((earnedPoints / totalPoints) * 100);
    const passed = score >= (selectedExam?.passingScore || 60);

    return {
      score,
      correctAnswers,
      totalQuestions: examQuestions.length,
      earnedPoints,
      totalPoints,
      passed
    };
  };

  const handleSubmitExam = () => {
    if (!selectedExam) return;

    const results = calculateResults();
    const attempt: ExamAttempt = {
      examId: selectedExam.id,
      answers: userAnswers,
      timeSpent: (selectedExam.duration * 60) - timeRemaining,
      score: results.score,
      passed: results.passed,
      submittedAt: new Date().toISOString()
    };

    setExamResults(attempt);
    setExamCompleted(true);
    setExamStarted(false);
    setCurrentView('results');
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < examQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const ExamCard = ({ exam }: { exam: Exam }) => (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{exam.title}</h3>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(exam.status)}`}>
            {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
          </span>
        </div>
      </div>
      
      <p className="text-gray-600 mb-4 text-sm">{exam.description}</p>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          {exam.duration} mins
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FileText className="w-4 h-4" />
          {exam.questions} questions
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Target className="w-4 h-4" />
          {exam.passingScore}% to pass
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Award className="w-4 h-4" />
          {exam.maxAttempts} attempt(s)
        </div>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={() => {
            setSelectedExam(exam);
            setCurrentView('exam-details');
          }}
          className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
        >
          View Details
        </button>
        {exam.status === 'active' && (
          <button
            onClick={() => startExam(exam)}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 text-sm font-medium"
          >
            Start Exam
          </button>
        )}
      </div>
    </div>
  );

  const StatCard = ({ icon: Icon, value, label, color }: any) => (
    <div className={`${color} p-6 rounded-2xl text-white shadow-lg transform hover:scale-105 transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold mb-1">{value}</div>
          <div className="text-sm opacity-90">{label}</div>
        </div>
        <Icon className="w-6 h-6 opacity-80" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 mb-8 shadow-xl border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-2xl">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  EduPortal - Student Dashboard
                </h1>
                <p className="text-gray-600">Take your exams and track your progress</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/50 rounded-xl p-3">
              <User className="w-5 h-5 text-gray-600" />
              <div className="text-sm">
                <div className="font-semibold">John Doe</div>
                <div className="text-gray-500">Student ID: 12345</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        {currentView !== 'taking-exam' && (
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                currentView === 'dashboard'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white/50 text-gray-600 hover:bg-white/80'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentView('exam-list')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                currentView === 'exam-list'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white/50 text-gray-600 hover:bg-white/80'
              }`}
            >
              Available Exams
            </button>
          </div>
        )}

        {/* Dashboard View */}
        {currentView === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-4 gap-6">
              <StatCard
                icon={BookOpen}
                value={exams.length}
                label="Total Exams"
                color="bg-gradient-to-br from-blue-500 to-blue-600"
              />
              <StatCard
                icon={Clock}
                value={exams.filter(e => e.status === 'active').length}
                label="Available Now"
                color="bg-gradient-to-br from-green-500 to-emerald-500"
              />
              <StatCard
                icon={CheckCircle2}
                value={exams.filter(e => e.status === 'completed').length}
                label="Completed"
                color="bg-gradient-to-br from-purple-500 to-pink-500"
              />
              <StatCard
                icon={Trophy}
                value="85%"
                label="Average Score"
                color="bg-gradient-to-br from-amber-500 to-orange-500"
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Exams</h2>
              <div className="grid grid-cols-2 gap-6">
                {exams.filter(e => e.status === 'active').map(exam => (
                  <ExamCard key={exam.id} exam={exam} />
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Exams</h2>
              <div className="grid grid-cols-2 gap-6">
                {exams.filter(e => e.status === 'upcoming').slice(0, 2).map(exam => (
                  <ExamCard key={exam.id} exam={exam} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Exam List View */}
        {currentView === 'exam-list' && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">All Available Exams</h2>
            <div className="grid grid-cols-2 gap-6">
              {exams.map(exam => (
                <ExamCard key={exam.id} exam={exam} />
              ))}
            </div>
          </div>
        )}

        {/* Exam Details View */}
        {currentView === 'exam-details' && selectedExam && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setCurrentView('exam-list')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold text-gray-900">{selectedExam.title}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(selectedExam.status)}`}>
                {selectedExam.status.charAt(0).toUpperCase() + selectedExam.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Exam Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-gray-500 mt-1" />
                    <div>
                      <div className="font-medium">Description</div>
                      <div className="text-gray-600 text-sm">{selectedExam.description}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="font-medium">Duration</div>
                      <div className="text-gray-600 text-sm">{selectedExam.duration} minutes</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="font-medium">Passing Score</div>
                      <div className="text-gray-600 text-sm">{selectedExam.passingScore}%</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="font-medium">Max Attempts</div>
                      <div className="text-gray-600 text-sm">{selectedExam.maxAttempts}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Exam Schedule</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="font-medium">Start Date</div>
                      <div className="text-gray-600 text-sm">
                        {new Date(selectedExam.startDate).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="font-medium">End Date</div>
                      <div className="text-gray-600 text-sm">
                        {new Date(selectedExam.endDate).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                {selectedExam.status === 'active' && (
                  <div className="mt-8">
                    <button
                      onClick={() => startExam(selectedExam)}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <Play className="w-5 h-5" />
                      Start Exam
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Taking Exam View */}
        {currentView === 'taking-exam' && selectedExam && examQuestions.length > 0 && (
          <div className="space-y-6">
            {/* Exam Header */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedExam.title}</h2>
                  <p className="text-gray-600">Question {currentQuestionIndex + 1} of {examQuestions.length}</p>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${timeRemaining < 300 ? 'text-red-600' : 'text-indigo-600'}`}>
                    <Timer className="w-6 h-6 inline mr-2" />
                    {formatTime(timeRemaining)}
                  </div>
                  <p className="text-gray-600 text-sm">Time Remaining</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-6">
              {/* Question Navigation */}
              <div className="col-span-1">
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 sticky top-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Question Navigator</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {examQuestions.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToQuestion(index)}
                        className={`w-8 h-8 rounded-lg text-sm font-semibold transition-all duration-200 ${
                          index === currentQuestionIndex
                            ? 'bg-indigo-600 text-white'
                            : userAnswers[examQuestions[index].id] !== undefined
                            ? 'bg-green-100 text-green-600 border border-green-300'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Answered:</span>
                        <span className="font-semibold text-green-600">
                          {Object.keys(userAnswers).length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Remaining:</span>
                        <span className="font-semibold text-orange-600">
                          {examQuestions.length - Object.keys(userAnswers).length}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmitExam}
                    className="w-full mt-6 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Flag className="w-4 h-4" />
                    Submit Exam
                  </button>
                </div>
              </div>

              {/* Question Content */}
              <div className="col-span-3">
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Question {currentQuestionIndex + 1}
                      </span>
                      <span className="text-sm text-gray-500">
                        {examQuestions[currentQuestionIndex].points} point(s)
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 leading-relaxed">
                      {examQuestions[currentQuestionIndex].question}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {examQuestions[currentQuestionIndex].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(examQuestions[currentQuestionIndex].id, index)}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                          userAnswers[examQuestions[currentQuestionIndex].id] === index
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                            : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            userAnswers[examQuestions[currentQuestionIndex].id] === index
                              ? 'border-indigo-600 bg-indigo-600'
                              : 'border-gray-300'
                          }`}>
                            {userAnswers[examQuestions[currentQuestionIndex].id] === index && (
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                          <span className="flex-1">{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                    <button
                      onClick={previousQuestion}
                      disabled={currentQuestionIndex === 0}
                      className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Previous
                    </button>

                    <span className="text-gray-500 text-sm">
                      {currentQuestionIndex + 1} of {examQuestions.length}
                    </span>

                    <button
                      onClick={nextQuestion}
                      disabled={currentQuestionIndex === examQuestions.length - 1}
                      className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results View */}
        {currentView === 'results' && examResults && selectedExam && (
          <div className="space-y-8">
            {/* Results Header */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20 text-center">
              <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
                examResults.passed ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {examResults.passed ? (
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                ) : (
                  <AlertCircle className="w-10 h-10 text-red-600" />
                )}
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {examResults.passed ? 'Congratulations!' : 'Keep Learning!'}
              </h2>
              <p className="text-gray-600 mb-6">
                {examResults.passed 
                  ? `You have successfully passed the ${selectedExam.title} exam.`
                  : `You need to study more to pass the ${selectedExam.title} exam.`
                }
              </p>

              <div className="inline-flex items-center gap-4 bg-gray-50 rounded-xl px-6 py-3">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${examResults.passed ? 'text-green-600' : 'text-red-600'}`}>
                    {examResults.score}%
                  </div>
                  <div className="text-sm text-gray-500">Your Score</div>
                </div>
                <div className="w-px h-12 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">
                    {selectedExam.passingScore}%
                  </div>
                  <div className="text-sm text-gray-500">Passing Score</div>
                </div>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="grid grid-cols-2 gap-8">
              {/* Score Breakdown */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Score Breakdown</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl">
                    <span className="font-medium text-blue-900">Correct Answers</span>
                    <span className="text-xl font-bold text-blue-600">
                      {calculateResults().correctAnswers} / {calculateResults().totalQuestions}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl">
                    <span className="font-medium text-green-900">Points Earned</span>
                    <span className="text-xl font-bold text-green-600">
                      {calculateResults().earnedPoints} / {calculateResults().totalPoints}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-purple-50 rounded-xl">
                    <span className="font-medium text-purple-900">Time Taken</span>
                    <span className="text-xl font-bold text-purple-600">
                      {formatTime(examResults.timeSpent)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-amber-50 rounded-xl">
                    <span className="font-medium text-amber-900">Completion Date</span>
                    <span className="text-lg font-bold text-amber-600">
                      {new Date(examResults.submittedAt!).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Performance Analysis */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Performance Analysis</h3>
                
                <div className="space-y-4">
                  {['easy', 'medium', 'hard'].map(difficulty => {
                    const difficultyQuestions = examQuestions.filter(q => q.difficulty === difficulty);
                    const correctCount = difficultyQuestions.filter(q => 
                      userAnswers[q.id] === q.correctAnswer
                    ).length;
                    const percentage = difficultyQuestions.length > 0 
                      ? Math.round((correctCount / difficultyQuestions.length) * 100) 
                      : 0;
                    
                    const colors = {
                      easy: 'bg-green-500',
                      medium: 'bg-yellow-500',
                      hard: 'bg-red-500'
                    };

                    return (
                      <div key={difficulty}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-700 capitalize">{difficulty} Questions</span>
                          <span className="text-sm text-gray-500">
                            {correctCount}/{difficultyQuestions.length} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full ${colors[difficulty as keyof typeof colors]} transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Recommendations</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    {calculateResults().score >= 90 && (
                      <p className="text-green-600">🎉 Excellent performance! You have mastered this topic.</p>
                    )}
                    {calculateResults().score >= 70 && calculateResults().score < 90 && (
                      <p className="text-blue-600">👍 Good job! Review the topics you missed for improvement.</p>
                    )}
                    {calculateResults().score >= 50 && calculateResults().score < 70 && (
                      <p className="text-amber-600">📚 Consider reviewing the study materials and practice more.</p>
                    )}
                    {calculateResults().score < 50 && (
                      <p className="text-red-600">📖 Focus on fundamental concepts and take additional practice tests.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Question Review */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Question Review</h3>
              
              <div className="space-y-6">
                {examQuestions.map((question, index) => {
                  const userAnswer = userAnswers[question.id];
                  const isCorrect = userAnswer === question.correctAnswer;
                  
                  return (
                    <div key={question.id} className={`border-2 rounded-xl p-6 ${
                      isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            isCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                          }`}>
                            {index + 1}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {isCorrect ? 'Correct' : 'Incorrect'}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">{question.points} point(s)</span>
                      </div>
                      
                      <h4 className="font-semibold text-gray-900 mb-4">{question.question}</h4>
                      
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`p-3 rounded-lg border text-sm ${
                              optIndex === question.correctAnswer
                                ? 'border-green-400 bg-green-100 text-green-900'
                                : optIndex === userAnswer && userAnswer !== question.correctAnswer
                                ? 'border-red-400 bg-red-100 text-red-900'
                                : 'border-gray-200 bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{String.fromCharCode(65 + optIndex)}. {option}</span>
                              {optIndex === question.correctAnswer && (
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                              )}
                              {optIndex === userAnswer && userAnswer !== question.correctAnswer && (
                                <AlertCircle className="w-4 h-4 text-red-600" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {question.explanation && (
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                          <p className="text-sm text-blue-900">
                            <strong>Explanation:</strong> {question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setCurrentView('dashboard');
                  setSelectedExam(null);
                  setExamResults(null);
                }}
                className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200"
              >
                Back to Dashboard
              </button>
              
              <button
                onClick={() => {
                  setCurrentView('exam-list');
                  setSelectedExam(null);
                  setExamResults(null);
                }}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
              >
                Take Another Exam
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamUserPortal;