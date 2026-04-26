import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  CssBaseline,
  ThemeProvider,
  Typography,
} from '@mui/material';

import FinalScreen from './components/FinalScreen';
import IntroScreen from './components/IntroScreen';
import LoadingScreen from './components/LoadingScreen';
import QuestionScreen from './components/QuestionScreen';
import { useQuiz } from './hooks/useQuiz';
import theme from './theme';

// Fundo Mesh-gradient ajustado para ser ainda mais suave e clean
const BgGradient = () => (
  <Box
    sx={{
      position: 'fixed',
      inset: 0,
      zIndex: -1,
      background: `
        radial-gradient(ellipse 80% 60% at 20% 10%, rgba(224,231,255,0.4) 0%, transparent 60%),
        radial-gradient(ellipse 60% 50% at 80% 80%, rgba(199,210,254,0.3) 0%, transparent 60%),
        #f8fafc
      `,
    }}
  />
);

export default function App() {
  const {
    screen,
    currentTheme,
    current,
    score,
    highScore,
    isNewRecord,
    answered,
    chosenIdx,
    correctIdx,
    currentQuestion,
    selected,
    progressPct,
    answeredProgressPct,
    autoAdvanceProgress,
    loadError,
    startGame,
    handleChoice,
    handleNext,
    triggerAutoAdvance,
    resetToIntro,
  } = useQuiz();

  const showQuitBtn = screen === 'question' || screen === 'loading';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BgGradient />

      <a href="#main" className="skip-link">Pular para o conteúdo</a>

      <Container component="main" id="main"
        maxWidth="sm"
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          py: { xs: 2, sm: 4 },
          px: { xs: 2, sm: 3 }
        }}
      >
        {/* ── Header ── */}
        <Box
          component="header"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 3,
          }}
        >
          {/* Logo */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              fontFamily: '"Syne", sans-serif',
              letterSpacing: '-0.03em', // Resolve a sensação de texto "puxado/esticado"
              background: 'linear-gradient(135deg, #5c67f2, #818cf8)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Quiz IA
          </Typography>

          {/* Ações (Placar e Sair) */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Chip
              icon={<EmojiEventsIcon sx={{ fontSize: '1.1rem !important', color: '#f59e0b !important' }} />}
              label={score}
              size="small"
              sx={{
                fontWeight: 700,
                fontSize: '0.9rem',
                bgcolor: '#ffffff',
                border: '1.5px solid #e2e8f0',
                color: '#334155',
                px: 0.5,
                height: 32,
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              }}
            />

            {showQuitBtn && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<ExitToAppIcon sx={{ fontSize: '1.1rem !important' }} />}
                onClick={resetToIntro}
                disableElevation
                sx={{
                  borderRadius: '16px',
                  textTransform: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  px: 1.5,
                  py: 0.5,
                  borderColor: '#e2e8f0',
                  color: '#64748b',
                  bgcolor: '#ffffff',
                  '&:hover': {
                    borderColor: '#cbd5e1',
                    bgcolor: '#f8fafc',
                    color: '#334155'
                  },
                }}
              >
                Sair
              </Button>
            )}
          </Box>
        </Box>

        {/* ── Theme tag (Centralizada como no seu print) ── */}
        {currentTheme && screen !== 'intro' && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: -2, zIndex: 1, position: 'relative' }}>
            <Chip
              label={`Tema: ${currentTheme}`}
              sx={{
                bgcolor: '#f5f7ff',
                color: '#5c67f2',
                fontWeight: 600,
                fontSize: '0.85rem',
                border: '1px solid #e0e7ff',
                px: 1,
              }}
            />
          </Box>
        )}

        {/* ── Main Card Moderno (Flat & Clean) ── */}
        <Card
          elevation={0}
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '24px',
            border: '1px solid #e2e8f0',
            bgcolor: 'rgba(255, 255, 255, 0.8)', // Leve transparência para o mesh vazar sutilmente
            backdropFilter: 'blur(8px)', // Efeito de vidro opaco
            boxShadow: '0 12px 40px rgba(0,0,0,0.03)', // Sombra super premium e difusa
            mt: currentTheme && screen !== 'intro' ? 2 : 0, // Ajuste de margem devido à tag de tema
          }}
        >
          <CardContent
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              p: { xs: 3, sm: 4 },
              '&:last-child': { pb: { xs: 3, sm: 4 } } // Sobrescreve comportamento padrão do MUI
            }}
          >

            {screen === 'intro' && (
              <IntroScreen onStart={startGame} loadError={loadError} />
            )}

            {screen === 'loading' && (
              <LoadingScreen theme={currentTheme} />
            )}

            {screen === 'question' && currentQuestion && (
              <QuestionScreen
                question={currentQuestion}
                current={current}
                total={selected.length}
                score={score}
                answered={answered}
                chosenIdx={chosenIdx}
                correctIdx={correctIdx}
                progressPct={progressPct}
                answeredProgressPct={answeredProgressPct}
                autoAdvanceProgress={autoAdvanceProgress}
                onChoice={handleChoice}
                onNext={handleNext}
                onAnswered={triggerAutoAdvance}
              />
            )}

            {screen === 'final' && (
              <FinalScreen
                score={score}
                total={selected.length || 10}
                highScore={highScore}
                isNewRecord={isNewRecord}
                onRestart={resetToIntro}
              />
            )}

          </CardContent>
        </Card>

        {/* ── Footer ── */}
        <Box component="footer" sx={{ textAlign: 'center', pt: 3, pb: 1 }}>
          <Typography
            variant="caption"
            sx={{
              color: '#94a3b8',
              fontWeight: 500,
              letterSpacing: '0.02em'
            }}
          >
            © 2026 Quiz IA
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
