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
  previewImg: string;
}

// ─────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────
const THEME_CONFIG: Record<Theme, ThemeConfig> = {
  code: {
    previewBg: '#1e2a1e',
    cardFront: '#26a69a',
    cardBack:  '#f5f5f0',
    previewImg:  '/assets/themes/preview_code.svg',
  },
  gaming: {
    previewBg: '#1a1a2e',
    cardFront: '#e91e8c',
    cardBack:  '#f5f5f0',
    previewImg:  '/assets/themes/preview_gaming.svg'
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
  
  private previewImg = document.getElementById('preview-img') as HTMLImageElement;
  
  
  
  private barTheme        = document.getElementById('bar-theme')!;
  private barPlayer       = document.getElementById('bar-player')!;
  private barSize         = document.getElementById('bar-size')!;
  private barLine1         = document.getElementById('bar-line-1') as HTMLImageElement;
  private barLine2         = document.getElementById('bar-line-2') as HTMLImageElement;
  private btnDisabled     = document.getElementById('btn-disabled') as HTMLImageElement;
  private btnPlay         = document.getElementById('btn-play') as HTMLImageElement;
  private startBtn        = document.getElementById('start-btn') as HTMLButtonElement;

  constructor(onStart: (theme: string, player: string, size: string) => void) {
    this.onStart = onStart;
    this.bindRadios();
    this.bindHover();
    this.startBtn?.addEventListener('click', () => this.handleStart());
    this.btnDisabled?.addEventListener('click', () => this.handleStart());
    this.btnPlay?.addEventListener('click', () => this.handleStart());
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

  // ── Hover für Theme-Preview ──
  private bindHover(): void {
    document.querySelectorAll<HTMLInputElement>('input[name="theme"]').forEach((input) => {
      const label = input.parentElement as HTMLLabelElement;
      label.addEventListener('mouseenter', () => {
        const hoveredTheme = input.value as Theme;
        this.renderPreview(hoveredTheme);
      });
      label.addEventListener('mouseleave', () => {
        this.renderPreview();
      });
    });
  }

  // ── Gesamtes UI neu rendern ──
 private render(): void {
  this.renderPreview();
  this.renderBottomBar();
  this.renderStartButton();
}

private renderPreview(overrideTheme?: Theme): void {
  const themeToUse = overrideTheme ?? this.theme ?? 'code';
  const cfg = THEME_CONFIG[themeToUse];
  this.previewImg.src = cfg.previewImg;
}

  private renderBottomBar(): void {
    this.barTheme.textContent  = this.theme  ? THEME_LABELS[this.theme]   : 'Game theme';
    this.barPlayer.textContent = this.player ? PLAYER_LABELS[this.player] : 'Player';
    this.barSize.textContent   = this.size   ? `${this.size} cards`       : 'Board size';

    this.barTheme.classList.toggle('is-active',  !!this.theme);
    this.barPlayer.classList.toggle('is-active', !!this.player);
    this.barSize.classList.toggle('is-active',   !!this.size);
    this.barTheme.classList.toggle('is-code-theme', this.theme === 'code');

    // Show/hide line images based on selections
    this.barLine1.style.display = this.theme ? 'inline' : 'none';
    this.barLine2.style.display = this.player ? 'inline' : 'none';

    // Theme-based separator styling (removed since we're using images now)
    const bottomBar = this.barTheme.parentElement!;
    bottomBar.className = 'settings__bottom-bar';
  }

  private renderStartButton(): void {
    const isReady = !!this.theme && !!this.player && !!this.size;
    this.startBtn.disabled = !isReady;
    this.startBtn.classList.toggle('is-ready', isReady);
    this.btnDisabled.style.display = isReady ? 'none' : 'inline-block';
    this.btnPlay.style.display     = isReady ? 'inline-block' : 'none';
  }

  private handleStart(): void {
    if (!this.theme || !this.player || !this.size) return;
    this.onStart(this.theme, this.player, this.size);
  }

  public reset(): void {
    this.theme = null;
    this.player = null;
    this.size = null;

    document.querySelectorAll<HTMLInputElement>('input[name="theme"]').forEach((r) => r.checked = false);
    document.querySelectorAll<HTMLInputElement>('input[name="player"]').forEach((r) => r.checked = false);
    document.querySelectorAll<HTMLInputElement>('input[name="size"]').forEach((r) => r.checked = false);

    this.render();
  }

  // Einstellungen von außen abrufen
  public getSettings(): GameSettings | null {
    if (!this.theme || !this.player || !this.size) return null;
    return { theme: this.theme, player: this.player, size: this.size };
  }
}
