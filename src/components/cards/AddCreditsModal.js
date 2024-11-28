import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Minus,
  Plus,
  ArrowLeft,
  Package,
  Zap,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import Alert, { AlertDescription } from '../ui/Alert';
import { useNavigate } from 'react-router-dom';
import usePaymentCheckout from '../../hooks/usePaymentCheckout'; // Import the custom hook

const AddCreditsPage = ({ onClose }) => {
  const [selectedCredits, setSelectedCredits] = useState(50);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const creditPackages = [
    { id: 1, credits: 50, price: 50, popular: false, savePercentage: 0 },
    { id: 2, credits: 100, price: 100, popular: true, savePercentage: 0 },
    { id: 3, credits: 200, price: 200, popular: false, savePercentage: 0 }
  ];

  const { loading, error: apiError, checkoutUrl, transactionId, checkout } = usePaymentCheckout(); // Use the custom hook

  const handleIncrement = () => {
    if (selectedCredits < 300) {
      setSelectedCredits(prev => prev + 5);
      setSelectedPackage(null);
    }
  };

  const handleDecrement = () => {
    if (selectedCredits > 1) {
      setSelectedCredits(prev => prev - 1);
      setSelectedPackage(null);
    }
  };

  const handlePackageSelect = (packageId) => {
    const selectedPkg = creditPackages.find(pkg => pkg.id === packageId);
    if (selectedPkg) {
      setSelectedCredits(selectedPkg.credits);
      setSelectedPackage(packageId);
    }
  };

  const handlePurchase = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      // Call the checkout API using the custom hook
      await checkout(selectedCredits);
    } catch (err) {
      setError(apiError || 'Unable to process purchase. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Redirect to checkout URL after it's set
  useEffect(() => {
    if (checkoutUrl) {
      // Ensure that we only navigate when the checkoutUrl is available
      window.location.href = checkoutUrl;
    }
  }, [checkoutUrl]); // This will trigger every time checkoutUrl changes
  
  const handleBackClick = () => {
    navigate("/payment-cancel"); // Navigate to PaymentCancelPage when back is clicked
  };

  // Update the price calculation logic: 1 credit = 1 dollar
  const calculatePrice = (credits) => {
    return credits; // 1 credit = 1 dollar, so price is equal to the number of credits
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-red-500 pt-6 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-bold text-white">Add Credits</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col space-y-3 mb-6">
            {creditPackages.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => handlePackageSelect(pkg.id)}
                className={`relative w-full p-4 rounded-lg border transition-all duration-300 ease-in-out transform ${
                  selectedPackage === pkg.id 
                    ? 'border-red-500 bg-red-50 scale-105' 
                    : 'border-gray-100 hover:border-red-200'
                }`}
                aria-pressed={selectedPackage === pkg.id}
                aria-label={`${pkg.credits} credits package for $${pkg.price}`}
              >
                {pkg.popular && (
                  <span className="absolute -top-2 right-4 px-2 py-0.5 bg-red-500 text-white text-xs font-medium rounded-full">
                    Popular
                  </span>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <Package className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="text-left">
                      <div className="text-lg font-bold text-gray-800">
                        {pkg.credits} Credits
                      </div>
                      <div className="text-sm text-gray-500">
                        ${pkg.price}
                        {pkg.savePercentage > 0 && (
                          <span className="text-green-600 ml-2">
                            Save {pkg.savePercentage}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {selectedPackage === pkg.id && (
                    <div className="text-red-500">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-800 mb-3">Custom Amount</h2>
            <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg shadow-sm">
              <button 
                onClick={handleDecrement}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                disabled={selectedCredits <= 1}
                aria-label="Decrease credits"
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className="text-center" aria-live="polite">
                <div className="text-xl font-bold text-gray-800">
                  {selectedCredits}
                </div>
                <div className="text-xs text-gray-500">Credits</div>
              </div>

              <button 
                onClick={handleIncrement}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                disabled={selectedCredits >= 300}
                aria-label="Increase credits"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-1.5 text-xs text-gray-500 text-center">
              Adjust credits in increments of 1 (max 300)
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <div className="text-sm text-gray-600">Selected Credits</div>
              <div className="text-base font-semibold text-gray-800">{selectedCredits}</div>
            </div>
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-gray-600">Total Price</div>
              <div className="text-xl font-bold text-gray-800">
                ${calculatePrice(selectedCredits)}
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Zap className="w-3.5 h-3.5" />
              <span>Credits will be added instantly after payment</span>
            </div>
          </div>

          <button 
            onClick={handlePurchase}
            disabled={loading || isProcessing}
            className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-70"
          >
            {loading || isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                Purchase Credits
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCreditsPage;
