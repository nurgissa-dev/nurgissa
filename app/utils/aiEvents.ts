/**
 * Workshop AI — Global Event Bus
 *
 * Lightweight pub/sub for semantic portfolio events.
 * Raw browser actions (mousemove, scroll, resize, etc.)
 * must NEVER be emitted through this bus.
 */

export type AIEventType =
  | 'SITE_LOADED'
  | 'PROJECTS_OPENED'
  | 'PROJECT_CLOSED'
  | 'PROJECT_VIEWED'
  | 'PROJECT_DWELL'
  | 'GITHUB_CLICKED'
  | 'DEMO_CLICKED'
  | 'ABOUT_OPENED'
  | 'CONTACTS_OPENED'
  | 'EDUCATION_OPENED'
  | 'TERMINAL_OPENED'
  | 'RESUME_VIEWED'
  | 'USER_RETURNED'
  | 'IDLE';

export interface AIEvent {
  type: AIEventType;
  /** Optional project identifier for PROJECT_VIEWED / PROJECT_DWELL */
  project?: string;
  timestamp: number;
}

type AIEventListener = (event: AIEvent) => void;

const listeners = new Set<AIEventListener>();

/** Emit a semantic AI event to all subscribers */
export function emitAIEvent(partial: Omit<AIEvent, 'timestamp'>): void {
  const event: AIEvent = { ...partial, timestamp: Date.now() };
  listeners.forEach((fn) => {
    try {
      fn(event);
    } catch (err) {
      console.error('[WorkshopAI] Event listener error:', err);
    }
  });
}

/** Subscribe to AI events. Returns cleanup function. */
export function onAIEvent(listener: AIEventListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
