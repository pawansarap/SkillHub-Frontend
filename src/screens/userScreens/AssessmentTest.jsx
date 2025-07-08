import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assessmentsAPI, userAnswersAPI, userAssessmentsAPI } from '../../services/api';

const buttonGroup = [
  { value: 'Never', label: 'Never' },
  { value: 'Rarely', label: 'Rarely' },
  { value: 'Sometimes', label: 'Sometimes' },
  { value: 'Often', label: 'Often' },
  { value: 'Always', label: 'Always' },
];

const AssessmentTest = () => {
  const { id: assessmentId } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // questionId -> choiceId
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await assessmentsAPI.getById(assessmentId);
        setAssessment(response);
        setQuestions(response.questions || []);
      } catch (err) {
        setError('Failed to load questions.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [assessmentId]);

  const handleSelect = (questionId, choiceId) => {
    setAnswers(prev => ({ ...prev, [questionId]: choiceId }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      // First, start the assessment if not already started
      const userAssessmentsArr = await userAssessmentsAPI.getAll();
      let userAssessment = userAssessmentsArr.find(ua => ua.assessment === parseInt(assessmentId));
      
      if (!userAssessment) {
        // Start the assessment if not already started
        const startResponse = await userAssessmentsAPI.start({ assessment_id: parseInt(assessmentId) });
        userAssessment = startResponse;
      }
      
      if (!userAssessment) {
        setError('Failed to start assessment. Please try again.');
        setSubmitting(false);
        return;
      }
      
      // Submit each answer individually
      for (const [questionId, choiceId] of Object.entries(answers)) {
        await userAnswersAPI.create({
          user_assessment: userAssessment.id,
          question: questionId,
          selected_choice: choiceId
        });
      }
      
      // Redirect to result page
      navigate(`/assessments/${assessmentId}/results`);
    } catch (err) {
      console.error('Error submitting answers:', err);
      setError('Failed to submit answers. ' + (err.message || ''));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading questions...</div>;
  }
  if (error) {
    return <div className="text-red-500 text-center mt-8">{error}</div>;
  }
  if (!questions.length) {
    return <div className="text-center mt-8">No questions found for this assessment.</div>;
  }

  return (
    <div className="flex flex-col md:flex-row max-w-5xl mx-auto mt-8">
      <div className="flex-1 bg-white dark:bg-gray-100 rounded shadow p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">{assessment?.title || 'Assessment Test'}</h2>
        <form onSubmit={handleSubmit}>
          {questions.map((q, idx) => (
            <div key={q.id} className="mb-8">
              <div className="font-semibold mb-3 text-gray-800">{idx + 1}. {q.text}</div>
              <div className="flex flex-row gap-2">
                {q.choices.map(choice => (
                  <button
                    type="button"
                    key={choice.id}
                    className={`px-4 py-2 rounded border transition-colors duration-150 focus:outline-none
                      ${answers[q.id] === choice.id ? 'bg-primary-600 text-white border-primary-600' : 'bg-gray-200 text-gray-800 border-gray-300 hover:bg-primary-100'}`}
                    onClick={() => handleSelect(q.id, choice.id)}
                  >
                    {choice.text}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <div className="block md:hidden mt-8">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-primary-600 text-white font-semibold rounded hover:bg-primary-700 disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit and Exit'}
            </button>
          </div>
        </form>
      </div>
      <div className="w-full md:w-1/4 md:ml-8 mt-8 md:mt-0">
        <div className="bg-white dark:bg-gray-100 rounded shadow p-6 sticky top-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Actions</h3>
          <p className="mb-6 text-gray-700">You can submit the test once you are done answering all the questions.</p>
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-3 px-4 bg-primary-600 text-white font-semibold rounded hover:bg-primary-700 disabled:opacity-50"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit and Exit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentTest;
