import React, { useState, useRef, useCallback, useEffect } from 'react';

interface ImageComparatorProps {
  original: string;
  enhanced: string;
  isDemo?: boolean;
}

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const ShareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
    </svg>
);


export const ImageComparator: React.FC<ImageComparatorProps> = ({ original, enhanced, isDemo = false }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  }, []);

  const handleInteractionStart = (clientX: number) => {
    setIsDragging(true);
    handleMove(clientX);
  };

  const handleInteractionMove = (clientX: number) => {
    if (isDragging) {
      handleMove(clientX);
    }
  };

  const handleInteractionEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleInteractionMove(e.clientX);
    const handleTouchMove = (e: TouchEvent) => handleInteractionMove(e.touches[0].clientX);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('mouseup', handleInteractionEnd);
    window.addEventListener('touchend', handleInteractionEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleInteractionEnd);
      window.removeEventListener('touchend', handleInteractionEnd);
    };
  }, [isDragging, handleInteractionMove]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = enhanced;
    link.download = `enhanced-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (!navigator.share) {
      alert('شەیرکردن لەم وێبگەڕەدا پشتگیری نەکراوە.');
      return;
    }

    try {
      const response = await fetch(enhanced);
      const blob = await response.blob();
      const file = new File([blob], `enhanced-image-${Date.now()}.png`, { type: blob.type });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'وێنەی سافکراو',
          text: 'سەیری ئەم وێنەیە بکە کە بەم ئەپە جوانەم سافم کردووە!',
          files: [file],
        });
      } else {
        alert('شەیرکردنی ئەم فایلە پشتگیری نەکراوە.');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      if ((error as DOMException).name !== 'AbortError') {
          alert('نەتوانرا فایلەکە شەیر بکرێت.');
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
        <div 
            ref={containerRef}
            className="relative w-full max-w-4xl aspect-[4/5] lg:aspect-auto lg:h-[80vh] max-h-[800px] mx-auto rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/50 select-none touch-none border-2 border-white/10"
            onMouseDown={(e) => handleInteractionStart(e.clientX)}
            onTouchStart={(e) => handleInteractionStart(e.touches[0].clientX)}
        >
            <img src={original} alt="Original" className={`w-full h-full object-cover pointer-events-none ${isDemo ? 'filter grayscale brightness-90' : ''}`} />
            <div
                className="absolute top-0 left-0 h-full w-full overflow-hidden pointer-events-none"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                <img src={enhanced} alt="Enhanced" className="h-full w-full object-cover absolute top-0 left-0 pointer-events-none" />
            </div>
            <div
                className="absolute top-0 h-full w-0.5 bg-white/70 cursor-ew-resize"
                style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-purple-600/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg cursor-ew-resize ring-2 ring-white/30">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.5 5.25l-6 6.75 6 6.75m-3-13.5l6 6.75-6 6.75"></path></svg>
                </div>
            </div>
        </div>
        {!isDemo && (
            <div className="mt-6 flex items-center justify-center space-x-4 rtl:space-x-reverse animate-fadeIn">
                <button
                  onClick={handleDownload}
                  className="flex flex-row-reverse items-center justify-center px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-full shadow-lg hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 ease-in-out active:animate-button-press"
                >
                  <DownloadIcon />
                  داگرتن
                </button>
                <button
                  onClick={handleShare}
                  className="flex flex-row-reverse items-center justify-center px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out active:animate-button-press"
                >
                  <ShareIcon />
                  شەیرکردن
                </button>
            </div>
        )}
    </div>
  );
};