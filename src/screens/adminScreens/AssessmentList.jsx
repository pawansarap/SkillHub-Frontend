import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AssessmentList = () => {
  const [assessments, setAssessments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API call
        // Simulated data
        const mockAssessments = [
          {
            id: 1,
            title: 'JavaScript Fundamentals',
            skillType: 'hard',
            language: 'JavaScript',
            status: 'published',
            questionCount: 10,
            createdAt: '2024-03-17',
            updatedAt: '2024-03-17'
          },
          {
            id: 2,
            title: 'Communication Skills',
            skillType: 'soft',
            language: null,
            status: 'draft',
            questionCount: 5,
            createdAt: '2024-03-16',
            updatedAt: '2024-03-16'
          }
        ];
        setAssessments(mockAssessments);
      } catch (err) {
        setError('Failed to load assessments');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  const handleStatusChange = async (assessmentId, newStatus) => {
    try {
      // TODO: Replace with actual API call
      setAssessments(prevAssessments =>
        prevAssessments.map(assessment =>
          assessment.id === assessmentId
            ? { ...assessment, status: newStatus }
            : assessment
        )
      );
    } catch (err) {
      console.error('Failed to update assessment status:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 dark:border-primary-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Assessments</h1>
        <Link
          to="/admin/assessments/create"
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
        >
          Create New Assessment
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assessments.map((assessment) => (
          <div
            key={assessment.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {assessment.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {assessment.skillType === 'hard' ? `${assessment.language} - ` : ''}
                  {assessment.skillType.charAt(0).toUpperCase() + assessment.skillType.slice(1)} Skill
                </p>
              </div>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  assessment.status === 'published'
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300'
                    : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300'
                }`}
              >
                {assessment.status.charAt(0).toUpperCase() + assessment.status.slice(1)}
              </span>
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Questions: {assessment.questionCount}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last updated: {new Date(assessment.updatedAt).toLocaleDateString()}
              </p>
            </div>

            <div className="mt-6 flex space-x-3">
              <Link
                to={`/admin/assessments/${assessment.id}/edit`}
                className="flex-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
              >
                Edit
              </Link>
              <button
                onClick={() =>
                  handleStatusChange(
                    assessment.id,
                    assessment.status === 'published' ? 'draft' : 'published'
                  )
                }
                className="flex-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
              >
                {assessment.status === 'published' ? 'Move to Draft' : 'Publish'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssessmentList; 