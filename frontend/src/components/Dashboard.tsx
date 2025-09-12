import React from 'react';
import { Calendar, Clock, TrendingUp, CheckCircle } from 'lucide-react';
import { Exam, ExamResult } from '../types';

interface DashboardProps {
  exams: Exam[];
  results: ExamResult[];
}

const Dashboard: React.FC<DashboardProps> = ({ exams, results }) => {
  const upcomingExams = exams.filter(exam => exam.status === 'upcoming');
  const completedExams = exams.filter(exam => exam.status === 'completed');
  const averageScore = results.length > 0 
    ? Math.round(results.reduce((sum, result) => sum + result.score, 0) / results.length)
    : 0;

  const stats = [
    {
      title: 'Total Exams',
      value: exams.length,
      icon: Calendar,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'Completed',
      value: completedExams.length,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      title: 'Upcoming',
      value: upcomingExams.length,
      icon: Clock,
      color: 'bg-amber-500',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700'
    },
    {
      title: 'Average Score',
      value: `${averageScore}%`,
      icon: TrendingUp,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's your exam progress at a glance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className={`${stat.bgColor} p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-200`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.textColor} mt-1`}>{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upcoming Exams */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Exams</h2>
        {upcomingExams.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No upcoming exams scheduled.</p>
        ) : (
          <div className="space-y-3">
            {upcomingExams.slice(0, 3).map((exam) => (
              <div
                key={exam.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{exam.title}</h3>
                  <p className="text-sm text-gray-500">{exam.category} • {exam.duration} minutes</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(exam.startDate).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(exam.startDate).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Results */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Results</h2>
        {results.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No results available yet.</p>
        ) : (
          <div className="space-y-3">
            {results.slice(0, 3).map((result) => (
              <div
                key={result.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{result.examTitle}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(result.completedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    result.passed 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {result.score}% ({result.grade})
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;