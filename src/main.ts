/**
 * @file main.ts
 * @description Application entry point. Injects HTML templates, initialises
 * controllers and manages navigation between screens.
 */

import './styles/style.scss';
import { SettingsController } from './settings';
import { GameController }     from './game';
import { heroTemplate }       from './templates/hero.template';
import { settingsTemplate }   from './templates/settings.template';
import { gameTemplate }       from './templates/game.template';

document.body.insertAdjacentHTML('afterbegin',
  heroTemplate() + settingsTemplate() + gameTemplate()
);

init();

/**
 * Bootstraps the application by registering event listeners
 * and creating the {@link SettingsController}.
 */
function init(): void {
  if (typeof (window as any).lucide !== 'undefined') {
    (window as any).lucide.createIcons();
  }

  document.getElementById('play-btn')?.addEventListener('click', showSettings);

  const settingsController = new SettingsController(onSettingsStart);

  document.addEventListener('game:exit', () => {
    settingsController.reset();
    showSettings();
  });

  document.getElementById('game-end-play-again')?.addEventListener('click', () => {
    document.getElementById('game-end-overlay')!.style.display = 'none';
    showSettings();
  });

  document.getElementById('game-end-home')?.addEventListener('click', () => {
    document.getElementById('game-end-overlay')!.style.display = 'none';
    showHero();
  });
}

/**
 * Called when the user confirms their settings and starts the game.
 *
 * @param theme  - The chosen game theme (`'code'` | `'gaming'`).
 * @param player - The chosen player colour (`'blue'` | `'orange'`).
 * @param size   - The chosen board size as a string (`'16'` | `'24'` | `'36'`).
 */
function onSettingsStart(theme: string, player: string, size: string): void {
  showGame();
  new GameController(
    theme  as 'code' | 'gaming',
    player as 'blue' | 'orange',
    size   as '16' | '24' | '36',
  );
}

/** Shows the hero screen and hides all other screens. */
function showHero(): void {
  document.getElementById('hero')!.style.display     = 'block';
  document.getElementById('settings')!.style.display = 'none';
  document.getElementById('game')!.style.display     = 'none';
}

/** Shows the settings screen and hides all other screens. */
function showSettings(): void {
  document.getElementById('hero')!.style.display     = 'none';
  document.getElementById('settings')!.style.display = 'block';
  document.getElementById('game')!.style.display     = 'none';
}

/** Shows the game screen and hides all other screens. */
function showGame(): void {
  document.getElementById('hero')!.style.display     = 'none';
  document.getElementById('settings')!.style.display = 'none';
  document.getElementById('game')!.style.display     = 'flex';
}
