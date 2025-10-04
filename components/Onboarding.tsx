import React, { useState } from 'react';

interface OnboardingProps {
    onComplete: () => void;
}

const onboardingSlides = [
    {
        id: 'slide1',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 16l-4 4-4-4 5.293-5.293a1 1 0 011.414 0L13 13m0 0l2.293 2.293a1 1 0 010 1.414L10 21l-4-4 4-4 3 3z" />
            </svg>
        ),
        title: 'سافکردنەوەی زیرەک',
        description: 'تەڵخی و ژاوەژاو لادەبەین و وێنەکانت وەک کریستاڵ ڕوون دەکەینەوە.',
    },
    {
        id: 'slide2',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
        ),
        title: 'ڕەنگکردنەوەی جادویی',
        description: 'ژیان ببەخشەرەوە بە وێنە ڕەش و سپییە کۆنەکانت بە ڕەنگی سروشتی و زیندوو.',
    },
    {
        id: 'slide3',
        icon: (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
             </svg>
        ),
        title: 'وردەکاری ڕووخسار',
        description: 'وردترین تایبەتمەندییەکانی ڕووخسارت دەردەخەین، لە چاوەکانەوە تا پێست.',
    },
];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleNext = () => {
        if (currentSlide < onboardingSlides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            onComplete();
        }
    };

    const slide = onboardingSlides[currentSlide];

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#111111] to-[#1d0f33] text-white p-8 justify-between items-center animate-fadeIn">
            <div className="w-full text-center pt-8">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">بەخێربێیت</h1>
            </div>
            
            <div key={slide.id} className="flex flex-col items-center text-center animate-fadeIn">
                <div className="mb-8 transform transition-transform duration-500 hover:scale-110">{slide.icon}</div>
                <h2 className="text-2xl font-bold mb-2">{slide.title}</h2>
                <p className="text-gray-400 max-w-xs">{slide.description}</p>
            </div>

            <div className="w-full flex flex-col items-center pb-8">
                 <div className="flex space-x-2 my-6">
                    {onboardingSlides.map((_, index) => (
                        <div
                            key={index}
                            className={`h-2 rounded-full transition-all duration-500 ${
                                currentSlide === index ? 'bg-purple-500 w-6' : 'bg-gray-600 w-2'
                            }`}
                        />
                    ))}
                </div>
                <button
                    onClick={handleNext}
                    className="w-full max-w-xs px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-full shadow-lg hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 ease-in-out active:animate-button-press"
                >
                    {currentSlide === onboardingSlides.length - 1 ? 'دەستپێبکە' : 'دواتر'}
                </button>
            </div>
        </div>
    );
};