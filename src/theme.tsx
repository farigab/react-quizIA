import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#5c67f2',        // alinhado com o #5c67f2 usado nos componentes
      light: '#eef0fd',
      dark: '#4a53d4',
      contrastText: '#ffffff',
    },
    success: {
      main: '#639922',        // alinhado com o verde das opções corretas
      light: '#eaf3de',
    },
    error: {
      main: '#A32D2D',        // alinhado com o vermelho das opções erradas
      light: '#fcebeb',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',     // alinhado com o #1e293b dos componentes
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    h1: { fontFamily: '"Syne", sans-serif', fontWeight: 800 },
    h2: { fontFamily: '"Syne", sans-serif', fontWeight: 700 },
    h3: { fontFamily: '"Syne", sans-serif', fontWeight: 700 },
    h4: { fontFamily: '"Syne", sans-serif', fontWeight: 700 },
    h5: { fontFamily: '"Syne", sans-serif', fontWeight: 700 },
    h6: { fontFamily: '"Syne", sans-serif', fontWeight: 600 },
    button: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,         // alinhado com o border-radius dos componentes
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '13px 24px',
          fontSize: '0.95rem',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' }, // removido — hover com sombra conflita com o estilo flat
        },
        contained: {
          background: '#5c67f2',            // removido gradiente — flat é mais consistente
          '&:hover': {
            background: '#4a53d4',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: 'none',                // removido — card usa border, não shadow
          border: '0.5px solid #e2e8f0',
          borderRadius: 20,
          background: '#ffffff',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          height: 4,                        // reduzido de 10px → 4px, mais sutil
          backgroundColor: '#f1f5f9',
        },
        bar: {
          borderRadius: 999,
          background: '#5c67f2',            // removido gradiente — flat
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: '"Plus Jakarta Sans", sans-serif', // trocado de Syne — Syne em chip fica pesado
          fontWeight: 600,
          fontSize: '0.78rem',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '&.Mui-focused fieldset': {
              borderColor: '#5c67f2',
            },
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 12 },
      },
    },
  },
});

export default theme;
