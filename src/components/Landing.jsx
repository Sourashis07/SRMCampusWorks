import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, Users, Shield, Zap } from 'lucide-react';

const Landing = () => {
  const { isDark, toggleTheme } = useTheme();

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
      <div className="px-6 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Your Campus <span className="text-blue-600">Works</span> Hub
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Connect with talented students in your college. Post assignments, find skilled peers, and collaborate on projects with secure payments.
        </p>
        <Link
          to="/login"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
        >
          Get Started
        </Link>
      </div>

      {/* Features */}
      <div className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Why Choose Campus Works?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Secure Payments
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Escrow-based payments ensure safe transactions for both parties
            </p>
          </div>
          <div className="text-center p-6">
            <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Team Collaboration
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Form groups and bid together on larger projects
            </p>
          </div>
          <div className="text-center p-6">
            <Zap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
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
      <div className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          How Campus Works Functions
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              1
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Post Your Task
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Create detailed task descriptions with budget and deadline
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              2
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Receive Bids
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Students submit proposals with their rates and approach
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              3
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Accept & Collaborate
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Choose the best bid and work together through our platform
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
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