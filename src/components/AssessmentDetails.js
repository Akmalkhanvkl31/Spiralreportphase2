import React from 'react';
import { FileText, Tag, Target, ChevronRight } from 'lucide-react';

function AssessmentDetails({ assessment, onNext }) {
  // Log the assessment prop to ensure it's receiving the expected data
  // console.log('Assessment:', assessment);

  // Handle null or undefined objectives
  const objectives = Array.isArray(assessment.objectives) ? assessment.objectives : [];

  // Log the objectives array to ensure it's correctly populated
  // console.log('Objectives:', objectives);
console.log(assessment);

  return (
    <div className="p-6">
      {/* Title Section */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-50 rounded-lg">
            <FileText className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{assessment.title}</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {assessment.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
          <p className="text-gray-600">{assessment.description}</p>
        </div>

        {/* Categories Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Tag className="h-4 w-4 text-gray-500" />
            Categories
          </h3>
          <div className="flex flex-wrap gap-2">
            {/* Capitalizing each word in the category */}
            {(assessment.categories || []).map((category, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium"
              >
                {category
                  .split(' ') // Split the string into words by spaces
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
                  .join(' ')} {/* Join the words back with a space */}
              </span>
            ))}
          </div>
        </div>

        {/* Learning Objectives Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Target className="h-4 w-4 text-gray-500" />
            Learning Objectives
          </h3>
          {/* Render Learning Objectives Line by Line */}
          <div className="space-y-2">
            {objectives.length > 0 ? (
              objectives.map((objective, index) => (
                <div key={index} className="text-gray-600 text-sm">
                  - {objective}
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-sm">No objectives available</div>
            )}
          </div>
        </div>

        {/* Assessment Details Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
          {/* Questions */}
          <div>
            <span className="text-xs text-gray-500">Questions</span>
            <p className="text-sm font-medium text-gray-900">{assessment.questionSet?.length || 'N/A'}</p>
          </div>

          {/* Duration */}
          <div>
            <span className="text-xs text-gray-500">Duration</span>
            <p className="text-sm font-medium text-gray-900">{assessment.duration || 'N/A'}</p>
          </div>

          {/* Credits */}
          <div>
            <span className="text-xs text-gray-500">Credits</span>
            <p className="text-sm font-medium text-gray-900">{assessment.credReq }</p>
          </div>

          {/* Last Updated */}
          <div>
            <span className="text-xs text-gray-500">Last Updated</span>
            <p className="text-sm font-medium text-gray-900">
              {assessment.updatedAt ? new Date(assessment.updatedAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 flex justify-end border-t border-gray-100 pt-4">
        <button
          onClick={onNext}
          className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Start Assessment
          <ChevronRight className="inline-block ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default AssessmentDetails;
