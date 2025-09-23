'use client';

import { SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200 mb-6">
            Choose Your Plan
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Unlock the power of AI-driven PDF analysis with our flexible pricing plans
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-600/30 rounded-xl p-8 hover:border-gray-500/50 transition-colors duration-300">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
              <div className="text-4xl font-bold text-white mb-4">
                $0<span className="text-lg text-white/70">/month</span>
              </div>
              <p className="text-white/70 mb-8">Perfect for getting started</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-white/80">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                5 PDF uploads per month
              </li>
              <li className="flex items-center text-white/80">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Basic AI analysis
              </li>
              <li className="flex items-center text-white/80">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Email support
              </li>
            </ul>

            <SignedOut>
              <Link
                href="/sign-up"
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 block text-center"
              >
                Get Started Free
              </Link>
            </SignedOut>
            <SignedIn>
              <Link
                href="/dashboard"
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 block text-center"
              >
                Current Plan
              </Link>
            </SignedIn>
          </div>

          {/* Pro Plan */}
          <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border border-purple-600/50 rounded-xl p-8 hover:border-purple-500/70 transition-colors duration-300 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>
            
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
              <div className="text-4xl font-bold text-white mb-4">
                $29<span className="text-lg text-white/70">/month</span>
              </div>
              <p className="text-white/70 mb-8">For professionals and teams</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-white/80">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Unlimited PDF uploads
              </li>
              <li className="flex items-center text-white/80">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Advanced AI analysis
              </li>
              <li className="flex items-center text-white/80">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Priority support
              </li>
              <li className="flex items-center text-white/80">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Export to multiple formats
              </li>
            </ul>

            <SignedOut>
              <Link
                href="/sign-up?plan=pro"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 block text-center"
              >
                Start Pro Trial
              </Link>
            </SignedOut>
            <SignedIn>
              <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200">
                Upgrade to Pro
              </button>
            </SignedIn>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-blue-600/30 rounded-xl p-8 hover:border-blue-500/50 transition-colors duration-300">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
              <div className="text-4xl font-bold text-white mb-4">
                Custom<span className="text-lg text-white/70">/month</span>
              </div>
              <p className="text-white/70 mb-8">For large organizations</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-white/80">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Everything in Pro
              </li>
              <li className="flex items-center text-white/80">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Custom integrations
              </li>
              <li className="flex items-center text-white/80">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Dedicated support
              </li>
              <li className="flex items-center text-white/80">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                SLA guarantee
              </li>
            </ul>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200">
              Contact Sales
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-gray-900/30 border border-gray-700/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">How does the AI analysis work?</h3>
              <p className="text-white/70">
                Our AI uses advanced natural language processing to extract key insights, summarize content, and identify important patterns in your PDF documents.
              </p>
            </div>
            <div className="bg-gray-900/30 border border-gray-700/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Can I cancel my subscription anytime?</h3>
              <p className="text-white/70">
                Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period.
              </p>
            </div>
            <div className="bg-gray-900/30 border border-gray-700/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Is my data secure?</h3>
              <p className="text-white/70">
                Absolutely. We use enterprise-grade encryption and never share your documents with third parties. Your data is processed securely and deleted after analysis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
