export function gameTemplate(): string {
  return `
  <section class="game" id="game" style="display: none;">

    <!-- HUD -->
    <header class="game__hud">
      <div class="game__hud-scores">
        <div class="game__hud-player game__hud-player--blue" id="hud-player-blue">
          <img src="/assets/player_blue.png" alt="Blue player" class="game__hud-icon" id="hud-icon-blue">
          <span class="game__hud-name">Blue</span>
          <span class="game__hud-score" id="score-blue">0</span>
        </div>
        <div class="game__hud-player game__hud-player--orange" id="hud-player-orange">
          <img src="/assets/player_orange.png" alt="Orange player" class="game__hud-icon" id="hud-icon-orange">
          <span class="game__hud-name">Orange</span>
          <span class="game__hud-score" id="score-orange">0</span>
        </div>
      </div>

      <div class="game__hud-current">
        Current player:
        <img src="/assets/player_blue_code.png" alt="Current player" class="game__hud-current-icon" id="current-player-icon">
        <span class="game__hud-current-label" id="current-player-label"></span>
      </div>

      <button class="game__exit-btn" id="exit-game-btn" type="button">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Exit game
      </button>
    </header>

    <!-- Board -->
    <main class="game__board-wrap">
      <div class="game__board" id="game-board"></div>
    </main>

    <!-- Game End Overlay -->
    <div class="game__end-overlay" id="game-end-overlay" style="display: none;">
      <img src="/assets/themes/code_result/game_over.png" alt="Game over" class="game__end-gameover-img">
      <p class="game__end-score-title">Final score</p>
      <div class="game__end-scores">
        <div class="game__end-score-badge game__end-score-badge--blue">
          <img src="" alt="Blue player" class="game__end-score-icon" id="end-icon-blue">
          <span class="game__end-score-name">Blue</span>
          <span class="game__end-score-value" id="end-score-blue">0</span>
        </div>
        <div class="game__end-score-badge game__end-score-badge--orange">
          <img src="" alt="Orange player" class="game__end-score-icon" id="end-icon-orange">
          <span class="game__end-score-name">Orange</span>
          <span class="game__end-score-value" id="end-score-orange">0</span>
        </div>
      </div>
    </div>

    <!-- Winner Overlay -->
    <div class="game__winner-overlay" id="game-winner-overlay" style="display: none;">
      <div class="game__winner-content">
        <!-- Code theme: text name -->
        <p class="game__winner-name" id="winner-name"></p>
        <!-- Gaming theme: name image -->
        <img src="" alt="" class="game__winner-name-img" id="winner-name-img" style="display:none;">
        <!-- Icon (chess pawn für code / pockal für gaming) -->
        <img src="" alt="Winner" class="game__winner-icon" id="winner-icon">
        <button class="game__winner-btn" id="game-winner-back">Back to start</button>
      </div>
    </div>

    <!-- Draw Overlay -->
    <div class="game__draw-overlay" id="game-draw-overlay" style="display: none;">
      <div class="game__draw-content">
        <img src="/assets/themes/code_result/its_draw.png" alt="It's a draw" class="game__draw-title-img">
        <img src="/assets/themes/code_result/scale_icon.png" alt="Scale" class="game__draw-icon">
        <button class="game__draw-btn" id="game-draw-back">Back to start</button>
      </div>
    </div>

    <!-- Exit Game Overlay -->
    <div class="game__exit-overlay" id="game-exit-overlay" style="display: none;">
      <div class="game__exit-card">
        <p class="game__exit-message">Are you sure you want to quit the game?</p>
        <div class="game__exit-actions">
          <button class="game__exit-btn game__exit-btn--primary" id="game-exit-back">No, back to game</button>
          <button class="game__exit-btn game__exit-btn--secondary" id="game-exit-confirm">Yes, quit game</button>
        </div>
      </div>
    </div>

  </section>
  `;
}
