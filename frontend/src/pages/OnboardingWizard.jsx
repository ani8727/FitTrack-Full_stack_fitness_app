import React, { useState } from 'react'
import { FiCheck, FiUser, FiTarget, FiActivity, FiTrendingUp } from 'react-icons/fi'
import { useAuth0 } from '@auth0/auth0-react'
import { updateUserProfile, completeOnboarding } from '../services/api'
import Toast from '../components/Toast'

const OnboardingWizard = ({ onComplete }) => {
  const { user } = useAuth0()
  const tokenData = user
  const [currentStep, setCurrentStep] = useState(1)
  const [toast, setToast] = useState(null)
  const [formData, setFormData] = useState({
    gender: '',
    age: '',
    height: '',
    weight: '',
    activityLevel: '',
    fitnessGoals: '',
    targetWeeklyWorkouts: 3
  })

  const userId = tokenData?.sub

  const steps = [
    { id: 1, title: 'Basic Info', icon: FiUser },
    { id: 2, title: 'Physical Stats', icon: FiActivity },
    { id: 3, title: 'Fitness Goals', icon: FiTarget },
    { id: 4, title: 'Get Started', icon: FiTrendingUp }
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    try {
      await updateUserProfile(userId, formData)
      await completeOnboarding(userId)
      setToast({ message: 'Welcome to FitTrack! Your profile is ready!', type: 'success' })
      setTimeout(() => {
        onComplete()
      }, 2000)
    } catch (error) {
      console.error('Error completing onboarding:', error)
      setToast({ message: 'Error saving profile', type: 'error' })
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.gender && formData.age
      case 2:
        return formData.height && formData.weight
      case 3:
        return formData.activityLevel && formData.fitnessGoals
      default:
        return true
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative" style={{ background: 'radial-gradient(circle at 10% 12%, rgba(37,99,235,0.10), transparent 30%), radial-gradient(circle at 86% 10%, rgba(249,115,22,0.08), transparent 28%), linear-gradient(140deg, #eef2f8 0%, #f8fbff 55%, #edf2fb 100%)' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-16 top-8 w-64 h-64 bg-primary-500/10 blur-3xl rounded-full" />
        <div className="absolute right-0 top-24 w-72 h-72 bg-secondary-500/10 blur-3xl rounded-full" />
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="max-w-4xl w-full relative">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    currentStep >= step.id
                      ? 'bg-gradient-to-br from-primary-600 to-primary-500 text-white shadow-[0_12px_30px_rgba(37,99,235,0.28)]'
                      : 'bg-white border border-[var(--color-border)] text-[var(--color-text-muted)]'
                  }`}>
                    {currentStep > step.id ? (
                      <FiCheck className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </div>
                  <p className={`text-sm mt-2 ${
                    currentStep >= step.id ? 'text-[var(--color-text)] font-semibold' : 'text-[var(--color-text-muted)]'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 transition-all rounded-full ${
                    currentStep > step.id ? 'bg-primary-500' : 'bg-[var(--color-border)]'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/90 border border-[var(--color-border)] rounded-2xl p-8 shadow-[0_26px_70px_rgba(15,23,42,0.12)] backdrop-blur-sm">
          {currentStep === 1 && (
            <div>
              <h2 className="text-3xl font-bold text-[var(--color-text)] mb-2">Let's get to know you</h2>
              <p className="text-[var(--color-text-muted)] mb-6">Tell us a bit about yourself</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full bg-white border border-[var(--color-border)] rounded-lg px-4 py-3 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                    <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min="13"
                    max="120"
                    className="w-full bg-white border border-[var(--color-border)] rounded-lg px-4 py-3 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your age"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="text-3xl font-bold text-[var(--color-text)] mb-2">Physical stats</h2>
              <p className="text-[var(--color-text-muted)] mb-6">Help us personalize your experience</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    min="50"
                    max="300"
                    step="0.1"
                    className="w-full bg-white border border-[var(--color-border)] rounded-lg px-4 py-3 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="170"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    min="20"
                    max="500"
                    step="0.1"
                    className="w-full bg-white border border-[var(--color-border)] rounded-lg px-4 py-3 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="70"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="text-3xl font-bold text-[var(--color-text)] mb-2">Your fitness journey</h2>
              <p className="text-[var(--color-text-muted)] mb-6">What are your fitness goals?</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Activity Level
                  </label>
                  <select
                    name="activityLevel"
                    value={formData.activityLevel}
                    onChange={handleChange}
                    className="w-full bg-white border border-[var(--color-border)] rounded-lg px-4 py-3 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Activity Level</option>
                    <option value="Sedentary">Sedentary (little or no exercise)</option>
                    <option value="Lightly Active">Lightly Active (1-3 days/week)</option>
                    <option value="Moderately Active">Moderately Active (3-5 days/week)</option>
                    <option value="Very Active">Very Active (6-7 days/week)</option>
                    <option value="Extra Active">Extra Active (physical job + exercise)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Fitness Goals
                  </label>
                  <textarea
                    name="fitnessGoals"
                    value={formData.fitnessGoals}
                    onChange={handleChange}
                    rows="4"
                    className="w-full bg-white border border-[var(--color-border)] rounded-lg px-4 py-3 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    placeholder="e.g., Lose weight, build muscle, improve endurance, get healthier..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Weekly Workout Target
                  </label>
                  <input
                    type="number"
                    name="targetWeeklyWorkouts"
                    value={formData.targetWeeklyWorkouts}
                    onChange={handleChange}
                    min="1"
                    max="14"
                    className="w-full bg-white border border-[var(--color-border)] rounded-lg px-4 py-3 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <p className="text-sm text-[var(--color-text-muted)] mt-1">How many days per week do you want to exercise?</p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-primary-500/12 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiCheck className="w-10 h-10 text-primary-600" />
              </div>
              <h2 className="text-3xl font-bold text-[var(--color-text)] mb-2">You're all set!</h2>
              <p className="text-[var(--color-text-muted)] mb-8">Ready to start your fitness journey?</p>
              
              <div className="bg-white border border-[var(--color-border)] rounded-xl p-6 text-left max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">What's next?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-[var(--color-text)]">
                    <FiActivity className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                    <span>Log your first activity to track progress</span>
                  </li>
                  <li className="flex items-start gap-3 text-[var(--color-text)]">
                    <FiTrendingUp className="w-5 h-5 text-secondary-600 mt-0.5 flex-shrink-0" />
                    <span>Get AI-powered personalized recommendations</span>
                  </li>
                  <li className="flex items-start gap-3 text-[var(--color-text)]">
                    <FiTarget className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" />
                    <span>Generate daily workout plans tailored for you</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-[var(--color-border)]">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="px-6 py-3 border border-[var(--color-border)] bg-white text-[var(--color-text)] hover:bg-[var(--color-surface-muted)] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-lg font-semibold transition-all shadow-[0_16px_34px_rgba(37,99,235,0.24)]"
            >
              {currentStep === 4 ? 'Complete Setup' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OnboardingWizard
