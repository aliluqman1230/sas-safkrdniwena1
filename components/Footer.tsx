import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full pt-8 text-center lg:text-right text-gray-500 text-xs">
      <p>&copy; 2025 sarokalishett. هەموو مافێکی پارێزراوە.</p>
      <a
        href="https://www.facebook.com/aliluqman.rahmanqadr"
        target="_blank"
        rel="noopener noreferrer"
        className="text-purple-500 hover:text-purple-400 transition-colors mt-1 inline-block"
      >
        پەیوەندیم پێوە بکە لە فەیسبووک
      </a>
    </footer>
  );
};