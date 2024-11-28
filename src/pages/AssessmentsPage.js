/* eslint-disable no-unused-vars */
import React, { useState ,useEffect,useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MoreVertical, Share2, FileText, ArrowLeft, Trash2, Shield, Coins } from 'lucide-react';
import useAssessments from '../hooks/useAssessments';
import useReport from '../hooks/useReport';
import Header from '../components/Header';
import TableLoader from '../components/ui/Table Loading Animation';
import PageLoader from '../components/ui/PageLoader';
const AssessmentsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFramework, setSelectedFramework] = useState('all');
    const [selectedMaturity, setSelectedMaturity] = useState('all');
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState({});
    const [isDeleting, setIsDeleting] = useState(false);
    const [assessmentToDelete, setAssessmentToDelete] = useState(null);
    const { assessments, loading, deleteAssessment } = useAssessments();
    const { isLoading: reportLoading, fetchReport } = useReport();
    const navigate = useNavigate();
    const menuRefs = useRef({});
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        }).format(date);
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            Object.entries(menuRefs.current).forEach(([draftId, menuRef]) => {
                if (menuRef && !menuRef.contains(event.target)) {
                    setIsMoreMenuOpen(prev => ({
                        ...prev,
                        [draftId]: false
                    }));
                }
            });
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    const getRelativeTime = (dateString) => {
        const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = date.getTime() - now.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === -1) return 'Yesterday';
        if (diffDays > -7) return rtf.format(diffDays, 'day');
        if (diffDays > -30) return rtf.format(Math.round(diffDays / 7), 'week');
        if (diffDays > -365) return rtf.format(Math.round(diffDays / 30), 'month');
        return rtf.format(Math.round(diffDays / 365), 'year');
    };

    const getMaturityColor = (score) => {
        if (score >= 80) return 'text-green-600 ';
        if (score >= 60) return 'text-yellow-600 ';
        return 'text-red-600 ';
    };

    const getMaturityLabel = (score) => {
        if (score >= 80) return 'Excellent';
        if (score >= 60) return 'Good';
        return 'Needs Improvement';
    };

    const toggleMoreMenu = (id) => {
        setIsMoreMenuOpen(prev => {
            // Close all other menus
            const newState = Object.keys(prev).reduce((acc, key) => {
                acc[key] = false;
                return acc;
            }, {});
            // Toggle the clicked menu
            newState[id] = !prev[id];
            return newState;
        });
    };

    const handleDeleteConfirmation = (assessmentId) => {
        setAssessmentToDelete(assessmentId);
        setIsDeleting(true);
    };

    const handleCancelDelete = () => {
        setAssessmentToDelete(null);
        setIsDeleting(false);
    };

    const handleDelete = async () => {
        if (assessmentToDelete) {
            try {
                await deleteAssessment(assessmentToDelete);
                setAssessmentToDelete(null);
                setIsDeleting(false);
            } catch (err) {
                setIsDeleting(false);
                console.error('Delete failed:', err);
            }
        }
    };

    const filteredAssessments = assessments.filter((assessment) => {
        const matchesSearch =
            assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            assessment.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFramework = selectedFramework === 'all' || assessment.compliance === selectedFramework;
        const matchesMaturity =
            selectedMaturity === 'all' ||
            (selectedMaturity === 'high' && assessment.maturity >= 80) ||
            (selectedMaturity === 'medium' && assessment.maturity >= 60 && assessment.maturity < 80) ||
            (selectedMaturity === 'low' && assessment.maturity < 60);

        return matchesSearch && matchesFramework && matchesMaturity;
    });

    const frameworks = [
        { id: 'iso27001', name: 'ISO 27001' },
        { id: 'gdpr', name: 'GDPR' },
        { id: 'hipaa', name: 'HIPAA' },
        { id: 'pci', name: 'PCI DSS' },
        { id: 'sox', name: 'Sarbanes-Oxley (SOX)' },
        { id: 'nist', name: 'NIST Cybersecurity Framework' },
        { id: 'isms', name: 'ISMS' },
        { id: 'iso', name: 'ISO' },
        { id: 'ssae18', name: 'SSAE 18' },
        { id: 'soc2', name: 'SOC 2' },
        { id: 'soc1', name: 'SOC 1' },
        { id: 'infosec', name: 'Infosec' },
        { id: 'dpia', name: 'DPIA' },
        { id: 'dataProtection', name: 'Data Protection' },
        { id: 'bia', name: 'BIA' },
        { id: 'bcp', name: 'BCP' },
        { id: 'dr', name: 'Disaster Recovery (DR)' },
        { id: 'gcr', name: 'GCR' },
    ];

    const handleViewReport = async (assessmentId) => {
        if (reportLoading) {
            return; // Prevent multiple clicks while loading
        }

        try {
            const reportData = await fetchReport(assessmentId);
            if (reportData) {
                navigate(`/report/${assessmentId}`, { state: { reportData } });
            }
        } catch (error) {
            console.error('Error fetching report:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="bg-red-500 pt-20 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <button
                        className="flex items-center gap-2 text-white/90 hover:text-white mb-4"
                        aria-label="Go back"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                    </button>
                    <h1 className="text-2xl font-bold text-white">My Assessments</h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6 pb-52">               
                 <div className="bg-white rounded-xl shadow-sm">
                    <div className="p-4 border-b border-gray-100">
                        <div className="flex flex-row gap-4">
                            <div className="flex-1 flex gap-4">
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        placeholder="Search assessments..."
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                                </div>
                                <select
                                    className="px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                    value={selectedFramework}
                                    onChange={(e) => setSelectedFramework(e.target.value)}
                                >
                                    <option value="all">All Frameworks</option>
                                    {frameworks.map((framework) => (
                                        <option key={framework.id} value={framework.id}>
                                            {framework.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <select
                                className="px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                value={selectedMaturity}
                                onChange={(e) => setSelectedMaturity(e.target.value)}
                            >
                                <option value="all">All Scores</option>
                                <option value="high">High (80%+)</option>
                                <option value="medium">Medium (60-79%)</option>
                                <option value="low">Low (&lt;60%)</option>
                            </select>
                        </div>
                    </div>

                    {/* Table Section */}
                    {loading ? (
                        <TableLoader />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Framework & Tags
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Created
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Credits
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Maturity Score
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredAssessments.map((assessment) => (
                                        <tr key={assessment.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">{assessment.name}</div>
                                                <div className="text-sm text-gray-500">{assessment.title}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="mb-2 flex items-center gap-1.5">
                                                    <Shield className="w-3.5 h-3.5 text-gray-400" />
                                                    <span className="text-sm text-gray-900 uppercase">{assessment.compliance}</span>
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
                                                    <span className={`text-lg font-bold mb-1 ${getMaturityColor(assessment.maturity)}`}>
                                                        {assessment.maturity}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleViewReport(assessment.id)}
                                                        className="px-3 py-1 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600"
                                                        disabled={reportLoading}
                                                    >
                                                        {reportLoading ? 'Loading...' : 'View Report'}
                                                    </button>
                                                    <div className="relative">
                                                        <button
                                                            onClick={() => toggleMoreMenu(assessment.id)}
                                                            className="p-1 rounded-lg hover:bg-gray-100"
                                                            aria-label={`More actions for ${assessment.title}`}
                                                        >
                                                            <MoreVertical className="w-4 h-4 text-gray-400" />
                                                        </button>
                                                        {isMoreMenuOpen[assessment.id] && (
                <div 
                    ref={el => menuRefs.current[assessment.id] = el}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10"
                >
                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                        <Share2 className="w-4 h-4" />
                        Share Report
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Download PDF
                    </button>
                    <button
                        onClick={() => handleDeleteConfirmation(assessment.id)}
                        className="w-full px-4 py-2 text-left text-red-600 text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete Report
                    </button>
                </div>
            )}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Loading Spinner */}
            {reportLoading && <PageLoader />}


            {/* Delete Confirmation Modal */}
            {isDeleting && (
                <div className="fixed inset-0 flex items-center justify-center z-20 bg-gray-600 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Are you sure you want to delete this assessment?
                        </h3>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={handleCancelDelete}
                                className="px-4 py-2 text-sm text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssessmentsPage;
