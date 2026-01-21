import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiActivity, 
  FiTrendingUp, 
  FiAward, 
  FiUsers, 
  FiTarget, 
  FiZap, 
  FiHeart, 
  FiClock, 
  FiSun, 
  FiMoon,
  FiCheck,
  FiArrowRight,
  FiStar,
  FiBarChart2,
  FiBrain
} from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { Logo } from '../shared/ui/Icons';
import { site } from '../config/site';
import { Card, Button, Badge } from '../components/ui/UIComponents';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const AnimatedSection = ({ children, delay = 0 }) => {
  const { ref, hasIntersected } = useIntersectionObserver();
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        hasIntersected 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const HomePageModern = ({ onLogin }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const features = [
    {
      icon: <FiActivity className="w-6 h-6" />,
      title: "Smart Activity Tracking",
      description: "Log workouts effortlessly with AI-powered suggestions and auto-complete features",
      color: "primary"
    },
    {
      icon: <FiTrendingUp className="w-6 h-6" />,
      title: "Visual Progress",
      description: "Beautiful charts and insights that make your fitness journey crystal clear",
      color: "secondary"
    },
    {
      icon: <FiBrain className="w-6 h-6" />,
      title: "AI Recommendations",
      description: "Get personalized workout plans powered by advanced machine learning",
      color: "accent"
    },
    {
      icon: <FiAward className="w-6 h-6" />,
      title: "Achievements System",
      description: "Stay motivated with badges, streaks, and milestone celebrations",
      color: "warning"
    },
    {
      icon: <FiTarget className="w-6 h-6" />,
      title: "Goal Management",
      description: "Set SMART goals and track your progress with precision",
      color: "success"
    },
    {
      icon: <FiZap className="w-6 h-6" />,
      title: "Quick Actions",
      description: "Log activities in seconds with streamlined quick-add shortcuts",
      color: "primary"
    }
  ];

  const stats = [
    { value: "50K+", label: "Active Users", icon: <FiUsers /> },
    { value: "2M+", label: "Activities Logged", icon: <FiActivity /> },
    { value: "100M+", label: "Calories Burned", icon: <FiHeart /> },
    { value: "4.9★", label: "User Rating", icon: <FiStar /> }
  ];

  const benefits = [
    "Unlimited activity tracking",
    "AI-powered recommendations",
    "Advanced analytics dashboard",
    "Goal setting & tracking",
    "Achievement system",
    "Export your data anytime"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-1/4 top-0 w-1/2 h-1/2 bg-primary-500/5 dark:bg-primary-500/10 blur-3xl rounded-full animate-float" />
        <div className="absolute right-0 top-1/4 w-1/3 h-1/3 bg-secondary-500/5 dark:bg-secondary-500/10 blur-3xl rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute left-1/3 bottom-0 w-1/3 h-1/3 bg-accent-500/5 dark:bg-accent-500/10 blur-3xl rounded-full animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-neutral-900/80 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('/')}>
              <Logo className="w-9 h-9 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                {site?.name || 'FitTrack'}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <FiSun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <FiMoon className="w-5 h-5 text-neutral-700" />
                )}
              </button>
              <Button variant="primary" onClick={onLogin}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <AnimatedSection>
                <Badge variant="primary" size="lg">
                  <FiZap className="w-4 h-4" />
                  Transform Your Fitness Journey
                </Badge>
              </AnimatedSection>

              <AnimatedSection delay={100}>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Track Smarter,{' '}
                  <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent">
                    Achieve Faster
                  </span>
                </h1>
              </AnimatedSection>

              <AnimatedSection delay={200}>
                <p className="text-xl text-neutral-600 dark:text-neutral-400">
                  The all-in-one fitness platform that combines effortless tracking with AI-powered insights 
                  to help you reach your goals faster than ever.
                </p>
              </AnimatedSection>

              <AnimatedSection delay={300}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={onLogin}
                    icon={<FiArrowRight />}
                    iconPosition="right"
                  >
                    Start Free Today
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    See How It Works
                  </Button>
                </div>
              </AnimatedSection>

              {/* Quick Stats */}
              <AnimatedSection delay={400}>
                <div className="grid grid-cols-3 gap-4 pt-8">
                  <Card variant="glass" className="p-4">
                    <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 mb-2">
                      <FiActivity className="w-5 h-5" />
                    </div>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">18</p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">Day Streak</p>
                  </Card>
                  <Card variant="glass" className="p-4">
                    <div className="flex items-center gap-2 text-secondary-600 dark:text-secondary-400 mb-2">
                      <FiHeart className="w-5 h-5" />
                    </div>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">820</p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">Calories</p>
                  </Card>
                  <Card variant="glass" className="p-4">
                    <div className="flex items-center gap-2 text-accent-600 dark:text-accent-400 mb-2">
                      <FiClock className="w-5 h-5" />
                    </div>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">12h</p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">Saved/mo</p>
                  </Card>
                </div>
              </AnimatedSection>
            </div>

            {/* Right Visual */}
            <AnimatedSection delay={200}>
              <div className="relative">
                <Card variant="elevated" hover glow className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold">Today's Progress</h3>
                      <Badge variant="success" dot>Active</Badge>
                    </div>
                    
                    <div className="space-y-4">
                      {[
                        { label: 'Calories', value: 820, max: 2000, color: 'bg-danger-500' },
                        { label: 'Steps', value: 8420, max: 10000, color: 'bg-primary-500' },
                        { label: 'Active Minutes', value: 45, max: 60, color: 'bg-secondary-500' }
                      ].map((item, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{item.label}</span>
                            <span className="text-neutral-600 dark:text-neutral-400">
                              {item.value}/{item.max}
                            </span>
                          </div>
                          <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                              style={{ width: `${(item.value / item.max) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="text-center p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                        <p className="text-2xl font-bold text-primary-600">12</p>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">Achievements</p>
                      </div>
                      <div className="text-center p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                        <p className="text-2xl font-bold text-secondary-600">87%</p>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">Goal Rate</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-neutral-100 dark:bg-neutral-900/50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <AnimatedSection key={index} delay={index * 100}>
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400 rounded-xl mb-4">
                      {stat.icon}
                    </div>
                    <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                      {stat.value}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {stat.label}
                    </p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <AnimatedSection>
            <div className="text-center mb-16">
              <Badge variant="primary" size="lg" className="mb-4">
                Features
              </Badge>
              <h2 className="text-4xl font-bold mb-4">
                Everything you need to{' '}
                <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  succeed
                </span>
              </h2>
              <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                Powerful features designed to make fitness tracking effortless and effective
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <Card variant="elevated" hover className="p-6 h-full">
                  <div className={`inline-flex p-3 rounded-xl bg-${feature.color}-100 dark:bg-${feature.color}-950 text-${feature.color}-600 dark:text-${feature.color}-400 mb-4`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-neutral-600 dark:text-neutral-400">{feature.description}</p>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-gradient-to-br from-primary-600 to-secondary-600 py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <AnimatedSection>
                <h2 className="text-4xl font-bold text-white mb-6">
                  Start your journey today. Free forever.
                </h2>
                <p className="text-xl text-white/90 mb-8">
                  Join thousands of users who have transformed their fitness journey with FitTrack
                </p>
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-3 text-white">
                      <div className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                        <FiCheck className="w-4 h-4" />
                      </div>
                      <span className="text-lg">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </AnimatedSection>

              <AnimatedSection delay={200}>
                <Card variant="glass" className="p-8 backdrop-blur-xl bg-white/10 border-white/20">
                  <h3 className="text-2xl font-bold text-white mb-6">Ready to get started?</h3>
                  <div className="space-y-4">
                    <Button 
                      variant="primary" 
                      size="lg" 
                      fullWidth
                      onClick={onLogin}
                      className="bg-white text-primary-600 hover:bg-neutral-100"
                    >
                      Create Free Account
                    </Button>
                    <p className="text-center text-sm text-white/80">
                      No credit card required • Free forever • Cancel anytime
                    </p>
                  </div>
                </Card>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-neutral-900 text-neutral-400 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Logo className="w-8 h-8" />
                <span className="text-xl font-bold text-white">{site?.name || 'FitTrack'}</span>
              </div>
              <p className="text-sm">
                © {new Date().getFullYear()} FitTrack. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePageModern;
