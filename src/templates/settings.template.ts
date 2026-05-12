/**
 * @file settings.template.ts
 * @description HTML template for the settings screen.
 */

/**
 * Returns the HTML of the settings screen as a string.
 *
 * @returns HTML string of the settings section.
 */
export function settingsTemplate(): string {
  return `
  <section class="settings" id="settings" style="display: none;">
    <div class="settings__header">
      <h1 class="settings__title">Settings</h1>
      <div class="settings__underline"></div>
    </div>

    <div class="settings__layout">

      <!-- LEFT: Options -->
      <div class="settings__options">

        <section class="settings__section">
          <h2 class="settings__section-title">
            <img src="./assets/palette.png" alt="" class="settings__section-icon" aria-hidden="true">
            Game themes
          </h2>
          <div class="settings__radio-group">
            <label class="settings__radio-option">
              <input type="radio" name="theme" value="code" />
              <span class="settings__radio-circle"></span>
              <span class="settings__radio-label">Code vibes theme</span>
              <img src="./assets/selected_option.png" alt="" class="settings__selected-icon" aria-hidden="true">
            </label>
            <label class="settings__radio-option">
              <input type="radio" name="theme" value="gaming" />
              <span class="settings__radio-circle"></span>
              <span class="settings__radio-label">Gaming theme</span>
              <img src="./assets/selected_option.png" alt="" class="settings__selected-icon" aria-hidden="true">
            </label>
          </div>
        </section>

        <section class="settings__section">
          <h2 class="settings__section-title">
            <img src="./assets/chess_pawn.png" alt="" class="settings__section-icon" aria-hidden="true">
            Choose player
          </h2>
          <div class="settings__radio-group">
            <label class="settings__radio-option">
              <input type="radio" name="player" value="blue" />
              <span class="settings__radio-circle"></span>
              <span class="settings__radio-label">Blue</span>
              <img src="./assets/selected_option.png" alt="" class="settings__selected-icon" aria-hidden="true">
            </label>
            <label class="settings__radio-option">
              <input type="radio" name="player" value="orange" />
              <span class="settings__radio-circle"></span>
              <span class="settings__radio-label">Orange</span>
              <img src="./assets/selected_option.png" alt="" class="settings__selected-icon" aria-hidden="true">
            </label>
          </div>
        </section>

        <section class="settings__section">
          <h2 class="settings__section-title">
            <img src="./assets/style.png" alt="" class="settings__section-icon" aria-hidden="true">
            Board size
          </h2>
          <div class="settings__radio-group">
            <label class="settings__radio-option">
              <input type="radio" name="size" value="16" />
              <span class="settings__radio-circle"></span>
              <span class="settings__radio-label">16 cards</span>
              <img src="./assets/selected_option.png" alt="" class="settings__selected-icon" aria-hidden="true">
            </label>
            <label class="settings__radio-option">
              <input type="radio" name="size" value="24" />
              <span class="settings__radio-circle"></span>
              <span class="settings__radio-label">24 cards</span>
              <img src="./assets/selected_option.png" alt="" class="settings__selected-icon" aria-hidden="true">
            </label>
            <label class="settings__radio-option">
              <input type="radio" name="size" value="36" />
              <span class="settings__radio-circle"></span>
              <span class="settings__radio-label">36 cards</span>
              <img src="./assets/selected_option.png" alt="" class="settings__selected-icon" aria-hidden="true">
            </label>
          </div>
        </section>

      </div>

      <!-- RIGHT: Preview -->
      <div class="settings__preview-wrap">

        <img
          src="./assets/themes/preview_code.svg"
          alt="Theme preview"
          class="settings__preview-img"
          id="preview-img"
        >

        <!-- Bottom bar -->
        <div class="settings__bottom-bar">
          <span class="settings__bar-item" id="bar-theme">Game theme</span>
          <img src="./assets/line.png" alt="" class="settings__bar-line" id="bar-line-1" style="display: none;">
          <span class="settings__bar-item" id="bar-player">Player</span>
          <img src="./assets/line.png" alt="" class="settings__bar-line" id="bar-line-2" style="display: none;">
          <span class="settings__bar-item" id="bar-size">Board size</span>
          <button class="settings__start-btn" id="start-btn" type="button" disabled style="display:none;">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <polygon points="5,3 19,12 5,21"/>
            </svg>
            Start
          </button>
          <img src="./assets/btn_disabled.png" alt="Disabled play button" class="settings__start-img settings__start-img--disabled" id="btn-disabled">
          <img src="./assets/btn_play.png" alt="Play button" class="settings__start-img settings__start-img--play" id="btn-play" style="display:none;">
        </div>

      </div>
    </div>
  </section>
  `;
}
