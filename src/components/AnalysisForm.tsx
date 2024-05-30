'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function AnalysisForm() {
  const [url, setUrl] = useState('');
  const [keyphrase, setKeyphrase] = useState(''); // State for keyphrase
  const [analysis, setAnalysis] = useState('');
  const [rating, setRating] = useState<number | null>(null); // State to store the rating
  const [seoScore, setSeoScore] = useState<string | null>(null); // State for SEO score
  const [suggestions, setSuggestions] = useState(''); // State for improvement suggestions
  const [wordCount, setWordCount] = useState<number | null>(null); // State for word count
  const [title, setTitle] = useState(''); // State for the page title
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // State to manage loading
  const [spinnerImage, setSpinnerImage] = useState('/images/robot-2.gif');

  const selectRandomSpinnerImage = () => {
    const images = ['/images/robot-2.gif', '/images/robot-3.gif'];
    return images[Math.floor(Math.random() * images.length)];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');  // Clear previous errors
    setAnalysis('');  // Clear previous analysis
    setRating(null);  // Clear previous rating
    setSeoScore(null);  // Clear previous SEO score
    setSuggestions('');  // Clear previous suggestions
    setWordCount(null);  // Clear previous word count
    setTitle('');  // Clear previous title
    setSpinnerImage(selectRandomSpinnerImage()); // Select a random spinner image
    setLoading(true); // Set loading state to true

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url, keyphrase }) // Include keyphrase in the request
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Unknown error occurred');
      }

      const data = await response.json();
      const analysisText = data.analysis;
      const ratingMatch = analysisText.match(/Bewertung: (\d+)/);
      const ratingValue = ratingMatch ? parseInt(ratingMatch[1], 10) : null;

      setAnalysis(analysisText.replace(/Bewertung: \d+/, '').trim());
      setRating(ratingValue);
      setSeoScore(data.seoScore); // Set SEO score from the response
      setSuggestions(data.suggestions); // Set suggestions from the response
      setWordCount(data.wordCount); // Set word count from the response
      setTitle(data.title); // Set title from the response
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  const getRatingBackgroundColor = (rating: number | null) => {
    if (rating === null) return 'bg-white';
    if (rating === 10) return 'bg-green-200';
    if (rating >= 7) return 'bg-orange-200';
    return 'bg-red-200';
  };

  const getWordCountBackgroundColor = (wordCount: number | null) => {
    if (wordCount === null) return 'bg-white';
    return wordCount >= 300 ? 'bg-green-200' : 'bg-red-200';
  };


  return (
    <div className="bg-white min-h-screen p-4 mx-auto max-w-7xl">
      <div className="border bg-background rounded-xl my-4 p-4">
        <h1 className="text-3xl font-bold">Paul AI by MM</h1>
        <div className="border-t mt-4 pt-4">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div className="flex flex-col mb-4">
              <label htmlFor="url" className="text-xs mb-2">Analyze your website:</label>
              <input
                type="text"
                id="url"
                name="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="px-4 py-2 border rounded-md w-full"
                placeholder="www.example.com"
              />
            </div>
            <div className="flex flex-col flex-grow mb-4">
              <label htmlFor="keyphrase" className="text-xs mb-2">Keyphrase:</label>
              <div className="flex items-end space-x-4">
                <input
                  type="text"
                  id="keyphrase"
                  name="keyphrase"
                  value={keyphrase}
                  onChange={(e) => setKeyphrase(e.target.value)}
                  required
                  className="px-4 py-2 border rounded-md flex-grow"
                  placeholder="Drupal 10"
                />
                <button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded-md">Analyze</button>
              </div>
            </div>
          </form>
        </div>
      </div>
  
      <div className="border bg-background rounded-xl my-4 p-4 flex flex-col items-center justify-center w-full max-w-7xl">
        {loading ? (
          <div className="text-center">
            <p className="mb-4">Paul is crawling your text...need some seconds.</p>
            <Image
              src={spinnerImage}
              alt="Loading..."
              width={256}
              height={256}
              className="mx-auto"
            />
          </div>
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
            <h1 className="text-xl mt-8 my-4">Paul AI is your <strong>friendly AI Bot</strong> designed to help you <strong>optimize your website text</strong>.</h1>
          </div>
        ) : (
          <div className="w-full">
            {rating !== null && (
              <div className={`mt-4 text-xl font-bold ${getRatingBackgroundColor(rating)} p-4 rounded-md`}>
                Bewertung: {rating}
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
            {seoScore !== null && (
              <div className="mt-2 text-xl">
                SEO Score: {seoScore}
              </div>
            )}
            {analysis && (
              <div className="mt-2 p-4 border rounded-md bg-gray-50 whitespace-pre-line">
                {title && (
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">Titel der Seite</h2>
                    <p>«{title}»</p>
                  </div>
                )}
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
          </div>
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