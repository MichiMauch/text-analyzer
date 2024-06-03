// Import necessary modules
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { OPENAI_API_KEY } from './analyze/config'; // Adjust the path as necessary
import { extractVisibleText } from './analyze/utils'; // Adjust the path to your utils module

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    // Expecting HTML content in the request body
    const { html } = req.body;
    if (!html) {
        res.status(400).json({ error: 'HTML content is required' });
        return;
    }

    // Extract text from HTML using the utility function
    const text = extractVisibleText(html);
    if (!text) {
        res.status(400).json({ error: 'No visible text extracted from HTML' });
        return;
    }

    try {
        // Data for OpenAI API request
        const postData = {
            model: 'gpt-3.5-turbo',
            temperature: 0.5,
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant. Provide consistent and objective analysis.',
                },
                {
                    role: 'user',
                    content: `Analyze the sentiment of this text: "${text}".`,
                }
            ]
        };

        // Send request to OpenAI API
        const response = await axios.post(OPENAI_URL, postData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            }
        });

        // Extract and send back the sentiment analysis result
        const sentimentAnalysis = response.data.choices[0].message.content.trim();
        res.status(200).json({ sentimentAnalysis });
    } catch (error: any) {
        console.error('Error accessing OpenAI API:', error.message);
        res.status(500).json({ error: 'Failed to fetch sentiment analysis from OpenAI API' });
    }
}
