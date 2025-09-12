import React, { useState } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import Header from '../components/Header';
import AdminDashboard from '../components/admin/AdminDashboard';
import ExamManagement from '../components/admin/ExamManagement';
import UserManagement from '../components/admin/UserManagement';
import Reports from '../components/admin/Reports';
import Settings from '../components/Settings';

type AdminSection = 'dashboard' | 'exams' | 'users' | 'reports' | 'settings';

const AdminPortal: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<AdminSection>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (currentSection) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'exams':
        return <ExamManagement />;
      case 'users':
        return <UserManagement />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <div className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 fixed lg:relative inset-y-0 left-0 z-50 w-64 transition-transform duration-300 ease-in-out lg:transition-none`}>
        <AdminSidebar
          currentSection={currentSection}
          onSectionChange={setCurrentSection}
        />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPortal;