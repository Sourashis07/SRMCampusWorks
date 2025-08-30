import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, Users, Shield, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

const Landing = () => {
  const { isDark, toggleTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors">
      {/* Header */}
      <nav className="px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Campus Works
        </h1>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </nav>

      {/* Hero Section */}
      <div className="px-6 py-20 text-center relative overflow-hidden">
        {/* Floating background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 animate-bounce" style={{animationDelay: '0s'}}></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 animate-bounce" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-green-200 dark:bg-green-800 rounded-full opacity-20 animate-bounce" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-32 right-10 w-12 h-12 bg-yellow-200 dark:bg-yellow-800 rounded-full opacity-20 animate-bounce" style={{animationDelay: '1.5s'}}></div>
        </div>
        
        <div className={`transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Your Campus <span className="text-blue-600 animate-pulse">Works</span> Hub
          </h1>
          <p className={`text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto transition-all duration-1000 delay-300 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            Connect with talented students in your college. Post assignments, find skilled peers, and collaborate on projects with secure payments.
          </p>
          <Link
            to="/login"
            className={`inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{transitionDelay: '0.5s'}}
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12 animate-fade-in-up">
          Why Choose Campus Works?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-xl rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
            <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-bounce" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Secure Payments
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Escrow-based payments ensure safe transactions for both parties
            </p>
          </div>
          <div className="text-center p-6 transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-xl rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800" style={{transitionDelay: '0.1s'}}>
            <Users className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-bounce" style={{animationDelay: '0.5s'}} />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Team Collaboration
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Form groups and bid together on larger projects
            </p>
          </div>
          <div className="text-center p-6 transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-xl rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800" style={{transitionDelay: '0.2s'}}>
            <Zap className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-bounce" style={{animationDelay: '1s'}} />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Real-time Chat
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Instant communication with project collaborators
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="px-6 py-16 max-w-6xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12 animate-fade-in-up">
          How Campus Works Functions
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center p-6 transform transition-all duration-500 hover:scale-110">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold animate-pulse">
              1
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Post Your Task
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Create detailed task descriptions with budget and deadline
            </p>
          </div>
          <div className="text-center p-6 transform transition-all duration-500 hover:scale-110" style={{transitionDelay: '0.1s'}}>
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold animate-pulse" style={{animationDelay: '0.5s'}}>
              2
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Receive Proposals
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Students submit proposals with their rates and approach
            </p>
          </div>
          <div className="text-center p-6 transform transition-all duration-500 hover:scale-110" style={{transitionDelay: '0.2s'}}>
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold animate-pulse" style={{animationDelay: '1s'}}>
              3
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Accept & Collaborate
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Choose the best proposal and work together through our platform
            </p>
          </div>
          <div className="text-center p-6 transform transition-all duration-500 hover:scale-110" style={{transitionDelay: '0.3s'}}>
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold animate-pulse" style={{animationDelay: '1.5s'}}>
              4
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Pay Securely
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Complete payment after work submission and approval
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-8 text-center text-gray-600 dark:text-gray-400">
        <p>&copy; 2024 Campus Works. Built for students, by students.</p>
      </footer>
    </div>
  );
};

export default Landing;