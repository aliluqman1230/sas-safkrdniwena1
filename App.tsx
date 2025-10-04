
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeScreen } from './components/HomeScreen';
import { ImageComparator } from './components/ImageComparator';
import { Loader } from './components/Loader';
import { SplashScreen } from './components/SplashScreen';
import { Onboarding } from './components/Onboarding';
import { VideoPlayer } from './components/VideoPlayer';
import { enhanceImage, enhanceVideo, applyHdrEffect, ImageQuality, VideoEffect } from './services/geminiService';
import { fileToBase64 } from './utils/imageUtils';
import { extractFirstFrame } from './utils/videoUtils';
import { getSettings, updateSettings } from './utils/settings';
import { Gallery } from './components/Gallery';
import { saveToGallery } from './utils/galleryUtils';

type View = 'splash' | 'onboarding' | 'home' | 'gallery';
type ProcessingType = 'image' | 'video';

const MUSIC_URL = 'https://cdn.pixabay.com/audio/2024/05/13/audio_4723021a8a.mp3';
const DEFAULT_IMAGE_URL = 'https://images.unsplash.com/photo-1595434091143-b375b668b244?q=80&w=2535&auto=format&fit=crop';


export default function App() {
  const [view, setView] = useState<View>('splash');
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [enhancedVideoUrl, setEnhancedVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [processingType, setProcessingType] = useState<ProcessingType>('image');
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const splashTimeout = setTimeout(() => {
      const settings = getSettings();
      if (settings.hasSeenOnboarding) {
        setView('home');
      } else {
        setView('onboarding');
      }
    }, 2500);

    return () => clearTimeout(splashTimeout);
  }, []);

  useEffect(() => {
      const audio = audioRef.current;
      if (audio) {
          audio.volume = 0.1;
          const playPromise = audio.play();
          if (playPromise !== undefined) {
              playPromise.catch(error => {
                  console.log("Audio autoplay was prevented by the browser.");
                  setIsMuted(true); 
              });
          }
      }
  }, [view]);

  const toggleMute = () => {
    const audio = audioRef.current;
    if (audio) {
      const newMutedState = !audio.muted;
      audio.muted = newMutedState;
      setIsMuted(newMutedState);
      if (!newMutedState && audio.paused) {
        audio.play().catch(e => console.error("Could not play audio:", e));
      }
    }
  };


  const handleOnboardingComplete = () => {
    updateSettings({ hasSeenOnboarding: true });
    setView('home');
  };

  const processFile = async (
    file: File,
    setLoadingMsg: string,
    processingFn: () => Promise<{ enhancedImageDataUrl?: string; videoUrl?: string }>,
    type: ProcessingType
  ) => {
    setIsLoading(true);
    setProcessingType(type);
    setError(null);
    setEnhancedImage(null);
    setOriginalImage(null);
    setEnhancedVideoUrl(null);
    setLoadingMessage(setLoadingMsg);
  
    try {
      const originalImageDataUrl = await fileToBase64(file);
      setOriginalImage(originalImageDataUrl);
      
      const result = await processingFn();
      
      if (result.enhancedImageDataUrl) {
        setEnhancedImage(result.enhancedImageDataUrl);
        saveToGallery({ original: originalImageDataUrl, enhanced: result.enhancedImageDataUrl });
      } else if (result.videoUrl) {
        setEnhancedVideoUrl(result.videoUrl);
      }
    } catch (err) {
      console.error(err);
      setError('هەڵەیەک ڕوویدا. تکایە دووبارە هەوڵبدەرەوە.');
      setOriginalImage(null); // Clear preview on error
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleImageUpload = useCallback(async (file: File, quality: ImageQuality) => {
    await processFile(
      file,
      '...تکایە چاوەڕوانبە، وێنەکەت ساف دەکرێتەوە',
      async () => {
        const originalImageDataUrl = await fileToBase64(file);
        const base64Data = originalImageDataUrl.split(',')[1];
        const enhancedBase64 = await enhanceImage(base64Data, file.type, quality);
        return { enhancedImageDataUrl: `data:${file.type};base64,${enhancedBase64}` };
      },
      'image'
    );
  }, []);

  const handleHdrEffectUpload = useCallback(async (file: File) => {
    await processFile(
      file,
      '...کاریگەری HDR جێبەجێ دەکرێت',
      async () => {
        const originalImageDataUrl = await fileToBase64(file);
        const base64Data = originalImageDataUrl.split(',')[1];
        const enhancedBase64 = await applyHdrEffect(base64Data, file.type);
        return { enhancedImageDataUrl: `data:${file.type};base64,${enhancedBase64}` };
      },
      'image'
    );
  }, []);

  const handleVideoEnhancement = useCallback(async (file: File, effect: VideoEffect) => {
    await processFile(
      file,
      '...ڤیدیۆکە باشتر دەکرێت، ئەمە لەوانەیە چەند خولەکێک بخایەنێت',
      async () => {
        setLoadingMessage('...یەکەم چرکەی ڤیدیۆکە دەردەهێنرێت');
        const { base64Data, mimeType } = await extractFirstFrame(file);
        setLoadingMessage('...ڤیدیۆکە باشتر دەکرێت، ئەمە لەوانەیە چەند خولەکێک بخایەنێت');
        const videoUrl = await enhanceVideo(base64Data, mimeType, effect);
        return { videoUrl };
      },
      'video'
    );
  }, []);
  
  const handleReset = () => {
    setOriginalImage(null);
    setEnhancedImage(null);
    setEnhancedVideoUrl(null);
    setError(null);
    setIsLoading(false);
    if (view !== 'home') {
        setView('home');
    }
  }

  if (view === 'splash') {
    return <SplashScreen />;
  }

  if (view === 'onboarding') {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }
  
  const isDemo = !originalImage && !enhancedVideoUrl;

  return (
    <div className="flex flex-col h-screen text-white overflow-hidden">
      <audio ref={audioRef} src={MUSIC_URL} loop />
      <Header 
        onReset={handleReset} 
        showReset={!!originalImage || !!enhancedVideoUrl || view === 'gallery'}
        isMuted={isMuted}
        onToggleMute={toggleMute}
      />
      <main className="flex-grow grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        {/* Left Panel - Visuals */}
        <div className="relative w-full h-full hidden lg:flex items-center justify-center bg-black">
          <div className="absolute inset-0 w-full h-full bg-cover bg-center blur-md scale-110 opacity-30" style={{backgroundImage: `url(${isDemo ? DEFAULT_IMAGE_URL : (originalImage || enhancedVideoUrl)})`}}></div>
            {enhancedVideoUrl ? (
              <VideoPlayer videoUrl={enhancedVideoUrl} />
            ) : (
              <ImageComparator
                original={originalImage || DEFAULT_IMAGE_URL}
                enhanced={enhancedImage || DEFAULT_IMAGE_URL}
                isDemo={isDemo}
              />
            )}
        </div>

        {/* Right Panel - Controls */}
        <div className="w-full h-full flex flex-col justify-between p-6 sm:p-8 md:p-12 bg-gradient-to-b from-[#1a102d] to-[#120c1f] overflow-y-auto">
          <div className="flex-grow flex flex-col justify-center">
            {isLoading ? (
              <Loader message={loadingMessage} type={processingType} />
            ) : error ? (
              <div className="text-center p-8 bg-red-900/50 rounded-2xl border border-red-500/50">
                <p className="text-red-300 text-xl font-semibold">{error}</p>
                <button
                  onClick={handleReset}
                  className="mt-6 px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-full shadow-lg hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 ease-in-out active:animate-button-press"
                >
                  دووبارە هەوڵبدەرەوە
                </button>
              </div>
            ) : view === 'gallery' ? (
                <Gallery 
                    onImageSelect={(original, enhanced) => {
                        setOriginalImage(original);
                        setEnhancedImage(enhanced);
                        setView('home');
                    }} 
                    onBack={handleReset} 
                />
            ) : (
              <HomeScreen 
                onImageUpload={handleImageUpload} 
                onVideoEnhancement={handleVideoEnhancement} 
                onHdrEffectUpload={handleHdrEffectUpload} 
                onShowGallery={() => setView('gallery')} 
              />
            )}
          </div>
          <Footer />
        </div>
      </main>
    </div>
  );
}
