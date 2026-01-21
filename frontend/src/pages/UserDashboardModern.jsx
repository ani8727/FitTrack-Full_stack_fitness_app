import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { 
  FiActivity, 
  FiTrendingUp, 
  FiAward, 
  FiTarget, 
  FiCalendar,
  FiClock,
  FiZap,
  FiPlus,
  FiArrowRight,
  FiBarChart2,
  FiFire
} from 'react-icons/fi';
import { Card, Button, Badge, Progress, Avatar } from '../components/ui/UIComponents';
import { Tabs } from '../components/ui/AdvancedComponents';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const AnimatedCard = ({ children, delay = 0 }) => {
  const { ref, hasIntersected } = useIntersectionObserver();
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ${
        hasIntersected 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const UserDashboardModern = () => {
  const { user } = useAuth0();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { 
      label: 'Total Activities', 
      value: '247', 
      change: '+12%',
      icon: FiActivity, 
      color: 'primary',
      trend: 'up'
    },
    { 
      label: 'Calories Burned', 
      value: '45,320', 
      change: '+8%',
      icon: FiFire, 
      color: 'danger',
      trend: 'up'
    },
    { 
      label: 'Achievements', 
      value: '28', 
      change: '+3',
      icon: FiAward, 
      color: 'warning',
      trend: 'up'
    },
    { 
      label: 'Active Days', 
      value: '156', 
      change: '89%',
      icon: FiTarget, 
      color: 'success',
      trend: 'up'
    },
  ];

  const recentActivities = [
    { 
      id: 1,
      name: 'Morning Run', 
      duration: '45 min', 
      calories: 420, 
      date: '2 hours ago',
      type: 'running',
      intensity: 'high'
    },
    { 
      id: 2,
      name: 'Yoga Session', 
      duration: '30 min', 
      calories: 180, 
      date: 'Yesterday',
      type: 'yoga',
      intensity: 'medium'
    },
    { 
      id: 3,
      name: 'Cycling', 
      duration: '1 hr', 
      calories: 550, 
      date: '2 days ago',
      type: 'cycling',
      intensity: 'high'
    },
    { 
      id: 4,
      name: 'Strength Training', 
      duration: '50 min', 
      calories: 320, 
      date: '3 days ago',
      type: 'strength',
      intensity: 'high'
    },
  ];

  const goals = [
    { 
      name: 'Weekly Running', 
      current: 18, 
      target: 25, 
      unit: 'km',
      color: 'primary',
      icon: <FiActivity />
    },
    { 
      name: 'Daily Calories', 
      current: 1850, 
      target: 2000, 
      unit: 'kcal',
      color: 'danger',
      icon: <FiFire />
    },
    { 
      name: 'Weekly Workouts', 
      current: 4, 
      target: 5, 
      unit: 'sessions',
      color: 'success',
      icon: <FiTarget />
    }
  ];

  const achievements = [
    { title: '30 Day Streak', icon: '🔥', color: 'danger', unlocked: true },
    { title: 'Marathon Master', icon: '🏃', color: 'primary', unlocked: true },
    { title: 'Early Bird', icon: '🌅', color: 'warning', unlocked: true },
    { title: '100 Workouts', icon: '💪', color: 'success', unlocked: false },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FiBarChart2 /> },
    { id: 'activities', label: 'Activities', icon: <FiActivity /> },
    { id: 'goals', label: 'Goals', icon: <FiTarget /> }
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Avatar 
                src={user?.picture}
                fallback={user?.name?.[0] || 'U'}
                size="xl"
                className="ring-4 ring-white/20"
              />
              <div>
                <h1 className="text-3xl font-bold">Welcome back, {user?.name?.split(' ')[0] || 'User'}!</h1>
                <p className="text-white/80 mt-1">You're crushing your fitness goals 🚀</p>
              </div>
            </div>
            <Button 
              variant="primary" 
              size="lg"
              icon={<FiPlus />}
              onClick={() => navigate('/activities/new')}
              className="bg-white text-primary-600 hover:bg-neutral-100"
            >
              Log Activity
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <AnimatedCard key={index} delay={index * 100}>
                <Card variant="glass" className="p-4 backdrop-blur-xl bg-white/10 border-white/20">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-lg bg-white/20`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <Badge variant="success" size="sm" className="bg-white/20 text-white border-0">
                      {stat.change}
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-sm text-white/80">{stat.label}</p>
                </Card>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <Tabs 
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
            variant="pills"
          />
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Today's Progress */}
              <AnimatedCard>
                <Card variant="elevated" className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                      Today's Progress
                    </h2>
                    <Button variant="ghost" size="sm" icon={<FiArrowRight />} iconPosition="right">
                      View Details
                    </Button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <FiFire className="w-5 h-5 text-danger-600" />
                          <span className="font-medium">Calories Burned</span>
                        </div>
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">820 / 2,000 kcal</span>
                      </div>
                      <Progress value={820} max={2000} variant="danger" size="md" />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <FiActivity className="w-5 h-5 text-primary-600" />
                          <span className="font-medium">Steps</span>
                        </div>
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">7,834 / 10,000</span>
                      </div>
                      <Progress value={7834} max={10000} variant="primary" size="md" />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <FiClock className="w-5 h-5 text-secondary-600" />
                          <span className="font-medium">Active Minutes</span>
                        </div>
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">45 / 60 min</span>
                      </div>
                      <Progress value={45} max={60} variant="success" size="md" />
                    </div>
                  </div>
                </Card>
              </AnimatedCard>

              {/* Recent Activities */}
              <AnimatedCard delay={100}>
                <Card variant="elevated" className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                      Recent Activities
                    </h2>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate('/activities')}
                      icon={<FiArrowRight />} 
                      iconPosition="right"
                    >
                      View All
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {recentActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                        onClick={() => navigate(`/activities/${activity.id}`)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-950 flex items-center justify-center">
                            <FiActivity className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                              {activity.name}
                            </h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                              {activity.date}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                            {activity.calories} cal
                          </p>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            {activity.duration}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </AnimatedCard>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Goals */}
              <AnimatedCard delay={150}>
                <Card variant="elevated" className="p-6">
                  <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
                    Active Goals
                  </h2>
                  <div className="space-y-6">
                    {goals.map((goal, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{goal.icon}</span>
                            <span className="font-medium text-sm">{goal.name}</span>
                          </div>
                        </div>
                        <Progress 
                          value={goal.current} 
                          max={goal.target} 
                          variant={goal.color}
                          size="sm"
                          showLabel
                        />
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                          {goal.current} / {goal.target} {goal.unit}
                        </p>
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    fullWidth 
                    className="mt-6"
                    onClick={() => navigate('/goals')}
                  >
                    Manage Goals
                  </Button>
                </Card>
              </AnimatedCard>

              {/* Achievements */}
              <AnimatedCard delay={200}>
                <Card variant="elevated" className="p-6">
                  <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
                    Recent Achievements
                  </h2>
                  <div className="space-y-3">
                    {achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                          achievement.unlocked
                            ? 'bg-neutral-50 dark:bg-neutral-800'
                            : 'bg-neutral-100 dark:bg-neutral-800/50 opacity-60'
                        }`}
                      >
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <p className="font-medium text-sm text-neutral-900 dark:text-neutral-100">
                            {achievement.title}
                          </p>
                          {achievement.unlocked && (
                            <Badge variant="success" size="sm" className="mt-1">
                              Unlocked
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    fullWidth 
                    className="mt-6"
                    onClick={() => navigate('/achievements')}
                  >
                    View All Achievements
                  </Button>
                </Card>
              </AnimatedCard>
            </div>
          </div>
        )}

        {activeTab === 'activities' && (
          <AnimatedCard>
            <Card variant="elevated" className="p-6">
              <h2 className="text-xl font-semibold mb-4">All Activities</h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                Activity list will be displayed here...
              </p>
            </Card>
          </AnimatedCard>
        )}

        {activeTab === 'goals' && (
          <AnimatedCard>
            <Card variant="elevated" className="p-6">
              <h2 className="text-xl font-semibold mb-4">Goals Management</h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                Goal management interface will be displayed here...
              </p>
            </Card>
          </AnimatedCard>
        )}
      </div>
    </div>
  );
};

export default UserDashboardModern;
