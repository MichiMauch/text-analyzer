import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import cheerio from 'cheerio';
import { OPENAI_API_KEY } from './config';
import { extractVisibleText, getMainContent } from './utils';

interface OpenAIResponse {
  choices: { message: { content: string } }[];
}

export async function POST(req: NextRequest) {
  if (!OPENAI_API_KEY) {
    return NextResponse.json({ error: 'API key is not set.' }, { status: 500 });
  }

  try {
    const { url, keyphrase } = await req.json();

    const webpageResponse = await axios.get(url);
    const webpageHTML = webpageResponse.data;

    const $ = cheerio.load(webpageHTML);
    const mainContent = extractVisibleText(getMainContent(webpageHTML));
    const pageTitle = $('h1').first().text();
    const ogImageElement = $('meta[property="og:image"]');
    const ogImage = ogImageElement.length > 0 ? ogImageElement.attr('content') : null;

    console.log('Extracted og:image:', ogImage);

    const maxLength = 5000;
    const truncatedContent = mainContent.length > maxLength ? mainContent.slice(0, maxLength) : mainContent;

    // Erste Abfrage: Qualitative Analyse und Verbesserungsvorschläge
    const data1 = {
      model: 'gpt-3.5-turbo',
      temperature: 0.2, // Setze die Temperatur für deterministischere Antworten
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant. Provide consistent and objective analysis.',
        },
        {
          role: 'user',
          content: `Bitte analysieren Sie den folgenden Text hinsichtlich seiner Länge und Lesbarkeit.
                    Beurteilen Sie, ob die Textlänge angemessen ist oder ob der Text zu kurz oder zu lang erscheint. 
                    Beurteilen Sie außerdem, wie flüssig sich der Text lesen lässt. Berücksichtigen Sie dabei Aspekte wie Satzstruktur, Klarheit der Argumentation und die Verwendung von Fachsprache oder Jargon. 
                    Geben Sie auch an, wie oft die Keyphrase "${keyphrase}" im Text vorhanden ist und machen Sie Vorschläge zur Verbesserung der Suchmaschinenoptimierung (SEO), ohne explizite numerische Bewertungen zu verwenden: ${truncatedContent}`,
        },
      ],
    };

    const qualitativeResponse = await axios.post<OpenAIResponse>(
      'https://api.openai.com/v1/chat/completions',
      data1,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    if (!qualitativeResponse.data || !qualitativeResponse.data.choices || qualitativeResponse.data.choices.length === 0) {
      throw new Error('Invalid response from OpenAI API');
    }

    const qualitativeAnalysis = qualitativeResponse.data.choices[0].message.content.trim();
    console.log('Qualitative Analysis:', qualitativeAnalysis);

    const suggestionsStart = qualitativeAnalysis.indexOf("Verbesserungsvorschläge:");
    const suggestions = suggestionsStart !== -1 ? qualitativeAnalysis.slice(suggestionsStart) : "";

    // Zweite Abfrage: Numerische Bewertung der Lesbarkeit
    const data2 = {
      model: 'gpt-3.5-turbo',
      temperature: 0.2, // Setze die Temperatur für deterministischere Antworten
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant. Provide consistent and objective analysis.',
        },
        {
          role: 'user',
          content: `Bitte bewerten Sie die allgemeine Lesbarkeit des folgenden Textes auf einer Skala von 1 bis 10, wobei 1 sehr schlecht und 10 ausgezeichnet bedeutet: ${truncatedContent}`,
        },
      ],
    };

    const readabilityResponse = await axios.post<OpenAIResponse>(
      'https://api.openai.com/v1/chat/completions',
      data2,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    if (!readabilityResponse.data || !readabilityResponse.data.choices || readabilityResponse.data.choices.length === 0) {
      throw new Error('Invalid response from OpenAI API');
    }

    const readabilityAnalysis = readabilityResponse.data.choices[0].message.content.trim();
    console.log('Readability Analysis:', readabilityAnalysis);
    const readabilityMatch = readabilityAnalysis.match(/(\d+)/);
    const ratingValue = readabilityMatch ? parseInt(readabilityMatch[1], 10) : null;

    // Dritte Abfrage: Numerische Bewertung der SEO-Optimierung
    const data3 = {
      model: 'gpt-3.5-turbo',
      temperature: 0.2, // Setze die Temperatur für deterministischere Antworten
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant. Provide consistent and objective analysis.',
        },
        {
          role: 'user',
          content: `Bitte bewerten Sie die SEO-Optimierung des folgenden Textes auf einer Skala von 1 bis 10, wobei 1 sehr schlecht und 10 ausgezeichnet bedeutet, basierend auf der Verwendung der Keyphrase "${keyphrase}": ${truncatedContent}`,
        },
      ],
    };

    const seoResponse = await axios.post<OpenAIResponse>(
      'https://api.openai.com/v1/chat/completions',
      data3,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    if (!seoResponse.data || !seoResponse.data.choices || seoResponse.data.choices.length === 0) {
      throw new Error('Invalid response from OpenAI API');
    }

    const seoAnalysis = seoResponse.data.choices[0].message.content.trim();
    console.log('SEO Analysis:', seoAnalysis);
    const seoMatch = seoAnalysis.match(/(\d+)/);
    const seoScore = seoMatch ? parseInt(seoMatch[1], 10) : null;

    return NextResponse.json({
      analysis: qualitativeAnalysis,
      rating: ratingValue,
      seoScore,
      suggestions,
      wordCount: truncatedContent.split(/\s+/).length,
      title: pageTitle,
      ogImage,
      truncatedContent,
    });

  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data || error.message);
      return NextResponse.json({ error: error.response?.data.message || 'Failed to analyze the text' }, { status: 500 });
    } else {
      console.error('Unexpected error', error);
      return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 });
    }
  }
}
