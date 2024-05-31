import React from 'react';
import Image from 'next/image';

interface AnalysisProps {
  title: string;
  ogImage: string;
  rating: number | null;
  seoScore: number | null;
  wordCount: number | null;
  analysis: string;
  suggestions: string;
  extractedText: string;
}

const getRatingBackgroundColor = (rating: number | null) => {
  if (rating === null) return 'bg-white';
  if (rating === 10) return 'bg-green-200';
  if (rating >= 7) return 'bg-orange-200';
  return 'bg-red-200';
};

const getSeoScoreBackgroundColor = (seoScore: number | null) => {
  if (seoScore === null) return 'bg-white';
  if (seoScore === 10) return 'bg-green-200';
  if (seoScore >= 7) return 'bg-orange-200';
  return 'bg-red-200';
};

const getWordCountBackgroundColor = (wordCount: number | null) => {
  if (wordCount === null) return 'bg-white';
  return wordCount >= 300 ? 'bg-green-200' : 'bg-red-200';
};

const Analysis: React.FC<AnalysisProps> = ({ title, ogImage, rating, seoScore, wordCount, analysis, suggestions, extractedText }) => (
  <div className="w-full">
    <div className="flex space-x-4 mb-4">
      <div className="flex-1 p-4 border font-bold text-2xl md:text-4xl rounded-md text-center flex items-center justify-center">
        «{title}»
      </div>
      <div className="flex-1 p-4 border rounded-md text-center">
        {ogImage && (
          <div className="mt-4">
            <Image
              src={ogImage}
              alt="Teaser Image"
              width={600} // Set the desired width
              height={315} // Set the desired height
              className="mx-auto rounded-md"
              unoptimized
            />
          </div>
        )}
      </div>
    </div>

    {rating !== null && (
      <div className={`mt-4 text-xl font-bold ${getRatingBackgroundColor(rating)} p-4 rounded-md`}>
        Bewertung: {rating}
      </div>
    )}
    {seoScore !== null && (
      <div className={`mt-4 text-xl font-bold ${getSeoScoreBackgroundColor(seoScore)} p-4 rounded-md`}>
        SEO Score: {seoScore}
      </div>
    )}
    {wordCount !== null && (
      <div className={`mt-4 p-4 font-bold text-lg p-2 rounded-md ${getWordCountBackgroundColor(wordCount)}`}>
        Wortanzahl: {wordCount}
        {wordCount < 300 && (
          <div className="text-red-500">Warnung: Der Text hat weniger als 300 Wörter.</div>
        )}
      </div>
    )}
    {analysis && (
            <div className="mt-2 p-4 border rounded-md bg-gray-50 whitespace-pre-line">
            <h2 className="text-xl font-semibold mb-2">Analyseergebnis</h2>
            <p>{analysis}</p>
          </div>
        )}
        {suggestions && (
          <div className="mt-2 p-4 border rounded-md bg-gray-50 whitespace-pre-line">
            <h2 className="text-xl font-semibold mb-2">Verbesserungsvorschläge</h2>
            <p>{suggestions}</p>
          </div>
        )}
        {extractedText && (
          <div className="mt-2 p-4 border rounded-md bg-gray-50 whitespace-pre-line">
            <h2 className="text-xl font-semibold mb-2">Extrahierter Text</h2>
            <p>{extractedText}</p>
          </div>
        )}
      </div>
    );
    
    export default Analysis;
    
