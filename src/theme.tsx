import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#5c67f2',
      light: 'rgba(92,103,242,0.08)',
      dark: '#4a53d4',
      contrastText: '#ffffff',
    },
    success: { main: '#16a34a', light: '#f0fdf4' },
    error: { main: '#dc2626', light: '#fef2f2' },
    background: {
      default: '#f7f6f3',
      paper: '#ffffff',
    },
    text: {
      primary: '#111111',
      secondary: '#737373',
    },
    divider: '#e5e5e3',
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    h1: { fontFamily: '"Syne", sans-serif', fontWeight: 800, letterSpacing: '-0.04em' },
    h2: { fontFamily: '"Syne", sans-serif', fontWeight: 800, letterSpacing: '-0.03em' },
    h3: { fontFamily: '"Syne", sans-serif', fontWeight: 700, letterSpacing: '-0.025em' },
    h4: { fontFamily: '"Syne", sans-serif', fontWeight: 700, letterSpacing: '-0.02em' },
    h5: { fontFamily: '"Syne", sans-serif', fontWeight: 700, letterSpacing: '-0.02em' },
    h6: { fontFamily: '"Syne", sans-serif', fontWeight: 700, letterSpacing: '-0.015em' },
    button: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '-0.01em',
    },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { background: '#f7f6f3' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
        contained: {
          background: '#111111',
          '&:hover': { background: '#1f1f1f' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          fontWeight: 600,
          fontSize: '0.78rem',
          letterSpacing: '-0.01em',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            background: '#ffffff',
            '&.Mui-focused fieldset': { borderColor: '#5c67f2' },
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: { root: { borderRadius: 10 } },
    },
  },
});

export default theme;
