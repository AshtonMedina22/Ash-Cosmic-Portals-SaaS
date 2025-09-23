'use client';

import { FileText, Search, Zap } from 'lucide-react';

const FeatureIcons = () => {
  const features = [
    {
      icon: FileText,
      title: 'Analyze any PDF',
      description: 'Upload and process any PDF document instantly'
    },
    {
      icon: Search,
      title: 'Extract Key Insights',
      description: 'Get meaningful insights from your documents'
    },
    {
      icon: Zap,
      title: 'Save Time',
      description: 'Process documents in seconds, not hours'
    }
  ];

  return (
    <div className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="text-center group"
              >
                {/* Icon with Glow Effect */}
                <div className="relative inline-flex items-center justify-center mb-6">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 opacity-20 blur-lg group-hover:opacity-40 transition-opacity duration-300" />
                  <div className="relative w-20 h-20 rounded-full bg-purple-900/30 border border-purple-400/20 flex items-center justify-center group-hover:border-purple-400/40 transition-colors duration-300">
                    <IconComponent className="w-10 h-10 text-white group-hover:text-purple-200 transition-colors duration-300" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-200 transition-colors duration-300">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-white/70 text-sm group-hover:text-white/90 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeatureIcons;
