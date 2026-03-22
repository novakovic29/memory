import './styles/style.scss';
import { SettingsController } from './settings';

init();

function init() {
  // Lucide Icons initialisieren
  if (typeof (window as any).lucide !== 'undefined') {
    (window as any).lucide.createIcons();
  }

  // Play-Button → zeigt Settings
  const playBtn = document.getElementById('play-btn');
  playBtn?.addEventListener('click', () => {
    showSettings();
  });

  // Start-Game Button (Platzhalter nach Settings)
  const startGameBtn = document.getElementById('start-game');
  startGameBtn?.addEventListener('click', () => {
    startGame();
  });

  // Karten-Flip
  const fieldRef = document.getElementById('field');
  fieldRef?.addEventListener('click', (e) => {
    const card = (e.target as HTMLElement).closest('.card');
    if (card) {
      card.classList.toggle('is-flipped');
    }
  });

  // Settings Controller starten (kümmert sich um Radios + Start-Button)
  new SettingsController(onSettingsStart);
}

// ── Wird aufgerufen wenn der Start-Button in Settings geklickt wird ──
function onSettingsStart(theme: string, player: string, size: string) {
  console.log('Einstellungen:', { theme, player, size });
  showGameMenu();
  // Hier kannst du theme/player/size ans Spiel weitergeben
}

// ─────────────────────────────────────────────
// Navigation
// ─────────────────────────────────────────────
function showSettings() {
  document.getElementById('hero')!.style.display        = 'none';
  document.getElementById('settings')!.style.display    = 'block';
  document.getElementById('game-menu')!.style.display   = 'none';
}

function showGameMenu() {
  document.getElementById('hero')!.style.display        = 'none';
  document.getElementById('settings')!.style.display    = 'none';
  document.getElementById('game-menu')!.style.display   = 'block';
}

function showHero() {
  document.getElementById('hero')!.style.display        = 'block';
  document.getElementById('settings')!.style.display    = 'none';
  document.getElementById('game-menu')!.style.display   = 'none';
}

function startGame() {
  alert('Spiel startet!');
}