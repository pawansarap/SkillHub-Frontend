import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

const AssessmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [assessment, setAssessment] = useState({
    title: '',
    description: '',
    skillType: 'soft', // 'soft' or 'hard'
    language: '', // Only for hard skills
    status: 'draft', // 'draft' or 'published'
    questions: []
  });

  useEffect(() => {
    if (id) {
      // TODO: Replace with actual API call
      // Simulated data for editing
      setAssessment({
        title: 'JavaScript Basics',
        description: 'Test your knowledge of JavaScript fundamentals',
        skillType: 'hard',
        language: 'javascript',
        status: 'draft',
        questions: [
          {
            id: 1,
            type: 'multiple_choice',
            question: 'What is the output of typeof null?',
            options: ['object', 'null', 'undefined', 'number'],
            correctAnswer: 'object'
          },
          {
            id: 2,
            type: 'code_editor',
            question: 'Write a function that reverses a string',
            initialCode: 'function reverseString(str) {\n  // Your code here\n}',
            testCases: [
              { input: '"hello"', expectedOutput: '"olleh"' },
              { input: '"world"', expectedOutput: '"dlrow"' }
            ]
          }
        ]
      });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // TODO: Replace with actual API call
      console.log('Saving assessment:', assessment);
      navigate('/admin/assessments');
    } catch (err) {
      setError('Failed to save assessment');
      console.error(err);
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
    setAssessment(prev => ({
      ...prev,
      questions: prev.questions.map(q => {
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
          return { ...q, [field]: value };
        }
        return q;
      })
    }));
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
              <label htmlFor="skillType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Skill Type
              </label>
              <select
                id="skillType"
                value={assessment.skillType}
                onChange={(e) => setAssessment(prev => ({ ...prev, skillType: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                required
              >
                <option value="soft">Soft Skills</option>
                <option value="hard">Hard Skills</option>
              </select>
            </div>

            {assessment.skillType === 'hard' && (
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Programming Language
                </label>
                <select
                  id="language"
                  value={assessment.language}
                  onChange={(e) => setAssessment(prev => ({ ...prev, language: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  required
                >
                  <option value="">Select a language</option>
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
              </div>
            )}

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <select
                id="status"
                value={assessment.status}
                onChange={(e) => setAssessment(prev => ({ ...prev, status: e.target.value }))}
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
            <button
              type="button"
              onClick={addQuestion}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
            >
              Add Question
            </button>
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

                  <div >
                  <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sub Topic
                </label>
                <select
                  id="language"
                  // value={assessment.language}
                  // onChange={(e) => setAssessment(prev => ({ ...prev, language: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  required
                >
                  <option value="">Select a Sub Type</option>
                  <option value="javascript">Sub type 1</option>
                  <option value="python">Sub type 2</option>
                  <option value="java">Sub type 3</option>
                  <option value="cpp">Sub type 4</option>
                </select>
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
                            type="radio"
                            name={`correct-${question.id}`}
                            checked={question.correctAnswer === option}
                            onChange={() => updateQuestion(question.id, 'correctAnswer', option)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600"
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                            className="flex-1 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                            required
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
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
                          required
                        />
                      </div>

                      <div className="space-y-4">
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
                          <div key={testCaseIndex} className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Input
                              </label>
                              <input
                                type="text"
                                value={testCase.input}
                                onChange={(e) => updateTestCase(question.id, testCaseIndex, 'input', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Expected Output
                              </label>
                              <input
                                type="text"
                                value={testCase.expectedOutput}
                                onChange={(e) => updateTestCase(question.id, testCaseIndex, 'expectedOutput', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                required
                              />
                            </div>
                            <div className="col-span-2 flex justify-end">
                              <button
                                type="button"
                                onClick={() => removeTestCase(question.id, testCaseIndex)}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
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
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Assessment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssessmentForm; 