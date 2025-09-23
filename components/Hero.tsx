'use client';

import { SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';

const Hero = () => {
  // Generate concentric rings for background animation
  const rings = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        {rings.map((ring) => (
          <div
            key={ring}
            className={`absolute rounded-full border border-purple-400/20 ${
              ring === 1
                ? 'w-32 h-32 animate-pulse'
                : ring === 2
                ? 'w-64 h-64 animate-pulse delay-75'
                : ring === 3
                ? 'w-96 h-96 animate-pulse delay-150'
                : ring === 4
                ? 'w-[32rem] h-[32rem] animate-pulse delay-200'
                : 'w-[40rem] h-[40rem] animate-pulse delay-300'
            }`}
            style={{
              boxShadow: `inset 0 0 ${ring * 20}px rgba(147, 51, 234, 0.1)`,
              filter: 'blur(1px)',
            }}
          />
        ))}
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200 mb-6">
          PDF Analysis Tool
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-white/70 mb-8 max-w-2xl mx-auto">
          Extract insights from your documents instantly with our AI-powered analysis tool
        </p>

        {/* CTA Button */}
        <div className="flex justify-center">
          <SignedOut>
            <Link
              href="/sign-up"
              className="group relative inline-flex items-center gap-2 rounded-full bg-black px-8 py-4 text-white font-semibold text-lg transition-all hover:bg-white/5"
            >
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF1E56] via-[#FF00FF] to-[#00FFFF] opacity-70 blur-sm transition-all group-hover:opacity-100" />
              <span className="absolute inset-0.5 rounded-full bg-black/50" />
              <span className="relative font-bold">Get Started</span>
            </Link>
          </SignedOut>
          
          <SignedIn>
            <Link
              href="/dashboard"
              className="group relative inline-flex items-center gap-2 rounded-full bg-black px-8 py-4 text-white font-semibold text-lg transition-all hover:bg-white/5"
            >
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF1E56] via-[#FF00FF] to-[#00FFFF] opacity-70 blur-sm transition-all group-hover:opacity-100" />
              <span className="absolute inset-0.5 rounded-full bg-black/50" />
              <span className="relative font-bold">Go to Dashboard</span>
            </Link>
          </SignedIn>
        </div>
      </div>
    </div>
  );
};

export default Hero;
