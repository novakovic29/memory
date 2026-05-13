/**
 * @file settings.ts
 * @description Types, configuration and controller for the settings screen.
 */

/** Available game themes. */
export type Theme  = 'code' | 'gaming';

/** Available player colours. */
export type Player = 'blue' | 'orange';

/** Available board sizes (number of cards). */
export type Size   = '16' | '24' | '36';

/**
 * All game settings selected by the user.
 */
export interface GameSettings {
  theme:  Theme;
  player: Player;
  size:   Size;
}

/**
 * Visual configuration object used to render the theme preview.
 */
interface ThemeConfig {
  previewBg:  string;
  cardFront:  string;
  cardBack:   string;
  previewImg: string;
}

/** Preview configuration per theme. */
const THEME_CONFIG: Record<Theme, ThemeConfig> = {
  code: {
    previewBg:  '#1e2a1e',
    cardFront:  '#26a69a',
    cardBack:   '#f5f5f0',
    previewImg: './assets/themes/preview_code.svg',
  },
  gaming: {
    previewBg:  '#1a1a2e',
    cardFront:  '#e91e8c',
    cardBack:   '#f5f5f0',
    previewImg: './assets/themes/preview_gaming.svg',
  },
};

/** Display colours per player. */
const PLAYER_COLORS: Record<Player, string> = {
  blue:   '#4fc3f7',
  orange: '#ff9800',
};

/** Display labels per player used in the bottom bar. */
const PLAYER_LABELS: Record<Player, string> = {
  blue:   'Blue',
  orange: 'Orange',
};

/** Display labels per theme used in the bottom bar. */
const THEME_LABELS: Record<Theme, string> = {
  code:   'Code vibes',
  gaming: 'Gaming',
};

/**
 * Controls the settings screen: radio groups, theme preview,
 * bottom bar and the start button.
 */
export class SettingsController {
  /** Currently selected theme. */
  private theme:  Theme  | null = null;

  /** Currently selected player colour. */
  private player: Player | null = null;

  /** Currently selected board size. */
  private size:   Size   | null = null;

  /** Callback invoked when the user clicks Start. */
  private onStart: (theme: string, player: string, size: string) => void;

  private previewImg  = document.getElementById('preview-img')           as HTMLImageElement;
  private previewWrap = document.querySelector('.settings__preview-wrap') as HTMLDivElement;
  private barTheme    = document.getElementById('bar-theme')!;
  private barPlayer   = document.getElementById('bar-player')!;
  private barSize     = document.getElementById('bar-size')!;
  private barLine1    = document.getElementById('bar-line-1')             as HTMLImageElement;
  private barLine2    = document.getElementById('bar-line-2')             as HTMLImageElement;
  private startBtn    = document.getElementById('start-btn')              as HTMLButtonElement;
  private startIcon   = document.getElementById('start-btn-icon')         as HTMLImageElement;

  /**
   * @param onStart - Called with theme, player and size when the user starts the game.
   */
  constructor(onStart: (theme: string, player: string, size: string) => void) {
    this.onStart = onStart;
    this.bindRadios();
    this.bindHover();
    this.startBtn?.addEventListener('click', () => this.handleStart());
    this.startBtn?.addEventListener('mouseenter', () => {
      if (this.startBtn.classList.contains('is-ready')) {
        this.startIcon.src = './assets/btn_play_hover.png';
      }
    });
    this.startBtn?.addEventListener('mouseleave', () => {
      if (this.startBtn.classList.contains('is-ready')) {
        this.startIcon.src = './assets/btn_play.png';
      }
    });
    this.render();
  }

  /**
   * Registers change listeners on all radio groups (theme, player, size).
   */
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

  /**
   * Registers hover listeners on theme labels for the live preview.
   * Restores the selected theme preview on mouse leave.
   */
  private bindHover(): void {
    document.querySelectorAll<HTMLInputElement>('input[name="theme"]').forEach((input) => {
      const label = input.parentElement as HTMLLabelElement;
      label.addEventListener('mouseenter', () => this.renderPreview(input.value as Theme));
      label.addEventListener('mouseleave', () => this.renderPreview());
    });
  }

  /** Re-renders the entire settings UI. */
  private render(): void {
    this.renderPreview();
    this.renderBottomBar();
    this.renderStartButton();
  }

  /**
   * Updates the preview image to the given or currently selected theme.
   *
   * @param overrideTheme - Optional theme to display instead of the selected one.
   */
  private renderPreview(overrideTheme?: Theme): void {
    const themeToUse = overrideTheme ?? this.theme ?? 'code';
    this.previewImg.src = THEME_CONFIG[themeToUse].previewImg;
  }

  /** Updates the bottom bar to reflect the current selections. */
  private renderBottomBar(): void {
    this.barTheme.textContent  = this.theme  ? THEME_LABELS[this.theme]   : 'Game theme';
    this.barPlayer.textContent = this.player ? PLAYER_LABELS[this.player] : 'Player';
    this.barSize.textContent   = this.size   ? `${this.size} cards`       : 'Board size';

    this.barTheme.classList.toggle('is-active',  !!this.theme);
    this.barPlayer.classList.toggle('is-active', !!this.player);
    this.barSize.classList.toggle('is-active',   !!this.size);
    this.previewWrap?.classList.toggle('is-code-theme',   this.theme === 'code');
    this.previewWrap?.classList.toggle('is-gaming-theme', this.theme === 'gaming');

    this.barLine1.style.display = 'inline';
    this.barLine2.style.display = 'inline';

    this.barTheme.parentElement!.className = 'settings__bottom-bar';
  }

  /** Enables or disables the start button based on selection completeness. */
  private renderStartButton(): void {
    const isReady = !!this.theme && !!this.player && !!this.size;
    this.startBtn.disabled = !isReady;
    this.startBtn.classList.toggle('is-ready', isReady);
    this.startIcon.src = isReady ? './assets/btn_play.png' : './assets/btn_disabled.png';
  }

  /** Fires the start callback if all settings are selected. */
  private handleStart(): void {
    if (!this.theme || !this.player || !this.size) return;
    this.onStart(this.theme, this.player, this.size);
  }

  /** Resets all selections and re-renders the initial state. */
  public reset(): void {
    this.theme  = null;
    this.player = null;
    this.size   = null;

    document.querySelectorAll<HTMLInputElement>('input[name="theme"]').forEach((r)  => r.checked = false);
    document.querySelectorAll<HTMLInputElement>('input[name="player"]').forEach((r) => r.checked = false);
    document.querySelectorAll<HTMLInputElement>('input[name="size"]').forEach((r)   => r.checked = false);

    this.render();
  }

  /**
   * Returns the currently selected settings.
   *
   * @returns The selected settings, or `null` if not all options have been chosen.
   */
  public getSettings(): GameSettings | null {
    if (!this.theme || !this.player || !this.size) return null;
    return { theme: this.theme, player: this.player, size: this.size };
  }
}
