'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface PaymentSuccessProps {
  onClose: () => void;
}

const PaymentSuccess = ({ onClose }: PaymentSuccessProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Auto-hide after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to complete
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="bg-gradient-to-r from-green-900/90 to-emerald-800/90 backdrop-blur-sm border border-green-500/30 rounded-xl p-6 shadow-2xl max-w-md">
        <div className="flex items-start gap-4">
          {/* Success Icon */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-400 animate-pulse" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-green-100 mb-1">
              Payment Successful! 🎉
            </h3>
            <p className="text-green-200/80 text-sm mb-3">
              Welcome to PDFtoolAI Pro! Your subscription is now active and you have access to all premium features.
            </p>
            
            {/* Features List */}
            <div className="space-y-1 mb-4">
              <div className="flex items-center gap-2 text-green-200/70 text-xs">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                Unlimited PDF uploads
              </div>
              <div className="flex items-center gap-2 text-green-200/70 text-xs">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                Advanced AI analysis
              </div>
              <div className="flex items-center gap-2 text-green-200/70 text-xs">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                Priority support
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleClose}
              className="bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Start Using Pro Features
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="flex-shrink-0 text-green-400/60 hover:text-green-300 transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 h-1 bg-green-900/30 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
