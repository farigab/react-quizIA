import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4f46e5',
      light: '#e0e7ff',
      dark: '#4338ca',
      contrastText: '#ffffff',
    },
    success: {
      main: '#10b981',
      light: '#d1fae5',
    },
    error: {
      main: '#ef4444',
      light: '#fee2e2',
    },
    background: {
      default: '#f1f5f9',
      paper: '#ffffff',
    },
    text: {
      primary: '#111827',
      secondary: '#6b7280',
    },
  },
  typography: {
    fontFamily: '"DM Sans", system-ui, sans-serif',
    h1: {
      fontFamily: '"Syne", sans-serif',
      fontWeight: 800,
    },
    h2: {
      fontFamily: '"Syne", sans-serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Syne", sans-serif',
      fontWeight: 700,
    },
    h4: {
      fontFamily: '"Syne", sans-serif',
      fontWeight: 700,
    },
    h5: {
      fontFamily: '"Syne", sans-serif',
      fontWeight: 700,
    },
    h6: {
      fontFamily: '"Syne", sans-serif',
      fontWeight: 600,
    },
    button: {
      fontFamily: '"Syne", sans-serif',
      fontWeight: 700,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 24px',
          fontSize: '1rem',
          fontWeight: 700,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 14px rgba(79,70,229,0.25)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4338ca, #4f46e5)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 20px 40px -8px rgba(17,24,39,0.10), 0 4px 10px -2px rgba(17,24,39,0.04)',
          border: '1px solid rgba(255,255,255,0.8)',
          borderRadius: 20,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          height: 10,
          backgroundColor: '#e2e8f0',
        },
        bar: {
          borderRadius: 999,
          background: 'linear-gradient(90deg, #4f46e5, #818cf8)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: '"Syne", sans-serif',
          fontWeight: 700,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '&.Mui-focused fieldset': {
              borderColor: '#4f46e5',
            },
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;
