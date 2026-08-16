import OpenAI from 'openai';

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

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }
  return new OpenAI({ apiKey });
}

function parseJson(content: string | null, label: string): unknown {
  if (!content?.trim()) {
    throw new Error(`${label} returned an empty response`);
  }

  try {
    return JSON.parse(content);
  } catch {
    throw new Error(`${label} returned invalid JSON`);
  }
}

export async function generateLessonDraft(
  topic: string,
  level: 'beginner' | 'intermediate' | 'advanced'
): Promise<LessonDraft> {
  const cleanTopic = topic.trim();
  if (!cleanTopic) {
    throw new Error('topic is required');
  }

  const openai = getOpenAIClient();
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.3,
    max_tokens: 2000,
    messages: [
      {
        role: 'system',
        content: `You are a curriculum designer. Create lesson content for ${level} learners.\nOutput JSON: { title, description, objectives: string[], sections: [{ heading, content }] }`,
      },
      { role: 'user', content: `Create a lesson about: ${cleanTopic}` },
    ],
    response_format: { type: 'json_object' },
  });

  const parsed = parseJson(response.choices[0]?.message.content ?? null, 'Lesson generation');
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Lesson generation returned an unexpected response shape');
  }

  return parsed as LessonDraft;
}

export async function generateQuestions(
  content: string,
  count: number = 5
): Promise<QuestionDraft[]> {
  const cleanContent = content.trim();
  if (!cleanContent) {
    throw new Error('lesson content is required');
  }

  const safeCount = Number.isFinite(count)
    ? Math.min(20, Math.max(1, Math.floor(count)))
    : 5;
  const openai = getOpenAIClient();

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.3,
    max_tokens: 2000,
    messages: [
      {
        role: 'system',
        content: `Generate ${safeCount} quiz questions based on lesson content.\nOutput a JSON object shaped exactly like: { "questions": [{ "type": "MULTIPLE_CHOICE", "prompt": "...", "options": ["..."], "correctAnswer": "...", "explanation": "..." }] }`,
      },
      { role: 'user', content: cleanContent },
    ],
    response_format: { type: 'json_object' },
  });

  const parsed = parseJson(response.choices[0]?.message.content ?? null, 'Question generation');
  const questions = (parsed as { questions?: unknown })?.questions;
  if (!Array.isArray(questions)) {
    throw new Error('Question generation returned an unexpected response shape');
  }

  return questions as QuestionDraft[];
}
