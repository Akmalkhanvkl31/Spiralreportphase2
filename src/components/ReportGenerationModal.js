/* eslint-disable no-unused-vars */
// ReportGenerationModal.js
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import useFetchReport from '../hooks/useFetchReport'; // Import the custom hook

const ReportGenerationModal = ({ setIsVisible, assessmentId }) => {
  const navigate = useNavigate();
  
  // Use the custom hook to fetch report status
  const { isGenerating, error, reportData } = useFetchReport(assessmentId);

  const handleViewReport = () => {
    // Close the modal before navigating
    setIsVisible(false);
    // Navigate to the /report page and pass reportData via state
    navigate('/report', { state: { reportData } });
  };

  const handleGoToDashboard = () => {
    console.log('Going to dashboard...');
    setIsVisible(false);  // Close the modal
  };

  const handleClick = () => {
    // Navigate to the /assessment page
    navigate('/assessment');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-md w-full mx-4 overflow-hidden">
        {/* Modal Content */}
        <div className="p-6 text-center">
          {isGenerating ? (
            <>
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Generating Your Report</h3>
              <p className="text-gray-500">Please wait while we generate your assessment report. This may take a few moments.</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Report Generated Successfully!</h3>
              <p className="text-gray-500">Your assessment report has been generated and is ready to view.</p>
            </>
          )}

          {/* Error message */}
          {error && <p className="text-red-500">{error}</p>}
        </div>

        {/* Modal Actions */}
        <div className="p-6 bg-gray-50 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={handleClick}
            className="flex-1 px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Go To Dashboard
          </button>
          <button
            onClick={handleViewReport}
            disabled={isGenerating}
            className={`flex-1 px-6 py-3 rounded-lg font-medium 
              ${isGenerating ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-600'} 
              transition-colors`}
          >
            View Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportGenerationModal;
