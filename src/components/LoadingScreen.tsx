import { Box, CircularProgress, Typography } from '@mui/material';

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
                py: 6,
                animation: 'fadeIn 0.3s ease',
                '@keyframes fadeIn': {
                    from: { opacity: 0 },
                    to: { opacity: 1 },
                },
            }}
        >
            <Box sx={{ textAlign: 'center' }}>
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 600, // Evite pesos absurdos como 800 ou 900 se a fonte for larga
                        letterSpacing: '-0.02em', // Puxa as letras levemente para perto (tira a sensação de esticado)
                        color: '#1e293b',
                        mt: 2
                    }}
                >
                    Gerando perguntas...
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    A IA está criando 10 questões sobre{' '}
                    <Box component="span" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {theme}
                    </Box>
                </Typography>
            </Box>

            {/* Animated dots */}
            <Box sx={{ display: 'flex', gap: 0.8 }}>
                {[0, 1, 2].map((i) => (
                    <Box
                        key={i}
                        sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: 'primary.main',
                            opacity: 0.3,
                            animation: `bounce 1.2s ease ${i * 0.2}s infinite`,
                            '@keyframes bounce': {
                                '0%, 100%': { transform: 'translateY(0)', opacity: 0.3 },
                                '50%': { transform: 'translateY(-8px)', opacity: 1 },
                            },
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
}
