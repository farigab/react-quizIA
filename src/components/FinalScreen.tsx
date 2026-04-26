import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ReplayIcon from '@mui/icons-material/Replay';
import StarIcon from '@mui/icons-material/Star';
import { Box, Button, Divider, Typography } from '@mui/material';
import { useEffect, useRef } from 'react';

const getRating = (score: number, total: number) => {
    const pct = (score / total) * 100;
    if (pct === 100) return { emoji: '🏆', label: 'Perfeito!', color: '#b45309' };
    if (pct >= 80) return { emoji: '🌟', label: 'Excelente!', color: '#5c67f2' };
    if (pct >= 60) return { emoji: '👍', label: 'Muito bom!', color: '#16a34a' };
    if (pct >= 40) return { emoji: '📚', label: 'Continue!', color: '#ea580c' };
    return { emoji: '💪', label: 'Treine mais!', color: '#dc2626' };
};

interface FinalScreenProps {
    score: number;
    total: number;
    highScore: number;
    isNewRecord: boolean;
    onRestart: () => void;
}

export default function FinalScreen({
    score,
    total,
    highScore,
    isNewRecord,
    onRestart,
}: Readonly<FinalScreenProps>) {
    const headingRef = useRef<HTMLHeadingElement | null>(null);
    useEffect(() => { headingRef.current?.focus(); }, []);

    const rating = getRating(score, total);
    const pct = Math.round((score / total) * 100);
    const errors = total - score;

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                pt: 3, pb: 2,
                animation: 'popIn 0.45s cubic-bezier(0.34,1.56,0.64,1)',
                '@keyframes popIn': {
                    from: { opacity: 0, transform: 'scale(0.92)' },
                    to: { opacity: 1, transform: 'scale(1)' },
                },
            }}
        >
            {/* ── Label row ── */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography
                    sx={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'text.secondary',
                    }}
                >
                    Resultado
                </Typography>
            </Box>

            {/* ── Big score number ── */}
            <Box sx={{ mb: 3 }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 0,
                    }}
                >
                    <Typography
                        variant="h1"
                        component="p"
                        ref={headingRef}
                        tabIndex={-1}
                        sx={{
                            fontFamily: '"Syne", sans-serif',
                            fontWeight: 800,
                            fontSize: { xs: '5.5rem', sm: '7rem' },
                            lineHeight: 0.9,
                            letterSpacing: '-0.04em',
                            color: rating.color,
                            fontVariantNumeric: 'tabular-nums',
                        }}
                    >
                        {pct}
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: '"Syne", sans-serif',
                            fontWeight: 800,
                            fontSize: { xs: '2rem', sm: '2.5rem' },
                            color: rating.color,
                            opacity: 0.6,
                            mt: '0.15em',
                            letterSpacing: '-0.03em',
                        }}
                    >
                        %
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5 }}>
                    <Typography
                        sx={{
                            fontSize: '1.35rem',
                            lineHeight: 1,
                            animation: 'floatEmoji 3s ease-in-out infinite',
                            '@keyframes floatEmoji': {
                                '0%,100%': { transform: 'translateY(0)' },
                                '50%': { transform: 'translateY(-5px)' },
                            },
                        }}
                    >
                        {rating.emoji}
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                            color: '#111',
                            letterSpacing: '-0.025em',
                        }}
                    >
                        {rating.label}
                    </Typography>
                </Box>
            </Box>

            {/* ── Stats row ── */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1px 1fr',
                    bgcolor: '#ffffff',
                    borderRadius: '14px',
                    border: '1.5px solid #e5e5e3',
                    overflow: 'hidden',
                    mb: 2,
                }}
            >
                <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography
                        sx={{
                            fontFamily: '"Syne", sans-serif',
                            fontWeight: 800,
                            fontSize: '2rem',
                            letterSpacing: '-0.04em',
                            color: '#111',
                            lineHeight: 1,
                            fontVariantNumeric: 'tabular-nums',
                        }}
                    >
                        {score}/{total}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 600, mt: 0.5, letterSpacing: '-0.01em' }}>
                        acertos
                    </Typography>
                </Box>

                {/* Divider column */}
                <Box sx={{ bgcolor: '#e5e5e3' }} />

                <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography
                        sx={{
                            fontFamily: '"Syne", sans-serif',
                            fontWeight: 800,
                            fontSize: '2rem',
                            letterSpacing: '-0.04em',
                            color: errors === 0 ? '#16a34a' : '#dc2626',
                            lineHeight: 1,
                            fontVariantNumeric: 'tabular-nums',
                        }}
                    >
                        {errors}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 600, mt: 0.5, letterSpacing: '-0.01em' }}>
                        {errors === 1 ? 'erro' : 'erros'}
                    </Typography>
                </Box>
            </Box>

            {/* ── High score ── */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    py: 1.75,
                    px: 2,
                    borderRadius: '12px',
                    bgcolor: isNewRecord ? '#fffbeb' : '#f7f6f3',
                    border: '1.5px solid',
                    borderColor: isNewRecord ? '#fde68a' : '#e5e5e3',
                    mb: 3,
                    transition: 'all 0.3s ease',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmojiEventsIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
                    <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: 'text.secondary', letterSpacing: '-0.01em' }}>
                        Melhor pontuação
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <Typography
                        sx={{
                            fontFamily: '"Syne", sans-serif',
                            fontWeight: 800,
                            fontSize: '1.05rem',
                            color: isNewRecord ? '#92400e' : '#111',
                            letterSpacing: '-0.03em',
                            fontVariantNumeric: 'tabular-nums',
                        }}
                    >
                        {highScore}
                    </Typography>
                    {isNewRecord && (
                        <Box
                            sx={{
                                display: 'flex', alignItems: 'center', gap: 0.25,
                                bgcolor: '#fde68a',
                                borderRadius: '6px',
                                px: 0.75, py: 0.2,
                                animation: 'pop 0.4s 0.25s cubic-bezier(0.34,1.56,0.64,1) both',
                                '@keyframes pop': {
                                    from: { transform: 'scale(0)', opacity: 0 },
                                    to: { transform: 'scale(1)', opacity: 1 },
                                },
                            }}
                        >
                            <StarIcon sx={{ fontSize: 11, color: '#92400e' }} />
                            <Typography variant="caption" sx={{ color: '#92400e', fontWeight: 800, fontSize: '0.68rem' }}>
                                Novo!
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>

            <Divider sx={{ mb: 3, borderColor: '#e5e5e3' }} />

            {/* ── CTA ── */}
            <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<ReplayIcon />}
                onClick={onRestart}
                disableElevation
                sx={{
                    py: 1.65,
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    borderRadius: '12px',
                    bgcolor: '#111',
                    letterSpacing: '-0.02em',
                    '&:hover': { bgcolor: '#1f1f1f' },
                }}
            >
                Jogar novamente
            </Button>
        </Box>
    );
}
