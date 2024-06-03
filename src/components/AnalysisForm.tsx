'use client';
import React, { useState } from 'react';
import Form from './Form';
import Loading from './Loading';
import Analysis from './Analysis';
import Image from 'next/image';

// Typdefinitionen für die API-Antworten
interface AnalysisResponse {
  analysis: string;
  rating: number | null;
  seoScore: number | null;
  suggestions: string;
  wordCount: number | null;
  title: string;
  ogImage: string;
  truncatedContent: string;
  sentimentScore: number | null;
  comparativeScore: number | null;
  sentimentAnalysis: string | null; // Füge diese Zeile hinzu
}

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
  //const [sentimentScore, setSentimentScore] = useState<number | null>(null);
  //const [comparativeScore, setComparativeScore] = useState<number | null>(null);
  const [newSentimentScore, setNewSentimentScore] = useState<string | null>(null);

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
    //setSentimentScore(null);
    //setComparativeScore(null);
    setNewSentimentScore(null);
    setSpinnerImage(selectRandomSpinnerImage());
    setLoading(true);

    try {
      const analysisResponse = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, keyphrase }),
      });

      if (!analysisResponse.ok) {
        throw new Error('Failed to fetch analysis');
      }

      const data: AnalysisResponse = await analysisResponse.json();
      setAnalysis(data.analysis);
      setRating(data.rating);
      setSeoScore(data.seoScore);
      setSuggestions(data.suggestions);
      setWordCount(data.wordCount);
      setTitle(data.title);
      setOgImage(data.ogImage);
      setExtractedText(data.truncatedContent);
      //setSentimentScore(data.sentimentScore);
      //setComparativeScore(data.comparativeScore);
      setNewSentimentScore(data.sentimentAnalysis); // Setze den neuen Sentiment-Score

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
                // sentimentScore={sentimentScore}
                // comparativeScore={comparativeScore}
                newSentimentScore={newSentimentScore} // Übergib den neuen Sentiment-Score
                sentimentScore={null} comparativeScore={null}          />
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
