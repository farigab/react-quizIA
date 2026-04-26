import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ReplayIcon from '@mui/icons-material/Replay';
import StarIcon from '@mui/icons-material/Star';
import { Box, Button, Typography } from '@mui/material';
import { useEffect, useRef } from 'react';

const getRating = (score: number, total: number) => {
    const pct = (score / total) * 100;
    if (pct === 100) return { emoji: '🏆', label: 'Perfeito!', color: '#f59e0b', bg: '#fef3c7' };
    if (pct >= 80) return { emoji: '🌟', label: 'Excelente!', color: '#5c67f2', bg: '#eef0fd' };
    if (pct >= 60) return { emoji: '👍', label: 'Muito bom!', color: '#10b981', bg: '#d1fae5' };
    if (pct >= 40) return { emoji: '📚', label: 'Continue!', color: '#f97316', bg: '#ffedd5' };
    return { emoji: '💪', label: 'Treine mais!', color: '#ef4444', bg: '#fee2e2' };
};

const formatErrors = (count: number) =>
    count === 1 ? '1 erro' : `${count} erros`;

// Confetti particle - pure CSS animation
function Confetti() {
    const particles = Array.from({ length: 20 }, (_, i) => i);
    const colors = ['#5c67f2', '#f59e0b', '#10b981', '#f97316', '#ec4899', '#06b6d4'];

    return (
        <Box
            sx={{
                position: 'absolute',
                inset: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
                borderRadius: 'inherit',
            }}
        >
            {particles.map((i) => {
                const color = colors[i % colors.length];
                const left = `${(i / particles.length) * 100}%`;
                const delay = `${(i * 0.08)}s`;
                const duration = `${0.8 + (i % 4) * 0.15}s`;
                const SIZES = [6, 5, 4];
                const size = SIZES[i % 3];
                return (
                    <Box
                        key={i}
                        sx={{
                            position: 'absolute',
                            top: '-8px',
                            left,
                            width: size,
                            height: size,
                            bgcolor: color,
                            borderRadius: i % 2 === 0 ? '50%' : '2px',
                            animation: `confettiFall ${duration} ${delay} ease-out forwards`,
                            '@keyframes confettiFall': {
                                '0%': {
                                    transform: 'translateY(0) rotate(0deg)',
                                    opacity: 1,
                                },
                                '100%': {
                                    transform: `translateY(200px) rotate(${i % 2 === 0 ? 360 : -360}deg) translateX(${(i % 5 - 2) * 20}px)`,
                                    opacity: 0,
                                },
                            },
                        }}
                    />
                );
            })}
        </Box>
    );
}

// Circular SVG score ring
function ScoreRing({
    score,
    total,
    color,
}: Readonly<{
    score: number;
    total: number;
    color: string;
}>) {
    const pct = score / total;
    const r = 44;
    const circ = 2 * Math.PI * r;
    const dash = pct * circ;

    return (
        <Box sx={{ position: 'relative', width: 120, height: 120, flexShrink: 0 }}>
            <svg
                width="120"
                height="120"
                viewBox="0 0 120 120"
                style={{ transform: 'rotate(-90deg)' }}
            >
                {/* Track */}
                <circle
                    cx="60"
                    cy="60"
                    r={r}
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="8"
                />
                {/* Progress */}
                <circle
                    cx="60"
                    cy="60"
                    r={r}
                    fill="none"
                    stroke={color}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${dash} ${circ - dash}`}
                    style={{
                        transition: 'stroke-dasharray 1s cubic-bezier(0.34,1.56,0.64,1)',
                    }}
                />
            </svg>
            {/* Center text */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography
                    sx={{ fontWeight: 800, fontSize: '1.7rem', lineHeight: 1, color: '#0f172a', fontFamily: '"Syne", sans-serif' }}
                >
                    {score}
                </Typography>
                <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>
                    de {total}
                </Typography>
            </Box>
        </Box>
    );
}

interface FinalScreenProps {
    score: number;
    total: number;
    highScore: number;
    isNewRecord: boolean;
    onRestart: () => void;
}

export default function FinalScreen({ score, total, highScore, isNewRecord, onRestart }: Readonly<FinalScreenProps>) {
    const headingRef = useRef<HTMLHeadingElement | null>(null);
    useEffect(() => { headingRef.current?.focus(); }, []);

    const rating = getRating(score, total);
    const pct = Math.round((score / total) * 100);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2.5,
                py: 1,
                animation: 'popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)',
                '@keyframes popIn': {
                    from: { opacity: 0, transform: 'scale(0.88)' },
                    to: { opacity: 1, transform: 'scale(1)' },
                },
            }}
        >
            {/* Emoji + label */}
            <Box sx={{ textAlign: 'center' }}>
                <Box
                    sx={{
                        fontSize: '3.5rem',
                        lineHeight: 1,
                        mb: 1,
                        display: 'inline-block',
                        animation: 'bounce 0.6s 0.2s cubic-bezier(0.34,1.56,0.64,1) both, float 3s 0.8s ease-in-out infinite',
                        '@keyframes bounce': {
                            from: { transform: 'scale(0.5)', opacity: 0 },
                            to: { transform: 'scale(1)', opacity: 1 },
                        },
                        '@keyframes float': {
                            '0%, 100%': { transform: 'translateY(0)' },
                            '50%': { transform: 'translateY(-8px)' },
                        },
                    }}
                >
                    {rating.emoji}
                </Box>
                <Typography
                    variant="h4"
                    tabIndex={-1}
                    ref={headingRef}
                    sx={{
                        fontWeight: 800,
                        color: rating.color,
                        fontFamily: '"Syne", sans-serif',
                        letterSpacing: '-0.02em',
                    }}
                >
                    {rating.label}
                </Typography>
            </Box>

            {/* Score card with ring + confetti */}
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    borderRadius: '20px',
                    bgcolor: rating.bg,
                    p: 2.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2.5,
                    overflow: 'hidden',
                }}
            >
                {isNewRecord && <Confetti />}

                <ScoreRing score={score} total={total} color={rating.color} />

                <Box sx={{ flex: 1, textAlign: 'left' }}>
                    <Typography
                        variant="body2"
                        sx={{ color: '#64748b', fontWeight: 600, mb: 0.5, fontSize: '0.8rem' }}
                    >
                        Sua pontuação
                    </Typography>
                    <Typography
                        sx={{
                            fontWeight: 800,
                            fontSize: '2.5rem',
                            lineHeight: 1,
                            color: rating.color,
                            fontFamily: '"Syne", sans-serif',
                        }}
                    >
                        {pct}%
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ color: '#64748b', fontWeight: 500, mt: 0.5, fontSize: '0.8rem' }}
                    >
                        {score === total
                            ? 'Acerto total!'
                            : formatErrors(total - score)}
                    </Typography>
                </Box>
            </Box>

            {/* High score row */}
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderRadius: '14px',
                    px: 2,
                    py: 1.5,
                    border: '1.5px solid',
                    bgcolor: isNewRecord ? '#fef9c3' : '#f8fafc',
                    borderColor: isNewRecord ? '#fde68a' : '#e2e8f0',
                    transition: 'all 0.3s ease',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmojiEventsIcon sx={{ color: '#f59e0b', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569', fontSize: '0.85rem' }}>
                        Melhor pontuação
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography
                        sx={{
                            fontWeight: 800,
                            fontSize: '1.1rem',
                            color: isNewRecord ? '#92400e' : '#5c67f2',
                            fontFamily: '"Syne", sans-serif',
                        }}
                    >
                        {highScore}
                    </Typography>
                    {isNewRecord && (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.3,
                                bgcolor: '#fde68a',
                                borderRadius: '8px',
                                px: 0.8,
                                py: 0.2,
                                animation: 'pop 0.4s 0.3s cubic-bezier(0.34,1.56,0.64,1) both',
                                '@keyframes pop': {
                                    from: { transform: 'scale(0)' },
                                    to: { transform: 'scale(1)' },
                                },
                            }}
                        >
                            <StarIcon sx={{ fontSize: 13, color: '#92400e' }} />
                            <Typography variant="caption" sx={{ color: '#92400e', fontWeight: 800, fontSize: '0.7rem' }}>
                                Novo!
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>

            {/* Restart */}
            <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<ReplayIcon />}
                onClick={onRestart}
                disableElevation
                sx={{
                    py: 1.6,
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    borderRadius: '14px',
                    bgcolor: '#5c67f2',
                    mt: 0.5,
                    '&:hover': { bgcolor: '#4a53d4' },
                }}
            >
                Jogar novamente
            </Button>
        </Box>
    );
}
