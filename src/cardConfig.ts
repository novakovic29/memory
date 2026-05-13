/**
 * @file cardConfig.ts
 * @description SVG asset configuration for all available game themes.
 */

import type { Theme } from './settings';

/**
 * Card front-face assets grouped by theme.
 * Each entry represents one card pair.
 * At least `boardSize / 2` entries must be present per theme.
 */
export const CARD_ASSETS: Record<Theme, string[]> = {
  code: [
    './assets/themes/code/code_01.svg',
    './assets/themes/code/code_02.svg',
    './assets/themes/code/code_03.svg',
    './assets/themes/code/code_04.svg',
    './assets/themes/code/code_05.svg',
    './assets/themes/code/code_06.svg',
    './assets/themes/code/code_07.svg',
    './assets/themes/code/code_08.svg',
    './assets/themes/code/code_09.svg',
    './assets/themes/code/code_10.svg',
    './assets/themes/code/code_11.svg',
    './assets/themes/code/code_12.svg',
    './assets/themes/code/code_13.svg',
    './assets/themes/code/code_14.svg',
    './assets/themes/code/code_15.svg',
    './assets/themes/code/code_16.svg',
    './assets/themes/code/code_17.svg',
    './assets/themes/code/code_18.svg',
  ],
  gaming: [
    './assets/themes/gaming/gaming_01.svg',
    './assets/themes/gaming/gaming_02.svg',
    './assets/themes/gaming/gaming_03.svg',
    './assets/themes/gaming/gaming_04.svg',
    './assets/themes/gaming/gaming_05.svg',
    './assets/themes/gaming/gaming_06.svg',
    './assets/themes/gaming/gaming_07.svg',
    './assets/themes/gaming/gaming_08.svg',
    './assets/themes/gaming/gaming_09.svg',
    './assets/themes/gaming/gaming_10.svg',
    './assets/themes/gaming/gaming_11.svg',
    './assets/themes/gaming/gaming_12.svg',
    './assets/themes/gaming/gaming_13.svg',
    './assets/themes/gaming/gaming_14.svg',
    './assets/themes/gaming/gaming_15.svg',
    './assets/themes/gaming/gaming_16.svg',
    './assets/themes/gaming/gaming_17.svg',
    './assets/themes/gaming/gaming_18.svg',
  ],
};

/**
 * Card back-face asset path per theme.
 */
export const CARD_BACK: Record<Theme, string> = {
  code:   './assets/themes/code/card_back.svg',
  gaming: './assets/themes/gaming/card_back.svg',
};
