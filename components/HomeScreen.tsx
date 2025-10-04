import React, { useRef, useState } from 'react';
import { ImageQuality, VideoEffect } from '../services/geminiService';

interface HomeScreenProps {
  onImageUpload: (file: File, quality: ImageQuality) => void;
  onVideoEnhancement: (file: File, effect: VideoEffect) => void;
  onHdrEffectUpload: (file: File) => void;
  onShowGallery: () => void; // Kept for future use, but button is removed from UI
}

const PhotoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const VideoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const HdrIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
       <path d="M12 16a4 4 0 100-8 4 4 0 000 8z" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="M4.93 4.93l1.41 1.41" /><path d="M17.66 17.66l1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="M4.93 19.07l1.41-1.41" /><path d="M17.66 6.34l1.41-1.41" />
    </svg>
);


export const HomeScreen: React.FC<HomeScreenProps> = ({ onImageUpload, onVideoEnhancement, onHdrEffectUpload }) => {
  const [quality, setQuality] = useState<ImageQuality>('High');
  const [videoEffect, setVideoEffect] = useState<VideoEffect>('Improve Quality');
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const hdrInputRef = useRef<HTMLInputElement>(null);

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onImageUpload(file, quality);
    event.target.value = '';
  };

  const handleVideoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onVideoEnhancement(file, videoEffect);
    event.target.value = '';
  };
  
  const handleHdrFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onHdrEffectUpload(file);
    event.target.value = '';
  };

  return (
    <div className="w-full max-w-lg mx-auto animate-fadeIn">
        <div className="mb-8 text-center lg:text-right">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                فایلەکانت بکە بە شاکار
            </h1>
            <p className="text-gray-400">
                بە یەک کرتە کوالێتی وێنەکانت بەرز بکەرەوە یان لە ڤیدیۆکانتەوە کلیپی سینەمایی دروست بکە.
            </p>
        </div>
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Video Card */}
                <div className="bg-black/40 p-4 rounded-xl border border-gray-700/50">
                    <div className="flex items-center text-pink-400 mb-3">
                        <VideoIcon />
                        <h3 className="mr-3 font-bold text-white">ڤیدیۆ باشتر بکە</h3>
                        <span className="text-xs mr-auto bg-pink-400 text-black font-bold px-2 py-0.5 rounded-full">نوێ</span>
                    </div>
                    <p className="text-sm text-gray-300 mb-2 text-right">شێوازی باشترکردن هەڵبژێرە:</p>
                    <div className="flex justify-between space-x-2 rtl:space-x-reverse bg-black/30 p-1 rounded-full">
                        {(['Improve Quality', 'Slow Motion', 'Hyperlapse'] as VideoEffect[]).map((effect) => (
                             <button key={effect} onClick={() => setVideoEffect(effect)} className={`w-full py-2 text-xs font-semibold rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/20 focus:ring-pink-500 ${videoEffect === effect ? 'bg-pink-600 text-white shadow-md' : 'bg-transparent text-gray-300 hover:bg-white/10'}`}>
                                 {effect === 'Improve Quality' ? 'باشترکردن' : effect === 'Slow Motion' ? 'هێواش' : 'خێرا'}
                             </button>
                        ))}
                    </div>
                    <button onClick={() => videoInputRef.current?.click()} className="w-full mt-4 p-3 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out active:animate-button-press">
                        ڤیدیۆیەک هەڵبژێرە
                    </button>
                </div>

                {/* Image Card */}
                <div className="bg-black/40 p-4 rounded-xl border border-gray-700/50">
                    <div className="flex items-center text-purple-400 mb-3">
                        <PhotoIcon />
                        <h3 className="mr-3 font-bold text-white">وێنە ساف بکە</h3>
                    </div>
                    <p className="text-sm text-gray-300 mb-2 text-right">ئاستی سافکردنەوە هەڵبژێرە:</p>
                    <div className="flex justify-between space-x-2 rtl:space-x-reverse bg-black/30 p-1 rounded-full">
                        {(['Standard', 'High', 'Ultra'] as ImageQuality[]).map((level) => (
                             <button key={level} onClick={() => setQuality(level)} className={`w-full py-2 text-xs font-semibold rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/20 focus:ring-purple-500 ${quality === level ? 'bg-purple-600 text-white shadow-md' : 'bg-transparent text-gray-300 hover:bg-white/10'}`}>
                                 {level === 'Standard' ? 'ئاسایی' : level === 'High' ? 'بەرز' : 'زۆر بەرز'}
                             </button>
                        ))}
                    </div>
                    <button onClick={() => imageInputRef.current?.click()} className="w-full mt-4 p-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out active:animate-button-press">
                        وێنەیەک هەڵبژێرە
                    </button>
                </div>
            </div>

            {/* HDR Card */}
            <button onClick={() => hdrInputRef.current?.click()} className="w-full bg-black/40 p-4 rounded-xl border border-gray-700/50 flex items-center justify-center space-x-4 rtl:space-x-reverse text-yellow-300 hover:bg-black/60 hover:border-yellow-400/50 transition-all duration-300">
                <HdrIcon />
                <span className="font-bold text-white text-lg">کاریگەری HDR</span>
            </button>
        </div>

        <input type="file" ref={imageInputRef} onChange={handleImageFileChange} className="hidden" accept="image/png, image/jpeg, image/webp" />
        <input type="file" ref={hdrInputRef} onChange={handleHdrFileChange} className="hidden" accept="image/png, image/jpeg, image/webp" />
        <input type="file" ref={videoInputRef} onChange={handleVideoFileChange} className="hidden" accept="video/mp4,video/quicktime,video/x-msvideo,video/webm" />
    </div>
  );
};