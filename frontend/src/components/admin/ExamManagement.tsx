import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Settings, 
  BarChart3, 
  Clock, 
  Users, 
  FileText, 
  CheckCircle2,
  Edit3,
  Trash2,
  X,
  Save,
  Eye,
  Download,
  Calendar,
  Award
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

const ExamPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [exams, setExams] = useState<Exam[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [currentExamId, setCurrentExamId] = useState<number | null>(null);

  // Initialize with sample data
  useEffect(() => {
    const sampleExams: Exam[] = [
      {
        id: 1,
        title: "JavaScript Fundamentals",
        description: "Test your knowledge of JavaScript basics including variables, functions, and control structures.",
        duration: 60,
        category: "programming",
        startDate: "2025-01-15T09:00",
        endDate: "2025-01-15T23:59",
        passingScore: 60,
        maxAttempts: 1,
        status: "upcoming",
        questions: 30
      },
      {
        id: 2,
        title: "React Development",
        description: "Comprehensive test covering React hooks, components, and state management.",
        duration: 90,
        category: "web-development",
        startDate: "2025-01-10T10:00",
        endDate: "2025-01-10T23:59",
        passingScore: 70,
        maxAttempts: 1,
        status: "completed",
        questions: 45
      }
    ];

    const sampleQuestions: Question[] = [
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
      }
    ];

    setExams(sampleExams);
    setQuestions(sampleQuestions);
  }, []);

  const [examForm, setExamForm] = useState({
    title: '',
    description: '',
    duration: 60,
    category: '',
    startDate: '',
    endDate: '',
    passingScore: 60,
    maxAttempts: 1
  });

  const [questionForm, setQuestionForm] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    points: 1
  });

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    const newExam: Exam = {
      id: Date.now(),
      ...examForm,
      status: 'upcoming',
      questions: 0
    };
    setExams([...exams, newExam]);
    setExamForm({
      title: '',
      description: '',
      duration: 60,
      category: '',
      startDate: '',
      endDate: '',
      passingScore: 60,
      maxAttempts: 1
    });
    setCurrentExamId(newExam.id);
    setShowQuestionModal(true);
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const newQuestion: Question = {
      id: editingQuestion?.id || Date.now(),
      examId: currentExamId || 1,
      ...questionForm
    };

    if (editingQuestion) {
      setQuestions(questions.map(q => q.id === editingQuestion.id ? newQuestion : q));
    } else {
      setQuestions([...questions, newQuestion]);
      // Update exam questions count
      setExams(exams.map(exam => 
        exam.id === newQuestion.examId 
          ? { ...exam, questions: questions.filter(q => q.examId === exam.id).length + 1 }
          : exam
      ));
    }

    setShowQuestionModal(false);
    setEditingQuestion(null);
    setQuestionForm({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      difficulty: 'medium',
      points: 1
    });
  };

  const openQuestionModal = (examId?: number, question?: Question) => {
    if (question) {
      setEditingQuestion(question);
      setQuestionForm({
        question: question.question,
        options: [...question.options],
        correctAnswer: question.correctAnswer,
        explanation: question.explanation || '',
        difficulty: question.difficulty,
        points: question.points
      });
      setCurrentExamId(question.examId);
    } else {
      setEditingQuestion(null);
      setCurrentExamId(examId || null);
      setQuestionForm({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
        difficulty: 'medium',
        points: 1
      });
    }
    setShowQuestionModal(true);
  };

  const deleteExam = (examId: number) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      setExams(exams.filter(e => e.id !== examId));
      setQuestions(questions.filter(q => q.examId !== examId));
    }
  };

  const deleteQuestion = (questionId: number) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      const question = questions.find(q => q.id === questionId);
      setQuestions(questions.filter(q => q.id !== questionId));
      if (question) {
        setExams(exams.map(exam => 
          exam.id === question.examId 
            ? { ...exam, questions: Math.max(0, exam.questions - 1) }
            : exam
        ));
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const StatCard = ({ icon: Icon, value, label, gradient }: any) => (
    <div className={`${gradient} p-6 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-300`}>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-3xl font-bold mb-1">{value}</div>
          <div className="text-sm opacity-90">{label}</div>
        </div>
        <Icon className="w-8 h-8 opacity-80" />
      </div>
    </div>
  );

  const ExamCard = ({ exam }: { exam: Exam }) => (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-200">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-900">{exam.title}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(exam.status)}`}>
          {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4 text-sm">{exam.description}</p>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          {exam.duration} mins
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FileText className="w-4 h-4" />
          {exam.questions} questions
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Award className="w-4 h-4" />
          {exam.passingScore}% passing
        </div>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={() => openQuestionModal(exam.id)}
          className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium"
        >
          Add Questions
        </button>
        <button
          onClick={() => deleteExam(exam.id)}
          className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const QuestionCard = ({ question }: { question: Question }) => {
    const exam = exams.find(e => e.id === question.examId);
    return (
      <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Q{question.id}
            </span>
            <span className="text-sm text-gray-500">{exam?.title || 'Unknown Exam'}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => openQuestionModal(undefined, question)}
              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => deleteQuestion(question.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <h4 className="font-semibold text-gray-900 mb-4">{question.question}</h4>
        
        <div className="space-y-2 mb-4">
          {question.options.map((option, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border-2 transition-colors duration-200 ${
                index === question.correctAnswer
                  ? 'border-green-200 bg-green-50 text-green-900'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                <span>{option}</span>
                {index === question.correctAnswer && <CheckCircle2 className="w-4 h-4 text-green-600" />}
              </div>
            </div>
          ))}
        </div>
        
        {question.explanation && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-lg mb-4">
            <p className="text-sm text-blue-900">
              <strong>Explanation:</strong> {question.explanation}
            </p>
          </div>
        )}
        
        <div className="flex justify-between items-center text-sm">
          <div className="flex gap-4">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(question.difficulty)}`}>
              {question.difficulty}
            </span>
            <span className="text-gray-500">Points: {question.points}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 mb-8 shadow-xl border border-white/20">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-2xl">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                EduPortal - Exam Management
              </h1>
              <p className="text-gray-600">Create and manage examinations with multiple choice questions</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="col-span-3">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Navigation</h3>
              <nav className="space-y-2">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                  { id: 'create-exam', label: 'Create Exam', icon: Plus },
                  { id: 'manage-exams', label: 'Manage Exams', icon: Settings },
                  { id: 'question-bank', label: 'Question Bank', icon: FileText },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeTab === id
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transform translate-x-1'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-indigo-600 hover:translate-x-1'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20 min-h-[600px]">
              {/* Dashboard */}
              {activeTab === 'dashboard' && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
                  
                  <div className="grid grid-cols-4 gap-6">
                    <StatCard
                      icon={BookOpen}
                      value={exams.length}
                      label="Total Exams"
                      gradient="bg-gradient-to-br from-blue-500 to-blue-600"
                    />
                    <StatCard
                      icon={Clock}
                      value={exams.filter(e => e.status === 'upcoming').length}
                      label="Upcoming Exams"
                      gradient="bg-gradient-to-br from-amber-500 to-orange-500"
                    />
                    <StatCard
                      icon={FileText}
                      value={questions.length}
                      label="Total Questions"
                      gradient="bg-gradient-to-br from-green-500 to-emerald-500"
                    />
                    <StatCard
                      icon={Users}
                      value="150"
                      label="Total Students"
                      gradient="bg-gradient-to-br from-purple-500 to-pink-500"
                    />
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Exams</h3>
                    <div className="grid grid-cols-2 gap-6">
                      {exams.slice(0, 4).map(exam => (
                        <ExamCard key={exam.id} exam={exam} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Create Exam */}
              {activeTab === 'create-exam' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Create New Exam</h2>
                  
                  <form onSubmit={handleCreateExam} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Exam Title
                      </label>
                      <input
                        type="text"
                        value={examForm.title}
                        onChange={(e) => setExamForm({...examForm, title: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter exam title"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={examForm.description}
                        onChange={(e) => setExamForm({...examForm, description: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        rows={3}
                        placeholder="Brief description of the exam"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Duration (minutes)
                        </label>
                        <input
                          type="number"
                          value={examForm.duration}
                          onChange={(e) => setExamForm({...examForm, duration: parseInt(e.target.value)})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                          min="1"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Category
                        </label>
                        <select
                          value={examForm.category}
                          onChange={(e) => setExamForm({...examForm, category: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                          required
                        >
                          <option value="">Select Category</option>
                          <option value="programming">Programming</option>
                          <option value="web-development">Web Development</option>
                          <option value="database">Database</option>
                          <option value="general">General Knowledge</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Start Date
                        </label>
                        <input
                          type="datetime-local"
                          value={examForm.startDate}
                          onChange={(e) => setExamForm({...examForm, startDate: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          End Date
                        </label>
                        <input
                          type="datetime-local"
                          value={examForm.endDate}
                          onChange={(e) => setExamForm({...examForm, endDate: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Passing Score (%)
                        </label>
                        <input
                          type="number"
                          value={examForm.passingScore}
                          onChange={(e) => setExamForm({...examForm, passingScore: parseInt(e.target.value)})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                          min="0"
                          max="100"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Max Attempts
                        </label>
                        <input
                          type="number"
                          value={examForm.maxAttempts}
                          onChange={(e) => setExamForm({...examForm, maxAttempts: parseInt(e.target.value)})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                          min="1"
                          required
                        />
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
                    >
                      Create Exam & Add Questions
                    </button>
                  </form>
                </div>
              )}

              {/* Manage Exams */}
              {activeTab === 'manage-exams' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">Manage Exams</h2>
                    <button
                      onClick={() => setActiveTab('create-exam')}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      Create New Exam
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    {exams.map(exam => (
                      <ExamCard key={exam.id} exam={exam} />
                    ))}
                  </div>
                  
                  {exams.length === 0 && (
                    <div className="text-center py-12">
                      <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No exams created yet. Create your first exam!</p>
                    </div>
                  )}
                </div>
              )}

              {/* Question Bank */}
              {activeTab === 'question-bank' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">Question Bank</h2>
                    <button
                      onClick={() => openQuestionModal()}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      Add New Question
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {questions.map(question => (
                      <QuestionCard key={question.id} question={question} />
                    ))}
                  </div>
                  
                  {questions.length === 0 && (
                    <div className="text-center py-12">
                      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No questions added yet. Add your first question!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Question Modal */}
      {showQuestionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingQuestion ? 'Edit Question' : 'Add New Question'}
                </h3>
                <button
                  onClick={() => setShowQuestionModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleCreateQuestion} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Question
                </label>
                <textarea
                  value={questionForm.question}
                  onChange={(e) => setQuestionForm({...questionForm, question: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  rows={3}
                  placeholder="Enter your question here..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Options
                </label>
                <div className="space-y-3">
                  {questionForm.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="correctAnswer"
                        value={index}
                        checked={questionForm.correctAnswer === index}
                        onChange={(e) => setQuestionForm({...questionForm, correctAnswer: index})}
                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...questionForm.options];
                          newOptions[index] = e.target.value;
                          setQuestionForm({...questionForm, options: newOptions});
                        }}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        placeholder={`Option ${String.fromCharCode(65 + index)}`}
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Explanation (Optional)
                </label>
                <textarea
                  value={questionForm.explanation}
                  onChange={(e) => setQuestionForm({...questionForm, explanation: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  rows={2}
                  placeholder="Explain why this is the correct answer..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={questionForm.difficulty}
                    onChange={(e) => setQuestionForm({...questionForm, difficulty: e.target.value as 'easy' | 'medium' | 'hard'})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Points
                  </label>
                  <input
                    type="number"
                    value={questionForm.points}
                    onChange={(e) => setQuestionForm({...questionForm, points: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    min="1"
                    required
                  />
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowQuestionModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
                >
                  {editingQuestion ? 'Update Question' : 'Save Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamPortal;