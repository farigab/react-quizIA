import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import {
    Box,
    Button,
    Collapse,
    Typography,
} from '@mui/material';
import { useEffect, useRef } from 'react';

const LABELS = ['A', 'B', 'C', 'D'];

interface ChoiceStyle {
    bgcolor: string;
    borderColor: string;
    color: string;
    labelBg: string;
    labelColor: string;
    opacity?: number;
    animation?: string;
    '&:hover'?: Record<string, string | number>;
}

function getLabelIcon(state: 'idle' | 'correct' | 'wrong' | 'dimmed', idx: number) {
    if (state === 'correct') return <CheckIcon sx={{ fontSize: 16 }} />;
    if (state === 'wrong') return <CloseIcon sx={{ fontSize: 16 }} />;
    return LABELS[idx];
}

const stateStyles: Record<'idle' | 'correct' | 'wrong' | 'dimmed', ChoiceStyle> = {
    idle: {
        bgcolor: '#ffffff',
        borderColor: '#e2e8f0',
        color: '#334155',
        labelBg: '#f1f5f9',
        labelColor: '#64748b',
        '&:hover': {
            borderColor: '#a5b4fc',
            bgcolor: '#f8faff',
            transform: 'translateX(2px)',
        },
    },
    correct: {
        bgcolor: '#f0fdf4',
        borderColor: '#86efac',
        color: '#14532d',
        labelBg: '#22c55e',
        labelColor: '#ffffff',
    },
    wrong: {
        bgcolor: '#fef2f2',
        borderColor: '#fca5a5',
        color: '#7f1d1d',
        labelBg: '#ef4444',
        labelColor: '#ffffff',
        animation: 'shake 0.35s ease',
    },
    dimmed: {
        bgcolor: '#f8fafc',
        borderColor: '#f1f5f9',
        color: '#94a3b8',
        labelBg: '#e2e8f0',
        labelColor: '#94a3b8',
        opacity: 0.55,
    },
};

type Question = {
    question?: string;
    choices?: string[];
    explanation?: string;
    answerIndex?: number;
    [k: string]: unknown;
};

interface QuestionScreenProps {
    question: Question | null;
    current: number;
    total: number;
    score: number;
    answered: boolean;
    chosenIdx: number | null;
    correctIdx: number;
    progressPct: number;
    answeredProgressPct: number;
    autoAdvanceProgress: number;
    onChoice: (idx: number) => void;
    onNext: () => void;
    onAnswered?: () => void;
}

export default function QuestionScreen({
    question,
    current,
    total,
    score,
    answered,
    chosenIdx,
    correctIdx,
    autoAdvanceProgress,
    onChoice,
    onNext,
    onAnswered,
}: Readonly<QuestionScreenProps>) {
    const headingRef = useRef<HTMLHeadingElement | null>(null);

    // Keyboard shortcut: 1-4
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (answered) return;
            const num = Number(e.key) - 1;
            if (num >= 0 && num < (question?.choices?.length ?? 0)) onChoice(num);
        };
        globalThis.addEventListener('keydown', handler);
        return () => globalThis.removeEventListener('keydown', handler);
    }, [answered, question, onChoice]);

    useEffect(() => {
        if (answered) onAnswered?.();
    }, [answered, onAnswered]);

    useEffect(() => {
        if (!answered) headingRef.current?.focus();
    }, [current, answered]);

    if (!question) return null;

    const isLast = current === total - 1;
    const isCorrectAnswer = chosenIdx === correctIdx;

    const getChoiceState = (idx: number) => {
        if (!answered) return 'idle';
        if (idx === correctIdx) return 'correct';
        if (idx === chosenIdx && idx !== correctIdx) return 'wrong';
        return 'dimmed';
    };

    // Segmented progress dots — objects with stable key (question position)
    const segments = Array.from({ length: total }, (_, i) => {
        const state =
            i < current ? 'done'
                : i === current ? (answered ? 'current-answered' : 'current')
                    : 'pending';
        return { key: `q${i}`, state };
    });

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2.5,
                animation: 'slideUp 0.3s cubic-bezier(0.16,1,0.3,1)',
                '@keyframes slideUp': {
                    from: { opacity: 0, transform: 'translateY(12px)' },
                    to: { opacity: 1, transform: 'translateY(0)' },
                },
            }}
        >
            {/* Header: segmented progress + score */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* Segmented dots */}
                <Box sx={{ display: 'flex', gap: 0.5, flex: 1, alignItems: 'center' }}>
                    {segments.map(({ key, state }) => {
                        const SEG_COLOR: Record<string, string> = {
                            pending: '#e2e8f0',
                            current: '#c7d2fe',
                        };
                        const segBgcolor = SEG_COLOR[state] ?? '#5c67f2';
                        return (
                            <Box
                                key={key}
                                sx={{
                                    flex: 1,
                                    height: 5,
                                    borderRadius: 999,
                                    transition: 'all 0.35s ease',
                                    bgcolor: segBgcolor,
                                    animation:
                                        state === 'current'
                                            ? 'pulse 1.5s ease infinite'
                                            : 'none',
                                    '@keyframes pulse': {
                                        '0%, 100%': { opacity: 1 },
                                        '50%': { opacity: 0.5 },
                                    },
                                }}
                            />
                        );
                    })}
                </Box>

                {/* Counter badge */}
                <Typography
                    variant="caption"
                    sx={{
                        fontWeight: 700,
                        color: '#5c67f2',
                        bgcolor: '#eef0fd',
                        px: 1,
                        py: 0.3,
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        flexShrink: 0,
                        fontFamily: '"Syne", sans-serif',
                    }}
                >
                    {current + 1}/{total}
                </Typography>

                {/* Score */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, flexShrink: 0 }}>
                    <EmojiEventsIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
                    <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#64748b' }}>
                        {score}
                    </Typography>
                </Box>
            </Box>

            {/* Question text */}
            <Typography
                variant="h6"
                tabIndex={-1}
                ref={headingRef}
                sx={{
                    fontWeight: 700,
                    lineHeight: 1.5,
                    color: '#0f172a',
                    letterSpacing: '-0.01em',
                    fontSize: { xs: '1.05rem', sm: '1.2rem' },
                }}
            >
                {question.question}
            </Typography>

            {/* Choices */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {(question.choices ?? []).map((text: string, idx: number) => {
                    const state = getChoiceState(idx);
                    const s = stateStyles[state];

                    return (
                        <Button
                            key={text}
                            fullWidth
                            disableElevation
                            disabled={answered}
                            onClick={() => onChoice(idx)}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                textAlign: 'left',
                                p: '11px 14px',
                                gap: 1.5,
                                textTransform: 'none',
                                borderRadius: '14px',
                                fontWeight: 500,
                                fontSize: '0.9rem',
                                lineHeight: 1.45,
                                border: '1.5px solid',
                                transition: 'all 0.18s ease',
                                cursor: answered ? 'default' : 'pointer',
                                bgcolor: s.bgcolor,
                                borderColor: s.borderColor,
                                color: s.color,
                                opacity: s.opacity ?? 1,
                                animation: s.animation,
                                '@keyframes shake': {
                                    '0%, 100%': { transform: 'translateX(0)' },
                                    '20%': { transform: 'translateX(-5px)' },
                                    '60%': { transform: 'translateX(5px)' },
                                },
                                '&:hover': answered ? {} : (s['&:hover'] ?? {}),
                                '&.Mui-disabled': {
                                    bgcolor: s.bgcolor,
                                    borderColor: s.borderColor,
                                    color: s.color,
                                    opacity: s.opacity ?? 1,
                                },
                            }}
                        >
                            {/* Label badge */}
                            <Box
                                sx={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: '9px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    fontFamily: '"Syne", sans-serif',
                                    fontWeight: 700,
                                    fontSize: '0.8rem',
                                    transition: 'all 0.18s ease',
                                    bgcolor: s.labelBg,
                                    color: s.labelColor,
                                }}
                            >
                                {getLabelIcon(state, idx)}
                            </Box>

                            <Box component="span" sx={{ flex: 1 }}>{text}</Box>
                        </Button>
                    );
                })}
            </Box>

            {/* Explanation */}
            <Collapse in={answered} timeout={250}>
                <Box
                    aria-live="polite"
                    sx={{
                        borderRadius: '14px',
                        p: '14px 16px',
                        bgcolor: isCorrectAnswer ? '#f0fdf4' : '#fff7ed',
                        borderLeft: '3px solid',
                        borderColor: isCorrectAnswer ? '#22c55e' : '#f97316',
                        mt: -0.5,
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            color: isCorrectAnswer ? '#166534' : '#7c2d12',
                            fontWeight: 500,
                            lineHeight: 1.65,
                            mb: 1.5,
                        }}
                    >
                        {question.explanation ||
                            (isCorrectAnswer
                                ? '✅ Correto! Excelente.'
                                : `❌ Correto: ${question.choices?.[correctIdx]}`)}
                    </Typography>

                    {/* Auto-advance countdown bar */}
                    <Box
                        sx={{
                            height: 3,
                            borderRadius: 999,
                            bgcolor: isCorrectAnswer ? 'rgba(34,197,94,0.2)' : 'rgba(249,115,22,0.15)',
                            overflow: 'hidden',
                        }}
                    >
                        <Box
                            sx={{
                                height: '100%',
                                borderRadius: 999,
                                bgcolor: isCorrectAnswer ? '#22c55e' : '#f97316',
                                width: `${autoAdvanceProgress}%`,
                                transition: 'width 0.1s linear',
                            }}
                        />
                    </Box>
                </Box>
            </Collapse>

            {/* Next button */}
            <Button
                variant="contained"
                fullWidth
                disableElevation
                disabled={!answered}
                onClick={onNext}
                endIcon={<ArrowForwardIcon />}
                sx={{
                    mt: 'auto',
                    py: 1.5,
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: '14px',
                    bgcolor: '#5c67f2',
                    color: '#ffffff',
                    opacity: answered ? 1 : 0,
                    transform: answered ? 'translateY(0) scale(1)' : 'translateY(6px) scale(0.98)',
                    transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                    pointerEvents: answered ? 'auto' : 'none',
                    '&:hover': { bgcolor: '#4a53d4' },
                    '&.Mui-disabled': { bgcolor: '#e2e8f0', color: '#fff' },
                }}
            >
                {isLast ? 'Ver resultado' : 'Próxima'}
            </Button>
        </Box>
    );
}
