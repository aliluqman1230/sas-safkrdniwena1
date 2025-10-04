import React from 'react';

const LogoIcon = () => (
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-purple-500 animate-pulse">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


export const SplashScreen: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-[#111111] to-[#1d0f33] text-white animate-fadeIn">
       <div className="relative flex flex-col items-center">
        <LogoIcon />
         <div className="absolute top-0 w-20 h-20 bg-purple-500 rounded-full opacity-20 blur-2xl animate-ping" style={{animationDuration: '2s'}}></div>
       </div>
      <h1 className="text-4xl font-bold text-purple-400 tracking-wider mt-4">
        سافکردنی وێنە
      </h1>
      <p className="text-gray-400 mt-2">sarokalishett ©</p>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-in-out;
        }
      `}</style>
    </div>
  );
};
