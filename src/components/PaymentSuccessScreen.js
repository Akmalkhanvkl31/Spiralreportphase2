import React from 'react';
import { 
  CheckCircle2,
  ArrowLeft,
  ChevronRight,
  Download,
  CreditCard,
  Calendar,
  Clock,
  Hash
} from 'lucide-react';

const PaymentSuccessScreen = () => {
  const paymentDetails = {
    amount: '$199.00',
    orderId: 'ORD123456789',
    date: 'March 6, 2024',
    time: '15:30 PM',
    card: '•••• 4242',
    description: 'Premium Plan - Annual Subscription'
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
          <h1 className="text-2xl font-bold text-white">Payment Success</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-lg mx-auto px-4 sm:px-6 -mt-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Success Message */}
          <div className="text-center p-8">
            <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-500">
              Thank you for your payment. Your transaction has been completed successfully.
            </p>
          </div>

          {/* Amount & Description */}
          <div className="border-t border-b border-gray-100 px-8 py-6">
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">Amount Paid</div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {paymentDetails.amount}
              </div>
              <div className="text-sm text-gray-500">
                {paymentDetails.description}
              </div>
            </div>
          </div>

          {/* Payment Details */}
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
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-gray-100 p-8">
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between text-sm font-medium text-gray-600 border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors">
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download Receipt
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button className="w-full flex items-center justify-center gap-2 text-sm font-medium text-white bg-red-500 rounded-lg p-3 hover:bg-red-600 transition-colors">
                <CreditCard className="w-4 h-4" />
                Make Another Payment
              </button>
            </div>
          </div>
        </div>

        {/* Return Link */}
        <div className="text-center mt-6">
          <button className="text-sm text-gray-500 hover:text-gray-700">
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessScreen;