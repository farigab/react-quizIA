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

// Subtle animated mesh background
const BgGradient = () => (
  <Box
    sx={{
      position: 'fixed',
      inset: 0,
      zIndex: -1,
      background: `
                radial-gradient(ellipse 70% 55% at 15% 8%, rgba(199,210,254,0.35) 0%, transparent 55%),
                radial-gradient(ellipse 55% 50% at 85% 85%, rgba(167,243,208,0.2) 0%, transparent 55%),
                radial-gradient(ellipse 45% 40% at 70% 15%, rgba(253,230,138,0.15) 0%, transparent 50%),
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

      <Container
        component="main"
        id="main"
        maxWidth="sm"
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          py: { xs: 2, sm: 3.5 },
          px: { xs: 2, sm: 3 },
        }}
      >
        {/* Header */}
        <Box
          component="header"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2.5,
          }}
        >
          {/* Logo mark */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #5c67f2, #818cf8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                flexShrink: 0,
              }}
            >
              ✦
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                fontFamily: '"Syne", sans-serif',
                letterSpacing: '-0.03em',
                color: '#1e293b',
                fontSize: '1.1rem',
              }}
            >
              Quiz IA
            </Typography>
          </Box>

          {/* Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              icon={
                <EmojiEventsIcon
                  sx={{ fontSize: '1rem !important', color: '#f59e0b !important' }}
                />
              }
              label={score}
              size="small"
              sx={{
                fontWeight: 700,
                fontSize: '0.85rem',
                bgcolor: '#ffffff',
                border: '1.5px solid #e2e8f0',
                color: '#334155',
                px: 0.3,
                height: 30,
                borderRadius: '10px',
              }}
            />

            {showQuitBtn && (
              <Button
                size="small"
                variant="outlined"
                startIcon={
                  <ExitToAppIcon sx={{ fontSize: '1rem !important' }} />
                }
                onClick={resetToIntro}
                disableElevation
                sx={{
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  px: 1.2,
                  py: 0.4,
                  height: 30,
                  minHeight: 30,
                  borderColor: '#e2e8f0',
                  color: '#64748b',
                  bgcolor: '#ffffff',
                  '&:hover': {
                    borderColor: '#cbd5e1',
                    bgcolor: '#f8fafc',
                    color: '#334155',
                  },
                }}
              >
                Sair
              </Button>
            )}
          </Box>
        </Box>

        {/* Theme tag */}
        {currentTheme && screen !== 'intro' && (
          <Box
            sx={{ display: 'flex', justifyContent: 'center', mb: -1.5, zIndex: 1, position: 'relative' }}
          >
            <Chip
              label={currentTheme}
              size="small"
              sx={{
                bgcolor: '#ffffff',
                color: '#5c67f2',
                fontWeight: 700,
                fontSize: '0.8rem',
                border: '1.5px solid #c7d2fe',
                height: 26,
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(92,103,242,0.1)',
              }}
            />
          </Box>
        )}

        {/* Main Card */}
        <Card
          elevation={0}
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '22px',
            border: '1px solid rgba(226,232,240,0.8)',
            bgcolor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.04), 0 1px 4px rgba(0,0,0,0.03)',
            mt: currentTheme && screen !== 'intro' ? 2 : 0,
          }}
        >
          <CardContent
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              p: { xs: 2.5, sm: 3.5 },
              '&:last-child': { pb: { xs: 2.5, sm: 3.5 } },
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

        {/* Footer */}
        <Box component="footer" sx={{ textAlign: 'center', pt: 2.5, pb: 1 }}>
          <Typography
            variant="caption"
            sx={{ color: '#cbd5e1', fontWeight: 500, letterSpacing: '0.03em', fontSize: '0.7rem' }}
          >
            © 2026 Quiz IA
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
