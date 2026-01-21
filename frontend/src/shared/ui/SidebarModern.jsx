import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiActivity, 
  FiTrendingUp, 
  FiUser, 
  FiTarget,
  FiAward,
  FiSettings,
  FiHelpCircle,
  FiX,
  FiUsers
} from 'react-icons/fi';

const Sidebar = ({ isOpen, onClose, isAdmin }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const mainNavItems = [
    { icon: <FiHome />, label: 'Dashboard', path: '/dashboard' },
    { icon: <FiActivity />, label: 'Activities', path: '/activities' },
    { icon: <FiTrendingUp />, label: 'Progress', path: '/progress' },
    { icon: <FiTarget />, label: 'Goals', path: '/goals' },
    { icon: <FiAward />, label: 'Achievements', path: '/achievements' }
  ];

  const adminNavItems = [
    { icon: <FiUsers />, label: 'Users', path: '/admin/users' },
    { icon: <FiTrendingUp />, label: 'Analytics', path: '/admin/analytics' }
  ];

  const bottomNavItems = [
    { icon: <FiUser />, label: 'Profile', path: '/profile' },
    { icon: <FiSettings />, label: 'Settings', path: '/settings' },
    { icon: <FiHelpCircle />, label: 'Help', path: '/help' }
  ];

  const handleNavigate = (path) => {
    navigate(path);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 bottom-0 z-40
          w-72 bg-white dark:bg-neutral-900 
          border-r border-neutral-200 dark:border-neutral-800
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full p-4">
          {/* Close button - mobile */}
          <button
            onClick={onClose}
            className="lg:hidden self-end mb-4 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>

          {/* Main Navigation */}
          <nav className="flex-1 space-y-1">
            <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider px-3 mb-3">
              Main Menu
            </div>
            {mainNavItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                  font-medium text-sm transition-all duration-200
                  ${isActive(item.path)
                    ? 'bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }
                `}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
                {isActive(item.path) && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-600"></span>
                )}
              </button>
            ))}

            {/* Admin Section */}
            {isAdmin && (
              <>
                <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider px-3 mt-6 mb-3">
                  Admin
                </div>
                {adminNavItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavigate(item.path)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                      font-medium text-sm transition-all duration-200
                      ${isActive(item.path)
                        ? 'bg-accent-50 dark:bg-accent-950 text-accent-600 dark:text-accent-400 shadow-sm'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      }
                    `}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                    {isActive(item.path) && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-600"></span>
                    )}
                  </button>
                ))}
              </>
            )}
          </nav>

          {/* Bottom Navigation */}
          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 space-y-1">
            <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider px-3 mb-3">
              Account
            </div>
            {bottomNavItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                  font-medium text-sm transition-all duration-200
                  ${isActive(item.path)
                    ? 'bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }
                `}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
