const axios = require('axios');

const generateBugFixSuggestion = async (description) => {
  const prompt = `You are an experienced senior software engineer.

Analyze the following software bug description.

Return your response in JSON format.

Fields:
possibleCause
suggestedFix
additionalNotes

Keep explanations concise and beginner-friendly.
Do not generate code.
Do not assume technologies unless mentioned.

Bug Description:
${description}`;

  if (!process.env.GROQ_API_KEY) {
    const error = new Error('GROQ_API_KEY is not configured');
    console.error('Groq bug fix request failed:', error.message);
    throw error;
  }

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 300,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = response?.data?.choices?.[0]?.message?.content || '{}';
    const cleaned = String(content).replace(/```json|```/g, '').trim();
    let parsed = {};

    try {
      parsed = JSON.parse(cleaned);
    } catch (error) {
      parsed = {};
    }

    return {
      possibleCause: parsed.possibleCause || 'Unable to determine the root cause.',
      suggestedFix: parsed.suggestedFix || 'Please review the issue carefully and check related logs.',
      additionalNotes: parsed.additionalNotes || 'No additional notes provided.',
    };
  } catch (error) {
    console.error('Groq bug fix request failed:', error.response?.data || error.message || error);
    throw error;
  }
};

module.exports = { generateBugFixSuggestion };
