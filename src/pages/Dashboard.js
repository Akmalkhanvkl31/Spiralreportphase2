/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { 
  BarChart3,
  ClipboardCheck,
  Clock,
  PlayCircle,
  TrendingUp,
  
  Plus,
  Star,
  ArrowUpRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../hooks/AuthContext';
import useReport from '../hooks/useReport';
import PageLoader from '../components/ui/PageLoader';

const DashboardStats = ({ icon: Icon, label, value, trend }) => (
  <div className="bg-white rounded-lg p-6">
    <div className="flex flex-col gap-4">
      <div className="p-2.5 bg-red-50 rounded-lg w-fit">
        <Icon className="w-5 h-5 text-red-500" />
      </div>
      <div>
        <div className="text-sm text-gray-600 mb-1">{label}</div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
      </div>
    </div>
    {trend && (
      <div className="mt-2 flex items-center gap-1 text-green-600 text-sm">
        <ArrowUpRight className="w-4 h-4" />
        {trend}
      </div>
    )}
  </div>
);

const AssessmentRow = ({ id, title, department, date, score, icon: Icon = Clock, onViewReport }) => {
  const formattedDate = date ? new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }) : null;

  return (
    <div 
      className="flex items-center py-4 hover:bg-gray-50 px-4 -mx-4 cursor-pointer"
      onClick={() => onViewReport(id)}
    >
      <div className="p-2 bg-gray-100 rounded-lg mr-4">
        <Icon className="w-4 h-4 text-gray-500" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 truncate">{title}</div>
        <div className="text-sm text-gray-500 truncate">
          {department} {formattedDate && `• ${formattedDate}`}
        </div>
      </div>
      <div className="text-base font-medium text-gray-900 ml-4">{score}</div>
    </div>
  );
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authData } = useAuth();
  const { fetchReport } = useReport();
  const [reportLoading, setReportLoading] = useState(false);
  
  const access_token = authData?.access_token || authData?.accessToken;
  const navigate = useNavigate();
  
  const handleStartAssessment = () => {
    navigate('/assessment');
  };

  const handleViewReport = async (assessmentId) => {
    if (reportLoading) {
      return;
    }

    setReportLoading(true);
    try {
      const reportData = await fetchReport(assessmentId);
      if (reportData) {
        navigate(`/report/${assessmentId}`, { state: { reportData } });
      }
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setReportLoading(false);
    }
  };

  const handleViewAllAssessments = () => {
    navigate('/assessmentsPage');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://app.spiralreports.com/api/dashboard', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        setDashboardData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [access_token]);

  if (loading || reportLoading) {
    return <PageLoader />;
  }

  const { recent_assessments, popular_assessments, total_assessments, assessments_this_month, average_maturity_score } = dashboardData?.data || {};

  return (
    <div>
      <Header />
      <div className="min-h-screen pt-20 bg-gray-50 pb-52"> {/* Added pb-52 for 200px bottom padding */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex gap-4 lg:gap-6 mb-6 sm:mb-8">
            <div className="lg:flex-1">
              <DashboardStats
                icon={ClipboardCheck}
                label="Total Assessments"
                value={total_assessments || '0'}
              />
            </div>
            <div className="lg:flex-1">
              <DashboardStats
                icon={BarChart3}
                label="Assessments This Month"
                value={assessments_this_month || '0'}
              />
            </div>
            <div className="lg:flex-1">
              <DashboardStats
                icon={TrendingUp}
                label="Average Maturity Score"
                value={average_maturity_score || '0%'}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Assessments</h2>
                  <button 
                    onClick={handleViewAllAssessments}
                    className="text-sm text-gray-600 hover:text-red-500"
                  >
                    View All
                  </button>
                </div>
                <div className="divide-y divide-gray-100">
                  {recent_assessments?.map((assessment) => (
                    <AssessmentRow
                      key={assessment.id}
                      id={assessment.id}
                      title={assessment.title}
                      department={assessment.department}
                      date={assessment.updatedAt}
                      score={assessment.maturity}
                      onViewReport={handleViewReport}
                    />
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Popular Assessments</h2>
                  <button className="text-sm text-gray-600 hover:text-red-500">
                    View All
                  </button>
                </div>
                <div className="divide-y divide-gray-100">
                  {popular_assessments?.map((assessment) => (
                    <AssessmentRow
                      key={assessment.id}
                      id={assessment.id}
                      title={assessment.title}
                      department={assessment.department}
                      score={assessment.avgMaturity}
                      icon={assessment.icon || Star}
                      onViewReport={handleViewReport}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PlayCircle className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Start New Assessment
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Begin a new assessment to evaluate your team's maturity.
                  </p>
                  <button
                    onClick={handleStartAssessment}
                    className="w-full flex items-center justify-center gap-2 text-sm font-medium text-white bg-red-500 rounded-lg py-2.5 px-4 hover:bg-red-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Start Assessment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;