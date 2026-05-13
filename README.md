# Memory

A browser-based memory card game built with TypeScript, Vite and SCSS.

## Features

- **Two themes** — Code Vibes and Gaming, each with unique card designs and end screens
- **Two players** — Blue and Orange with individual score tracking
- **Three board sizes** — 16, 24 or 36 cards
- **Game screens** — Game Over, Winner and Draw screens per theme
- **Responsive settings** — Live theme preview while selecting

## Tech Stack

- TypeScript
- Vite
- SCSS (7-1 architecture, BEM)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── templates/        # HTML templates as TypeScript functions
├── styles/
│   ├── abstracts/    # Variables, mixins
│   ├── base/         # Reset, typography
│   ├── components/   # Buttons, cards, radio inputs
│   └── layouts/      # Hero, settings, game screens
├── main.ts           # Entry point, navigation
├── settings.ts       # Settings controller
├── game.ts           # Game controller
└── cardConfig.ts     # Card asset configuration
```
