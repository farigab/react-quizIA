import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import {
    Box,
    Button,
    Chip,
    Collapse,
    LinearProgress,
    Typography,
} from '@mui/material';
import { useEffect, useRef } from 'react';

const LABELS = ['A', 'B', 'C', 'D'];

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
    progressPct,
    answeredProgressPct,
    autoAdvanceProgress,
    onChoice,
    onNext,
    onAnswered,
}: QuestionScreenProps) {
    const headingRef = useRef<HTMLHeadingElement | null>(null);
    // Atalho de teclado: 1-4 seleciona a alternativa
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (answered) return;
            const num = Number(e.key) - 1;
            if (num >= 0 && num < (question?.choices?.length ?? 0)) {
                onChoice(num);
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [answered, question, onChoice]);

    useEffect(() => {
        if (answered) onAnswered?.();
    }, [answered, onAnswered]);

    // Move focus to the question heading when a new question is shown
    useEffect(() => {
        if (!answered) {
            headingRef.current?.focus();
        }
    }, [current, answered]);

    if (!question) return null;

    const isLast = current === total - 1;

    const getChoiceState = (idx: number) => {
        if (!answered) return 'idle';
        if (idx === correctIdx) return 'correct';
        if (idx === chosenIdx && idx !== correctIdx) return 'wrong';
        return 'dimmed';
    };

    // Estilos limpos e flat para as alternativas
    const choiceStyles = {
        idle: {
            bgcolor: '#ffffff',
            border: '1.5px solid',
            borderColor: '#e2e8f0',
            color: '#334155',
            '&:hover': {
                borderColor: '#cbd5e1',
                bgcolor: '#f8fafc',
            },
        },
        correct: {
            bgcolor: '#ecfdf5', // Fundo verde super suave
            border: '1.5px solid',
            borderColor: '#34d399',
            color: '#065f46',
        },
        wrong: {
            bgcolor: '#fef2f2', // Fundo vermelho super suave
            border: '1.5px solid',
            borderColor: '#f87171',
            color: '#991b1b',
            animation: 'shake 0.4s ease',
            '@keyframes shake': {
                '0%, 100%': { transform: 'translateX(0)' },
                '25%': { transform: 'translateX(-4px)' },
                '75%': { transform: 'translateX(4px)' },
            },
        },
        dimmed: {
            bgcolor: '#f8fafc',
            border: '1.5px solid',
            borderColor: 'transparent',
            color: '#94a3b8',
            opacity: 0.6,
        },
    };

    const labelColors = {
        idle: { bgcolor: '#f1f5f9', color: '#64748b' },
        correct: { bgcolor: '#10b981', color: '#ffffff' },
        wrong: { bgcolor: '#ef4444', color: '#ffffff' },
        dimmed: { bgcolor: '#e2e8f0', color: '#94a3b8' },
    };

    const isCorrectAnswer = chosenIdx === correctIdx;

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2.5,
                animation: 'slideUp 0.35s cubic-bezier(0.16,1,0.3,1)',
                '@keyframes slideUp': {
                    from: { opacity: 0, transform: 'translateY(14px)' },
                    to: { opacity: 1, transform: 'translateY(0)' },
                },
            }}
        >
            {/* Linha de Progresso Superior */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Chip
                    label={`${current + 1} / ${total}`}
                    size="small"
                    sx={{
                        fontFamily: '"Syne", sans-serif',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        bgcolor: '#f5f7ff',
                        color: '#5c67f2',
                        height: 26,
                        borderRadius: '8px',
                    }}
                />
                <Box sx={{ flex: 1 }}>
                    <LinearProgress
                        variant="determinate"
                        value={answered ? answeredProgressPct : progressPct}
                        aria-label="Progresso do quiz"
                        role="progressbar"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.round(answered ? answeredProgressPct : progressPct)}
                        sx={{
                            height: 8,
                            borderRadius: 999,
                            bgcolor: '#e2e8f0',
                            '& .MuiLinearProgress-bar': {
                                bgcolor: '#5c67f2',
                                transition: 'transform 0.5s ease',
                            }
                        }}
                    />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <EmojiEventsIcon sx={{ fontSize: 18, color: '#f59e0b' }} />
                    <Typography
                        variant="body2"
                        sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.9rem' }}
                    >
                        {score}
                    </Typography>
                </Box>
            </Box>

            {/* Pergunta */}
            <Typography
                variant="h6"
                tabIndex={-1}
                ref={headingRef}
                sx={{
                    fontWeight: 700,
                    lineHeight: 1.45,
                    color: '#1e293b', // Cinza escuro para melhor legibilidade
                    letterSpacing: '-0.01em',
                    fontSize: { xs: '1.1rem', sm: '1.25rem' },
                }}
            >
                {question.question}
            </Typography>

            {/* Alternativas */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                {(question.choices ?? []).map((text: string, idx: number) => {
                    const state = getChoiceState(idx);
                    return (
                        <Button
                            key={idx}
                            fullWidth
                            disableElevation
                            disabled={answered}
                            onClick={() => onChoice(idx)}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                textAlign: 'left',
                                p: '12px 16px',
                                gap: 1.5,
                                textTransform: 'none',
                                borderRadius: '16px',
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                lineHeight: 1.4,
                                transition: 'all 0.18s ease',
                                cursor: answered ? 'default' : 'pointer',
                                ...choiceStyles[state],
                                '&.Mui-disabled': {
                                    ...choiceStyles[state],
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    fontFamily: '"Syne", sans-serif',
                                    fontWeight: 700,
                                    fontSize: '0.85rem',
                                    transition: 'all 0.18s ease',
                                    ...labelColors[state],
                                }}
                            >
                                {state === 'correct' ? (
                                    <CheckCircleOutlineIcon sx={{ fontSize: 18 }} />
                                ) : state === 'wrong' ? (
                                    <HighlightOffIcon sx={{ fontSize: 18 }} />
                                ) : (
                                    LABELS[idx]
                                )}
                            </Box>
                            <Box component="span" sx={{ flex: 1 }}>
                                {text}
                            </Box>
                        </Button>
                    );
                })}
            </Box>

            {/* Explicação */}
            <Collapse in={answered} timeout={300}>
                <Box
                    aria-live="polite"
                    sx={{
                        bgcolor: isCorrectAnswer ? '#f0fdf4' : '#f8fafc',
                        border: '1px solid',
                        borderColor: isCorrectAnswer ? '#bbf7d0' : '#e2e8f0',
                        borderRadius: '16px',
                        p: 2,
                        mt: 0.5,
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            color: isCorrectAnswer ? '#166534' : '#334155',
                            fontWeight: 500,
                            lineHeight: 1.6,
                            mb: 1.5
                        }}
                    >
                        {question.explanation ||
                            (isCorrectAnswer
                                ? '✅ Resposta correta! Excelente.'
                                : `❌ A alternativa correta era: ${question.choices?.[correctIdx]}`)}
                    </Typography>

                    {/* Barra de contagem regressiva para auto-avanço */}
                    <Box
                        sx={{
                            height: 4,
                            borderRadius: 999,
                            bgcolor: isCorrectAnswer ? 'rgba(34, 197, 94, 0.2)' : '#e2e8f0',
                            overflow: 'hidden',
                        }}
                    >
                        <Box
                            sx={{
                                height: '100%',
                                borderRadius: 999,
                                bgcolor: isCorrectAnswer ? '#22c55e' : '#94a3b8',
                                width: `${autoAdvanceProgress}%`,
                                transition: 'width 0.1s linear',
                            }}
                        />
                    </Box>
                </Box>
            </Collapse>

            {/* Botão Próxima */}
            <Button
                variant="contained"
                fullWidth
                disableElevation
                disabled={!answered}
                onClick={onNext}
                endIcon={<ArrowForwardIcon />}
                sx={{
                    mt: 'auto',
                    py: 1.6,
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: '16px',
                    bgcolor: '#5c67f2',
                    color: '#ffffff',
                    opacity: answered ? 1 : 0,
                    transform: answered ? 'translateY(0)' : 'translateY(8px)',
                    transition: 'all 0.25s ease',
                    pointerEvents: answered ? 'auto' : 'none',
                    '&:hover': {
                        bgcolor: '#4f58d3',
                    },
                    '&.Mui-disabled': {
                        bgcolor: '#cbd5e1',
                        color: '#ffffff'
                    }
                }}
            >
                {isLast ? 'Ver resultado' : 'Próxima pergunta'}
            </Button>
        </Box>
    );
}
