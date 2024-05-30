import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import cheerio from 'cheerio';
import dotenv from 'dotenv';

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

interface OpenAIResponse {
  choices: { message: { content: string } }[];
}

export async function POST(req: NextRequest) {
  if (!OPENAI_API_KEY) {
    return NextResponse.json({ error: 'API key is not set.' }, { status: 500 });
  }

  try {
    const { url, keyphrase } = await req.json();

    // Fetch the webpage
    const webpageResponse = await axios.get(url);
    const webpageHTML = webpageResponse.data;

    // Parse the HTML and extract the main content
    const $ = cheerio.load(webpageHTML);
    const mainContent = $('.default').text();

    // Truncate the text if it's too long (optional, based on your needs)
    const maxLength = 5000;
    const truncatedContent = mainContent.length > maxLength ? mainContent.slice(0, maxLength) : mainContent;

    // Count the number of words
    const wordCount = truncatedContent.split(/\s+/).length;

    // Prepare the data for OpenAI API
    const data = {
      model: 'gpt-3.5-turbo', // Change to 'gpt-4' if you have access
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant.',
        },
        {
          role: 'user',
          content: `Bitte analysieren Sie den folgenden Text hinsichtlich seiner Länge und Lesbarkeit. Bewerten Sie, ob die Textlänge angemessen ist oder ob der Text zu kurz oder zu lang erscheint. Beurteilen Sie außerdem, wie flüssig sich der Text lesen lässt. Berücksichtigen Sie dabei Aspekte wie Satzstruktur, Klarheit der Argumentation und die Verwendung von Fachsprache oder Jargon. Geben Sie die Bewertung auf einer Skala von 1 bis 10, wobei 1 sehr schlecht und 10 ausgezeichnet bedeutet, am Anfang der Antwort an. Überprüfen Sie außerdem, ob die Keyphrase "${keyphrase}" im Text vorhanden ist und wie oft sie vorkommt. Geben Sie abschließend eine SEO-Bewertung basierend auf der Verwendung der Keyphrase und machen Sie Vorschläge, wie der Text verbessert werden kann: ${truncatedContent}`,
        },
      ],
    };

    // Send the request to OpenAI API
    const openaiResponse = await axios.post<OpenAIResponse>(
      'https://api.openai.com/v1/chat/completions',
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    // Check the response structure
    if (!openaiResponse.data || !openaiResponse.data.choices || openaiResponse.data.choices.length === 0) {
      throw new Error('Invalid response from OpenAI API');
    }

    const analysis = openaiResponse.data.choices[0].message.content.trim();

    // Extract the SEO score from the analysis
    const seoMatch = analysis.match(/SEO-Bewertung: (\d+)/);
    const seoScore = seoMatch ? parseInt(seoMatch[1], 10) : null;

    // Extract the general rating from the analysis
    const ratingMatch = analysis.match(/Bewertung: (\d+)/);
    const ratingValue = ratingMatch ? parseInt(ratingMatch[1], 10) : null;

    // Extract suggestions for improvement
    const suggestionsStart = analysis.indexOf("Vorschläge:");
    const suggestions = suggestionsStart !== -1 ? analysis.slice(suggestionsStart) : "";

    return NextResponse.json({ analysis, rating: ratingValue, seoScore, suggestions, wordCount });
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
