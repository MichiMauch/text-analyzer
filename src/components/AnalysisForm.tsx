'use client';

import { useState } from 'react';
import Form from './Form';
import Loading from './Loading';
import Analysis from './Analysis';
import Image from 'next/image';

export default function AnalysisForm() {
  const [url, setUrl] = useState('');
  const [keyphrase, setKeyphrase] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [seoScore, setSeoScore] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState('');
  const [wordCount, setWordCount] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [spinnerImage, setSpinnerImage] = useState('/images/robot-2.gif');

  const selectRandomSpinnerImage = () => {
    const images = ['/images/robot-2.gif', '/images/robot-3.gif'];
    return images[Math.floor(Math.random() * images.length)];
  };

  const handleSubmit = async (url: string, keyphrase: string) => {
    setError('');
    setAnalysis('');
    setRating(null);
    setSeoScore(null);
    setSuggestions('');
    setWordCount(null);
    setTitle('');
    setOgImage('');
    setExtractedText('');
    setSpinnerImage(selectRandomSpinnerImage());
    setLoading(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, keyphrase }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Unknown error occurred');
      }

      const data = await response.json();
      console.log('API Response:', data); // Konsolenausgabe der gesamten API-Antwort

      const analysisText = data.analysis;
      console.log('Analysis Text:', analysisText); // Konsolenausgabe des Analysis-Textes

      const ratingValue = data.rating;
      console.log('Extracted Rating Value:', ratingValue); // Konsolenausgabe des extrahierten Rating-Werts

      const seoScoreValue = data.seoScore;
      console.log('Extracted SEO Score Value:', seoScoreValue); // Konsolenausgabe des extrahierten SEO-Score-Werts

      console.log('ogImage:', data.ogImage); // Log the ogImage URL to the console

      setAnalysis(analysisText);
      setRating(ratingValue);
      setSeoScore(seoScoreValue);
      setSuggestions(data.suggestions);
      setWordCount(data.wordCount);
      setTitle(data.title);
      setOgImage(data.ogImage);
      setExtractedText(data.truncatedContent);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col justify-center p-4 mx-auto max-w-7xl">
      <Form onSubmit={handleSubmit} loading={loading} />

      <div className="border bg-background rounded-xl my-4 p-4 flex flex-col items-center justify-center w-full max-w-7xl flex-grow">
        {loading ? (
          <Loading spinnerImage={spinnerImage} />
        ) : !analysis ? (
          <div className="text-center">
            <Image
              src="/images/robot-1.gif"
              alt="Analysis Placeholder"
              width={256}
              height={256}
              className="mx-auto"
            />
            <p className="text-7xl mt-8 my-4 font-semibold">Paul AI</p>
            <h1 className="text-xl mt-8 my-4">
              Paul AI is your <strong>friendly AI Bot</strong> designed to help you <strong>optimize your website text</strong>.
            </h1>
          </div>
        ) : (
          <Analysis
            title={title}
            ogImage={ogImage}
            rating={rating}
            seoScore={seoScore}
            wordCount={wordCount}
            analysis={analysis}
            suggestions={suggestions}
            extractedText={extractedText}
          />
        )}
        {error && (
          <div className="mt-4 text-red-500">
            <p>Error: {error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
