import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface LessonDraft {
  title: string;
  description: string;
  objectives: string[];
  sections: Array<{ heading: string; content: string }>;
}

export interface QuestionDraft {
  type: 'MULTIPLE_CHOICE' | 'FILL_BLANK' | 'TRUE_FALSE';
  prompt: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export async function generateLessonDraft(
  topic: string,
  level: 'beginner' | 'intermediate' | 'advanced'
): Promise<LessonDraft> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.3,
    max_tokens: 2000,
    messages: [
      {
        role: 'system',
        content: `You are a curriculum designer. Create lesson content for ${level} learners.
Output JSON: { title, description, objectives: string[], sections: [{ heading, content }] }`,
      },
      { role: 'user', content: `Create a lesson about: ${topic}` },
    ],
    response_format: { type: 'json_object' },
  });

  return JSON.parse(response.choices[0].message.content || '{}');
}

export async function generateQuestions(
  content: string,
  count: number = 5
): Promise<QuestionDraft[]> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.3,
    max_tokens: 2000,
    messages: [
      {
        role: 'system',
        content: `Generate ${count} quiz questions based on lesson content.
Output JSON array: [{ type, prompt, options?, correctAnswer, explanation }]`,
      },
      { role: 'user', content },
    ],
    response_format: { type: 'json_object' },
  });

  const parsed = JSON.parse(response.choices[0].message.content || '{}');
  return parsed.questions || [];
}
