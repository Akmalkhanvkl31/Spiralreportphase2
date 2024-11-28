/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import AssessmentCard from '../components/cards/AssessmentCard';
import { useAuth } from '../hooks/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import PageLoader from '../components/ui/PageLoader';
function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [savedAssessments, setSavedAssessments] = useState([]);
  const [assessments, setAssessments] = useState([]); // Initialize as an empty array
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const { authData, setAuthData, refreshToken } = useAuth();
  const navigate = useNavigate(); // For navigation
  console.log(authData.access_token);

  // Get the access token from either location state or authData
  const access_token = authData.access_token||authData?.accessToken;

  // Organize assessments into a 3x2 grid structure
  const toggleSave = (assessmentId) => {
    setSavedAssessments((prev) =>
      prev.includes(assessmentId) ? prev.filter((id) => id !== assessmentId) : [...prev, assessmentId]
    );
  };

  useEffect(() => {
    // If access_token exists, verify it's not expired
    if (access_token) {
      const checkTokenExpiry = () => {
        const isExpired = checkTokenExpiryFunction(access_token);
        if (isExpired) {
          // If the token is expired, attempt to refresh the token
          refreshToken().then(() => {
            // Refresh is successful, proceed to fetch assessments
            fetchAssessments();
          }).catch(() => {
            // Refresh failed, log out the user and redirect to login page
            logoutAndRedirect();
          });
        } else {
          // If token is valid, proceed to fetch assessments
          fetchAssessments();
        }
      };
  
      checkTokenExpiry();
    }
  }, [access_token, refreshToken]);  // Re-run when access_token changes

  // Function to check if the JWT token is expired
  const checkTokenExpiryFunction = (token) => {
    try {
      const { exp } = JSON.parse(atob(token.split('.')[1])); // Decode the JWT payload
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      return exp < currentTime; // Return true if the token is expired
    } catch (e) {
      console.error('Error checking token expiry:', e);
      return true; // If decoding fails, assume expired
    }
  };

  const fetchAssessments = async () => {
    setIsLoading(true); // Start loading
    try {
      const response = await fetch('https://app.spiralreports.com/api/assessments/all?page=1&limit=10&orderBy=desc', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        const formattedAssessments = data.data.results.map((assessment) => ({
          id: assessment.id,
          name: assessment.title,
          tags: assessment.tags,
          questionCount: assessment.questionCount,
          completionCount: assessment.evaluationCount || 0,
          duration: 'N/A',
          credits: assessment.credReq || 0,
        })).sort((a, b) => b.completionCount - a.completionCount);
        
        setAssessments(formattedAssessments);
      } else if (response.status === 401) {
        // If 401 Unauthorized, the token is invalid or expired
        console.log('Access token expired or invalid, logging out...');
        
        // Log out the user and redirect to the login page
        logoutAndRedirect();
      } else {
        throw new Error('Failed to fetch assessments');
      }
    } catch (error) {
      console.error('Error fetching assessments:', error);
      // You can show an error message to the user or handle it differently
    } finally {
      setIsLoading(false); // End loading regardless of outcome
    }
  };
  
  // Helper function to log out and navigate to the login page
  const logoutAndRedirect = () => {
    setAuthData(null); // Clear authentication data
    localStorage.removeItem('authData');
    navigate('/login'); // Redirect to login
  };  

  // Filter assessments based on search query
  const filteredAssessments = assessments.filter((assessment) => {
    const lowercasedSearchQuery = searchQuery.toLowerCase();
    return (
      assessment.name.toLowerCase().includes(lowercasedSearchQuery) ||
      assessment.tags.some((tag) => tag.toLowerCase().includes(lowercasedSearchQuery))
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {isLoading && <PageLoader />}
      <Header/>
      {/* Header Section */}
      <div className="bg-red-500 pt-20 pb-4">
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="text-white hover:text-gray-200"
          >
            {/* Sidebar Icon */}
          </button>
        </div>
      </div>

      <div className="bg-red-500 pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-8">
          <h1 className="text-2xl font-bold text-white">Begin Assessment</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 -mt-8 pb-52"> {/* Added pb-52 for 200px bottom padding */}
        {/* Search Bar */}
        <div className="relative mb-12">
          <input
            type="text"
            placeholder="Search assessments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 pl-14 rounded-xl border border-gray-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          <Search className="absolute left-5 top-5 text-gray-400" size={20} />
        </div>

        {/* Popular Assessments Section */}
        <div className="max-w-7xl mx-auto px-8 mt-6">
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Popular Assessments</h2>
              <button className="flex items-center gap-2 px-4 py-2 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors font-medium">
                View Most Popular
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAssessments.length > 0 ? (
                  filteredAssessments.map((assessment) => (
                    <AssessmentCard
                      key={assessment.id}
                      assessment={assessment}
                      isSaved={savedAssessments.includes(assessment.id)}
                      onToggleSave={toggleSave}
                      access_token={access_token}  
                    />
                  ))
                ) : (
                  <p>No assessments found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> 
  );
}

export default SearchPage;