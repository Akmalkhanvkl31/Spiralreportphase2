/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck, Book, Users, Clock, ChevronRight } from 'lucide-react';
import AssessmentModal from '../AssessmentModal'; // Import the AssessmentModal
import useAssessmentDetails from '../../hooks/useAssessmentDetails'; // Import the custom hook

const defaultAssessment = {
  name: 'Untitled Assessment',
  tags: [],
  questionCount: 0,
  completionCount: 0,
  duration: 'N/A',
  credits: 0,
  id: '0'
};

function AssessmentCard({
  assessment = defaultAssessment,
  isSaved = false,
  onToggleSave = () => {}
}) {
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal state
  const safeAssessment = { ...defaultAssessment, ...assessment }; // Ensure we have the right data

  const { id } = safeAssessment; // Extract assessment ID

  // State to hold the assessment data for the modal
  const [modalAssessment, setModalAssessment] = useState(null);

  // Fetch assessment details when the modal opens
  const [modalId, setModalId] = useState(null); // State to trigger the API call when modal opens
  const { assessmentDetails, loading, error } = useAssessmentDetails(modalId); // Custom hook to fetch data

  // Effect to update modal data once the API call finishes
  useEffect(() => {
    if (isModalOpen) {
      if (loading) {
        console.log('Loading assessment details...');
      }
      if (error) {
        console.error('Error fetching assessment details:', error);
      }
      // Set the modal data once it's available (use the fetched details or fallback to safeAssessment)
      setModalAssessment(assessmentDetails || safeAssessment);
    }
  }, [isModalOpen, assessmentDetails, loading, error]);

  // Handle opening the modal, triggering the API call
  const openModal = () => {
    setIsModalOpen(true); // Open the modal
    setModalId(id); // Trigger the API call by setting the assessment ID
  };

  // Handle closing the modal
  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setModalAssessment(null); // Clear modal data
  };

  return (
    <div>
      {/* Wrapper div */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-lg">
        {/* Header Section */}
        <div className="px-6 pt-6 pb-4 space-y-3 border-b border-gray-100">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 min-h-[3rem]">
              <div className="mt-1 flex-shrink-0">
                <Book className="h-5 w-5 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 leading-tight break-words">
                {safeAssessment.name}
              </h3>
            </div>
            <div className="flex-shrink-0">
              <button
                onClick={() => onToggleSave(safeAssessment.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                aria-label={isSaved ? "Remove from saved" : "Save assessment"}
              >
                {isSaved ? (
                  <BookmarkCheck className="h-5 w-5" />
                ) : (
                  <Bookmark className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {safeAssessment.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 flex-shrink-0">
                <Book className="h-4 w-4 text-gray-500" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs text-gray-500">Questions</span>
                <span className="text-sm font-medium text-gray-900 truncate">
                  {safeAssessment.questionCount}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 flex-shrink-0">
                <Users className="h-4 w-4 text-gray-500" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs text-gray-500">Completed</span>
                <span className="text-sm font-medium text-gray-900 truncate">
                  {safeAssessment.completionCount.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 flex-shrink-0">
                <Clock className="h-4 w-4 text-gray-500" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs text-gray-500">Duration</span>
                <span className="text-sm font-medium text-gray-900 truncate">
                  {safeAssessment.duration || 'N/A'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 flex-shrink-0">
                <span className="text-sm font-semibold text-gray-500">©</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs text-gray-500">Credits</span>
                <span className="text-sm font-medium text-gray-900 truncate">
                  {safeAssessment.credits}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="p-6 pt-4">
          <button
            onClick={openModal} // Open the modal when clicked
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg
              bg-red-50 hover:bg-red-100 text-red-600 font-medium transition-colors
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
           Begin Assessment
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Modal Integration */}
      {isModalOpen && modalAssessment && (
        <AssessmentModal
          isOpen={isModalOpen} // Pass modal open state
          setIsOpen={setIsModalOpen} // Pass setIsOpen function to close modal
          assessment={modalAssessment} // Pass the assessment data to the modal
        />
      )}
    </div>
  );
}

export default AssessmentCard;
