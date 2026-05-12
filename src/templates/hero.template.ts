/**
 * @file hero.template.ts
 * @description HTML template for the hero screen.
 */

/**
 * Returns the HTML of the hero screen as a string.
 *
 * @returns HTML string of the hero section.
 */
export function heroTemplate(): string {
  return `
  <section class="hero" id="hero">
    <div class="hero__content">
      <p class="hero__subtitle">It's play time.</p>
      <h1 class="hero__title">Ready to play?</h1>

      <button class="hero__btn" id="play-btn">
        <img src="/assets/stadia_controller.svg" alt="controller">
        <span>Play</span>
        <i data-lucide="arrow-right"></i>
      </button>
    </div>

    <img src="/assets/stadia_controller_background.svg" alt="" class="hero__bg-icon" aria-hidden="true">
  </section>
  `;
}
