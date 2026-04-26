import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Collapse, Typography } from '@mui/material';
import { useEffect, useRef } from 'react';

const LABELS = ['A', 'B', 'C', 'D'];

type ChoiceState = 'idle' | 'correct' | 'wrong' | 'dimmed';

function getChoiceState(
    idx: number,
    answered: boolean,
    chosenIdx: number | null,
    correctIdx: number,
): ChoiceState {
    if (!answered) return 'idle';
    if (idx === correctIdx) return 'correct';
    if (idx === chosenIdx) return 'wrong';
    return 'dimmed';
}

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
    answered,
    chosenIdx,
    correctIdx,
    autoAdvanceProgress,
    onChoice,
    onNext,
    onAnswered,
}: Readonly<QuestionScreenProps>) {
    const headingRef = useRef<HTMLHeadingElement | null>(null);

    // Keyboard 1–4
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

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                gap: 0,
                pt: 3,
                animation: 'slideIn 0.28s cubic-bezier(0.16,1,0.3,1)',
                '@keyframes slideIn': {
                    from: { opacity: 0, transform: 'translateY(10px)' },
                    to: { opacity: 1, transform: 'translateY(0)' },
                },
            }}
        >
            {/* ── Meta row: counter + ghost number ── */}
            <Box sx={{ position: 'relative', mb: 3 }}>
                {/* Decorative large ghost number – editorial backdrop */}
                <Typography
                    aria-hidden="true"
                    sx={{
                        position: 'absolute',
                        top: '-0.35em',
                        right: '-0.1em',
                        fontFamily: '"Syne", sans-serif',
                        fontWeight: 800,
                        fontSize: { xs: '8rem', sm: '10rem' },
                        lineHeight: 1,
                        color: '#111',
                        opacity: 0.035,
                        userSelect: 'none',
                        pointerEvents: 'none',
                        letterSpacing: '-0.04em',
                    }}
                >
                    {String(current + 1).padStart(2, '0')}
                </Typography>

                {/* Counter pill */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                        sx={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            color: 'text.secondary',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                        }}
                    >
                        Questão
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            color: '#5c67f2',
                            letterSpacing: '0.04em',
                            fontVariantNumeric: 'tabular-nums',
                        }}
                    >
                        {current + 1}/{total}
                    </Typography>
                </Box>
            </Box>

            {/* ── Question text ── */}
            <Typography
                variant="h5"
                component="h2"
                tabIndex={-1}
                ref={headingRef}
                sx={{
                    fontWeight: 700,
                    color: '#111',
                    lineHeight: 1.45,
                    mb: 4,
                    fontSize: { xs: '1.15rem', sm: '1.3rem' },
                    letterSpacing: '-0.02em',
                }}
            >
                {question.question}
            </Typography>

            {/* ── Choices ── */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {(question.choices ?? []).map((text: string, idx: number) => {
                    const state = getChoiceState(idx, answered, chosenIdx, correctIdx);

                    const styles = {
                        idle: {
                            bg: '#ffffff',
                            border: '#e5e5e3',
                            color: '#111',
                            labelBg: '#f5f4f1',
                            labelColor: '#737373',
                            hover: { bgcolor: '#f5f4f1', borderColor: '#c7c7c5' },
                        },
                        correct: {
                            bg: '#f0fdf4',
                            border: '#86efac',
                            color: '#14532d',
                            labelBg: '#16a34a',
                            labelColor: '#fff',
                            hover: {},
                        },
                        wrong: {
                            bg: '#fef2f2',
                            border: '#fca5a5',
                            color: '#7f1d1d',
                            labelBg: '#dc2626',
                            labelColor: '#fff',
                            hover: {},
                        },
                        dimmed: {
                            bg: '#ffffff',
                            border: '#ededea',
                            color: '#a3a3a3',
                            labelBg: '#f5f4f1',
                            labelColor: '#c3c3c1',
                            hover: {},
                        },
                    }[state];

                    const labelContent =
                        state === 'correct' ? <CheckIcon sx={{ fontSize: 14 }} />
                            : state === 'wrong' ? <CloseIcon sx={{ fontSize: 14 }} />
                                : LABELS[idx];

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
                                py: '13px',
                                px: 2,
                                gap: 1.5,
                                borderRadius: '12px',
                                textTransform: 'none',
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                lineHeight: 1.5,
                                letterSpacing: '-0.01em',
                                border: '1.5px solid',
                                transition: 'all 0.15s ease',
                                cursor: answered ? 'default' : 'pointer',
                                bgcolor: styles.bg,
                                borderColor: styles.border,
                                color: styles.color,
                                opacity: state === 'dimmed' ? 0.5 : 1,
                                animation: state === 'wrong' ? 'shake 0.35s ease' : 'none',
                                '@keyframes shake': {
                                    '0%,100%': { transform: 'translateX(0)' },
                                    '20%': { transform: 'translateX(-6px)' },
                                    '60%': { transform: 'translateX(5px)' },
                                },
                                '&:hover': answered ? {} : styles.hover,
                                '&.Mui-disabled': {
                                    bgcolor: styles.bg,
                                    borderColor: styles.border,
                                    color: styles.color,
                                    opacity: state === 'dimmed' ? 0.5 : 1,
                                },
                            }}
                        >
                            {/* Label badge */}
                            <Box
                                sx={{
                                    width: 28, height: 28,
                                    borderRadius: '8px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0,
                                    fontFamily: '"Syne", sans-serif',
                                    fontWeight: 700,
                                    fontSize: '0.75rem',
                                    transition: 'all 0.15s ease',
                                    bgcolor: styles.labelBg,
                                    color: styles.labelColor,
                                }}
                            >
                                {labelContent}
                            </Box>
                            <Box component="span" sx={{ flex: 1 }}>{text}</Box>
                        </Button>
                    );
                })}
            </Box>

            {/* ── Explanation ── */}
            <Collapse in={answered} timeout={220}>
                <Box
                    aria-live="polite"
                    sx={{
                        mt: 2,
                        p: '14px 16px',
                        borderRadius: '12px',
                        bgcolor: isCorrectAnswer ? '#f0fdf4' : '#fef2f2',
                        borderLeft: '3px solid',
                        borderColor: isCorrectAnswer ? '#16a34a' : '#dc2626',
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            color: isCorrectAnswer ? '#14532d' : '#7f1d1d',
                            lineHeight: 1.65,
                            fontWeight: 500,
                            mb: 1.5,
                        }}
                    >
                        {question.explanation ??
                            (isCorrectAnswer ? '✅ Correto! Excelente.' : `❌ A resposta correta era: ${question.choices?.[correctIdx]}`)}
                    </Typography>

                    {/* Countdown bar */}
                    <Box sx={{ height: 2, borderRadius: 999, bgcolor: 'rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                        <Box
                            sx={{
                                height: '100%',
                                borderRadius: 999,
                                bgcolor: isCorrectAnswer ? '#16a34a' : '#dc2626',
                                width: `${autoAdvanceProgress}%`,
                                transition: 'width 0.1s linear',
                            }}
                        />
                    </Box>
                </Box>
            </Collapse>

            {/* ── Next button ── */}
            <Button
                variant="contained"
                fullWidth
                disableElevation
                disabled={!answered}
                onClick={onNext}
                endIcon={<ArrowForwardIcon sx={{ fontSize: '1rem !important' }} />}
                sx={{
                    mt: 2.5,
                    py: 1.6,
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    borderRadius: '12px',
                    bgcolor: '#111',
                    color: '#fff',
                    opacity: answered ? 1 : 0,
                    transform: answered ? 'translateY(0)' : 'translateY(8px)',
                    transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                    pointerEvents: answered ? 'auto' : 'none',
                    '&:hover': { bgcolor: '#1f1f1f' },
                    '&.Mui-disabled': { bgcolor: '#e5e5e3', color: '#fff' },
                }}
            >
                {isLast ? 'Ver resultado' : 'Próxima questão'}
            </Button>
        </Box>
    );
}
