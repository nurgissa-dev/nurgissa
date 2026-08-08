'use client';

/**
 * Workshop AI — Main State Manager & Speech Bubble Component
 *
 * Owns all internal AI state: mood, timers, cooldowns, phrase history.
 * page.tsx only receives the current mood via onMoodChange callback.
 *
 * Behavioral Invariants:
 * - Never speaks immediately on page load.
 * - CRT mood updates IMMEDIATELY on semantic events (silent reactions).
 * - Mood resets to neutral after 5s without new semantic events.
 * - Speech cooldown: 45s between bubbles.
 * - IDLE fires only once per inactivity period.
 * - PROJECT_DWELL validates captured projectId vs current.
 * - PROJECT_CLOSED is control-only — no speech, no mood.
 * - Phrase history prevents repetition (last 3 in category).
 */

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { onAIEvent, emitAIEvent } from '../../utils/aiEvents';
import type { AIEvent, AIEventType } from '../../utils/aiEvents';
import {
  AI_COOLDOWN,
  IDLE_TIMEOUT,
  PROJECT_DWELL_TIMEOUT,
  MOOD_RESET_TIMEOUT,
  BUBBLE_DURATION_DEFAULT,
  ACTIVITY_THROTTLE,
  EVENT_PROBABILITIES,
  SILENT_MOOD_MAP,
  EVENT_PRIORITY,
  REACTIONS,
} from './workshopAIConfig';
import type { AIMood, AIReactionConfig } from './workshopAIConfig';
import './WorkshopAI.css';

interface WorkshopAIProps {
  onMoodChange?: (mood: AIMood) => void;
}

export default function WorkshopAI({ onMoodChange }: WorkshopAIProps) {
  // ── Visible state (triggers re-render) ──
  const [activeMessage, setActiveMessage] = useState<string | null>(null);
  const [bubbleExiting, setBubbleExiting] = useState(false);

  // ── Refs for mutable internal state (no re-renders) ──
  const currentMoodRef = useRef<AIMood>('neutral');
  const lastMessageAtRef = useRef<number>(0);
  const lastInteractionAtRef = useRef<number>(Date.now());
  const idleTriggeredRef = useRef<boolean>(false);
  const recentPhraseIdsRef = useRef<string[]>([]);

  // Project dwell state
  const currentProjectRef = useRef<string | null>(null);
  const githubClickedRef = useRef<boolean>(false);
  const demoClickedRef = useRef<boolean>(false);
  const dwellTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mood reset timer
  const moodResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Bubble auto-hide timer
  const bubbleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pending event queue for priority resolution
  const pendingEventRef = useRef<AIEvent | null>(null);
  const evaluationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Helpers ──

  const setMood = useCallback((mood: AIMood) => {
    currentMoodRef.current = mood;
    onMoodChange?.(mood);
  }, [onMoodChange]);

  const startMoodResetTimer = useCallback(() => {
    if (moodResetTimerRef.current) clearTimeout(moodResetTimerRef.current);
    moodResetTimerRef.current = setTimeout(() => {
      setMood('neutral');
      moodResetTimerRef.current = null;
    }, MOOD_RESET_TIMEOUT);
  }, [setMood]);

  const clearDwellTimer = useCallback(() => {
    if (dwellTimerRef.current) {
      clearTimeout(dwellTimerRef.current);
      dwellTimerRef.current = null;
    }
  }, []);

  /** Pick a reaction from the phrase database, avoiding recent repetitions */
  const pickReaction = useCallback((context: AIEventType): AIReactionConfig | null => {
    const candidates = REACTIONS.filter((r) => r.context === context);
    if (candidates.length === 0) return null;

    // Graceful handling for small categories:
    // - 1 phrase: always return it (no history tracking needed)
    // - 2-3 phrases: only exclude the very last used phrase
    // - 4+ phrases: exclude up to last 3 used phrases
    if (candidates.length === 1) {
      return candidates[0];
    }

    const recent = recentPhraseIdsRef.current;
    const recentInCategory = recent.filter((id) =>
      candidates.some((c) => c.id === id)
    );

    // Determine how many to exclude based on category size
    const excludeCount = candidates.length <= 3 ? 1 : 3;
    const recentToExclude = recentInCategory.slice(-excludeCount);

    const available = candidates.filter(
      (c) => !recentToExclude.includes(c.id)
    );

    // If all phrases exhausted, allow all (shouldn't happen with correct excludeCount)
    const pool = available.length > 0 ? available : candidates;
    const picked = pool[Math.floor(Math.random() * pool.length)];

    // Update history — cap total at 30
    recentPhraseIdsRef.current = [...recent, picked.id].slice(-30);

    return picked;
  }, []);

  /** Show a speech bubble with auto-hide */
  const showBubble = useCallback((text: string, duration: number = BUBBLE_DURATION_DEFAULT) => {
    // Clear any existing bubble timer
    if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);

    setBubbleExiting(false);
    setActiveMessage(text);
    lastMessageAtRef.current = Date.now();

    // Auto-hide with exit animation
    bubbleTimerRef.current = setTimeout(() => {
      setBubbleExiting(true);
      // Wait for exit animation to finish
      setTimeout(() => {
        setActiveMessage(null);
        setBubbleExiting(false);
      }, 300);
    }, duration);
  }, []);

  /** Evaluate whether to show a speech reaction for an event */
  const evaluateReaction = useCallback((event: AIEvent) => {
    const eventType = event.type;

    // Control events — no speech, no mood
    if (eventType === 'PROJECT_CLOSED' || eventType === 'SITE_LOADED') return;

    // Check speech cooldown
    const now = Date.now();
    if (now - lastMessageAtRef.current < AI_COOLDOWN) return;

    // Check probability
    const prob = EVENT_PROBABILITIES[eventType] ?? 0;
    if (prob === 0) return;
    if (Math.random() > prob) return;

    // Pick a reaction phrase
    const reaction = pickReaction(eventType);
    if (!reaction) return;

    // Apply mood from reaction and show bubble
    setMood(reaction.mood);
    startMoodResetTimer();
    showBubble(reaction.text, reaction.duration ?? BUBBLE_DURATION_DEFAULT);
  }, [pickReaction, setMood, startMoodResetTimer, showBubble]);

  // ── Main Event Handler ──
  useEffect(() => {
    const unsubscribe = onAIEvent((event: AIEvent) => {
      const eventType = event.type;

      // ─── Control Events ───
      if (eventType === 'PROJECT_CLOSED') {
        clearDwellTimer();
        currentProjectRef.current = null;
        githubClickedRef.current = false;
        demoClickedRef.current = false;
        return;
      }

      if (eventType === 'SITE_LOADED') {
        // No reaction, no mood change. AI stays neutral and silent.
        return;
      }

      // ─── Silent Mood Reaction (immediate, no cooldown cost) ───
      const silentMood = SILENT_MOOD_MAP[eventType];
      if (silentMood) {
        setMood(silentMood);
        startMoodResetTimer();
      }

      // ─── Project-Specific State Management ───
      if (eventType === 'PROJECT_VIEWED') {
        // Reset project state for new project
        clearDwellTimer();
        githubClickedRef.current = false;
        demoClickedRef.current = false;
        currentProjectRef.current = event.project ?? null;

        // Start dwell timeout (PROJECT_DWELL_TIMEOUT)
        const capturedProject = event.project ?? null;
        dwellTimerRef.current = setTimeout(() => {
          // Validate: same project still active
          if (
            capturedProject &&
            capturedProject === currentProjectRef.current
          ) {
            emitAIEvent({ type: 'PROJECT_DWELL', project: capturedProject });
          }
          dwellTimerRef.current = null;
        }, PROJECT_DWELL_TIMEOUT);
      }

      if (eventType === 'GITHUB_CLICKED') {
        githubClickedRef.current = true;
        clearDwellTimer();
      }

      if (eventType === 'DEMO_CLICKED') {
        demoClickedRef.current = true;
        clearDwellTimer();
      }

      // Cancel dwell on section changes
      if (
        eventType === 'ABOUT_OPENED' ||
        eventType === 'CONTACTS_OPENED' ||
        eventType === 'EDUCATION_OPENED' ||
        eventType === 'TERMINAL_OPENED' ||
        eventType === 'PROJECTS_OPENED'
      ) {
        clearDwellTimer();
      }

      // ─── Priority Resolution (debounce 100ms) ───
      // If events fire rapidly, only the highest-priority one gets evaluated.
      const incoming = event;
      const pending = pendingEventRef.current;

      if (
        !pending ||
        (EVENT_PRIORITY[incoming.type] ?? 99) < (EVENT_PRIORITY[pending.type] ?? 99)
      ) {
        pendingEventRef.current = incoming;
      }

      if (evaluationTimerRef.current) clearTimeout(evaluationTimerRef.current);
      evaluationTimerRef.current = setTimeout(() => {
        const toEvaluate = pendingEventRef.current;
        pendingEventRef.current = null;
        if (toEvaluate) {
          evaluateReaction(toEvaluate);
        }
      }, 100);
    });

    return unsubscribe;
  }, [setMood, startMoodResetTimer, clearDwellTimer, evaluateReaction]);

  // ── Throttled Activity Tracker (for IDLE detection) ──
  useEffect(() => {
    let throttleTimer: ReturnType<typeof setTimeout> | null = null;

    const updateActivity = () => {
      lastInteractionAtRef.current = Date.now();
      // Reset idle flag — user is active again
      idleTriggeredRef.current = false;
    };

    const throttledUpdate = () => {
      if (throttleTimer) return;
      updateActivity();
      throttleTimer = setTimeout(() => {
        throttleTimer = null;
      }, ACTIVITY_THROTTLE);
    };

    window.addEventListener('mousemove', throttledUpdate);
    window.addEventListener('keydown', throttledUpdate);
    window.addEventListener('click', throttledUpdate);
    window.addEventListener('scroll', throttledUpdate);

    return () => {
      window.removeEventListener('mousemove', throttledUpdate);
      window.removeEventListener('keydown', throttledUpdate);
      window.removeEventListener('click', throttledUpdate);
      window.removeEventListener('scroll', throttledUpdate);
      if (throttleTimer) clearTimeout(throttleTimer);
    };
  }, []);

  // ── IDLE Detection Loop ──
  useEffect(() => {
    const idleCheckInterval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastInteractionAtRef.current;

      if (elapsed >= IDLE_TIMEOUT && !idleTriggeredRef.current) {
        idleTriggeredRef.current = true;
        emitAIEvent({ type: 'IDLE' });
      }
    }, 5_000);

    return () => clearInterval(idleCheckInterval);
  }, []);

  // ── Visibility Change Detection (user left & returned) ──
  const leftAtRef = useRef<number>(0);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        leftAtRef.current = Date.now();
      } else {
        // User returned — emit if gone for 5+ seconds
        if (leftAtRef.current > 0 && Date.now() - leftAtRef.current > 5_000) {
          emitAIEvent({ type: 'USER_RETURNED' });
        }
        leftAtRef.current = 0;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // ── Cleanup all timers on unmount ──
  useEffect(() => {
    return () => {
      if (dwellTimerRef.current) clearTimeout(dwellTimerRef.current);
      if (moodResetTimerRef.current) clearTimeout(moodResetTimerRef.current);
      if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
      if (evaluationTimerRef.current) clearTimeout(evaluationTimerRef.current);
    };
  }, []);

  // ── Render Speech Bubble ──
  if (!activeMessage) return null;

  return (
    <div
      className={`workshop-ai-bubble${bubbleExiting ? ' workshop-ai-bubble-exit' : ''}`}
      aria-live="polite"
      role="status"
    >
      <div className="workshop-ai-bubble-inner">
        {activeMessage}
      </div>
    </div>
  );
}
