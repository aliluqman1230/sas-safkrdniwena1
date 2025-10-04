import React from 'react';

interface LoaderProps {
    message?: string;
    type: 'image' | 'video';
}

const ImageLoaderAnimation = () => (
    <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Pulsing Glow */}
        <div className="absolute w-full h-full bg-purple-500 rounded-2xl opacity-30 blur-2xl animate-pulse"></div>
        
        {/* Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>

        {/* Scan Line */}
        <div className="scanline"></div>
    </div>
);

const VideoLoaderAnimation = () => (
    <div className="relative w-32 h-32 flex items-center justify-center">
         {/* Pulsing Glow */}
        <div className="absolute w-full h-full bg-purple-500 rounded-2xl opacity-30 blur-2xl animate-pulse"></div>
        {/* Film Strip Icon */}
        <svg className="w-28 h-28 text-purple-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
            <line x1="7" y1="2" x2="7" y2="22"></line>
            <line x1="17" y1="2" x2="17" y2="22"></line>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <line x1="2" y1="7" x2="7" y2="7" className="film-frame film-frame-1"></line>
            <line x1="2" y1="17" x2="7" y2="17" className="film-frame film-frame-2"></line>
            <line x1="17" y1="17" x2="22" y2="17" className="film-frame film-frame-3"></line>
            <line x1="17" y1="7" x2="22" y2="7" className="film-frame film-frame-4"></line>
        </svg>
    </div>
);


export const Loader: React.FC<LoaderProps> = ({ message, type }) => {
  const defaultMessage = '...تکایە چاوەڕوانبە، کارەکەت جێبەجێ دەکرێت';
  const subMessage = 'ئەم کارە لەوانەیە کەمێک بۆ چەند خولەکێک بخایەنێت';
  
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
       {type === 'image' ? <ImageLoaderAnimation /> : <VideoLoaderAnimation />}
      
      <p className="mt-8 text-xl text-purple-300 font-semibold animate-pulse">{message || defaultMessage}</p>
      <p className="mt-2 text-sm text-gray-400">{subMessage}</p>
      <style>{`
        .scanline {
            position: absolute;
            top: 0;
            left: -10%;
            width: 3px;
            height: 100%;
            background: rgba(255, 255, 255, 0.6);
            box-shadow: 0 0 15px #fff, 0 0 25px #c084fc;
            border-radius: 5px;
            animation: scan 3s ease-in-out infinite;
        }

        @keyframes scan {
            0% {
                left: -10%;
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                left: 110%;
                opacity: 0;
            }
        }
        
        .film-frame {
            stroke: #a78bfa; /* purple-300 */
            animation: light-up 2.5s infinite;
        }
        .film-frame-1 { animation-delay: 0s; }
        .film-frame-2 { animation-delay: 0.6s; }
        .film-frame-3 { animation-delay: 1.2s; }
        .film-frame-4 { animation-delay: 1.8s; }

        @keyframes light-up {
            0%, 100% {
                stroke: #a78bfa; /* purple-300 */
                stroke-width: 1;
            }
            25% {
                stroke: #ffffff;
                stroke-width: 2;
            }
        }
      `}</style>
    </div>
  );
};