import CasinoIcon from '@mui/icons-material/Casino';
import EastIcon from '@mui/icons-material/East';
import {
    Alert,
    Box,
    Button,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
} from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';

interface Theme {
    label: string;
    emoji: string;
}

const THEMES: Theme[] = [
    { label: 'Cinema', emoji: '🎬' },
    { label: 'Ciências', emoji: '🔬' },
    { label: 'Contabilidade', emoji: '📊' },
    { label: 'Diversos', emoji: '🌐' },
    { label: 'Enfermagem', emoji: '🏥' },
    { label: 'Geografia', emoji: '🌍' },
    { label: 'História', emoji: '📜' },
    { label: 'Literatura', emoji: '📚' },
    { label: 'Matemática', emoji: '➗' },
    { label: 'MPB', emoji: '🎵' },
];

const STORAGE_KEY = 'showdo_miau_theme';

interface IntroScreenProps {
    onStart: (theme: string) => void;
    loadError?: string | null;
}

const safeStorage = {
    get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } },
};

export default function IntroScreen({ onStart, loadError }: Readonly<IntroScreenProps>) {
    const [selected, setSelected] = useState<string | null>(() => safeStorage.get(STORAGE_KEY) || null);
    const initialCustom = (() => {
        const stored = safeStorage.get(STORAGE_KEY);
        return stored && !THEMES.some(t => t.label === stored) ? stored : '';
    })();
    const [customTheme, setCustomTheme] = useState<string>(initialCustom);
    const [rolling, setRolling] = useState<boolean>(false);
    const rollTimeoutRef = useRef<number | null>(null);

    useEffect(() => () => {
        if (rollTimeoutRef.current !== null) clearTimeout(rollTimeoutRef.current);
    }, []);

    const handleThemeClick = useCallback((theme: string) => {
        setSelected(theme);
        safeStorage.set(STORAGE_KEY, theme);
        onStart(theme);
    }, [onStart]);

    const handleCustomStart = (e?: React.SyntheticEvent) => {
        e?.preventDefault();
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
            setSelected(rand.label);
            safeStorage.set(STORAGE_KEY, rand.label);
            onStart(rand.label);
        }, 600);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            <Typography
                variant="body2"
                sx={{ color: 'text.secondary', mb: 0.5, fontWeight: 500 }}
            >
                Escolha um tema para começar
            </Typography>

            {loadError && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                    {loadError}
                </Alert>
            )}

            {/* Theme grid */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 1,
                }}
            >
                {THEMES.map(({ label, emoji }, i) => {
                    const isActive = selected === label;
                    return (
                        <Button
                            key={label}
                            fullWidth
                            disableElevation
                            onClick={() => handleThemeClick(label)}
                            aria-pressed={isActive}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                gap: 1.2,
                                py: 1.3,
                                px: 1.6,
                                borderRadius: '14px',
                                textTransform: 'none',
                                fontSize: '0.875rem',
                                fontWeight: isActive ? 700 : 500,
                                border: '1.5px solid',
                                borderColor: isActive ? '#5c67f2' : '#e2e8f0',
                                bgcolor: isActive ? '#eef0fd' : '#ffffff',
                                color: isActive ? '#4a53d4' : '#334155',
                                transition: 'all 0.18s ease',
                                boxShadow: isActive
                                    ? '0 0 0 3px rgba(92, 103, 242, 0.12)'
                                    : 'none',
                                animation: `fadeSlideIn 0.3s ease both`,
                                animationDelay: `${i * 35}ms`,
                                '@keyframes fadeSlideIn': {
                                    from: { opacity: 0, transform: 'translateY(6px)' },
                                    to: { opacity: 1, transform: 'translateY(0)' },
                                },
                                '&:hover': {
                                    borderColor: isActive ? '#5c67f2' : '#c7d2fe',
                                    bgcolor: isActive ? '#eef0fd' : '#f5f7ff',
                                    color: isActive ? '#4a53d4' : '#4f46e5',
                                },
                            }}
                        >
                            <Box
                                component="span"
                                sx={{
                                    fontSize: '1.15rem',
                                    lineHeight: 1,
                                    flexShrink: 0,
                                    // Slight scale on active
                                    transform: isActive ? 'scale(1.15)' : 'scale(1)',
                                    transition: 'transform 0.18s ease',
                                }}
                            >
                                {emoji}
                            </Box>
                            <Box component="span">{label}</Box>
                        </Button>
                    );
                })}
            </Box>

            {/* Dice button */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.5 }}>
                <Box sx={{ flex: 1, height: '1px', bgcolor: '#e2e8f0' }} />
                <IconButton
                    onClick={handleDice}
                    disabled={rolling}
                    aria-label="Sortear tema aleatório"
                    size="small"
                    sx={{
                        border: '1.5px dashed #a5b4fc',
                        bgcolor: '#ffffff',
                        color: '#5c67f2',
                        width: 36,
                        height: 36,
                        '&:hover': { bgcolor: '#f5f7ff', borderStyle: 'solid' },
                        '&:disabled': { opacity: 0.6 },
                    }}
                >
                    <CasinoIcon
                        sx={{
                            fontSize: 18,
                            animation: rolling ? 'spin 0.6s ease' : 'none',
                            '@keyframes spin': {
                                '0%': { transform: 'rotate(0deg) scale(1)' },
                                '50%': { transform: 'rotate(180deg) scale(1.2)' },
                                '100%': { transform: 'rotate(360deg) scale(1)' },
                            },
                        }}
                    />
                </IconButton>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                    tema aleatório
                </Typography>
                <Box sx={{ flex: 1, height: '1px', bgcolor: '#e2e8f0' }} />
            </Box>

            {/* Custom theme input */}
            <Box
                component="form"
                onSubmit={handleCustomStart}
                sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}
            >
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Ou escreva seu próprio tema…"
                    value={customTheme}
                    onChange={(e) => setCustomTheme(e.target.value)}
                    variant="outlined"
                    slotProps={{
                        input: {
                            endAdornment: customTheme.trim() ? (
                                <InputAdornment position="end">
                                    <IconButton
                                        type="submit"
                                        size="small"
                                        sx={{
                                            bgcolor: '#5c67f2',
                                            color: '#fff',
                                            width: 28,
                                            height: 28,
                                            borderRadius: '8px',
                                            '&:hover': { bgcolor: '#4a53d4' },
                                        }}
                                    >
                                        <EastIcon sx={{ fontSize: 15 }} />
                                    </IconButton>
                                </InputAdornment>
                            ) : null,
                        },
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            bgcolor: '#f8fafc',
                            borderRadius: '14px',
                            fontSize: '0.875rem',
                            '& fieldset': { borderColor: '#e2e8f0' },
                            '&:hover fieldset': { borderColor: '#c7d2fe' },
                            '&.Mui-focused fieldset': { borderColor: '#5c67f2', borderWidth: '1.5px' },
                        },
                    }}
                />
            </Box>
        </Box>
    );
}
