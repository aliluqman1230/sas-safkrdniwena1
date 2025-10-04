import React from 'react';

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const ShareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
    </svg>
);


interface VideoPlayerProps {
  videoUrl: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {

  const handleDownload = async () => {
    try {
      // The videoUrl already contains the API key from the service
      const response = await fetch(videoUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `generated-video-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading the video:', error);
      alert('داگرتنی ڤیدیۆکە سەرکەوتوو نەبوو.');
    }
  };

  const handleShare = async () => {
    if (!navigator.share) {
      alert('شەیرکردن لەم وێبگەڕەدا پشتگیری نەکراوە.');
      return;
    }

    try {
      const response = await fetch(videoUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const blob = await response.blob();
      const file = new File([blob], `generated-video-${Date.now()}.mp4`, { type: 'video/mp4' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'ڤیدیۆی دروستکراو',
          text: 'سەیری ئەم ڤیدیۆیە بکە کە بەم ئەپە جوانەم دروستم کردووە!',
          files: [file],
        });
      } else {
        alert('شەیرکردنی ئەم فایلە پشتگیری نەکراوە.');
      }
    } catch (error) {
      console.error('Error sharing video:', error);
      if ((error as DOMException).name !== 'AbortError') {
        alert('شەیرکردنی ڤیدیۆکە سەرکەوتوو نەبوو.');
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-4xl aspect-video mx-auto rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/50 bg-black border-2 border-white/10">
        <video
          src={videoUrl}
          controls
          autoPlay
          loop
          className="w-full h-full object-contain"
        >
          داواکاری لێبووردن دەکەین، وێبگەڕەکەت پشتگیری ئەم ڤیدیۆیە ناکات.
        </video>
      </div>
       <div className="mt-6 flex items-center justify-center space-x-4">
          <button
            onClick={handleDownload}
            className="flex items-center justify-center px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-full shadow-lg hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 ease-in-out active:animate-button-press"
          >
            <DownloadIcon />
            داگرتنی ڤیدیۆ
          </button>
           <button
            onClick={handleShare}
            className="flex items-center justify-center px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out active:animate-button-press"
          >
            <ShareIcon />
            شەیرکردنی ڤیدیۆ
          </button>
       </div>
    </div>
  );
};