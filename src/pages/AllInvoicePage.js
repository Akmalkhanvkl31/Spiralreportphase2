/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { 
  ArrowLeft,
  Download,
  Search,
  ChevronDown,
  Filter,
  CreditCard,
  FileCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate from react-router-dom
import useTransactions from '../hooks/useTransactions';
import Header from '../components/Header';

const AllInvoicePage = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const token = localStorage.getItem('authToken');

  // Use navigate hook to go back
  const navigate = useNavigate();

  const { transactions, loading, error } = useTransactions(token, page);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-700';
      case 'INITIAL':
        return 'bg-yellow-100 text-yellow-700';
      case 'FAILED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'CREDIT':
        return <CreditCard className="w-5 h-5 text-green-500" />;
      case 'DEBIT':
        return <FileCheck className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const formatTrnRef = (ref) => {
    if (ref.startsWith('Assessment')) {
      return ref.replace('Assessment', '').trim();
    }
    if (ref.startsWith('cs_test')) {
      return ref.substring(0, 15) + '...';
    }
    return ref;
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredTransactions = Array.isArray(transactions) 
    ? transactions.filter((transaction) => {
        const lowerCaseSearchQuery = searchQuery.toLowerCase();
        return (
          transaction.trnRef.toLowerCase().includes(lowerCaseSearchQuery) ||
          transaction.description.toLowerCase().includes(lowerCaseSearchQuery)
        );
      })
    : [];

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header/>
      <div className="bg-red-500 pt-20 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <button 
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4"
            onClick={() => navigate(-1)}  // Navigate back to the previous page
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Transactions</h1>
            <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg text-red-500 text-sm font-medium hover:bg-white/90 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-6">
        <div className="bg-white rounded-xl shadow-sm">
          {/* Filters */}
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search by transaction ID or description..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:border-gray-300 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
                <button className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:border-gray-300 flex items-center gap-2">
                  <span>Last 30 days</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Transactions List */}
          <div className="divide-y divide-gray-100">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map(transaction => (
                <div 
                  key={transaction._id} 
                  className="p-4 sm:p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-900">
                            {transaction.type === 'CREDIT' 
                              ? `Added $${transaction.credits} Credits`
                              : 'Used Credits for Assessment'}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {transaction.description}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          ID: {formatTrnRef(transaction.trnRef)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.type === 'CREDIT' ? '+' : '-'}{transaction.credits} credits
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {formatDate(transaction.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 sm:p-6 text-gray-500">
                No transactions found.
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="p-4 sm:p-6 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {transactions.length} transactions
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                  Previous
                </button>
                <button className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:border-gray-300">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllInvoicePage;
