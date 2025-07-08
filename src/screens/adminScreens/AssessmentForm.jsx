import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import api from '../../utils/axios';
import { useAuth } from '../../contexts/AuthContext';

const AssessmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [languages, setLanguages] = useState([]);
  const [subtopics, setSubtopics] = useState([]);
  const [showNewLanguageForm, setShowNewLanguageForm] = useState(false);
  const [showNewSubtopicForm, setShowNewSubtopicForm] = useState(false);
  const [newLanguage, setNewLanguage] = useState({ name: '', description: '' });
  const [newSubtopic, setNewSubtopic] = useState({ name: '', description: '', language: '' });
  const [questionSubtopicForms, setQuestionSubtopicForms] = useState({});
  const [questionSubtopicData, setQuestionSubtopicData] = useState({});
  const [assessment, setAssessment] = useState({
    title: '',
    description: '',
    language: '',
    duration_minutes: 30,
    passing_score: 70,
    is_published: false,
    questions: []
  });

  useEffect(() => {
    fetchLanguages();
    fetchSubtopics();

    if (id) {
      // Fetch assessment data if editing
      const fetchAssessment = async () => {
        try {
          const response = await api.get(`/assessments/${id}/`);
      setAssessment({
            ...response.data,
            language: response.data.language?.id || '',
            questions: (response.data.questions || []).map(q => ({
              id: q.id,
              type: 'multiple_choice', // Adjust if you support more types
              question: q.text,
              options: (q.choices || []).map(choice => choice.text),
              correctAnswer: (q.choices || []).find(choice => choice.is_correct)?.text || '',
              subtopic: q.subtopic ? parseInt(q.subtopic, 10) : null,
            }))
          });
          // If assessment has a language, fetch its subtopics
          if (response.data.language?.id) {
            fetchSubtopics(response.data.language.id);
          }
        } catch (err) {
          console.error('Error fetching assessment:', err);
          setError('Failed to load assessment');
        }
      };
      fetchAssessment();
    }
  }, [id]);

  const fetchLanguages = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/languages/');
      let languagesData = response.data;
      
      // Handle different response formats
      if (!Array.isArray(languagesData)) {
        if (languagesData.results) {
          languagesData = languagesData.results;
        } else if (languagesData.languages) {
          languagesData = languagesData.languages;
        } else {
          console.error('Unexpected languages response format:', languagesData);
          setError('Failed to load languages. Please try again.');
          return;
        }
      }
      
      console.log('Languages data:', languagesData);
      setLanguages(languagesData);
    } catch (error) {
      console.error('Error fetching languages:', error);
      setError(error.response?.data?.message || 'Failed to load languages. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubtopics = async (languageId) => {
    try {
      setIsLoading(true);
      // Don't fetch if languageId is undefined or empty
      if (!languageId) {
        setSubtopics([]);
        return;
      }

      console.log('Fetching subtopics for language:', languageId);
      const response = await api.get(`/subtopics/?language=${languageId}`);
      let subtopicsData = response.data;
      
      // Handle different response formats
      if (!Array.isArray(subtopicsData)) {
        if (subtopicsData.results) {
          subtopicsData = subtopicsData.results;
        } else if (subtopicsData.subtopics) {
          subtopicsData = subtopicsData.subtopics;
        } else {
          console.error('Unexpected subtopics response format:', subtopicsData);
          setError('Failed to load subtopics. Please try again.');
          return;
        }
      }
      
      console.log('Subtopics data:', subtopicsData);
      setSubtopics(subtopicsData);
    } catch (error) {
      console.error('Error fetching subtopics:', error);
      setError(error.response?.data?.message || 'Failed to load subtopics. Please try again.');
      setSubtopics([]); // Clear subtopics on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = async (e) => {
    const languageId = e.target.value;
    console.log('Language changed to:', languageId);
    setAssessment(prev => ({ ...prev, language: languageId }));
    
    // Clear subtopics when no language is selected
    if (!languageId) {
      setSubtopics([]);
      return;
    }
    
    await fetchSubtopics(languageId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    setIsLoading(true);
    setError('');

      // Check if there are any questions
      if (assessment.questions.length === 0) {
        setError('Please add at least one question to the assessment.');
        setIsLoading(false);
        return;
      }
      
      // Check if the first question has a subtopic
      if (!assessment.questions[0].subtopic) {
        setError('Please select a subtopic for at least the first question.');
        setIsLoading(false);
        return;
      }
      
      // Prepare the assessment data
      const assessmentData = {
        ...assessment,
        // Use the first question's subtopic as the assessment's subtopic
        subtopic: assessment.questions[0].subtopic,
        questions: assessment.questions.map(q => ({
          ...q,
          subtopic: q.subtopic ? parseInt(q.subtopic, 10) : null
        }))
      };
      
      console.log('Submitting assessment data:', JSON.stringify(assessmentData, null, 2));
      
      if (id) {
        await api.put(`/assessments/${id}/`, assessmentData);
      } else {
        const response = await api.post('/assessments/', assessmentData);
        console.log('Assessment created successfully:', response.data);
      }
      
      navigate('/admin/assessments');
    } catch (error) {
      console.error('Error saving assessment:', error);
      
      // Log detailed error information
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      
      setError(error.response?.data?.message || 'Failed to save assessment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateLanguage = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      // Check if user is admin
      if (currentUser?.role !== 'admin') {
        setError('Only administrators can create new languages.');
        return;
      }

      const response = await api.post('/languages/', newLanguage);
      setLanguages([...languages, response.data]);
      setShowNewLanguageForm(false);
      setNewLanguage({ name: '', description: '' });
    } catch (error) {
      console.error('Error creating language:', error);
      if (error.response?.status === 403) {
        setError('You do not have permission to create languages. Please contact an administrator.');
      } else {
        setError(error.response?.data?.message || 'Failed to create language. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addQuestion = () => {
    setAssessment(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: prev.questions.length + 1,
          type: 'multiple_choice',
          question: '',
          options: ['', '', '', ''],
          correctAnswer: ''
        }
      ]
    }));
  };

  const updateQuestion = (questionId, field, value) => {
    console.log(`Updating question ${questionId}, field: ${field}, value:`, value);
    
    setAssessment(prev => {
      const updatedQuestions = prev.questions.map(q => {
        if (q.id === questionId) {
          if (field === 'type') {
            // Reset question data when type changes
            return {
              ...q,
              type: value,
              question: '',
              options: value === 'multiple_choice' ? ['', '', '', ''] : [],
              correctAnswer: value === 'multiple_choice' ? '' : null,
              initialCode: value === 'code_editor' ? '// Your code here\n' : '',
              testCases: value === 'code_editor' ? [{ input: '', expectedOutput: '' }] : []
            };
          }
          
          // For subtopic field, ensure we're storing the ID
          if (field === 'subtopic') {
            console.log('Setting subtopic for question:', questionId, 'to:', value);
            return { ...q, [field]: value };
          }
          
          return { ...q, [field]: value };
        }
        return q;
      });
      
      console.log('Updated questions:', updatedQuestions);
      return {
        ...prev,
        questions: updatedQuestions
      };
    });
  };

  const updateOption = (questionId, optionIndex, value) => {
    setAssessment(prev => ({
      ...prev,
      questions: prev.questions.map(q => {
        if (q.id === questionId) {
          const newOptions = [...q.options];
          newOptions[optionIndex] = value;
          return { ...q, options: newOptions };
        }
        return q;
      })
    }));
  };

  const addOption = (questionId) => {
    setAssessment(prev => ({
      ...prev,
      questions: prev.questions.map(q => {
        if (q.id === questionId) {
          return { ...q, options: [...q.options, ''] };
        }
        return q;
      })
    }));
  };

  const removeOption = (questionId, optionIndex) => {
    setAssessment(prev => ({
      ...prev,
      questions: prev.questions.map(q => {
        if (q.id === questionId) {
          const newOptions = q.options.filter((_, index) => index !== optionIndex);
          return { ...q, options: newOptions };
        }
        return q;
      })
    }));
  };

  const updateTestCase = (questionId, testCaseIndex, field, value) => {
    setAssessment(prev => ({
      ...prev,
      questions: prev.questions.map(q => {
        if (q.id === questionId) {
          const newTestCases = [...q.testCases];
          newTestCases[testCaseIndex] = { ...newTestCases[testCaseIndex], [field]: value };
          return { ...q, testCases: newTestCases };
        }
        return q;
      })
    }));
  };

  const addTestCase = (questionId) => {
    setAssessment(prev => ({
      ...prev,
      questions: prev.questions.map(q => {
        if (q.id === questionId) {
          return { ...q, testCases: [...q.testCases, { input: '', expectedOutput: '' }] };
        }
        return q;
      })
    }));
  };

  const removeTestCase = (questionId, testCaseIndex) => {
    setAssessment(prev => ({
      ...prev,
      questions: prev.questions.map(q => {
        if (q.id === questionId) {
          const newTestCases = q.testCases.filter((_, index) => index !== testCaseIndex);
          return { ...q, testCases: newTestCases };
        }
        return q;
      })
    }));
  };

  const removeQuestion = (questionId) => {
    setAssessment(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };

  const toggleSubtopicForm = (questionId) => {
    console.log('Toggling subtopic form for question:', questionId);
    setQuestionSubtopicForms(prev => {
      const newState = {
        ...prev,
        [questionId]: !prev[questionId]
      };
      console.log('New questionSubtopicForms state:', newState);
      return newState;
    });
    
    // Initialize subtopic data for this question if it doesn't exist
    if (!questionSubtopicData[questionId]) {
      setQuestionSubtopicData(prev => ({
        ...prev,
        [questionId]: { name: '', description: '' }
      }));
    }
  };

  const updateQuestionSubtopicData = (questionId, field, value) => {
    setQuestionSubtopicData(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [field]: value
      }
    }));
  };

  const handleCreateSubtopic = async (e, questionId) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await api.post('/subtopics/', {
        ...questionSubtopicData[questionId],
        language: assessment.language
      });
      setSubtopics(prev => [...prev, response.data]);
      setQuestionSubtopicForms(prev => ({
        ...prev,
        [questionId]: false
      }));
      // Clear the subtopic data for this question
      setQuestionSubtopicData(prev => ({
        ...prev,
        [questionId]: { name: '', description: '' }
      }));
    } catch (error) {
      console.error('Error creating subtopic:', error);
      setError(error.response?.data?.message || 'Failed to create subtopic. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {id ? 'Edit Assessment' : 'Create Assessment'}
        </h1>
        <button
          onClick={() => navigate('/admin/assessments')}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          Cancel
        </button>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={assessment.title}
                onChange={(e) => setAssessment(prev => ({ ...prev, title: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                id="description"
                value={assessment.description}
                onChange={(e) => setAssessment(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Language
              </label>
              <div className="flex space-x-2">
                <select
                  id="language"
                  value={assessment.language}
                  onChange={handleLanguageChange}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  required
                >
                  <option value="">Select a language</option>
                  {Array.isArray(languages) && languages.map(language => (
                    <option key={language.id} value={language.id}>{language.name}</option>
                  ))}
                </select>
                {currentUser?.role === 'admin' && (
                  <button
                    type="button"
                    onClick={() => setShowNewLanguageForm(!showNewLanguageForm)}
                    className="mt-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    {showNewLanguageForm ? 'Cancel' : 'Add New'}
                  </button>
                )}
              </div>
            </div>
            
            {showNewLanguageForm && (
              <div className="mt-2 p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Add New Language</h3>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="newLanguageName" className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                      Name
                    </label>
                    <input
                      type="text"
                      id="newLanguageName"
                      value={newLanguage.name}
                      onChange={(e) => setNewLanguage(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="newLanguageDescription" className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                      Description
                    </label>
                    <textarea
                      id="newLanguageDescription"
                      value={newLanguage.description}
                      onChange={(e) => setNewLanguage(prev => ({ ...prev, description: e.target.value }))}
                      rows={2}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleCreateLanguage}
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
                  >
                    Create Language
                  </button>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="duration_minutes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Duration (minutes)
              </label>
              <input
                type="number"
                id="duration_minutes"
                value={assessment.duration_minutes}
                onChange={(e) => setAssessment(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) }))}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                required
                min="1"
              />
            </div>
            
            <div>
              <label htmlFor="passing_score" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Passing Score (%)
              </label>
              <input
                type="number"
                id="passing_score"
                value={assessment.passing_score}
                onChange={(e) => setAssessment(prev => ({ ...prev, passing_score: parseInt(e.target.value) }))}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                required
                min="0"
                max="100"
              />
            </div>
            
            <div>
              <label htmlFor="is_published" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <select
                id="is_published"
                value={assessment.is_published ? 'published' : 'draft'}
                onChange={(e) => setAssessment(prev => ({ ...prev, is_published: e.target.value === 'published' }))}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                required
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Questions</h2>
            
          </div>

          <div className="space-y-6">
            {assessment.questions.map((question, index) => (
              <div key={question.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Question {index + 1}
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeQuestion(question.id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Question Type
                    </label>
                    <select
                      value={question.type}
                      onChange={(e) => updateQuestion(question.id, 'type', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                    >
                      <option value="multiple_choice">Multiple Choice</option>
                      <option value="code_editor">Code Editor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Subtopic
                </label>
                    <div className="flex space-x-2">
                <select
                        value={question.subtopic || ''}
                        onChange={(e) => updateQuestion(question.id, 'subtopic', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                        disabled={!assessment.language}
                      >
                        <option value="">Select a subtopic</option>
                        {Array.isArray(subtopics) && subtopics.map(subtopic => (
                          <option key={subtopic.id} value={subtopic.id}>{subtopic.name}</option>
                        ))}
                      </select>
                      {currentUser?.role === 'admin' && (
                        <button
                          type="button"
                          onClick={() => {
                            console.log('Add New button clicked for question:', question.id);
                            toggleSubtopicForm(question.id);
                          }}
                          className="mt-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                          disabled={!assessment.language}
                        >
                          {questionSubtopicForms[question.id] ? 'Cancel' : 'Add New'}
                        </button>
                      )}
                    </div>
                    {questionSubtopicForms[question.id] && (
                      <div className="mt-2 p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Add New Subtopic</h3>
                        <div className="space-y-3">
                          <div>
                            <label htmlFor={`newSubtopicName-${question.id}`} className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                              Name
                            </label>
                            <input
                              type="text"
                              id={`newSubtopicName-${question.id}`}
                              value={questionSubtopicData[question.id]?.name || ''}
                              onChange={(e) => updateQuestionSubtopicData(question.id, 'name', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  required
                            />
                          </div>
                          <div>
                            <label htmlFor={`newSubtopicDescription-${question.id}`} className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                              Description
                            </label>
                            <textarea
                              id={`newSubtopicDescription-${question.id}`}
                              value={questionSubtopicData[question.id]?.description || ''}
                              onChange={(e) => updateQuestionSubtopicData(question.id, 'description', e.target.value)}
                              rows={2}
                              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={(e) => handleCreateSubtopic(e, question.id)}
                            className="w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
                          >
                            Create Subtopic
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Question Text
                    </label>
                    <textarea
                      value={question.question}
                      onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                      rows={2}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                      required
                    />
                  </div>

                  {question.type === 'multiple_choice' && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Options
                        </label>
                        <button
                          type="button"
                          onClick={() => addOption(question.id)}
                          className="text-sm text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                        >
                          Add Option
                        </button>
                      </div>
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                            className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                            placeholder={`Option ${optionIndex + 1}`}
                            required
                          />
                          <input
                            type="radio"
                            name={`correct-${question.id}`}
                            checked={question.correctAnswer === option}
                            onChange={() => updateQuestion(question.id, 'correctAnswer', option)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600"
                          />
                          <button
                            type="button"
                            onClick={() => removeOption(question.id, optionIndex)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {question.type === 'code_editor' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Initial Code
                        </label>
                        <textarea
                          value={question.initialCode}
                          onChange={(e) => updateQuestion(question.id, 'initialCode', e.target.value)}
                          rows={5}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm font-mono"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between items-center">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Test Cases
                          </label>
                          <button
                            type="button"
                            onClick={() => addTestCase(question.id)}
                            className="text-sm text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                          >
                            Add Test Case
                          </button>
                        </div>
                        {question.testCases.map((testCase, testCaseIndex) => (
                          <div key={testCaseIndex} className="mt-2 grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                                Input
                              </label>
                              <input
                                type="text"
                                value={testCase.input}
                                onChange={(e) => updateTestCase(question.id, testCaseIndex, 'input', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                placeholder="e.g., [1, 2, 3]"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                                Expected Output
                              </label>
                              <input
                                type="text"
                                value={testCase.expectedOutput}
                                onChange={(e) => updateTestCase(question.id, testCaseIndex, 'expectedOutput', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                placeholder="e.g., 6"
                              />
                            </div>
                            <div className="col-span-2 flex justify-end">
                              <button
                                type="button"
                                onClick={() => removeTestCase(question.id, testCaseIndex)}
                                className="text-sm text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              >
                                Remove Test Case
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mb-6">

            
            <button
              type="button"
              onClick={addQuestion}
              className="px-4 py-2 text-sm mt-10 font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
            >
              Add Question
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {isLoading ? 'Saving...' : 'Save Assessment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssessmentForm; 