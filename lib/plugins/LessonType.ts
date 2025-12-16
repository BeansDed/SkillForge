export interface LessonContext {
  lessonId: string;
  userId: string;
  attempt: number;
}

export interface ILessonPlugin {
  componentName: string;
  validateAnswer(input: unknown, context: LessonContext): boolean;
  getInitialState(): Record<string, unknown>;
}

export class FlashcardPlugin implements ILessonPlugin {
  componentName = 'FlashcardLesson';

  validateAnswer(input: unknown, context: LessonContext): boolean {
    return typeof input === 'boolean' && input === true;
  }

  getInitialState() {
    return { flipped: false, completed: false };
  }
}

export class MultipleChoicePlugin implements ILessonPlugin {
  componentName = 'MultipleChoiceLesson';

  validateAnswer(input: unknown, context: LessonContext): boolean {
    return typeof input === 'string' && input.length > 0;
  }

  getInitialState() {
    return { selectedOption: null, submitted: false };
  }
}

export class CodeChallengePlugin implements ILessonPlugin {
  componentName = 'CodeChallengeLesson';

  validateAnswer(input: unknown, context: LessonContext): boolean {
    return typeof input === 'string' && input.trim().length > 0;
  }

  getInitialState() {
    return { code: '', output: '', isRunning: false };
  }
}
