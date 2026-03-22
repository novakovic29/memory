// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export type Theme  = 'code' | 'gaming';
export type Player = 'blue' | 'orange';
export type Size   = '16' | '24' | '36';

export interface GameSettings {
  theme:  Theme;
  player: Player;
  size:   Size;
}

interface ThemeConfig {
  previewBg: string;
  cardFront: string;
  cardBack:  string;
}

// ─────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────
const THEME_CONFIG: Record<Theme, ThemeConfig> = {
  code: {
    previewBg: '#1e2a1e',
    cardFront: '#26a69a',
    cardBack:  '#f5f5f0',
  },
  gaming: {
    previewBg: '#1a1a2e',
    cardFront: '#e91e8c',
    cardBack:  '#f5f5f0',
  },
};

const PLAYER_COLORS: Record<Player, string> = {
  blue:   '#4fc3f7',
  orange: '#ff9800',
};

const PLAYER_LABELS: Record<Player, string> = {
  blue:   'Blue',
  orange: 'Orange',
};

const THEME_LABELS: Record<Theme, string> = {
  code:   'Code vibes',
  gaming: 'Gaming',
};

// ─────────────────────────────────────────────
// SettingsController
// ─────────────────────────────────────────────
export class SettingsController {
  private theme:  Theme  | null = null;
  private player: Player | null = null;
  private size:   Size   | null = null;

  // Callback der aufgerufen wird wenn Start geklickt wird
  private onStart: (theme: string, player: string, size: string) => void;

  // DOM refs
  private previewContent  = document.getElementById('preview-content')!;
  private cardFront       = document.getElementById('card-front')!;
  private cardBack        = document.getElementById('card-back')!;
  private dotBlue         = document.getElementById('dot-blue')!;
  private dotOrange       = document.getElementById('dot-orange')!;
  private playerIndicator = document.getElementById('player-indicator')!;
  private barTheme        = document.getElementById('bar-theme')!;
  private barPlayer       = document.getElementById('bar-player')!;
  private barSize         = document.getElementById('bar-size')!;
  private startBtn        = document.getElementById('start-btn') as HTMLButtonElement;

  constructor(onStart: (theme: string, player: string, size: string) => void) {
    this.onStart = onStart;
    this.bindRadios();
    this.startBtn?.addEventListener('click', () => this.handleStart());
    this.render();
  }

  // ── Alle Radio-Gruppen verdrahten ──
  private bindRadios(): void {
    document.querySelectorAll<HTMLInputElement>('input[name="theme"]').forEach((r) => {
      r.addEventListener('change', () => {
        if (r.checked) { this.theme = r.value as Theme; this.render(); }
      });
    });

    document.querySelectorAll<HTMLInputElement>('input[name="player"]').forEach((r) => {
      r.addEventListener('change', () => {
        if (r.checked) { this.player = r.value as Player; this.render(); }
      });
    });

    document.querySelectorAll<HTMLInputElement>('input[name="size"]').forEach((r) => {
      r.addEventListener('change', () => {
        if (r.checked) { this.size = r.value as Size; this.render(); }
      });
    });
  }

  // ── Gesamtes UI neu rendern ──
  private render(): void {
    this.renderPreview();
    this.renderPlayerDots();
    this.renderBottomBar();
    this.renderStartButton();
  }

  private renderPreview(): void {
    const cfg = THEME_CONFIG[this.theme ?? 'code'];
    this.previewContent.style.background = cfg.previewBg;
    this.cardFront.style.background      = cfg.cardFront;
    this.cardBack.style.background       = cfg.cardBack;
  }

  private renderPlayerDots(): void {
    const color = this.player ? PLAYER_COLORS[this.player] : PLAYER_COLORS.blue;
    this.playerIndicator.style.background = color;
    this.dotBlue.style.background   = this.player === 'orange' ? '#444' : PLAYER_COLORS.blue;
    this.dotOrange.style.background = this.player === 'orange' ? PLAYER_COLORS.orange : '#444';
  }

  private renderBottomBar(): void {
    this.barTheme.textContent  = this.theme  ? THEME_LABELS[this.theme]   : 'Game theme';
    this.barPlayer.textContent = this.player ? PLAYER_LABELS[this.player] : 'Player';
    this.barSize.textContent   = this.size   ? `${this.size} cards`       : 'Board size';

    this.barTheme.classList.toggle('is-active',  !!this.theme);
    this.barPlayer.classList.toggle('is-active', !!this.player);
    this.barSize.classList.toggle('is-active',   !!this.size);
  }

  private renderStartButton(): void {
    const isReady = !!this.theme && !!this.player && !!this.size;
    this.startBtn.disabled = !isReady;
    this.startBtn.classList.toggle('is-ready', isReady);
  }

  private handleStart(): void {
    if (!this.theme || !this.player || !this.size) return;
    this.onStart(this.theme, this.player, this.size);
  }

  // Einstellungen von außen abrufen
  public getSettings(): GameSettings | null {
    if (!this.theme || !this.player || !this.size) return null;
    return { theme: this.theme, player: this.player, size: this.size };
  }
}
