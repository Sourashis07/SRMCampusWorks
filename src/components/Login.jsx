import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Sign in to Campus Works
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Connect with your college community
          </p>
        </div>
        
        <div className="mt-8 space-y-4">
          <button className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Sign in with Google
          </button>
          
          <div className="text-center">
            <Link 
              to="/" 
              className="text-blue-600 hover:text-blue-500 text-sm"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;