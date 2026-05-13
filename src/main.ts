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

injectTemplates();
bindHeroButton();
bindNavigation(new SettingsController(onSettingsStart));

/** Injects all screen templates into the DOM. */
function injectTemplates(): void {
  document.body.insertAdjacentHTML('afterbegin',
    heroTemplate() + settingsTemplate() + gameTemplate()
  );
}

/** Preloads hover assets and binds events on the hero play button. */
function bindHeroButton(): void {
  preloadImages(['./assets/stadia_controller_hover.png', './assets/arrow_hover.png']);

  const playBtn       = document.getElementById('play-btn')!;
  const controllerImg = document.getElementById('play-btn-controller') as HTMLImageElement;
  const arrowImg      = document.getElementById('play-btn-arrow')      as HTMLImageElement;

  playBtn.addEventListener('mouseenter', () => {
    controllerImg.src = './assets/stadia_controller_hover.png';
    arrowImg.src      = './assets/arrow_hover.png';
  });
  playBtn.addEventListener('mouseleave', () => {
    controllerImg.src = './assets/stadia_controller.png';
    arrowImg.src      = './assets/arrow.png';
  });
  playBtn.addEventListener('click', showSettings);
}

/**
 * Binds all navigation event listeners.
 *
 * @param settingsController - The active {@link SettingsController} instance.
 */
function bindNavigation(settingsController: SettingsController): void {
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

/**
 * Preloads an array of image URLs into the browser cache.
 *
 * @param urls - Asset paths to preload.
 */
function preloadImages(urls: string[]): void {
  urls.forEach((src) => { new Image().src = src; });
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
