import React, { useState, useEffect, useRef } from 'react';
import { Search, MoreVertical, Edit2, ArrowLeft, Trash2, Clock, FileText } from 'lucide-react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

const DraftAssessmentsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFramework, setSelectedFramework] = useState('all');
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState({});
    const [isDeleting, setIsDeleting] = useState(false);
    const [draftToDelete, setDraftToDelete] = useState(null);
    const menuRefs = useRef({});
    const navigate = useNavigate();
    // Static draft data
    const draftAssessments = [
        {
            id: 1,
            name: "Annual Security Review",
            title: "Information Security Assessment 2024",
            framework: "ISO 27001",
            lastModified: "2024-03-15T10:30:00",
            status: "In Progress",
            completionPercentage: 65
        },
        {
            id: 2,
            name: "GDPR Compliance Check",
            title: "Data Protection Impact Assessment",
            framework: "GDPR",
            lastModified: "2024-03-14T15:45:00",
            status: "Not Started",
            completionPercentage: 0
        },
        {
            id: 3,
            name: "Healthcare Systems Audit",
            title: "HIPAA Compliance Review",
            framework: "HIPAA",
            lastModified: "2024-03-13T09:20:00",
            status: "In Progress",
            completionPercentage: 30
        }
    ];

    const frameworks = [
        { id: 'iso27001', name: 'ISO 27001' },
        { id: 'gdpr', name: 'GDPR' },
        { id: 'hipaa', name: 'HIPAA' },
        { id: 'pci', name: 'PCI DSS' },
        { id: 'nist', name: 'NIST Cybersecurity Framework' }
    ];

    // Effect for handling outside clicks
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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }).format(date);
    };

    const getRelativeTime = (dateString) => {
        const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = date.getTime() - now.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === -1) return 'Yesterday';
        if (diffDays > -7) return rtf.format(diffDays, 'day');
        return rtf.format(Math.round(diffDays / 7), 'week');
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

    const handleDeleteConfirmation = (draftId) => {
        setDraftToDelete(draftId);
        setIsDeleting(true);
    };

    const handleCancelDelete = () => {
        setDraftToDelete(null);
        setIsDeleting(false);
    };

    const handleDelete = () => {
        // In a real app, this would delete the draft
        console.log('Deleting draft:', draftToDelete);
        setDraftToDelete(null);
        setIsDeleting(false);
    };

    const handleContinueDraft = (draftId) => {
        console.log('Continuing draft:', draftId);
    };

  

    // Filter drafts based on search term and selected framework
    const filteredDrafts = draftAssessments.filter(draft => {
        const matchesSearch = 
            draft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            draft.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFramework = selectedFramework === 'all' || draft.framework.toLowerCase() === selectedFramework;
        return matchesSearch && matchesFramework;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
           <Header/>

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
                    <h1 className="text-2xl font-bold text-white">Draft Assessments</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6 pb-52">
                <div className="bg-white rounded-xl shadow-sm">
                    <div className="p-4 border-b border-gray-100">
                        <div className="flex flex-row gap-4">
                            <div className="flex-1 flex gap-4">
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        placeholder="Search drafts..."
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
                                        <option key={framework.id} value={framework.id.toLowerCase()}>
                                            {framework.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Framework
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Last Modified
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Completion
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredDrafts.map((draft) => (
                                    <tr key={draft.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{draft.name}</div>
                                            <div className="text-sm text-gray-500">{draft.title}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{draft.framework}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{formatDate(draft.lastModified)}</div>
                                            <div className="text-sm text-gray-500">{getRelativeTime(draft.lastModified)}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm text-gray-900">{draft.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div 
                                                    className="bg-red-500 h-2.5 rounded-full"
                                                    style={{ width: `${draft.completionPercentage}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm text-gray-500 mt-1">{draft.completionPercentage}%</span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleContinueDraft(draft.id)}
                                                    className="px-3 py-1 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600"
                                                >
                                                    Continue
                                                </button>
                                                <div 
                                                    className="relative"
                                                    ref={el => menuRefs.current[draft.id] = el}
                                                >
                                                    <button
                                                        onClick={() => toggleMoreMenu(draft.id)}
                                                        className="p-1 rounded-lg hover:bg-gray-100"
                                                    >
                                                        <MoreVertical className="w-4 h-4 text-gray-400" />
                                                    </button>
                                                    {isMoreMenuOpen[draft.id] && (
                                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                                                            <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                                                                <Edit2 className="w-4 h-4" />
                                                                Rename
                                                            </button>
                                                            <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                                                                <FileText className="w-4 h-4" />
                                                                Export
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteConfirmation(draft.id)}
                                                                className="w-full px-4 py-2 text-left text-red-600 text-sm hover:bg-gray-50 flex items-center gap-2"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                                Delete
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
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {isDeleting && (
                <div className="fixed inset-0 flex items-center justify-center z-20 bg-gray-600 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Are you sure you want to delete this draft?
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

export default DraftAssessmentsPage;