"use client"

import React from 'react';
import Header from './Header';

export interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  darkMode: boolean;
  toggleDarkMode: () => void;
  language: "fr" | "en";
  toggleLanguage: (lang?: "fr" | "en") => void;
}

export default function PageHeader({ 
  title, 
  subtitle,
  darkMode,
  toggleDarkMode,
  language,
  toggleLanguage
}: PageHeaderProps) {
  return (
    <>
      <Header 
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        language={language}
        toggleLanguage={toggleLanguage}
      />
      {(title || subtitle) && (
        <div className="relative">
          {/* Background with overlay */}
          <div className="absolute inset-0 bg-[#28384d] opacity-90 z-[-1]"></div>
          
          {/* Content */}
          <div className="container mx-auto px-4 py-24 pt-40">
            <div className="max-w-3xl">
              {title && (
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-lg text-white/80 max-w-2xl">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

