import {
    Box,
    Typography,
    Button,
    Divider,
    LinearProgress,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ReplayIcon from '@mui/icons-material/Replay';
import StarIcon from '@mui/icons-material/Star';

const getRating = (score: number, total: number) => {
    const pct = (score / total) * 100;
    if (pct === 100) return { emoji: '🏆', label: 'Perfeito!', color: '#f59e0b' };
    if (pct >= 80) return { emoji: '🌟', label: 'Excelente!', color: '#4f46e5' };
    if (pct >= 60) return { emoji: '👍', label: 'Muito bom!', color: '#10b981' };
    if (pct >= 40) return { emoji: '📚', label: 'Continue tentando!', color: '#6366f1' };
    return { emoji: '💪', label: 'Treine mais!', color: '#ef4444' };
};

interface FinalScreenProps {
    score: number;
    total: number;
    highScore: number;
    isNewRecord: boolean;
    onRestart: () => void;
}

export default function FinalScreen({ score, total, highScore, isNewRecord, onRestart }: FinalScreenProps) {
    const rating = getRating(score, total);
    const pct = Math.round((score / total) * 100);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                py: 2,
                animation: 'popIn 0.45s cubic-bezier(0.34,1.56,0.64,1)',
                '@keyframes popIn': {
                    from: { opacity: 0, transform: 'scale(0.85)' },
                    to: { opacity: 1, transform: 'scale(1)' },
                },
            }}
        >
            {/* Big emoji */}
            <Box
                sx={{
                    fontSize: '5rem',
                    lineHeight: 1,
                    animation: 'float 3s ease-in-out infinite',
                    '@keyframes float': {
                        '0%, 100%': { transform: 'translateY(0)' },
                        '50%': { transform: 'translateY(-10px)' },
                    },
                }}
            >
                {rating.emoji}
            </Box>

            {/* Rating label */}
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 800,
                    color: rating.color,
                    textAlign: 'center',
                    fontFamily: '"Syne", sans-serif',
                }}
            >
                {rating.label}
            </Typography>

            {/* Score display */}
            <Box
                sx={{
                    width: '100%',
                    bgcolor: 'primary.light',
                    borderRadius: 3,
                    p: 2.5,
                    textAlign: 'center',
                }}
            >
                <Typography variant="body2" sx={{ color: '#6366f1', fontWeight: 600, mb: 0.5 }}>
                    Sua pontuação
                </Typography>
                <Typography
                    variant="h2"
                    sx={{ fontWeight: 800, color: 'primary.main', lineHeight: 1 }}
                >
                    {score}
                    <Box component="span" sx={{ fontSize: '1.5rem', color: '#818cf8', ml: 0.5 }}>
                        / {total}
                    </Box>
                </Typography>
                <Typography
                    variant="body2"
                    sx={{ color: '#6366f1', fontWeight: 600, mt: 0.5 }}
                >
                    {pct}% de acerto
                </Typography>

                {/* Progress bar */}
                <Box sx={{ mt: 2 }}>
                    <LinearProgress
                        variant="determinate"
                        value={pct}
                        sx={{
                            height: 12,
                            borderRadius: 999,
                            bgcolor: 'rgba(79,70,229,0.15)',
                            '& .MuiLinearProgress-bar': {
                                background: `linear-gradient(90deg, #4f46e5, #818cf8)`,
                                borderRadius: 999,
                            },
                        }}
                    />
                </Box>
            </Box>

            <Divider sx={{ width: '100%' }} />

            {/* High score row */}
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    bgcolor: isNewRecord ? '#fef9c3' : '#f8fafc',
                    borderRadius: 2,
                    px: 2.5,
                    py: 1.8,
                    border: '1.5px solid',
                    borderColor: isNewRecord ? '#fde68a' : 'divider',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmojiEventsIcon sx={{ color: '#f59e0b', fontSize: 22 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                        Melhor pontuação
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography
                        variant="body1"
                        sx={{ fontWeight: 800, color: isNewRecord ? '#92400e' : 'primary.main' }}
                    >
                        {highScore}
                    </Typography>
                    {isNewRecord && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                            <StarIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
                            <Typography variant="caption" sx={{ color: '#92400e', fontWeight: 700 }}>
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
                sx={{
                    py: 1.8,
                    fontSize: '1rem',
                    mt: 0.5,
                }}
            >
                Jogar novamente
            </Button>
        </Box>
    );
}
