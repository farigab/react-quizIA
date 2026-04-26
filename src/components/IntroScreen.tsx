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
    const [selected, setSelected] = useState<string | null>(() => safeStorage.get(STORAGE_KEY));
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
        }, 550);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
                animation: 'fadeUp 0.35s cubic-bezier(0.16,1,0.3,1)',
                '@keyframes fadeUp': {
                    from: { opacity: 0, transform: 'translateY(12px)' },
                    to: { opacity: 1, transform: 'translateY(0)' },
                },
            }}
        >
            {/* ── Hero heading ── */}
            <Box sx={{ pt: 3, pb: 4 }}>
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 800,
                        color: '#111',
                        letterSpacing: '-0.03em',
                        mb: 0.75,
                        lineHeight: 1.1,
                    }}
                >
                    Escolha um tema
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem', fontWeight: 500 }}>
                    10 questões geradas por IA em segundos.
                </Typography>
            </Box>

            {loadError && (
                <Alert severity="error" sx={{ mb: 2.5, borderRadius: '10px' }}>{loadError}</Alert>
            )}

            {/* ── Theme grid ── */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 1,
                    mb: 3,
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
                                gap: 1.25,
                                py: '11px',
                                px: 1.75,
                                borderRadius: '10px',
                                textTransform: 'none',
                                fontSize: '0.875rem',
                                fontWeight: isActive ? 700 : 500,
                                letterSpacing: '-0.01em',
                                border: '1.5px solid',
                                borderColor: isActive ? '#111' : '#e5e5e3',
                                bgcolor: isActive ? '#111' : '#ffffff',
                                color: isActive ? '#fff' : '#111',
                                transition: 'all 0.15s ease',
                                animation: `fadeUp 0.3s ${i * 30}ms ease both`,
                                '&:hover': {
                                    borderColor: '#111',
                                    bgcolor: isActive ? '#111' : '#f5f4f1',
                                    color: isActive ? '#fff' : '#111',
                                },
                            }}
                        >
                            <Box
                                component="span"
                                sx={{
                                    fontSize: '1.05rem', lineHeight: 1, flexShrink: 0,
                                    filter: isActive ? 'brightness(1.2)' : 'none',
                                    transition: 'filter 0.15s ease',
                                }}
                            >
                                {emoji}
                            </Box>
                            {label}
                        </Button>
                    );
                })}
            </Box>

            {/* ── Divider with dice ── */}
            <Box
                sx={{
                    display: 'flex', alignItems: 'center', gap: 1.5,
                    mb: 3,
                    color: 'text.secondary',
                }}
            >
                <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
                <Button
                    onClick={handleDice}
                    disabled={rolling}
                    startIcon={
                        <CasinoIcon
                            sx={{
                                fontSize: '1rem !important',
                                animation: rolling ? 'spinDice 0.55s ease' : 'none',
                                '@keyframes spinDice': {
                                    '0%': { transform: 'rotate(0deg) scale(1)' },
                                    '50%': { transform: 'rotate(180deg) scale(1.25)' },
                                    '100%': { transform: 'rotate(360deg) scale(1)' },
                                },
                            }}
                        />
                    }
                    size="small"
                    sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.78rem',
                        letterSpacing: '-0.01em',
                        color: 'text.secondary',
                        border: '1.5px dashed',
                        borderColor: 'divider',
                        borderRadius: '8px',
                        px: 1.5, py: 0.5,
                        minHeight: 0,
                        bgcolor: '#fff',
                        '&:hover': { borderStyle: 'solid', borderColor: '#aaa', color: '#111', bgcolor: '#fff' },
                        '&:disabled': { opacity: 0.5 },
                    }}
                >
                    Sortear tema
                </Button>
                <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
            </Box>

            {/* ── Custom theme input ── */}
            <Box component="form" onSubmit={handleCustomStart}>
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
                                            bgcolor: '#111',
                                            color: '#fff',
                                            width: 26, height: 26,
                                            borderRadius: '7px',
                                            '&:hover': { bgcolor: '#333' },
                                        }}
                                    >
                                        <EastIcon sx={{ fontSize: 13 }} />
                                    </IconButton>
                                </InputAdornment>
                            ) : null,
                        },
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            letterSpacing: '-0.01em',
                            '& fieldset': { borderColor: '#e5e5e3' },
                            '&:hover fieldset': { borderColor: '#aaa' },
                        },
                    }}
                />
            </Box>
        </Box>
    );
}
