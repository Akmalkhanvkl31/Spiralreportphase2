import React from 'react';
import { 
  XCircle,
  ArrowLeft,
  ChevronRight,
  RefreshCcw,
  Calendar,
  Clock,
  CreditCard,
  Hash,
  AlertCircle,
  MessageCircle
} from 'lucide-react';

const PaymentFailedScreen = () => {
  const paymentDetails = {
    amount: '$199.00',
    orderId: 'ORD123456789',
    date: 'March 6, 2024',
    time: '15:30 PM',
    card: '•••• 4242',
    description: 'Premium Plan - Annual Subscription',
    errorCode: 'ERR_CARD_DECLINED',
    errorMessage: 'Your card was declined. Please try a different payment method or contact your bank.'
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-red-500 pt-6 pb-12">
        <div className="max-w-lg mx-auto px-4 sm:px-6">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl font-bold text-white">Payment Failed</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-lg mx-auto px-4 sm:px-6 -mt-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Failed Message */}
          <div className="text-center p-8">
            <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Failed
            </h2>
            <p className="text-gray-500">
              We couldn't process your payment. Please try again or use a different payment method.
            </p>
          </div>

          {/* Error Details */}
          <div className="border-t border-b border-gray-100 px-8 py-6">
            <div className="bg-red-50 border border-red-100 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <div>
                  <div className="text-sm font-medium text-red-800 mb-1">
                    {paymentDetails.errorCode}
                  </div>
                  <div className="text-sm text-red-700">
                    {paymentDetails.errorMessage}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="p-8">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Transaction Details
            </h3>
            <div className="divide-y divide-gray-100">
              <DetailRow 
                icon={Hash}
                label="Order ID" 
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
                icon={CreditCard}
                label="Payment Method" 
                value={paymentDetails.card} 
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
                Try Again
              </button>
              <button className="w-full flex items-center justify-between text-sm font-medium text-gray-600 border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Contact Support
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Need help? <button className="text-red-500 hover:text-red-600">View our payment guide</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailedScreen;
