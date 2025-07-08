import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userAssessmentsAPI } from '../../services/api';

const getSubtopicStats = (questions) => {
  const stats = {};
  questions.forEach(q => {
    if (!stats[q.subtopic]) stats[q.subtopic] = { correct: 0, total: 0 };
    stats[q.subtopic].total += 1;
    if (q.isCorrect) stats[q.subtopic].correct += 1;
  });
  return stats;
};

const getOverallStats = (questions) => {
  const correct = questions.filter(q => q.isCorrect).length;
  return { correct, total: questions.length };
};

const getColorForScore = (percent) => {
  if (percent >= 80) return 'bg-green-500';
  if (percent >= 60) return 'bg-yellow-500';
  return 'bg-red-500';
};

const getSubTopicColor = (index) => {
  const colors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'];
  return colors[index % colors.length];
};

const AssessmentResult = () => {
  const { id: assessmentId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (!assessmentId) {
      setLoading(false);
      setError('Invalid assessment ID');
      return;
    }
    
    const fetchResult = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await userAssessmentsAPI.getResult(assessmentId);
        setResult(data);
      } catch (error) {
        console.error('Error fetching assessment result:', error);
        setError(error.response?.data?.error || 'Error loading assessment result');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResult();
  }, [assessmentId]);

  if (!assessmentId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Invalid assessment ID</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => navigate('/assessments')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Assessments
        </button>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">No assessment result found</div>
      </div>
    );
  }

  // Calculate score percentage
  const { correct: correctAnswers, total: totalQuestions } = 
    getOverallStats(result.questions || []);

  // Now derive the percent
  const scorePercentage = totalQuestions > 0
    ? Math.round((correctAnswers / totalQuestions) * 100)
    : 0;


   console.log("totalQuestions: ",totalQuestions)
   console.log("scorePercentage:",scorePercentage)
   console.log("correctAnswers: ",correctAnswers)
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessment Results</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-6">{result.assessment_title}</h2>

          {/* Status Banner */}
          <div className={`mb-6 p-4 rounded-lg ${result.status === 'PASSED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <div className="flex items-center">
              <span className="font-semibold mr-2">Status:</span>
              <span>{result.status}</span>
              <span className="mx-2">|</span>
              <span className="font-semibold mr-2">Required to Pass:</span>
              <span>{result.passing_score}%</span>
            </div>
          </div>

          {/* Main Assessment Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold text-gray-800">Overall Score</h2>
              <span className="text-2xl font-bold text-gray-900">
                {correctAnswers} / {totalQuestions} ({scorePercentage}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-6">
              <div
                className={`${getColorForScore(scorePercentage)} h-6 rounded-full transition-all duration-500`}
                style={{ width: `${scorePercentage}%` }}
              ></div>
            </div>
          </div>


          {/* Time Taken */}
          {result.time_taken && (
            <div className="mb-6">
              <div className="flex items-center text-gray-700">
                <span className="font-semibold mr-2">Time Taken:</span>
                <span>{Math.floor(result.time_taken / 60)} minutes {result.time_taken % 60} seconds</span>
              </div>
            </div>
          )}

          {/* Questions List */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Questions Review</h2>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {showDetails ? 'Hide Details' : 'View Details'}
              </button>
            </div>

            {showDetails && (
              <div className="space-y-6">
                {result.questions && result.questions.map((question, index) => (
                  <div 
                    key={`${question.questionId}-${index}`} 
                    className={`p-4 rounded-lg ${question.isCorrect ? 'bg-green-50' : 'bg-red-50'}`}
                  >
                    <div className="mb-2">
                      <span className="font-semibold">Question {index + 1}:</span> {question.questionText}
                    </div>
                    <div className={`ml-4 ${question.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                      <div>Your Answer: {question.selectedText}</div>
                      {!question.isCorrect && (
                        <div className="text-green-700">Correct Answer: {question.correctText}</div>
                      )}
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      Points: {question.earnedPoints} / {question.points}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={() => navigate('/assessments')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Back to Assessments
            </button>
            <button
              onClick={() => navigate(`/assessments/${assessmentId}/take`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Retake Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentResult;
