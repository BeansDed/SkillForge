import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'skillforge-offline';
const STORE_NAME = 'pending-actions';

interface QueuedAction {
  id: string;
  type: 'XP_REWARD' | 'LESSON_COMPLETE' | 'STREAK_UPDATE';
  payload: Record<string, unknown>;
  timestamp: number;
  retries: number;
}

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

export async function enqueueAction(
  type: QueuedAction['type'],
  payload: Record<string, unknown>
): Promise<string> {
  const db = await getDB();
  const id = `${type}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const action: QueuedAction = { id, type, payload, timestamp: Date.now(), retries: 0 };
  await db.put(STORE_NAME, action);
  return id;
}

export async function getPendingActions(): Promise<QueuedAction[]> {
  const db = await getDB();
  return db.getAll(STORE_NAME);
}

export async function removeAction(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}

export async function flushQueue(
  processor: (action: QueuedAction) => Promise<boolean>
): Promise<{ success: number; failed: number }> {
  const actions = await getPendingActions();
  let success = 0;
  let failed = 0;

  for (const action of actions) {
    try {
      const ok = await processor(action);
      if (ok) {
        await removeAction(action.id);
        success++;
      } else {
        failed++;
      }
    } catch {
      failed++;
    }
  }

  return { success, failed };
}

export function setupOnlineSync(processor: (action: QueuedAction) => Promise<boolean>) {
  if (typeof window === 'undefined') return;
  window.addEventListener('online', () => flushQueue(processor));
}
