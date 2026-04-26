import CasinoIcon from '@mui/icons-material/Casino';
import {
    Alert,
    Box,
    Button,
    Grid2,
    IconButton,
    TextField,
    Typography,
} from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const THEMES: string[] = [
    'Cinema',
    'Ciências',
    'Contabilidade',
    'Diversos',
    'Enfermagem',
    'Geografia',
    'História',
    'Literatura',
    'Matemática',
    'MPB',
];

const STORAGE_KEY = 'showdo_miau_theme';

interface IntroScreenProps {
    onStart: (theme: string) => void;
    loadError?: string | null;
}

const safeStorage: {
    get: (k: string) => string | null;
    set: (k: string, v: string) => void;
} = {
    get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* ignore storage errors */ } },
};

export default function IntroScreen({ onStart, loadError }: Readonly<IntroScreenProps>) {
    const [selected, setSelected] = useState<string | null>(() => safeStorage.get(STORAGE_KEY) || null);
    const initialCustom = (() => {
        const stored = safeStorage.get(STORAGE_KEY);
        return stored && !THEMES.includes(stored) ? stored : '';
    })();
    const [customTheme, setCustomTheme] = useState<string>(initialCustom);
    const [rolling, setRolling] = useState<boolean>(false);

    const inputRef = useRef<HTMLInputElement | null>(null);
    const rollTimeoutRef = useRef<number | null>(null);



    useEffect(() => {
        return () => {
            if (rollTimeoutRef.current !== null) {
                clearTimeout(rollTimeoutRef.current);
            }
        };
    }, []);

    const handleThemeClick = useCallback((theme: string) => {
        setSelected(theme);
        safeStorage.set(STORAGE_KEY, theme);
        onStart(theme);
    }, [onStart]);

    const handleCustomStart = (e?: React.FormEvent<HTMLFormElement>) => {
        if (e) e.preventDefault();
        const val = customTheme.trim();
        if (!val) return;

        setSelected(val);
        safeStorage.set(STORAGE_KEY, val);
        onStart(val);
    };

    const handleDice = () => {
        if (rolling) return;
        setRolling(true);
        rollTimeoutRef.current = globalThis.setTimeout(() => {
            setRolling(false);
            const rand = THEMES[Math.floor(Math.random() * THEMES.length)];
            setSelected(rand);
            safeStorage.set(STORAGE_KEY, rand);
            onStart(rand);
        }, 700);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2.5,
                maxWidth: '480px',
                margin: '0 auto',
                animation: 'fadeIn 0.4s ease',
                '@keyframes fadeIn': {
                    from: { opacity: 0, transform: 'translateY(10px)' },
                    to: { opacity: 1, transform: 'translateY(0)' },
                },
            }}
        >
            <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                Responda 10 perguntas. Toque em um tema para iniciar:
            </Typography>

            {loadError && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                    {loadError}
                </Alert>
            )}

            {/* Grid de Temas */}
            <Grid2 container spacing={1.5}>
                {THEMES.map((theme) => {
                    const isActive = selected === theme;
                    return (
                        <Grid2 size={{ xs: 6, sm: 4 }} key={theme}>
                            <Button
                                fullWidth
                                disableElevation
                                variant={isActive ? 'contained' : 'outlined'}
                                onClick={() => handleThemeClick(theme)}
                                aria-pressed={isActive}
                                sx={{
                                    py: 1.2,
                                    borderRadius: '24px',
                                    textTransform: 'none',
                                    fontSize: '0.85rem',
                                    fontWeight: isActive ? 600 : 500,
                                    borderColor: isActive ? 'transparent' : '#e2e8f0',
                                    bgcolor: isActive ? '#5c67f2' : '#ffffff',
                                    color: isActive ? '#ffffff' : '#334155',
                                    '&:hover': {
                                        bgcolor: isActive ? '#4f58d3' : '#f8fafc',
                                        borderColor: isActive ? 'transparent' : '#cbd5e1',
                                    },
                                    transition: 'all 0.2s ease',
                                    boxShadow: isActive ? '0 4px 12px rgba(92, 103, 242, 0.3)' : 'none',
                                }}
                            >
                                {theme}
                            </Button>
                        </Grid2>
                    );
                })}
            </Grid2>

            {/* Botão de Dado Centralizado */}
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
                <IconButton
                    onClick={handleDice}
                    disabled={rolling}
                    aria-label="Sortear tema aleatório"
                    sx={{
                        border: '1.5px dashed',
                        borderColor: '#a5b4fc',
                        bgcolor: '#ffffff',
                        color: '#5c67f2',
                        p: 1.5,
                        '&:hover': {
                            bgcolor: '#f5f7ff',
                        },
                    }}
                >
                    <CasinoIcon
                        sx={{
                            fontSize: 24,
                            animation: rolling ? 'spin 0.7s ease' : 'none',
                            '@keyframes spin': {
                                '0%': { transform: 'rotate(0deg)' },
                                '100%': { transform: 'rotate(360deg)' },
                            },
                        }}
                    />
                </IconButton>
            </Box>

            {/* Fundo levemente cinza para o input (igual ao print) */}
            <Box
                component="form"
                onSubmit={handleCustomStart}
                sx={{
                    display: 'flex',
                    gap: 1.5,
                    alignItems: 'center',
                    bgcolor: '#f8fafc',
                    p: 1,
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0'
                }}
            >
                <TextField
                    inputRef={inputRef}
                    fullWidth
                    size="small"
                    placeholder="Tema personalizado"
                    value={customTheme}
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setCustomTheme(e.target.value)}
                    variant="outlined"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            bgcolor: '#ffffff',
                            borderRadius: '12px',
                            '& fieldset': { borderColor: '#e2e8f0' },
                            '&:hover fieldset': { borderColor: '#cbd5e1' },
                            '&.Mui-focused fieldset': { borderColor: '#5c67f2' },
                        },
                        '& .MuiInputBase-input': {
                            fontSize: '0.9rem',
                            color: '#334155',
                        }
                    }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    disableElevation
                    disabled={!customTheme.trim()}
                    sx={{
                        bgcolor: '#5c67f2',
                        color: '#fff',
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 3,
                        py: 1,
                        whiteSpace: 'nowrap',
                        '&:hover': {
                            bgcolor: '#4f58d3',
                        },
                    }}
                >
                    Usar tema
                </Button>
            </Box>

            <Typography
                variant="caption"
                sx={{ color: '#94a3b8', textAlign: 'center', display: 'block', mt: 1 }}
            >
                Toque em um tema para iniciar automaticamente.
            </Typography>
        </Box>
    );
}
