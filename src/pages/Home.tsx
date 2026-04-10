import React from 'react';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';

export default function Home() {
  return (
    <div className="pb-20">
      <HeroSection />

      <AboutSection />
    </div>
  );
}
