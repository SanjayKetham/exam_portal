import React from 'react';
import { Clock, Users, Play, CheckCircle2, AlertCircle } from 'lucide-react';
import { Exam } from '../types';

interface MyExamsProps {
  exams: Exam[];
}

const MyExams: React.FC<MyExamsProps> = ({ exams }) => {
  const getStatusIcon = (status: Exam['status']) => {
    switch (status) {
      case 'upcoming':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case 'in-progress':
        return <Play className="w-5 h-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: Exam['status']) => {
    const badges = {
      upcoming: 'bg-amber-100 text-amber-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800'
    };
    
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getActionButton = (exam: Exam) => {
    switch (exam.status) {
      case 'upcoming':
        return (
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Start Exam
          </button>
        );
      case 'in-progress':
        return (
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
            Continue
          </button>
        );
      case 'completed':
        return (
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
            View Results
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Exams</h1>
        <p className="text-gray-600">Manage and take your scheduled examinations.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {['All', 'Upcoming', 'In Progress', 'Completed'].map((filter) => (
          <button
            key={filter}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              filter === 'All' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Exams Grid */}
      <div className="grid gap-4">
        {exams.map((exam) => (
          <div
            key={exam.id}
            className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  {getStatusIcon(exam.status)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{exam.title}</h3>
                  <p className="text-gray-600 mt-1">{exam.description}</p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusBadge(exam.status)}`}>
                {exam.status.replace('-', ' ')}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{exam.duration} mins</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{exam.totalQuestions} questions</span>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Start:</span> {new Date(exam.startDate).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Category:</span> {exam.category}
              </div>
            </div>

            <div className="flex justify-end">
              {getActionButton(exam)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyExams;