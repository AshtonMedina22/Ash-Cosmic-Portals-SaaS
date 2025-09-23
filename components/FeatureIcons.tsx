'use client';

import { FileText, Search, Zap } from 'lucide-react';

const FeatureIcons = () => {
  const features = [
    {
      icon: FileText,
      title: 'Analyze any PDF'
    },
    {
      icon: Search,
      title: 'Extract Key Insights'
    },
    {
      icon: Zap,
      title: 'Save Time'
    }
  ];

  return (
    <div className="relative pt-8 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center items-center gap-12 sm:gap-16 lg:gap-20">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="text-center group"
              >
                {/* Icon with Glow Effect */}
                <div className="relative inline-flex items-center justify-center mb-3">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 opacity-30 blur-md group-hover:opacity-50 transition-opacity duration-300" />
                  <div className="relative w-12 h-12 rounded-full bg-purple-900/40 border border-purple-400/30 flex items-center justify-center group-hover:border-purple-400/50 transition-colors duration-300">
                    <IconComponent className="w-6 h-6 text-white group-hover:text-purple-200 transition-colors duration-300" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-sm font-medium text-white/70 group-hover:text-white transition-colors duration-300">
                  {feature.title}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeatureIcons;
