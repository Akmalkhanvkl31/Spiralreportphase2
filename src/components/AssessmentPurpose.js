import React from 'react';
import { Building2, User } from 'lucide-react';

const ASSESSMENT_PURPOSES = [
  {
    id: 'client',
    title: 'Client Assessment',
    description: 'Conduct assessment for a specific client or organization',
    icon: Building2,
  },
  {
    id: 'personal',
    title: 'Personal Assessment',
    description: 'Take assessment for personal development or practice',
    icon: User,
  },
];

function AssessmentPurpose({ onSelectPurpose }) {
  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Assessment Purpose</h2>
        <p className="text-gray-600">Select the purpose of this assessment</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {ASSESSMENT_PURPOSES.map((purpose) => {
          const Icon = purpose.icon;
          return (
            <button
              key={purpose.id}
              onClick={() => onSelectPurpose(purpose.id)}  // Trigger the onSelectPurpose handler
              className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-xl hover:border-red-500 hover:bg-red-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <div className="p-3 bg-red-100 rounded-full mb-4">
                <Icon className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{purpose.title}</h3>
              <p className="text-sm text-gray-600 text-center">{purpose.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default AssessmentPurpose;
