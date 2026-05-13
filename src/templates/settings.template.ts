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
      <h2 class="settings__title">Settings</h2>
      <div class="settings__underline"></div>
    </div>

    <div class="settings__layout">

      <!-- LEFT: Options -->
      <div class="settings__options">

        <section class="settings__section">
          <h3 class="settings__section-title">
            <img src="./assets/palette.png" alt="" class="settings__section-icon" aria-hidden="true">
            Game themes
          </h3>
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
          <h3 class="settings__section-title">
            <img src="./assets/chess_pawn.png" alt="" class="settings__section-icon" aria-hidden="true">
            Choose player
          </h3>
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
          <h3 class="settings__section-title">
            <img src="./assets/style.png" alt="" class="settings__section-icon" aria-hidden="true">
            Board size
          </h3>
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
          <img src="./assets/line.png" alt="" class="settings__bar-line" id="bar-line-1">
          <span class="settings__bar-item" id="bar-player">Player</span>
          <img src="./assets/line.png" alt="" class="settings__bar-line" id="bar-line-2">
          <span class="settings__bar-item" id="bar-size">Board size</span>
          <button class="settings__start-btn" id="start-btn" type="button">
            <img src="./assets/btn_disabled.png" alt="" class="settings__start-icon" id="start-btn-icon" aria-hidden="true">
            <span class="settings__start-label">Start</span>
          </button>
        </div>

      </div>
    </div>
  </section>
  `;
}
