import React from 'react';
import { TrendingUp, Download, Eye } from 'lucide-react';
import { ExamResult } from '../types';

interface ResultsProps {
  results: ExamResult[];
}

const Results: React.FC<ResultsProps> = ({ results }) => {
  const getGradeColor = (grade: string) => {
    const gradeColors: { [key: string]: string } = {
      'A+': 'bg-green-100 text-green-800',
      'A': 'bg-green-100 text-green-800',
      'B': 'bg-blue-100 text-blue-800',
      'C': 'bg-yellow-100 text-yellow-800',
      'D': 'bg-orange-100 text-orange-800',
      'F': 'bg-red-100 text-red-800'
    };
    return gradeColors[grade] || 'bg-gray-100 text-gray-800';
  };

  const averageScore = results.length > 0 
    ? Math.round(results.reduce((sum, result) => sum + result.score, 0) / results.length)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Exam Results</h1>
        <p className="text-gray-600">View your performance and download detailed reports.</p>
      </div>

      {/* Performance Summary */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-lg">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Overall Performance</h2>
            <p className="text-blue-100">Your average score across all completed exams</p>
          </div>
          <div className="ml-auto text-right">
            <div className="text-3xl font-bold">{averageScore}%</div>
            <p className="text-blue-100">Average Score</p>
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Detailed Results</h2>
        </div>

        {results.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No exam results available yet.</p>
            <p className="text-sm text-gray-400 mt-1">Complete an exam to see your results here.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {results.map((result) => (
              <div key={result.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{result.examTitle}</h3>
                    <p className="text-sm text-gray-500">
                      Completed on {new Date(result.completedAt).toLocaleDateString()} at{' '}
                      {new Date(result.completedAt).toLocaleTimeString()}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm text-gray-600">
                        Score: <span className="font-medium">{result.correctAnswers}/{result.totalQuestions}</span>
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(result.grade)}`}>
                        Grade {result.grade}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        result.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {result.passed ? 'Passed' : 'Failed'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right mr-4">
                      <div className="text-2xl font-bold text-gray-900">{result.score}%</div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
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

export default Results;