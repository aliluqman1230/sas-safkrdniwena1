import React from 'react';

interface HeaderProps {
  onReset: () => void;
  showReset: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
}

const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const SpeakerOnIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
);

const SpeakerOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
    </svg>
);

export const Header: React.FC<HeaderProps> = ({ onReset, showReset, isMuted, onToggleMute }) => {
  return (
    <header className="sticky top-0 w-full p-4 flex justify-between items-center bg-black/50 backdrop-blur-lg z-50 border-b border-white/10">
      <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 tracking-wide">
        سافکردنی وێنە
      </h1>
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <button
            onClick={onToggleMute}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 active:animate-button-press"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
            {isMuted ? <SpeakerOffIcon /> : <SpeakerOnIcon />}
        </button>

        {showReset && (
          <button
            onClick={onReset}
            className="px-5 py-2.5 text-sm bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 active:animate-button-press"
          >
            فایلێکی نوێ
          </button>
        )}
         {!showReset && (
             <button
                className="group flex items-center justify-center space-x-2 rtl:space-x-reverse px-5 py-2.5 text-sm bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold rounded-full shadow-lg shadow-yellow-500/20 transition-all duration-300 ease-in-out transform hover:scale-105 active:animate-button-press"
             >
                <StarIcon />
                <span>ببە بە پرۆ</span>
             </button>
         )}
      </div>
    </header>
  );
};