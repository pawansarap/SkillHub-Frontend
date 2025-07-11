import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { assessmentsAPI, userAssessmentsAPI } from '../../services/api';
import { ASSESSMENT_STATUS, ASSESSMENT_TYPES } from '../../config/constants';
baseURL: import.meta.env.VITE_API_URL

const Assessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [userAssessments, setUserAssessments] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError('');
        // Fetch all published assessments
        const allAssessments = await assessmentsAPI.getAll();
        console.log('All Assessments:', allAssessments);
        
        const publishedAssessments = allAssessments.filter(assessment => assessment.is_published);
        setAssessments(publishedAssessments);
        // Fetch user assessments
        const userAssessmentsArr = await userAssessmentsAPI.getAll();
        console.log('User Assessments:', userAssessmentsArr);
        // Map assessmentId -> userAssessment
        const userAssessmentMap = {};
        userAssessmentsArr.forEach(ua => {
          userAssessmentMap[ua.assessment] = ua;
        });
        setUserAssessments(userAssessmentMap);
      } catch (err) {
        setError('Failed to load assessments. Please try again later.');
        setAssessments([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  
  console.log("hiihii")

  const handleStartAssessment = async (assessmentId) => {
    try {
      const response = await userAssessmentsAPI.start({ assessment_id: assessmentId });
      // Redirect to take assessment page
      navigate(`/assessments/${assessmentId}/take`);
    } catch (err) {
      alert('Failed to start assessment.');
    }
  };

  const handleViewResults = (assessmentId) => {
    navigate(`/assessments/${assessmentId}/results`);
  };

  const filteredAssessments = filter === 'all' 
    ? assessments 
    : assessments.filter(assessment => assessment.status === filter);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case ASSESSMENT_STATUS.COMPLETED:
        return 'bg-green-100 text-green-800 ';
      case ASSESSMENT_STATUS.IN_PROGRESS:
        return 'bg-yellow-100 text-yellow-800';
      case ASSESSMENT_STATUS.EVALUATED:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case ASSESSMENT_STATUS.COMPLETED:
        return 'Completed';
      case ASSESSMENT_STATUS.IN_PROGRESS:
        return 'In Progress';
      case ASSESSMENT_STATUS.NOT_STARTED:
        return 'Not Started';
      case ASSESSMENT_STATUS.EVALUATED:
        return 'Evaluated';
      default:
        return status;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case ASSESSMENT_TYPES.QUIZ:
        return (
          <svg className="h-6 w-6 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        );
      case ASSESSMENT_TYPES.PRACTICAL:
        return (
          <svg className="h-6 w-6 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        );
      case ASSESSMENT_TYPES.PROJECT:
        return (
          <svg className="h-6 w-6 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
        );
      default:
        return (
          <svg className="h-6 w-6 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Assessments</h1>
            <p className="mt-1 text-gray-600 dark:text-white">Take assessments to evaluate your skills and earn credentials.</p>
          </div>
          <div className="mt-4 md:mt-0">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md "
            >
              <option value="all">All Assessments</option>
              <option value={ASSESSMENT_STATUS.NOT_STARTED}>Not Started</option>
              <option value={ASSESSMENT_STATUS.IN_PROGRESS}>In Progress</option>
              <option value={ASSESSMENT_STATUS.COMPLETED}>Completed</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {filteredAssessments.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
          <p className="text-gray-500 dark:text-white">No assessments found matching your filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAssessments.map((assessment) => (
            <div key={assessment.id} className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center">
                  {getTypeIcon(assessment.type)}
                  <span className="ml-2 text-xs font-medium text-gray-500 dark:text-white uppercase">{assessment.type}</span>
                </div>
                <h3 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">{assessment.title}</h3>
                <p className="mt-2 text-gray-600 line-clamp-3 dark:text-white">{assessment.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(assessment.status)}`}>
                    {getStatusText(assessment.status)}
                  </span>
                  {assessment.score !== null && (
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Score: {assessment.score}%</span>
                  )}
                </div>
                <div className="mt-4 text-sm text-gray-500 dark:text-white">
                  <div className="flex items-center">
                    <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{assessment.duration_minutes || 0} minutes</span>
                  </div>
                  {assessment.language && (
                    <div className="flex items-center mt-1">
                      <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Language: {assessment.language?.name || assessment.language || 'N/A'}</span>
                    </div>
                  )}
                  {assessment.questions_count && (
                    <div className="flex items-center mt-1">
                      <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{assessment.questions_count} questions</span>
                    </div>
                  )}
                </div>
              </div>
              <div className=" bg-white dark:bg-gray-800 px-6 py-4">
                {userAssessments[assessment.id] && (userAssessments[assessment.id].status === 'PASSED' || userAssessments[assessment.id].status === 'FAILED') ? (
                  <button onClick={() => handleViewResults(assessment.id)} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    View Results
                  </button>
                ) : userAssessments[assessment.id] && userAssessments[assessment.id].status === 'IN_PROGRESS' ? (
                  <button onClick={() => handleStartAssessment(assessment.id)} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    Continue Assessment
                  </button>
                ) : (
                  <button onClick={() => handleStartAssessment(assessment.id)} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    Start Assessment
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Assessments; 