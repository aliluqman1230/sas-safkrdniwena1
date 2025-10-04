export const extractFirstFrame = (videoFile: File): Promise<{ base64Data: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = URL.createObjectURL(videoFile);
    video.muted = true;
    video.playsInline = true;

    video.onloadeddata = () => {
      // Seek to a very early frame to capture the beginning
      video.currentTime = 0.1;
    };

    video.onseeked = () => {
      // Use a timeout to ensure the frame is fully rendered on the video element
      setTimeout(() => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          URL.revokeObjectURL(video.src);
          reject(new Error('Could not get canvas context.'));
          return;
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const mimeType = 'image/jpeg';
        const quality = 0.9; // Use 90% quality for JPEG
        const base64Image = canvas.toDataURL(mimeType, quality);
        
        // Clean up the created object URL
        URL.revokeObjectURL(video.src);
        
        // Remove the "data:image/jpeg;base64," prefix to get raw base64 data
        const base64Data = base64Image.split(',')[1];

        if (!base64Data) {
            reject(new Error('Failed to extract base64 data from the video frame.'));
            return;
        }

        resolve({ base64Data, mimeType });
      }, 100);
    };

    video.onerror = (e) => {
      URL.revokeObjectURL(video.src);
      reject(new Error('Error loading the video file. It might be corrupted or in an unsupported format.'));
    };
  });
};
