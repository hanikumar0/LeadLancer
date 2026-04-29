import axios from 'axios';
import { env } from '../config/env';

export const generateAiEmail = async (data: { leadBusinessName: string; niche: string; city: string; issues: string[]; bestService: string }) => {
  const prompt = `
    You are an expert cold email copywriter.
    Write a short, professional, and personalized cold email to the owner of "${data.leadBusinessName}" (a ${data.niche} business in ${data.city}).
    Mention that you noticed issues with their website like: ${data.issues.join(', ')}.
    Pitch them your ${data.bestService} services to help them get more local customers.
    Return ONLY a JSON object exactly like this:
    { "subject": "Your subject line here", "body": "Your email body here" }
  `;

  try {
    const response = await axios.post(
      `${env.XAI_BASE_URL}/chat/completions`,
      {
        model: env.XAI_MODEL,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${env.XAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const messageContent = response.data.choices[0].message.content;
    return JSON.parse(messageContent);
  } catch (error: any) {
    console.error('Grok AI Error:', error?.response?.data || error.message);
    throw new Error('Failed to generate email with Grok AI');
  }
};
