import React, { useState, useEffect } from 'react';
import { getGalleryItems, deleteFromGallery, GalleryItem } from '../utils/galleryUtils';

interface GalleryProps {
    onImageSelect: (original: string, enhanced: string) => void;
    onBack: () => void;
}

const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const TrashIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const EmptyGalleryIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
     </svg>
);


export const Gallery: React.FC<GalleryProps> = ({ onImageSelect, onBack }) => {
    const [items, setItems] = useState<GalleryItem[]>([]);

    useEffect(() => {
        setItems(getGalleryItems());
    }, []);

    const handleDelete = (id: string) => {
        const updatedItems = deleteFromGallery(id);
        setItems(updatedItems);
    };

    return (
        <div className="w-full flex flex-col items-center p-4">
            <div className="w-full flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">گەلەری من</h2>
                <button
                    onClick={onBack}
                    className="flex items-center px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-full shadow-lg transition-colors duration-300 active:animate-button-press"
                >
                    <BackIcon />
                    گەڕانەوە
                </button>
            </div>

            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center mt-20 p-8 bg-gray-800/50 rounded-2xl border border-white/10">
                    <EmptyGalleryIcon />
                    <p className="text-xl text-gray-300">گەلرییەکەت بەتاڵە.</p>
                    <p className="text-gray-400 mt-2">وێنەیەک ساف بکەرەوە بۆ ئەوەی لێرە زیاد بێت.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full">
                    {items.map((item, index) => (
                        <div 
                            key={item.id} 
                            className="relative group aspect-square rounded-lg overflow-hidden shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/40 ring-1 ring-white/10 hover:ring-2 hover:ring-purple-500 animate-gallery-item-appear"
                            style={{ animationDelay: `${index * 60}ms` }}
                        >
                            <img
                                src={item.enhanced}
                                alt="Enhanced image"
                                className="w-full h-full object-cover"
                                onClick={() => onImageSelect(item.original, item.enhanced)}
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent triggering onImageSelect
                                        handleDelete(item.id);
                                    }}
                                    className="p-3 bg-red-600/80 hover:bg-red-500 rounded-full transition-all scale-75 group-hover:scale-100 duration-300 active:animate-button-press"
                                    aria-label="Delete image"
                                >
                                    <TrashIcon />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};