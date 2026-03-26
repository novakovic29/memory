import './styles/style.scss';
import { SettingsController } from './settings';
import { GameController }     from './game';

init();

function init() {
  // Lucide Icons
  if (typeof (window as any).lucide !== 'undefined') {
    (window as any).lucide.createIcons();
  }

  // Play-Button → Settings
  document.getElementById('play-btn')?.addEventListener('click', showSettings);

  // Settings Controller
  new SettingsController(onSettingsStart);

  // Exit game Event (von GameController gefeuert)
  document.addEventListener('game:exit', () => showSettings());

  // Game-End Overlay Buttons
  document.getElementById('game-end-play-again')?.addEventListener('click', () => {
    document.getElementById('game-end-overlay')!.style.display = 'none';
    showSettings();
  });
  document.getElementById('game-end-home')?.addEventListener('click', () => {
    document.getElementById('game-end-overlay')!.style.display = 'none';
    showHero();
  });
}

// ── Called when Start button is clicked in Settings ──
function onSettingsStart(theme: string, player: string, size: string) {
  showGame();
  new GameController(
    theme  as 'code' | 'gaming',
    player as 'blue' | 'orange',
    size   as '16' | '24' | '36',
    true,   // isTwoPlayer – immer aktiviert für abwechselndes Spiel
  );
}

// ─────────────────────────────────────────────
// Navigation
// ─────────────────────────────────────────────
function showHero() {
  document.getElementById('hero')!.style.display     = 'block';
  document.getElementById('settings')!.style.display = 'none';
  document.getElementById('game')!.style.display     = 'none';
}

function showSettings() {
  document.getElementById('hero')!.style.display     = 'none';
  document.getElementById('settings')!.style.display = 'block';
  document.getElementById('game')!.style.display     = 'none';
}

function showGame() {
  document.getElementById('hero')!.style.display     = 'none';
  document.getElementById('settings')!.style.display = 'none';
  document.getElementById('game')!.style.display     = 'flex';
}
