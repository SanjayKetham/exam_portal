import React from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

const ExamManagement: React.FC = () => {
  const exams = [
    { id: 1, title: 'JavaScript Fundamentals', category: 'Programming', questions: 30, duration: 60, status: 'Active' },
    { id: 2, title: 'React Development', category: 'Web Development', questions: 45, duration: 90, status: 'Active' },
    { id: 3, title: 'Database Design', category: 'Database', questions: 35, duration: 75, status: 'Draft' },
    { id: 4, title: 'CSS Advanced', category: 'Web Development', questions: 25, duration: 45, status: 'Inactive' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Exam Management</h1>
          <p className="text-gray-600">Create, edit, and manage examination content.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
          <Plus className="w-4 h-4" />
          Create New Exam
        </button>
      </div>

      {/* Exams Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Exam Title</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Category</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Questions</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Duration</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {exams.map((exam) => (
                <tr key={exam.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="py-4 px-6">
                    <p className="font-medium text-gray-900">{exam.title}</p>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{exam.category}</td>
                  <td className="py-4 px-6 text-gray-600">{exam.questions}</td>
                  <td className="py-4 px-6 text-gray-600">{exam.duration} min</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      exam.status === 'Active' ? 'bg-green-100 text-green-800' :
                      exam.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {exam.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExamManagement;