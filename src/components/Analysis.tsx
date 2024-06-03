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
  sentimentScore: number | null;
  comparativeScore: number | null;
  newSentimentScore: string | null;
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

const getSentimentBackgroundColor = (score: number | null) => {
  if (score === null) return 'bg-white';
  if (score <= 4) return 'bg-red-200';
  if (score <= 8) return 'bg-orange-200';
  return 'bg-green-200';
};

const getSentimentDescription = (score: number | null) => {
  if (score === null) return '';
  if (score <= 2) return 'Sehr negativ - Der Text hat eine stark negative Stimmung.';
  if (score <= 4) return 'Negativ - Der Text hat eine überwiegend negative Stimmung.';
  if (score <= 6) return 'Neutral bis leicht positiv - Der Text ist weitgehend neutral oder hat eine leicht positive Stimmung.';
  if (score <= 8) return 'Positiv - Der Text hat eine deutlich positive Stimmung.';
  return 'Sehr positiv - Der Text hat eine stark positive Stimmung.';
};

const Analysis: React.FC<AnalysisProps> = ({
  title, ogImage, rating, seoScore, wordCount, analysis, suggestions,
  extractedText, sentimentScore, comparativeScore, newSentimentScore
}) => (
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
              width={600}
              height={315}
              className="mx-auto rounded-md"
              unoptimized
            />
          </div>
        )}
      </div>
    </div>

    {rating !== null && (
      <div className={`mt-4 text-xl font-bold ${getRatingBackgroundColor(rating)} p-4 rounded-md`}>
        Allg. Bewertung: {rating}
      </div>
    )}
    {seoScore !== null && (
      <div className={`mt-4 text-xl font-bold ${getSeoScoreBackgroundColor(seoScore)} p-4 rounded-md`}>
        SEO Score: {seoScore}
      </div>
    )}
    {newSentimentScore !== null && (
      <div className={`mt-4 text-xl font-bold ${getSentimentBackgroundColor(Number(newSentimentScore))} p-4 rounded-md`}>
        Sentiment Score: {newSentimentScore} - {getSentimentDescription(Number(newSentimentScore))}
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
     
    {sentimentScore !== null && (
      <div className={`mt-4 text-xl font-bold bg-blue-200 p-4 rounded-md`}>
        (Sentiment Score: {sentimentScore.toFixed(2)})
      </div>
    )}
    {comparativeScore !== null && (
      <div className={`mt-4 text-xl font-bold bg-blue-100 p-4 rounded-md`}>
        (Comparative Score: {comparativeScore.toFixed(2)})
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
