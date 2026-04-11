// ─────────────────────────────────────────────
// game.ts  –  GameController
// ─────────────────────────────────────────────
import type { Theme, Player, Size } from './settings';
import { CARD_ASSETS, CARD_BACK }   from './cardConfig';

// ── Types ──────────────────────────────────────
export interface CardData {
  id:      number;   // unique per card
  pairId:  number;   // same for both cards of a pair
  src:     string;   // SVG path
}

export type PlayerKey = 'blue' | 'orange';

interface PlayerState {
  score: number;
}

// ── GameController ─────────────────────────────
export class GameController {
  private theme:   Theme;
  private player:  Player;   // starting player color
  private size:    number;   // total cards (16 | 24 | 36)

  private cards:       CardData[] = [];
  private flipped:     number[]   = [];   // ids of currently face-up (unmatched) cards
  private matched:     Set<number> = new Set();
  private locked:      boolean     = false;  // block clicks during flip-back delay

  private scores: Record<PlayerKey, PlayerState> = {
    blue:   { score: 0 },
    orange: { score: 0 },
  };
  private currentPlayer: PlayerKey;
  private isTwoPlayer: boolean;

  // DOM refs
  private boardEl:       HTMLElement;
  private scoreBlueEl:   HTMLElement;
  private scoreOrangeEl: HTMLElement;
  private currentIconEl: HTMLImageElement;
  private playerLabelEl: HTMLElement;
  private iconBlueEl:    HTMLImageElement;
  private iconOrangeEl:  HTMLImageElement;

  constructor(
    theme:      Theme,
    player:     Player,
    size:       Size,
    isTwoPlayer: boolean = false,
  ) {
    this.theme        = theme;
    this.player       = player;
    this.size         = parseInt(size, 10);
    this.isTwoPlayer  = isTwoPlayer;
    this.currentPlayer = player as PlayerKey;

    this.boardEl       = document.getElementById('game-board')!;
    this.scoreBlueEl   = document.getElementById('score-blue')!;
    this.scoreOrangeEl = document.getElementById('score-orange')!;
    this.currentIconEl = document.getElementById('current-player-icon')! as HTMLImageElement;
    this.playerLabelEl = document.getElementById('current-player-label')!;
    this.iconBlueEl    = document.getElementById('hud-icon-blue')! as HTMLImageElement;
    this.iconOrangeEl  = document.getElementById('hud-icon-orange')! as HTMLImageElement;

    this.buildCards();
    this.renderBoard();
    this.renderHUD();
    this.bindEvents();
  }

  // ── Build card data ─────────────────────────
  private buildCards(): void {
    const pool    = CARD_ASSETS[this.theme];
    const pairCount = this.size / 2;

    if (pool.length < pairCount) {
      console.warn(
        `Theme "${this.theme}" hat nur ${pool.length} Assets, aber ${pairCount} Paare werden benötigt.`
      );
    }

    const selected = pool.slice(0, pairCount);
    // Jedes Asset doppelt → mischen
    const doubled: CardData[] = [];
    selected.forEach((src, pairId) => {
      doubled.push({ id: pairId * 2,     pairId, src });
      doubled.push({ id: pairId * 2 + 1, pairId, src });
    });

    this.cards = this.shuffle(doubled);
  }

  private shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ── Render board ────────────────────────────
  private renderBoard(): void {
    this.boardEl.innerHTML = '';

    // Grid columns: 4 für 16, 6 für 24 und 36
    const cols = this.size === 16 ? 4 : this.size === 24 ? 6 : 6;
    this.boardEl.style.gridTemplateColumns = `repeat(${cols}, 120px)`;
    this.boardEl.dataset.theme = this.theme;
    this.boardEl.dataset.size = String(this.size);

    this.cards.forEach(card => {
      const el = document.createElement('div');
      el.className  = 'memory-card';
      el.dataset.id = String(card.id);

      el.innerHTML = `
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

  // ── HUD ─────────────────────────────────────
  private renderHUD(): void {
    // Set player icons based on theme
    const themeSuffix = this.theme === 'gaming' ? 'game' : this.theme;
    this.iconBlueEl.src   = `/assets/player_blue_${themeSuffix}.png`;
    this.iconOrangeEl.src = `/assets/player_orange_${themeSuffix}.png`;

    this.scoreBlueEl.textContent   = String(this.scores.blue.score);
    this.scoreOrangeEl.textContent = String(this.scores.orange.score);
    this.updateCurrentPlayer();
  }

  private updateCurrentPlayer(): void {
    const COLORS: Record<PlayerKey, string> = {
      blue:   '#4fc3f7',
      orange: '#ff9800',
    };
    const color = COLORS[this.currentPlayer];
    const themeSuffix = this.theme === 'gaming' ? 'game' : this.theme;
    this.currentIconEl.src = `/assets/player_${this.currentPlayer}_${themeSuffix}.png`;
    this.playerLabelEl.textContent       = this.currentPlayer === 'blue' ? 'Blue' : 'Orange';
    this.playerLabelEl.style.color       = color;

    // Dot im HUD highlighten
    const dotBlue   = document.getElementById('hud-icon-blue')!;
    const dotOrange = document.getElementById('hud-icon-orange')!;
    dotBlue.classList.toggle('is-active',   this.currentPlayer === 'blue');
    dotOrange.classList.toggle('is-active', this.currentPlayer === 'orange');
  }

  // ── Events ──────────────────────────────────
  private bindEvents(): void {
    this.boardEl.addEventListener('click', (e) => {
      const cardEl = (e.target as HTMLElement).closest<HTMLElement>('.memory-card');
      if (!cardEl) return;
      const id = parseInt(cardEl.dataset.id ?? '-1', 10);
      this.handleCardClick(id, cardEl);
    });

    // Exit button
    document.getElementById('exit-game-btn')?.addEventListener('click', () => {
      this.onExit();
    });
  }

  // ── Flip logic ──────────────────────────────
  private handleCardClick(id: number, el: HTMLElement): void {
    if (this.locked)                  return;
    if (this.matched.has(id))         return;
    if (this.flipped.includes(id))    return;
    if (this.flipped.length >= 2)     return;

    el.classList.add('is-flipped');
    this.flipped.push(id);

    if (this.flipped.length === 2) {
      this.checkMatch();
    }
  }

  private checkMatch(): void {
    const [id1, id2] = this.flipped;
    const card1 = this.cards.find(c => c.id === id1)!;
    const card2 = this.cards.find(c => c.id === id2)!;

    if (card1.pairId === card2.pairId) {
      // ✅ Match!
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
        // Spielerwechsel nach erfolgreichem Match
        this.switchPlayer();
      }
    } else {
      // ❌ Kein Match → nach kurzer Pause zurückdrehen
      this.locked = true;
      setTimeout(() => {
        this.getCardEl(id1)?.classList.remove('is-flipped');
        this.getCardEl(id2)?.classList.remove('is-flipped');
        this.flipped = [];
        this.locked  = false;

        // Spielerwechsel nach Fehlversuch
        this.switchPlayer();
      }, 1000);
    }
  }

  private switchPlayer(): void {
    this.currentPlayer = this.currentPlayer === 'blue' ? 'orange' : 'blue';
    this.updateCurrentPlayer();
  }

  private getCardEl(id: number): HTMLElement | null {
    return this.boardEl.querySelector<HTMLElement>(`.memory-card[data-id="${id}"]`);
  }

  // ── Game end ────────────────────────────────
  private onGameEnd(): void {
    const winner =
      this.scores.blue.score > this.scores.orange.score  ? 'Blue' :
      this.scores.orange.score > this.scores.blue.score  ? 'Orange' :
      'Draw';

    // Einfaches Overlay (kann später durch ein schöneres ersetzt werden)
    const overlay = document.getElementById('game-end-overlay')!;
    const msg     = document.getElementById('game-end-message')!;
    msg.textContent = winner === 'Draw' ? "It's a draw! 🤝" : `${winner} wins! 🎉`;
    overlay.style.display = 'flex';
  }

  private onExit(): void {
    // Zurück zur Hero-Section → main.ts übernimmt
    document.dispatchEvent(new CustomEvent('game:exit'));
  }
}
