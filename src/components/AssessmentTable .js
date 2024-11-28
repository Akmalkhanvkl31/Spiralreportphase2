import React, { useState } from 'react';
import { MoreVertical, Share2, FileText, Trash2, Tag, Shield, Coins } from 'lucide-react';
import useAssessments from './useAssessments'; // Import the custom hook

const AssessmentTable = ({ access_token, getMaturityLabel, getMaturityColor, formatDate, getRelativeTime }) => {
  const { assessments, loading, error } = useAssessments(access_token); // Use the custom hook
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState({});

  const toggleMoreMenu = (assessmentId) => {
    setIsMoreMenuOpen((prev) => ({
      ...prev,
      [assessmentId]: !prev[assessmentId],
    }));
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assessment Details</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Framework & Tags</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Maturity Score</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {assessments && assessments.length > 0 ? (
            assessments.map((assessment) => (
              <tr key={assessment._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{assessment.title}</div>
                  {/* <div className="text-sm text-gray-500">{assessment.name}</div> */}
                </td>
                <td className="px-6 py-4">
                  <div className="mb-2 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-sm text-gray-900">{assessment.compliance}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {assessment.subdomainScore?.map((subdomain, index) => (
                      <span key={index} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        <Tag className="w-3 h-3" />
                        {subdomain.subdomain}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{formatDate(assessment.createdAt)}</div>
                  <div className="text-sm text-gray-500">{getRelativeTime(assessment.createdAt)}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-sm text-gray-900">
                    <Coins className="w-4 h-4 text-gray-400" />
                    {assessment.creditsUsed}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col items-start">
                    <span className={`text-lg font-bold mb-1 ${assessment.maturity >= 80 ? 'text-green-600' : assessment.maturity >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {assessment.maturity}%
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getMaturityColor(assessment.maturity)}`}>
                      {getMaturityLabel(assessment.maturity)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button className="px-3 py-1 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600">
                      View Report
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => toggleMoreMenu(assessment._id)}
                        className="p-1 rounded-lg hover:bg-gray-100"
                        aria-label={`More actions for ${assessment.title}`}
                      >
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                      {isMoreMenuOpen[assessment._id] && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                          <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                            <Share2 className="w-4 h-4" />
                            Share Report
                          </button>
                          <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Download PDF
                          </button>
                          <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                            <Trash2 className="w-4 h-4" />
                            Delete Report
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center text-gray-500">No assessments found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AssessmentTable;
