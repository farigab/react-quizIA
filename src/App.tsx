import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import {
  Box,
  Button,
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

  const showControls = screen === 'question' || screen === 'loading';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* ── Top progress bar – only during a quiz ── */}
      <Box
        aria-hidden="true"
        sx={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          height: 3,
          bgcolor: 'rgba(0,0,0,0.06)',
          zIndex: 1200,
          opacity: screen === 'question' ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        <Box
          sx={{
            height: '100%',
            bgcolor: '#5c67f2',
            width: `${answeredProgressPct}%`,
            transition: 'width 0.45s cubic-bezier(0.4,0,0.2,1)',
            borderRadius: '0 999px 999px 0',
          }}
        />
      </Box>

      <a href="#main" className="skip-link">Pular para o conteúdo</a>

      <Container
        component="div"
        maxWidth="sm"
        sx={{
          minHeight: '100svh',
          display: 'flex',
          flexDirection: 'column',
          pt: { xs: '56px', sm: '64px' },
          pb: { xs: 4, sm: 5 },
          px: { xs: 2.5, sm: 4 },
        }}
      >
        {/* ── Header ── */}
        <Box
          component="header"
          sx={{
            position: 'fixed',
            top: 3,                          // sits below the progress stripe
            left: 0, right: 0,
            zIndex: 1100,
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            background: 'rgba(247,246,243,0.88)',
          }}
        >
          <Container maxWidth="sm" sx={{ px: { xs: 2.5, sm: 4 } }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: 52,
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              {/* Logo */}
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'default' }}
                onClick={screen !== 'question' ? undefined : undefined}
              >
                <Box
                  sx={{
                    width: 26, height: 26,
                    borderRadius: '8px',
                    background: '#111',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', color: '#fff', flexShrink: 0,
                  }}
                >
                  ✦
                </Box>
                <Typography
                  sx={{
                    fontFamily: '"Syne", sans-serif',
                    fontWeight: 800,
                    fontSize: '1rem',
                    letterSpacing: '-0.04em',
                    color: '#111',
                  }}
                >
                  Quiz IA
                </Typography>

                {/* Active theme tag */}
                {currentTheme && screen !== 'intro' && (
                  <Typography
                    sx={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      color: 'text.secondary',
                      bgcolor: 'rgba(0,0,0,0.05)',
                      px: 1, py: 0.25,
                      borderRadius: '6px',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {currentTheme}
                  </Typography>
                )}
              </Box>

              {/* Right side */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* Score */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <EmojiEventsIcon sx={{ fontSize: 14, color: '#f59e0b' }} />
                  <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                    {score}
                  </Typography>
                </Box>

                {/* Quit */}
                {showControls && (
                  <Button
                    size="small"
                    onClick={resetToIntro}
                    sx={{
                      color: 'text.secondary',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      minWidth: 0,
                      px: 0,
                      py: 0,
                      minHeight: 0,
                      '&:hover': { color: '#111', background: 'transparent' },
                    }}
                  >
                    Sair
                  </Button>
                )}
              </Box>
            </Box>
          </Container>
        </Box>

        {/* ── Main content ── */}
        <Box component="main" id="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
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
        </Box>
      </Container>
    </ThemeProvider>
  );
}
