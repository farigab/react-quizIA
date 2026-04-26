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
                gap: 3,
                py: 5,
                animation: 'fadeIn 0.3s ease',
                '@keyframes fadeIn': { from: { opacity: 0 }, to: { opacity: 1 } },
            }}
        >
            {/* Orbiting animation */}
            <Box sx={{ position: 'relative', width: 80, height: 80 }}>
                {/* Core */}
                <Box
                    sx={{
                        position: 'absolute',
                        inset: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        bgcolor: '#5c67f2',
                        boxShadow: '0 0 0 6px rgba(92,103,242,0.15)',
                        animation: 'corePulse 2s ease-in-out infinite',
                        '@keyframes corePulse': {
                            '0%, 100%': { boxShadow: '0 0 0 6px rgba(92,103,242,0.15)' },
                            '50%': { boxShadow: '0 0 0 12px rgba(92,103,242,0.08)' },
                        },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                    }}
                >
                    <Box component="span" sx={{ fontSize: '14px', lineHeight: 1 }}>✦</Box>
                </Box>

                {/* Orbit ring 1 */}
                {[0, 1, 2].map((i) => (
                    <Box
                        key={i}
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            borderRadius: '50%',
                            border: '1.5px solid transparent',
                            animation: `orbit 2s ${i * 0.67}s linear infinite`,
                            '@keyframes orbit': {
                                from: { transform: 'rotate(0deg)' },
                                to: { transform: 'rotate(360deg)' },
                            },
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: -3,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                bgcolor: ['#5c67f2', '#f59e0b', '#10b981'][i],
                            },
                        }}
                    />
                ))}

                {/* Orbit ring 2 (reverse) */}
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 10,
                        borderRadius: '50%',
                        animation: 'orbitReverse 3s linear infinite',
                        '@keyframes orbitReverse': {
                            from: { transform: 'rotate(0deg)' },
                            to: { transform: 'rotate(-360deg)' },
                        },
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: -2.5,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 5,
                            height: 5,
                            borderRadius: '50%',
                            bgcolor: '#ec4899',
                        },
                    }}
                />
            </Box>

            {/* Text */}
            <Box sx={{ textAlign: 'center' }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        color: '#0f172a',
                        letterSpacing: '-0.02em',
                        mb: 0.5,
                    }}
                >
                    Gerando perguntas…
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                    A IA está criando 10 questões sobre{' '}
                    <Box component="span" sx={{ fontWeight: 700, color: '#5c67f2' }}>
                        {theme}
                    </Box>
                </Typography>
            </Box>

            {/* Shimmer text dots */}
            <Box sx={{ display: 'flex', gap: 0.6, alignItems: 'center' }}>
                {[0, 1, 2, 3, 4].map((i) => (
                    <Box
                        key={i}
                        sx={{
                            width: i === 2 ? 10 : 7,
                            height: i === 2 ? 10 : 7,
                            borderRadius: '50%',
                            bgcolor: '#5c67f2',
                            opacity: 0.2,
                            animation: `wave 1.4s ease ${i * 0.12}s infinite`,
                            '@keyframes wave': {
                                '0%, 100%': { transform: 'scaleY(1)', opacity: 0.2 },
                                '50%': { transform: 'scaleY(1.8)', opacity: 1 },
                            },
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
}
