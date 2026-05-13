/**
 * @file card.template.ts
 * @description HTML template for a single memory card.
 */

/**
 * Returns the inner HTML for a memory card element.
 *
 * @param frontSrc - Path to the card's front-face image.
 * @param backSrc  - Path to the card's back-face image.
 * @returns HTML string for the card's inner structure.
 */
export function cardTemplate(frontSrc: string, backSrc: string): string {
  return `
    <div class="memory-card__inner">
      <div class="memory-card__front">
        <img src="${frontSrc}" alt="card" draggable="false" />
      </div>
      <div class="memory-card__back">
        <img src="${backSrc}" alt="back" draggable="false" />
      </div>
    </div>
  `;
}
