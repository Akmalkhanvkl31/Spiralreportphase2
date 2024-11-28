import React, { useState, useEffect } from 'react';
import { 
  XOctagon,
  ArrowLeft,
  ChevronRight,
  CreditCard,
  Calendar,
  Clock,
  Hash,
  AlertCircle,
  RefreshCcw,
  Home
} from 'lucide-react';

const PaymentCancelledScreen = () => {
  const [loading, setLoading] = useState(true);

  // Simulating asynchronous data fetching
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000); // Simulate a 2s load time
  }, []);

  const paymentDetails = {
    amount: '$199.00',
    orderId: 'ORD123456789',
    date: 'March 6, 2024',
    time: '15:30 PM',
    description: 'Premium Plan - Annual Subscription',
    cancelReason: 'Transaction cancelled by user'
  };

  const DetailRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-50 rounded-lg">
          <Icon className="w-4 h-4 text-gray-400" />
        </div>
        <span className="text-gray-500">{label}</span>
      </div>
      <span className="text-gray-900 font-medium">{value}</span>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-gray-500">Loading payment details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-red-500 pt-6 pb-12">
        <div className="max-w-lg mx-auto px-4 sm:px-6">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4"
            aria-label="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl font-bold text-white">Payment Cancelled</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-lg mx-auto px-4 sm:px-6 -mt-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Cancelled Message */}
          <div className="text-center p-8">
            <div className="bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <XOctagon className="w-12 h-12 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Cancelled
            </h2>
            <p className="text-gray-500">
              Your payment process has been cancelled. No charges have been made to your account.
            </p>
          </div>

          {/* Cancellation Details */}
          <div className="border-t border-b border-gray-100 px-8 py-6">
            <div className="bg-orange-50 border border-orange-100 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-orange-500 shrink-0" />
                <div>
                  <div className="text-sm font-medium text-orange-800 mb-1">
                    Transaction Status: Cancelled
                  </div>
                  <div className="text-sm text-orange-700">
                    {paymentDetails.cancelReason}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="p-8">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Attempt Details
            </h3>
            <div className="divide-y divide-gray-100">
              <DetailRow 
                icon={Hash}
                label="Reference ID" 
                value={paymentDetails.orderId} 
              />
              <DetailRow 
                icon={Calendar}
                label="Date" 
                value={paymentDetails.date} 
              />
              <DetailRow 
                icon={Clock}
                label="Time" 
                value={paymentDetails.time} 
              />
              <DetailRow 
                icon={AlertCircle}
                label="Amount" 
                value={paymentDetails.amount} 
              />
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-gray-100 p-8">
            <div className="space-y-4">
              <button className="w-full flex items-center justify-center gap-2 text-sm font-medium text-white bg-red-500 rounded-lg p-3 hover:bg-red-600 transition-colors">
                <RefreshCcw className="w-4 h-4" />
                Try Payment Again
              </button>
              <button className="w-full flex items-center justify-between text-sm font-medium text-gray-600 border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Change Payment Method
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button className="w-full flex items-center justify-between text-sm font-medium text-gray-600 border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors">
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Return to Dashboard
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Want to learn more about our payment process?{' '}
            <button className="text-red-500 hover:text-red-600">
              View payment guide
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelledScreen;
