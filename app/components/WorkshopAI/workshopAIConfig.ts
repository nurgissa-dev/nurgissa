/**
 * Workshop AI — Configuration & Reaction Database
 *
 * Central config for timing constants, event probabilities,
 * silent mood mapping, and the phrase reaction database.
 */

import type { AIEventType } from '../../utils/aiEvents';

// ── Mood Types ──
export type AIMood = 'neutral' | 'curious' | 'happy' | 'sad' | 'sarcastic' | 'surprised';

// ── Timing Constants ──
export const AI_COOLDOWN = 20_000;           // 20s between speech bubbles
export const IDLE_TIMEOUT = 30_000;          // 30s of inactivity → IDLE
export const PROJECT_DWELL_TIMEOUT = 8_000; // 8s viewing a single project
export const MOOD_RESET_TIMEOUT = 4_000;     // 4s → return to neutral
export const BUBBLE_DURATION_DEFAULT = 4_000; // 4s default bubble display time
export const ACTIVITY_THROTTLE = 1_500;      // 1.5s throttle for interaction tracker

// ── Centralized Event Probabilities ──
// Probability that AI will speak (show bubble) when this event fires.
// 0 = never speak, 1 = always speak.
export const EVENT_PROBABILITIES: Record<AIEventType, number> = {
  SITE_LOADED: 0,
  PROJECTS_OPENED: 0.25,
  PROJECT_CLOSED: 0,    // Control event only — never triggers speech or mood
  PROJECT_VIEWED: 0.22,
  PROJECT_DWELL: 0.35,
  GITHUB_CLICKED: 0.40,
  DEMO_CLICKED: 0.40,
  ABOUT_OPENED: 0.25,
  CONTACTS_OPENED: 0.30,
  EDUCATION_OPENED: 0.20,
  TERMINAL_OPENED: 0.35,
  RESUME_VIEWED: 0.22,
  USER_RETURNED: 0.25,
  IDLE: 0.18,
};

// ── Silent Mood Mapping ──
// CRT face changes IMMEDIATELY on these events, even without speech.
// PROJECT_CLOSED and SITE_LOADED have no mood effect.
export const SILENT_MOOD_MAP: Partial<Record<AIEventType, AIMood>> = {
  PROJECTS_OPENED: 'curious',
  PROJECT_VIEWED: 'curious',
  PROJECT_DWELL: 'sad',
  GITHUB_CLICKED: 'happy',
  DEMO_CLICKED: 'happy',
  ABOUT_OPENED: 'curious',
  CONTACTS_OPENED: 'surprised',
  EDUCATION_OPENED: 'curious',
  TERMINAL_OPENED: 'sarcastic',
  RESUME_VIEWED: 'curious',
  USER_RETURNED: 'happy',
  IDLE: 'sarcastic',
};

// ── Event Priority (lower number = higher priority) ──
export const EVENT_PRIORITY: Record<AIEventType, number> = {
  GITHUB_CLICKED: 1,
  DEMO_CLICKED: 1,
  PROJECT_DWELL: 2,
  PROJECT_VIEWED: 3,
  PROJECTS_OPENED: 4,
  TERMINAL_OPENED: 5,
  CONTACTS_OPENED: 6,
  ABOUT_OPENED: 7,
  EDUCATION_OPENED: 8,
  RESUME_VIEWED: 9,
  USER_RETURNED: 10,
  IDLE: 11,
  SITE_LOADED: 99,
  PROJECT_CLOSED: 99,
};

// ── Structured Reaction Config ──
export interface AIReactionConfig {
  id: string;
  context: AIEventType;
  text: string;
  mood: AIMood;
  duration?: number; // ms to display bubble (defaults to BUBBLE_DURATION_DEFAULT)
}

// ── Phrase / Reaction Database ──
export const REACTIONS: AIReactionConfig[] = [
  // PROJECTS_OPENED
  { id: 'proj_open_01', context: 'PROJECTS_OPENED', text: 'Мм... заинтересовало?', mood: 'curious' },
  { id: 'proj_open_02', context: 'PROJECTS_OPENED', text: 'Добро пожаловать в Projects.', mood: 'neutral' },
  { id: 'proj_open_03', context: 'PROJECTS_OPENED', text: 'О, решил посмотреть, что я тут натворил.', mood: 'curious' },
  { id: 'proj_open_04', context: 'PROJECTS_OPENED', text: 'Здесь я немного постарался.', mood: 'happy' },

  // PROJECT_VIEWED
  { id: 'proj_view_01', context: 'PROJECT_VIEWED', text: 'О, этот решил посмотреть.', mood: 'curious' },
  { id: 'proj_view_02', context: 'PROJECT_VIEWED', text: 'Интересный выбор.', mood: 'curious' },
  { id: 'proj_view_03', context: 'PROJECT_VIEWED', text: 'Этот проект мне нравится.', mood: 'happy' },
  { id: 'proj_view_04', context: 'PROJECT_VIEWED', text: 'Ты уже третий проект смотришь.', mood: 'sarcastic' },

  // PROJECT_DWELL (user stayed 15s+ without clicking GitHub/Demo)
  { id: 'proj_dwell_01', context: 'PROJECT_DWELL', text: 'Ты уже немного с ним познакомился...', mood: 'curious' },
  { id: 'proj_dwell_02', context: 'PROJECT_DWELL', text: 'Ты даже GitHub не открыл... 🥲', mood: 'sad' },
  { id: 'proj_dwell_03', context: 'PROJECT_DWELL', text: 'Он посмотрел проект... и ушёл.', mood: 'sad' },
  { id: 'proj_dwell_04', context: 'PROJECT_DWELL', text: 'Нажми GitHub, не стесняйся.', mood: 'sarcastic' },

  // GITHUB_CLICKED
  { id: 'github_01', context: 'GITHUB_CLICKED', text: 'Неплохой выбор!', mood: 'happy' },
  { id: 'github_02', context: 'GITHUB_CLICKED', text: 'Хочешь глянуть исходники? Правильно.', mood: 'happy' },
  { id: 'github_03', context: 'GITHUB_CLICKED', text: 'Ого, реально полез в код.', mood: 'surprised' },
  { id: 'github_04', context: 'GITHUB_CLICKED', text: 'Мне нравится твой подход.', mood: 'happy' },

  // DEMO_CLICKED
  { id: 'demo_01', context: 'DEMO_CLICKED', text: 'Отлично, посмотри вживую!', mood: 'happy' },
  { id: 'demo_02', context: 'DEMO_CLICKED', text: 'Приятного просмотра.', mood: 'happy' },
  { id: 'demo_03', context: 'DEMO_CLICKED', text: 'Надеюсь, тебе понравится.', mood: 'curious' },
  { id: 'demo_04', context: 'DEMO_CLICKED', text: 'О, решил запустить демо. Смелый.', mood: 'sarcastic' },

  // ABOUT_OPENED
  { id: 'about_01', context: 'ABOUT_OPENED', text: 'Осторожно. Сейчас ты узнаешь слишком много.', mood: 'sarcastic' },
  { id: 'about_02', context: 'ABOUT_OPENED', text: 'Ну... раз уж ты спросил.', mood: 'curious' },
  { id: 'about_03', context: 'ABOUT_OPENED', text: 'Добро пожаловать в раздел "обо мне".', mood: 'neutral' },
  { id: 'about_04', context: 'ABOUT_OPENED', text: 'Хочешь узнать, кто я? Похвально.', mood: 'happy' },

  // TERMINAL_OPENED
  { id: 'term_01', context: 'TERMINAL_OPENED', text: 'Наконец-то кто-то нажал на терминал.', mood: 'happy' },
  { id: 'term_02', context: 'TERMINAL_OPENED', text: 'Добро пожаловать на мою территорию.', mood: 'sarcastic' },
  { id: 'term_03', context: 'TERMINAL_OPENED', text: 'О, терминал. Человек со вкусом.', mood: 'happy' },
  { id: 'term_04', context: 'TERMINAL_OPENED', text: 'sudo make me a sandwich.', mood: 'sarcastic' },

  // CONTACTS_OPENED
  { id: 'contact_01', context: 'CONTACTS_OPENED', text: 'Ого. Уже хочешь связаться?', mood: 'surprised' },
  { id: 'contact_02', context: 'CONTACTS_OPENED', text: 'Неужели я тебе понравился?', mood: 'happy' },
  { id: 'contact_03', context: 'CONTACTS_OPENED', text: 'Контакты. Серьёзный шаг.', mood: 'surprised' },
  { id: 'contact_04', context: 'CONTACTS_OPENED', text: 'Telegram предпочтительнее. Просто говорю.', mood: 'sarcastic' },

  // EDUCATION_OPENED
  { id: 'edu_01', context: 'EDUCATION_OPENED', text: 'Astana IT University — хорошие воспоминания.', mood: 'happy' },
  { id: 'edu_02', context: 'EDUCATION_OPENED', text: 'Диплом. Почти готов.', mood: 'curious' },
  { id: 'edu_03', context: 'EDUCATION_OPENED', text: 'Software Engineering, если что.', mood: 'neutral' },
  { id: 'edu_04', context: 'EDUCATION_OPENED', text: 'Ты проверяешь, настоящий ли я студент?', mood: 'sarcastic' },

  // RESUME_VIEWED
  { id: 'resume_01', context: 'RESUME_VIEWED', text: 'Ага, решил проверить резюме.', mood: 'curious' },
  { id: 'resume_02', context: 'RESUME_VIEWED', text: 'Надеюсь, там всё понятно.', mood: 'neutral' },
  { id: 'resume_03', context: 'RESUME_VIEWED', text: 'PDF. Классика.', mood: 'sarcastic' },
  { id: 'resume_04', context: 'RESUME_VIEWED', text: 'Ого... ты серьёзно настроен.', mood: 'surprised' },

  // IDLE
  { id: 'idle_01', context: 'IDLE', text: 'Ты всё ещё здесь?', mood: 'curious' },
  { id: 'idle_02', context: 'IDLE', text: 'Я начинаю подозревать, что ты просто оставил вкладку открытой.', mood: 'sarcastic', duration: 6000 },
  { id: 'idle_03', context: 'IDLE', text: '...тишина.', mood: 'neutral' },
  { id: 'idle_04', context: 'IDLE', text: 'Может, попробуешь нажать на что-нибудь?', mood: 'sarcastic' },
];
