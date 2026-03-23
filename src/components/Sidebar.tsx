import React from 'react';
import {
  Camera,
  LayoutGrid,
  Settings,
  ChevronRight,
  Star,
  Building2,
  Shield,
  Moon,
  Sun,
  Menu,
  X
} from 'lucide-react';
import { useDashboardStore } from '../store/useDashboardStore';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick, children }) => {
  return (
    <div>
      <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          active
            ? 'bg-blue-600 text-white'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        {icon}
        <span className="flex-1 text-left">{label}</span>
        {children && <ChevronRight size={16} className="opacity-50" />}
      </button>
      {children}
    </div>
  );
};

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const isDarkMode = useDashboardStore((state) => state.isDarkMode);
  const toggleDarkMode = useDashboardStore((state) => state.toggleDarkMode);
  const activeSection = useDashboardStore((state) => state.activeSection);
  const setActiveSection = useDashboardStore((state) => state.setActiveSection);

  if (isCollapsed) {
    return (
      <div className="w-16 bg-gray-50 dark:bg-neutral-950 border-r border-gray-200 dark:border-neutral-700 flex flex-col items-center py-4 gap-4">
        <button
          onClick={onToggle}
          className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-lg transition-colors"
        >
          <Menu size={20} />
        </button>
        <div className="flex-1 flex flex-col gap-2 items-center">
          <button
            onClick={() => setActiveSection('cameras')}
            className={`p-2.5 rounded-lg transition-colors ${
              activeSection === 'cameras' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-white'
            }`}
            title="Cameras"
          >
            <Camera size={20} />
          </button>
          <button
            onClick={() => setActiveSection('grids')}
            className={`p-2.5 rounded-lg transition-colors ${
              activeSection === 'grids' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-white'
            }`}
            title="Grids"
          >
            <LayoutGrid size={20} />
          </button>
          <button
            onClick={() => setActiveSection('sites')}
            className={`p-2.5 rounded-lg transition-colors ${
              activeSection === 'sites' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-white'
            }`}
            title="Sites"
          >
            <Building2 size={20} />
          </button>
        </div>
        <button
          onClick={toggleDarkMode}
          className="p-2.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    );
  }

  return (
    <aside className="w-64 bg-gray-50 dark:bg-neutral-950 border-r border-gray-200 dark:border-neutral-700 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-neutral-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="text-blue-600 dark:text-blue-400" size={24} />
          <span className="font-bold text-gray-900 dark:text-gray-50 text-lg">Command</span>
        </div>
        <button
          onClick={onToggle}
          className="p-1.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-lg transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="mb-4 flex flex-col gap-3">
          <p className="px-3 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Video Security
          </p>
          <NavItem
            icon={<Camera size={18} />}
            label="All Cameras"
            active={activeSection === 'cameras'}
            onClick={() => setActiveSection('cameras')}
          />
          <NavItem
            icon={<LayoutGrid size={18} />}
            label="Grids"
            active={activeSection === 'grids'}
            onClick={() => setActiveSection('grids')}
          />
          <NavItem
            icon={<Star size={18} />}
            label="Favorites"
            active={activeSection === 'favorites'}
            onClick={() => setActiveSection('favorites')}
          />
        </div>

        <div className="mb-4 flex flex-col gap-3">
          <p className="px-3 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Organization
          </p>
          <NavItem
            icon={<Building2 size={18} />}
            label="Sites"
            active={activeSection === 'sites'}
            onClick={() => setActiveSection('sites')}
          />
        </div>
      </nav>

      <div className="p-3 border-t border-gray-200 dark:border-neutral-700 space-y-1">
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <NavItem
          icon={<Settings size={18} />}
          label="Settings"
          active={activeSection === 'settings'}
          onClick={() => setActiveSection('settings')}
        />
      </div>
    </aside>
  );
};
