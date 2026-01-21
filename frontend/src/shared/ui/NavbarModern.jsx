import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from './Icons';
import { useAuth0 } from '@auth0/auth0-react';
import { site } from '../../config/site';
import { 
  FiSun, 
  FiMoon, 
  FiMenu, 
  FiUser, 
  FiSettings, 
  FiLogOut,
  FiChevronDown,
  FiBell,
  FiSearch
} from 'react-icons/fi';
import { useScrollPosition } from '../../hooks/useScrollPosition';
import { Dropdown } from '../../components/ui/AdvancedComponents';
import { Avatar } from '../../components/ui/UIComponents';

const Navbar = ({ onLogout, isAuthenticated, isDark, onToggleTheme, sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const { user } = useAuth0();
  const { scrollPosition, scrollDirection } = useScrollPosition();

  // Hide navbar on scroll down, show on scroll up
  const isVisible = scrollDirection === 'up' || scrollPosition < 50;

  const isAdmin = useMemo(() => {
    const roles = user?.['https://fitness-app/roles'] || 
                  user?.['fitness_auth/roles'] || 
                  user?.roles || 
                  user?.['https://fitness.app/roles'] || 
                  [];
    return Array.isArray(roles) && (roles.includes('ADMIN') || roles.includes('admin'));
  }, [user]);
  
  const initials = useMemo(() => {
    const n = user?.name || user?.nickname || '';
    if (!n) return 'U';
    const parts = n.split(' ').filter(Boolean);
    const first = parts[0]?.[0] || '';
    const last = parts[1]?.[0] || '';
    return (first + last || first).toUpperCase();
  }, [user]);

  const userMenuItems = [
    {
      icon: <FiUser />,
      label: 'Profile',
      onClick: () => navigate('/profile')
    },
    {
      icon: <FiSettings />,
      label: 'Settings',
      onClick: () => navigate('/settings')
    },
    { divider: true },
    {
      icon: <FiLogOut />,
      label: 'Logout',
      danger: true,
      onClick: onLogout
    }
  ];

  return (
    <header 
      className={`
        fixed top-0 left-0 right-0 z-50 
        backdrop-blur-xl border-b border-neutral-200/50 dark:border-neutral-800/50
        bg-white/80 dark:bg-neutral-900/80
        transition-transform duration-300
        ${isVisible ? 'translate-y-0' : '-translate-y-full'}
      `}
    >
      <div className="app-container">
        <div className="h-16 flex items-center justify-between">
          {/* Left - Logo and Brand */}
          <div className="flex items-center gap-3">
            {/* Menu Button - Mobile */}
            {isAuthenticated && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Toggle menu"
              >
                <FiMenu className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
              </button>
            )}

            {/* Logo */}
            <div 
              className="flex items-center gap-2 cursor-pointer group" 
              onClick={() => navigate('/')}
            >
              <Logo className="w-9 h-9 group-hover:scale-110 transition-transform duration-200" />
              <div className="hidden sm:block">
                <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  {site.name}
                </span>
              </div>
            </div>
          </div>

          {/* Center - Search (Desktop) */}
          {isAuthenticated && (
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search activities, goals..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
              </div>
            </div>
          )}

          {/* Right - Actions */}
          <div className="flex items-center gap-2">
            {/* Search Icon - Mobile */}
            {isAuthenticated && (
              <button
                className="md:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Search"
              >
                <FiSearch className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
              </button>
            )}

            {/* Notifications */}
            {isAuthenticated && (
              <button
                className="relative p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Notifications"
              >
                <FiBell className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"></span>
              </button>
            )}

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <FiSun className="w-5 h-5 text-yellow-500" />
              ) : (
                <FiMoon className="w-5 h-5 text-neutral-700" />
              )}
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <Dropdown
                trigger={
                  <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                    <Avatar 
                      src={user?.picture}
                      fallback={initials}
                      size="sm"
                      status="online"
                    />
                    <FiChevronDown className="w-4 h-4 text-neutral-700 dark:text-neutral-300 hidden sm:block" />
                  </button>
                }
                items={userMenuItems}
                position="bottom-right"
              />
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Admin Badge */}
      {isAdmin && (
        <div className="absolute bottom-0 right-4 transform translate-y-1/2">
          <span className="px-2 py-0.5 bg-accent-500 text-white text-xs font-semibold rounded-full shadow-lg">
            Admin
          </span>
        </div>
      )}
    </header>
  );
};

export default Navbar;
