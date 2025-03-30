const AssessmentTest = () => {
  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Python Assessment!
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-300">
          This will have test you skill in Python.
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Q1. Python is used in Backend or not
        </h2>
        <div>
          <input type="radio" id="yes" name="q1" value="yes" />
          <label for="yes">Yes</label>
          <input type="radio" id="no" name="q1" value="no" />
          <label for="no">No</label>
        </div>
      </div>
    </div>
  );
};

export default AssessmentTest;
