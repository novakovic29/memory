/**
 * @file game.ts
 * @description Game logic, board rendering, HUD and all end-screen overlays.
 */

import type { Theme, Player, Size } from './settings';
import { CARD_ASSETS, CARD_BACK }   from './cardConfig';

/**
 * Represents a single memory card on the board.
 */
export interface CardData {
  /** Unique identifier for this card instance. */
  id:     number;
  /** Shared identifier for both cards of a pair. */
  pairId: number;
  /** Path to the card's front-face image. */
  src:    string;
}

/** Player colour key. */
export type PlayerKey = 'blue' | 'orange';

/**
 * Runtime state for a single player.
 */
interface PlayerState {
  score: number;
}

/**
 * Controls the running memory game: card logic, HUD,
 * exit overlay and all result screens.
 */
export class GameController {
  /** Active game theme. */
  private theme: Theme;

  /** Total number of cards on the board. */
  private size: number;

  private cards:   CardData[]  = [];
  private flipped: number[]    = [];
  private matched: Set<number> = new Set();

  /** Blocks card clicks during the flip-back animation. */
  private locked: boolean = false;

  private scores: Record<PlayerKey, PlayerState> = {
    blue:   { score: 0 },
    orange: { score: 0 },
  };

  private currentPlayer: PlayerKey;

  private boardEl:       HTMLElement;
  private scoreBlueEl:   HTMLElement;
  private scoreOrangeEl: HTMLElement;
  private currentIconEl: HTMLImageElement;
  private playerLabelEl: HTMLElement;
  private iconBlueEl:    HTMLImageElement;
  private iconOrangeEl:  HTMLImageElement;

  /**
   * @param theme  - The chosen game theme.
   * @param player - The colour of the starting player.
   * @param size   - The board size as a string.
   */
  constructor(
    theme:  Theme,
    player: Player,
    size:   Size,
  ) {
    this.theme         = theme;
    this.size          = parseInt(size, 10);
    this.currentPlayer = player as PlayerKey;

    this.boardEl       = document.getElementById('game-board')!;
    this.scoreBlueEl   = document.getElementById('score-blue')!;
    this.scoreOrangeEl = document.getElementById('score-orange')!;
    this.currentIconEl = document.getElementById('current-player-icon')! as HTMLImageElement;
    this.playerLabelEl = document.getElementById('current-player-label')!;
    this.iconBlueEl    = document.getElementById('hud-icon-blue')!        as HTMLImageElement;
    this.iconOrangeEl  = document.getElementById('hud-icon-orange')!      as HTMLImageElement;

    this.buildCards();
    this.renderBoard();
    this.renderHUD();
    this.bindEvents();
  }

  /**
   * Builds shuffled card pairs from the asset pool of the active theme.
   */
  private buildCards(): void {
    const pool      = CARD_ASSETS[this.theme];
    const pairCount = this.size / 2;

    if (pool.length < pairCount) {
      console.warn(
        `Theme "${this.theme}" only has ${pool.length} assets, but ${pairCount} pairs are required.`
      );
    }

    const doubled: CardData[] = [];
    pool.slice(0, pairCount).forEach((src, pairId) => {
      doubled.push({ id: pairId * 2,     pairId, src });
      doubled.push({ id: pairId * 2 + 1, pairId, src });
    });

    this.cards = this.shuffle(doubled);
  }

  /**
   * Shuffles an array using the Fisher-Yates algorithm.
   *
   * @param arr - The array to shuffle.
   * @returns   A new shuffled copy of the array.
   */
  private shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /**
   * Renders all cards on the board and sets the grid layout.
   */
  private renderBoard(): void {
    this.boardEl.innerHTML = '';

    const cols = this.size === 16 ? 4 : 6;
    this.boardEl.style.gridTemplateColumns         = `repeat(${cols}, 120px)`;
    this.boardEl.dataset.theme                     = this.theme;
    this.boardEl.dataset.size                      = String(this.size);
    document.getElementById('game')!.dataset.theme = this.theme;

    this.cards.forEach(card => {
      const el = document.createElement('div');
      el.className  = 'memory-card';
      el.dataset.id = String(card.id);
      el.innerHTML  = `
        <div class="memory-card__inner">
          <div class="memory-card__front">
            <img src="${card.src}" alt="card" draggable="false" />
          </div>
          <div class="memory-card__back">
            <img src="${CARD_BACK[this.theme]}" alt="back" draggable="false" />
          </div>
        </div>
      `;
      this.boardEl.appendChild(el);
    });
  }

  /**
   * Updates the HUD with player icons and current scores.
   */
  private renderHUD(): void {
    const suffix = this.theme === 'gaming' ? 'game' : this.theme;
    this.iconBlueEl.src   = `/assets/player_blue_${suffix}.png`;
    this.iconOrangeEl.src = `/assets/player_orange_${suffix}.png`;

    this.scoreBlueEl.textContent   = String(this.scores.blue.score);
    this.scoreOrangeEl.textContent = String(this.scores.orange.score);
    this.updateCurrentPlayer();
  }

  /**
   * Updates the current-player icon and active highlight in the HUD.
   */
  private updateCurrentPlayer(): void {
    const suffix = this.theme === 'gaming' ? 'game' : this.theme;
    this.currentIconEl.src         = `/assets/player_${this.currentPlayer}_${suffix}.png`;
    this.playerLabelEl.textContent = '';
    this.playerLabelEl.style.color = '';

    document.getElementById('hud-icon-blue')!
      .classList.toggle('is-active', this.currentPlayer === 'blue');
    document.getElementById('hud-icon-orange')!
      .classList.toggle('is-active', this.currentPlayer === 'orange');
  }

  /**
   * Registers all click listeners for the board, exit button and exit overlay.
   */
  private bindEvents(): void {
    this.boardEl.addEventListener('click', (e) => {
      const cardEl = (e.target as HTMLElement).closest<HTMLElement>('.memory-card');
      if (!cardEl) return;
      this.handleCardClick(parseInt(cardEl.dataset.id ?? '-1', 10), cardEl);
    });

    document.getElementById('exit-game-btn')?.addEventListener('click', () => {
      this.showExitOverlay();
    });

    document.getElementById('game-exit-back')?.addEventListener('click', () => {
      this.hideExitOverlay();
    });

    document.getElementById('game-exit-confirm')?.addEventListener('click', () => {
      this.hideExitOverlay();
      this.onExit();
    });
  }

  /**
   * Handles a click on a card.
   *
   * @param id - The ID of the clicked card.
   * @param el - The card's DOM element.
   */
  private handleCardClick(id: number, el: HTMLElement): void {
    if (this.locked)               return;
    if (this.matched.has(id))      return;
    if (this.flipped.includes(id)) return;
    if (this.flipped.length >= 2)  return;

    el.classList.add('is-flipped');
    this.flipped.push(id);

    if (this.flipped.length === 2) this.checkMatch();
  }

  /**
   * Checks whether the two face-up cards form a pair.
   * Awards a point on match and switches the player after every turn.
   */
  private checkMatch(): void {
    const [id1, id2] = this.flipped;
    const card1 = this.cards.find(c => c.id === id1)!;
    const card2 = this.cards.find(c => c.id === id2)!;

    if (card1.pairId === card2.pairId) {
      this.matched.add(id1);
      this.matched.add(id2);
      this.scores[this.currentPlayer].score++;
      this.flipped = [];

      this.getCardEl(id1)?.classList.add('is-matched');
      this.getCardEl(id2)?.classList.add('is-matched');
      this.renderHUD();

      if (this.matched.size === this.cards.length) {
        setTimeout(() => this.onGameEnd(), 600);
      } else {
        this.switchPlayer();
      }
    } else {
      this.locked = true;
      setTimeout(() => {
        this.getCardEl(id1)?.classList.remove('is-flipped');
        this.getCardEl(id2)?.classList.remove('is-flipped');
        this.flipped = [];
        this.locked  = false;
        this.switchPlayer();
      }, 1000);
    }
  }

  /** Switches to the other player and updates the HUD. */
  private switchPlayer(): void {
    this.currentPlayer = this.currentPlayer === 'blue' ? 'orange' : 'blue';
    this.updateCurrentPlayer();
  }

  /**
   * Returns the DOM element of a card by its ID.
   *
   * @param id - The card ID to look up.
   * @returns  The card element, or `null` if not found.
   */
  private getCardEl(id: number): HTMLElement | null {
    return this.boardEl.querySelector<HTMLElement>(`.memory-card[data-id="${id}"]`);
  }

  /**
   * Triggered when all cards have been matched.
   * Displays the game-over screen and transitions to the result screen after 5 seconds.
   */
  private onGameEnd(): void {
    const suffix = this.theme === 'gaming' ? 'game' : this.theme;
    (document.getElementById('end-icon-blue')   as HTMLImageElement).src = `/assets/player_blue_${suffix}.png`;
    (document.getElementById('end-icon-orange') as HTMLImageElement).src = `/assets/player_orange_${suffix}.png`;

    document.getElementById('end-score-blue')!.textContent   = String(this.scores.blue.score);
    document.getElementById('end-score-orange')!.textContent = String(this.scores.orange.score);

    (document.querySelector('.game__end-gameover-img') as HTMLImageElement).src =
      this.theme === 'gaming'
        ? '/assets/themes/gaming_result/game_over_gaming.png'
        : '/assets/themes/code_result/game_over.png';

    const endOverlay = document.getElementById('game-end-overlay')!;
    endOverlay.style.display = 'flex';

    setTimeout(() => {
      endOverlay.style.display = 'none';
      this.showWinnerScreen();
    }, 5000);
  }

  /**
   * Displays the winner or draw screen depending on the final scores.
   */
  private showWinnerScreen(): void {
    const winner: PlayerKey | 'draw' =
      this.scores.blue.score > this.scores.orange.score   ? 'blue'   :
      this.scores.orange.score > this.scores.blue.score   ? 'orange' : 'draw';

    if (winner === 'draw') {
      this.showDrawScreen();
      return;
    }

    const nameEl    = document.getElementById('winner-name')!;
    const nameImgEl = document.getElementById('winner-name-img') as HTMLImageElement;
    const iconEl    = document.getElementById('winner-icon')     as HTMLImageElement;
    const backBtn   = document.getElementById('game-winner-back')!;

    if (this.theme === 'gaming') {
      nameEl.style.display    = 'none';
      nameImgEl.src           = `/assets/themes/gaming_result/winner_${winner}.png`;
      nameImgEl.style.display = 'block';
      iconEl.src              = '/assets/themes/gaming_result/pockal.png';
      backBtn.textContent     = 'Home';
    } else {
      nameImgEl.style.display = 'none';
      nameEl.style.display    = '';
      nameEl.textContent      = `${winner.toUpperCase()} PLAYER`;
      nameEl.className        = `game__winner-name game__winner-name--${winner}`;
      iconEl.src              = `/assets/themes/code_result/chess_pawn_${winner}.png`;
      backBtn.textContent     = 'Back to start';
    }

    const overlay = document.getElementById('game-winner-overlay')!;
    overlay.style.display = 'flex';

    backBtn.addEventListener('click', () => {
      overlay.style.display = 'none';
      document.dispatchEvent(new CustomEvent('game:exit'));
    }, { once: true });
  }

  /**
   * Displays the draw screen with theme-specific assets.
   */
  private showDrawScreen(): void {
    const titleImg = document.querySelector('.game__draw-title-img') as HTMLImageElement;
    const scaleImg = document.querySelector('.game__draw-icon')      as HTMLImageElement;
    const backBtn  = document.getElementById('game-draw-back')!;

    if (this.theme === 'gaming') {
      titleImg.src           = '/assets/themes/gaming_result/its_draw_gaming.png';
      scaleImg.style.display = 'none';
      backBtn.textContent    = 'Home';
    } else {
      titleImg.src           = '/assets/themes/code_result/its_draw.png';
      scaleImg.src           = '/assets/themes/code_result/scale_icon.png';
      scaleImg.style.display = '';
      backBtn.textContent    = 'Back to start';
    }

    const overlay = document.getElementById('game-draw-overlay')!;
    overlay.style.display = 'flex';

    backBtn.addEventListener('click', () => {
      overlay.style.display = 'none';
      document.dispatchEvent(new CustomEvent('game:exit'));
    }, { once: true });
  }

  /** Dispatches the `game:exit` event handled by `main.ts`. */
  private onExit(): void {
    document.dispatchEvent(new CustomEvent('game:exit'));
  }

  /**
   * Shows the exit confirmation overlay with theme-specific button labels.
   */
  private showExitOverlay(): void {
    const overlay    = document.getElementById('game-exit-overlay')!;
    const backBtn    = document.getElementById('game-exit-back')!;
    const confirmBtn = document.getElementById('game-exit-confirm')!;

    if (this.theme === 'code') {
      backBtn.textContent    = 'Back to game';
      confirmBtn.textContent = 'Exit game';
    } else {
      backBtn.textContent    = 'No, back to game';
      confirmBtn.textContent = 'Yes, quit game';
    }

    overlay.classList.toggle('game__exit-overlay--gaming', this.theme === 'gaming');
    overlay.classList.toggle('game__exit-overlay--code',   this.theme === 'code');
    overlay.style.display = 'flex';
  }

  /** Hides the exit confirmation overlay. */
  private hideExitOverlay(): void {
    document.getElementById('game-exit-overlay')!.style.display = 'none';
  }
}
