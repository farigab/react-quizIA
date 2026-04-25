import { useCallback, useRef, useState } from 'react';

const NUM_QUESTIONS = 10;
const AUTO_ADVANCE_DELAY = 15000;
const AUTO_ADVANCE_ENABLED = true;
const QUESTIONS_URL = '/questions.json';
const SERVER_BASE = import.meta.env.VITE_SERVER_BASE || '';

type Question = { theme?: string; answerIndex?: number;[key: string]: unknown };

const safeStorage: {
  get: (k: string) => string | null;
  set: (k: string, v: string) => void;
} = {
  get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* ignore storage errors */ } },
};

function pickRandom<T>(arr: T[], n: number): T[] {
  const clone = [...arr];
  for (let i = clone.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone.slice(0, Math.min(n, clone.length));
}

// Screens: 'intro' | 'loading' | 'question' | 'final'
export function useQuiz() {
  const [screen, setScreen] = useState<'intro' | 'loading' | 'question' | 'final'>('intro');
  const [currentTheme, setCurrentTheme] = useState<string | null>(null);
  const questionsRef = useRef<Question[] | null>(null);
  const [selected, setSelected] = useState<Question[]>([]);
  const [current, setCurrent] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [answered, setAnswered] = useState<boolean>(false);
  const [chosenIdx, setChosenIdx] = useState<number | null>(null);
  const [highScore, setHighScore] = useState<number>(() => Number(safeStorage.get('showdo_miau_highscore') || 0));
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [autoAdvanceProgress, setAutoAdvanceProgress] = useState<number>(100);

  const controllerRef = useRef<AbortController | null>(null);
  const autoAdvanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = useCallback(() => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setAutoAdvanceProgress(100);
  }, []);

  const startAutoAdvance = useCallback((onAdvance: () => void) => {
    if (!AUTO_ADVANCE_ENABLED) return;
    clearTimers();
    setAutoAdvanceProgress(100);
    const start = Date.now();
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.max(0, 100 - (elapsed / AUTO_ADVANCE_DELAY) * 100);
      setAutoAdvanceProgress(pct);
    }, 100);
    autoAdvanceTimerRef.current = setTimeout(() => {
      clearTimers();
      onAdvance();
    }, AUTO_ADVANCE_DELAY);
  }, [clearTimers]);

  const startGame = useCallback(async (theme: string | null = null) => {
    setCurrentTheme(theme);
    setLoadError(null);
    setScreen('loading');
    clearTimers();

    if (controllerRef.current) {
      try { controllerRef.current.abort(); } catch { /* ignore abort errors */ }
    }

    let loadedQuestions: Question[] | null = null;

    if (theme) {
      try {
        const ctrl = new AbortController();
        controllerRef.current = ctrl;
        const resp = await fetch(`${SERVER_BASE}/api/generate-questions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ theme, count: NUM_QUESTIONS }),
          signal: ctrl.signal,
        });
        controllerRef.current = null;
        if (resp.ok) {
          const data = await resp.json();
          if (data?.ok && Array.isArray(data.questions) && data.questions.length) {
            loadedQuestions = data.questions;
          }
        }
      } catch (err: unknown) {
        const errName = (typeof err === 'object' && err !== null && 'name' in err && typeof (err as Record<string, unknown>).name === 'string')
          ? (err as { name: string }).name
          : undefined;
        if (errName === 'AbortError') return;
        controllerRef.current = null;
        console.warn('Falha ao chamar servidor generativo:', err);
      }
    }

    if (!loadedQuestions) {
      try {
        const res = await fetch(QUESTIONS_URL, { cache: 'no-store' });
        if (!res.ok) throw new Error('Falha ao carregar perguntas');
        loadedQuestions = await res.json();
      } catch {
        setLoadError('Erro ao carregar perguntas. Verifique sua conexão.');
        setScreen('intro');
        return;
      }
    }

    let pool: Question[] = loadedQuestions ?? [];
    if (theme && theme !== 'Diversos') {
      const filtered = pool.filter(
        (q) => String(q.theme || '').toLowerCase() === String(theme).toLowerCase()
      );
      if (filtered.length >= 3) pool = filtered;
    }

    const sel = pickRandom<Question>(pool, NUM_QUESTIONS);
    questionsRef.current = loadedQuestions;
    setSelected(sel);
    setCurrent(0);
    setScore(0);
    setAnswered(false);
    setChosenIdx(null);
    setScreen('question');
  }, [clearTimers]);

  const handleChoice = useCallback((idx: number) => {
    if (answered) return;
    setAnswered(true);
    setChosenIdx(idx);
    const correctIdx = Number(selected[current]?.answerIndex ?? 0);
    if (idx === correctIdx) {
      setScore((s) => s + 1);
    }
  }, [answered, selected, current]);

  const handleNext = useCallback(() => {
    clearTimers();
    if (current < selected.length - 1) {
      setCurrent((c) => c + 1);
      setAnswered(false);
      setChosenIdx(null);
    } else {
      // Final
      setScore((finalScore) => {
        const prev = Number(safeStorage.get('showdo_miau_highscore') || 0);
        if (finalScore > prev) {
          safeStorage.set('showdo_miau_highscore', String(finalScore));
          setHighScore(finalScore);
          setIsNewRecord(true);
        } else {
          setIsNewRecord(false);
        }
        return finalScore;
      });
      setScreen('final');
    }
  }, [clearTimers, current, selected.length]);

  // Must be called after setAnswered so we have answered=true
  const triggerAutoAdvance = useCallback(() => {
    startAutoAdvance(handleNext);
  }, [startAutoAdvance, handleNext]);

  const resetToIntro = useCallback(() => {
    clearTimers();
    if (controllerRef.current) {
      try { controllerRef.current.abort(); } catch { /* ignore abort errors */ }
      controllerRef.current = null;
    }
    setScreen('intro');
    setCurrentTheme(null);
    setSelected([]);
    setCurrent(0);
    setScore(0);
    setAnswered(false);
    setChosenIdx(null);
    setIsNewRecord(false);
    setLoadError(null);
  }, [clearTimers]);

  const currentQuestion = selected[current] ?? null;
  const correctIdx = Number(currentQuestion?.answerIndex ?? 0);
  const progressPct = selected.length ? (current / selected.length) * 100 : 0;
  const answeredOffset = answered ? 1 : 0;
  const answeredProgressPct = selected.length ? ((current + answeredOffset) / selected.length) * 100 : 0;

  return {
    screen,
    currentTheme,
    current,
    score,
    highScore,
    isNewRecord,
    answered,
    chosenIdx,
    correctIdx,
    currentQuestion,
    selected,
    progressPct,
    answeredProgressPct,
    autoAdvanceProgress,
    loadError,
    startGame,
    handleChoice,
    handleNext,
    triggerAutoAdvance,
    resetToIntro,
  };
}
