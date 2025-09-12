import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Trophy, 
  Award, 
  Settings, 
  User, 
  LogOut,
  GraduationCap
} from 'lucide-react';
import { SidebarSection } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  currentSection: SidebarSection;
  onSectionChange: (section: SidebarSection) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentSection, 
  onSectionChange
}) => {
  const { user, signOut } = useAuth();

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'exams', label: 'My Exams', icon: FileText },
    { id: 'results', label: 'Results', icon: Trophy },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  if (!user) return null;

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Company Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-900">EduPortal</h1>
            <p className="text-sm text-gray-500">Excellence in Learning</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id as SidebarSection)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
          <img
            src={user.avatar_url || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150'}
            alt={user.full_name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">{user.full_name}</p>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
            <p className="text-xs text-blue-600 font-medium capitalize">{user.role}</p>
          </div>
        </div>
        
        <button
          onClick={signOut}
          className="w-full mt-2 flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;