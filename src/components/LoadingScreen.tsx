import { Box, Typography } from '@mui/material';

interface LoadingScreenProps {
    theme?: string | null;
}

export default function LoadingScreen({ theme }: Readonly<LoadingScreenProps>) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                gap: 3,
                py: 6,
                animation: 'fadeIn 0.3s ease',
                '@keyframes fadeIn': { from: { opacity: 0 }, to: { opacity: 1 } },
            }}
        >
            {/* Spinner */}
            <Box sx={{ position: 'relative', width: 64, height: 64 }}>
                {/* Outer ring */}
                <Box
                    sx={{
                        position: 'absolute', inset: 0,
                        borderRadius: '50%',
                        border: '2px solid',
                        borderColor: 'divider',
                    }}
                />
                {/* Spinning arc */}
                <Box
                    sx={{
                        position: 'absolute', inset: 0,
                        borderRadius: '50%',
                        border: '2px solid transparent',
                        borderTopColor: '#111',
                        animation: 'spin 0.9s linear infinite',
                        '@keyframes spin': {
                            to: { transform: 'rotate(360deg)' },
                        },
                    }}
                />
                {/* Center dot */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%', left: '50%',
                        transform: 'translate(-50%,-50%)',
                        width: 10, height: 10,
                        borderRadius: '50%',
                        bgcolor: '#111',
                        animation: 'pulse 1.8s ease-in-out infinite',
                        '@keyframes pulse': {
                            '0%,100%': { opacity: 1 },
                            '50%': { opacity: 0.3 },
                        },
                    }}
                />
            </Box>

            {/* Text */}
            <Box sx={{ textAlign: 'center' }}>
                <Typography
                    sx={{
                        fontFamily: '"Syne", sans-serif',
                        fontWeight: 700,
                        fontSize: '1.2rem',
                        letterSpacing: '-0.03em',
                        color: '#111',
                        mb: 0.5,
                    }}
                >
                    Gerando questões…
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem', fontWeight: 500 }}>
                    Criando 10 perguntas sobre{' '}
                    <Box component="span" sx={{ fontWeight: 700, color: '#111' }}>
                        {theme}
                    </Box>
                </Typography>
            </Box>

            {/* Animated dots */}
            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                {[0, 1, 2].map((i) => (
                    <Box
                        key={i}
                        sx={{
                            width: 6, height: 6,
                            borderRadius: '50%',
                            bgcolor: '#111',
                            opacity: 0.15,
                            animation: `dotWave 1.2s ease ${i * 0.18}s infinite`,
                            '@keyframes dotWave': {
                                '0%,100%': { opacity: 0.15, transform: 'scale(1)' },
                                '50%': { opacity: 0.6, transform: 'scale(1.4)' },
                            },
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
}
