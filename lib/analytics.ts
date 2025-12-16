type EventName =
  | 'lesson_start'
  | 'lesson_complete'
  | 'streak_update'
  | 'purchase'
  | 'experiment_exposure'
  | 'page_view';

interface EventProperties {
  [key: string]: string | number | boolean | undefined;
}

const isDev = process.env.NODE_ENV === 'development';
let eventQueue: Array<{ name: EventName; properties: EventProperties; timestamp: number }> = [];

export function trackEvent(name: EventName, properties: EventProperties = {}): void {
  if (isDev) {
    console.log('[Analytics]', name, properties);
    return;
  }

  eventQueue.push({ name, properties, timestamp: Date.now() });

  if (eventQueue.length >= 10) {
    flushEvents();
  }
}

export function trackPageView(path: string): void {
  trackEvent('page_view', { path });
}

export async function flushEvents(): Promise<void> {
  if (eventQueue.length === 0) return;

  const events = [...eventQueue];
  eventQueue = [];

  if (isDev) return;

  try {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events }),
    });
  } catch {
    eventQueue = [...events, ...eventQueue];
  }
}

export function trackExperiment(experimentId: string, variant: string): void {
  trackEvent('experiment_exposure', { experimentId, variant });
}

export function trackLessonStart(lessonId: string): void {
  trackEvent('lesson_start', { lessonId });
}

export function trackLessonComplete(lessonId: string, xpEarned: number): void {
  trackEvent('lesson_complete', { lessonId, xpEarned });
}

export function trackPurchase(itemId: string, cost: number): void {
  trackEvent('purchase', { itemId, cost });
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', flushEvents);
  setInterval(flushEvents, 30000);
}
