import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
  // Can be configured to point to Groq by changing baseURL
  // baseURL: 'https://api.groq.com/openai/v1' 
});

export const generateColdEmail = async (
  businessName: string,
  niche: string,
  city: string,
  issues: string[],
  service: string,
  tone: string
) => {
  const prompt = `
    You are an expert sales copywriter. Write a cold outreach email to ${businessName}, a ${niche} business in ${city}.
    We noticed the following issues with their online presence: ${issues.join(', ')}.
    We want to sell them: ${service}.
    Tone: ${tone}.
    
    Requirements:
    1. Catchy subject line.
    2. Short, personalized body.
    3. Clear Call to Action (CTA).
    4. Provide output in JSON format: { "subject": "string", "body": "string" }
  `;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // or 'llama3-8b-8192' if using Groq
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0].message.content;
    if (content) {
      return JSON.parse(content);
    }
    throw new Error('Empty response from AI');
  } catch (error) {
    console.error('AI Generation error:', error);
    throw new Error('Failed to generate email');
  }
};
