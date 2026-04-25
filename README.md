# Quiz IA — Versão React + Material UI

Migração completa do frontend para React 18 + MUI v6.

## Estrutura

```
quiz-react/
├── index.html
├── vite.config.js          ← proxy /api → localhost:3000
├── package.json
└── src/
    ├── main.jsx             ← entry point
    ├── App.jsx              ← layout, header, roteamento de telas
    ├── theme.js             ← MUI theme customizado (Syne + DM Sans)
    ├── hooks/
    │   └── useQuiz.js       ← toda a lógica do jogo (estado, fetch, timers)
    └── components/
        ├── IntroScreen.jsx  ← seleção de tema + tema personalizado + dado
        ├── LoadingScreen.jsx ← spinner animado enquanto a IA gera perguntas
        ├── QuestionScreen.jsx ← pergunta + choices + explanation + countdown
        └── FinalScreen.jsx  ← pontuação final + recorde + botão reiniciar
```

## Como rodar

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar em dev (com proxy para o backend Node na porta 3000)
npm run dev

# 3. Build de produção
npm run build
```

O backend (`server.js`) continua **inalterado** — o Vite apenas faz proxy
de `/api/*` para `http://localhost:3000` durante o desenvolvimento.

## Funcionalidades preservadas

- ✅ Seleção de tema com cards + emoji
- ✅ Botão dado para tema aleatório (animado)
- ✅ Campo de tema personalizado (Enter ou clique)
- ✅ Geração de perguntas via API `/api/generate-questions`
- ✅ Fallback para `questions.json` local
- ✅ Barra de progresso por questão
- ✅ Labels A / B / C / D com feedback visual
- ✅ Explicação após responder
- ✅ Auto-avanço com barra de contagem regressiva (15 s)
- ✅ Placar + melhor pontuação (localStorage)
- ✅ Atalho de teclado (1–4 para escolher resposta)
- ✅ Botão "Sair" durante o jogo
- ✅ Tela final com rating, progress bar e badge "Novo recorde!"
