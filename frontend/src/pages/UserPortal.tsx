import React, { useState } from 'react';
import Sidebar from '../components/user/UserSidebar';
import Header from '../components/Header';
import Dashboard from '../components/Dashboard';
import MyExams from '../components/MyExams';
import Results from '../components/Results';
import Certificates from '../components/Certificates';
import Settings from '../components/Settings';
import { SidebarSection } from '../types';
import { mockExams, mockResults, mockCertificates } from '../data/mockData';

const UserPortal: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<SidebarSection>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (currentSection) {
      case 'overview':
        return <Dashboard exams={mockExams} results={mockResults} />;
      case 'exams':
        return <MyExams exams={mockExams} />;
      case 'results':
        return <Results results={mockResults} />;
      case 'certificates':
        return <Certificates certificates={mockCertificates} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard exams={mockExams} results={mockResults} />;
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <div className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 fixed lg:relative inset-y-0 left-0 z-50 w-64 transition-transform duration-300 ease-in-out lg:transition-none`}>
        <Sidebar
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

export default UserPortal;