import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start space-x-6">
            <Link to="/" className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200">
              Home
            </Link>
            <Link to="/about" className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200">
              About
            </Link>
            <a href="#" className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200">
              Terms of Service
            </a>
          </div>
          <div className="mt-8 md:mt-0">
            <p className="text-center text-gray-400 dark:text-gray-300 text-sm">
              &copy; {currentYear} SkillHub. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 