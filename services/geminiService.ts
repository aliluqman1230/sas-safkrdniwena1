import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

const ai = new GoogleGenAI({ apiKey: API_KEY });

export type ImageQuality = 'Standard' | 'High' | 'Ultra';
export type VideoEffect = 'Improve Quality' | 'Slow Motion' | 'Hyperlapse';

const enhancementPrompts: Record<ImageQuality, string> = {
  Standard: 'Enhance this image. Improve clarity, remove blur, and correct colors. If it is black and white, colorize it.',
  High: 'Enhance this image to the highest quality. Focus on reconstructing facial features with extreme detail, correcting skin texture to look natural and clear. Remove any blurriness or noise, improve clarity and details. If it is black and white, colorize it realistically with natural colors. Apply a subtle and professional portrait effect by slightly blurring the background to make the subject stand out. The final result should look like it was taken with a professional DSLR camera.',
  Ultra: 'Transform this image into a masterpiece with ultra-realistic enhancement. Reconstruct every facial detail with hyper-realistic precision, including individual pores and hair strands. Perfect skin texture while preserving natural character. Eliminate all noise and artifacts, achieving supreme clarity. If black and white, perform cinematic-grade colorization with rich, nuanced tones and lighting. Apply advanced, professional portrait effects, creating a beautiful bokeh background. The final image must be indistinguishable from a high-end professional photograph with expert-level retouching and color grading.',
};

const videoEnhancementPrompts: Record<VideoEffect, string> = {
  'Improve Quality': 'Taking this input image as a guide, generate a short, high-quality, cinematic video clip. Greatly enhance the resolution, clarity, and color vibrancy. Stabilize any implied motion and add subtle, natural movement to make the scene feel incredibly realistic and lifelike, as if shot on a professional 8k camera.',
  'Slow Motion': 'Taking this input image as a reference, generate a video that depicts the scene in dramatic, ultra slow-motion. Focus on fluid movement and exaggerated detail.',
  'Hyperlapse': 'Using this image as the starting point, create a fast-paced hyperlapse or time-lapse video of the scene. Show the passage of time with clouds moving quickly, light changing, or people/cars blurring past.',
};


export const enhanceImage = async (base64ImageData: string, mimeType: string, quality: ImageQuality): Promise<string> => {
  try {
    const prompt = enhancementPrompts[quality];

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    
    // Fallback if no image part is found, which is unlikely but safe to handle.
    throw new Error("The API did not return an enhanced image.");

  } catch (error) {
    console.error("Error enhancing image with Gemini API:", error);
    throw new Error("Failed to process the image with the AI service.");
  }
};

export const applyHdrEffect = async (base64ImageData: string, mimeType: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: 'Apply a dramatic High Dynamic Range (HDR) effect to this image. Enhance the contrast between light and dark areas, bring out details in shadows and highlights, and increase color saturation and vibrancy to create a stunning, high-impact image. The result should look professional and visually striking.',
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    
    throw new Error("The API did not return an HDR image.");

  } catch (error) {
    console.error("Error applying HDR effect with Gemini API:", error);
    throw new Error("Failed to process the image with the AI service for HDR effect.");
  }
};


export const enhanceVideo = async (base64ImageData: string, mimeType: string, effect: VideoEffect): Promise<string> => {
  try {
    const prompt = videoEnhancementPrompts[effect];
    let operation = await ai.models.generateVideos({
      model: 'veo-2.0-generate-001',
      prompt: prompt,
      image: {
        imageBytes: base64ImageData,
        mimeType: mimeType,
      },
      config: {
        numberOfVideos: 1
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

    if (downloadLink) {
      // The link needs the API key to be used for fetching
      return `${downloadLink}&key=${API_KEY}`;
    } else {
      console.error("VEO API operation details:", operation);
      throw new Error("The API did not return a video URI.");
    }

  } catch (error) {
    console.error("Error generating video with Gemini API:", error);
    throw new Error("Failed to process the video with the AI service.");
  }
};
