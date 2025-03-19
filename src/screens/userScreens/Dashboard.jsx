import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { assessmentsAPI, credentialsAPI } from '../../services/api';

// Mock data for development/fallback
const MOCK_DATA = {
  stats: {
    completedAssessments: 5,
    inProgressAssessments: 2,
    earnedCredentials: 3,
  },
  recentAssessments: [
    { id: 1, title: 'JavaScript Fundamentals', status: 'completed', score: 85, date: '2023-11-15' },
    { id: 2, title: 'React Basics', status: 'completed', score: 92, date: '2023-11-10' },
    { id: 3, title: 'Advanced CSS', status: 'in_progress', score: null, date: '2023-11-20' },
  ],
  recentCredentials: [
    { id: 1, title: 'JavaScript Developer', issueDate: '2023-11-16', expiryDate: '2024-11-16' },
    { id: 2, title: 'React Frontend Developer', issueDate: '2023-11-12', expiryDate: '2024-11-12' },
  ],
};

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    completedAssessments: 0,
    inProgressAssessments: 0,
    earnedCredentials: 0,
  });
  const [recentAssessments, setRecentAssessments] = useState([]);
  const [recentCredentials, setRecentCredentials] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError('');

        try {
          const [statsData, assessmentsData, credentialsData] = await Promise.all([
            assessmentsAPI.getStats(),
            assessmentsAPI.getRecent(),
            credentialsAPI.getRecent()
          ]);

          setStats(statsData);
          setRecentAssessments(assessmentsData);
          setRecentCredentials(credentialsData);
        } catch (apiError) {
          console.warn('API not available, using mock data:', apiError);
          setStats(MOCK_DATA.stats);
          setRecentAssessments(MOCK_DATA.recentAssessments);
          setRecentCredentials(MOCK_DATA.recentCredentials);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (error) {
    return (
      <div className="bg-red-900/30 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="bg-[#1e2837] rounded-lg p-6">
        <h1 className="text-2xl font-bold text-white">Welcome back, {currentUser?.name || 'User'}!</h1>
        <p className="mt-1 text-gray-300">Here's an overview of your progress and recent activities.</p>
      </div>

      {/* Stats section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1e2837] rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-[#2a3749] text-[#4299e1]">
              <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-300">Completed Assessments</h2>
              <p className="text-3xl font-bold text-white">{stats.completedAssessments}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#1e2837] rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-[#2a3749] text-[#eab308]">
              <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-300">In Progress</h2>
              <p className="text-3xl font-bold text-white">{stats.inProgressAssessments}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#1e2837] rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-[#2a3749] text-[#22c55e]">
              <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-300">Earned Credentials</h2>
              <p className="text-3xl font-bold text-white">{stats.earnedCredentials}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent assessments section */}
      <div className="bg-[#1e2837] rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Recent Assessments</h2>
          <Link to="/assessments" className="text-[#4299e1] hover:text-[#63b3ed] text-sm font-medium">
            View all
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th scope="col" className="text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Assessment
                </th>
                <th scope="col" className="text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Score
                </th>
                <th scope="col" className="text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {recentAssessments.map((assessment) => (
                <tr key={assessment.id}>
                  <td className="py-4">
                    <Link to={`/assessments/${assessment.id}`} className="text-[#4299e1] hover:text-[#63b3ed]">
                      {assessment.title}
                    </Link>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      assessment.status === 'completed' 
                        ? 'bg-green-900/30 text-green-300' 
                        : 'bg-yellow-900/30 text-yellow-300'
                    }`}>
                      {assessment.status === 'completed' ? 'Completed' : 'In Progress'}
                    </span>
                  </td>
                  <td className="py-4 text-white">
                    {assessment.score !== null ? `${assessment.score}%` : '-'}
                  </td>
                  <td className="py-4 text-gray-400">
                    {assessment.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;