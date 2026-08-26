/**
 * KOPAR Design System Tokens
 * Source of truth for programmatic color, typography, and layout constants.
 */

export const THEME_COLORS = {
  coinbaseBlue: '#0052ff',
  interactiveBlue: '#578bfa',
  midnight: '#0a0b0d',
  pureWhite: '#ffffff',
  slate: '#5b616e',
  ash: '#8a919e',
  frost: '#f7f8f9',
  cloud: '#eef0f3',
  pewter: '#dedfe2',
  positiveGreen: '#27ad75',
  negativeRed: '#f0616d',
} as const;

export const THEME_RADII = {
  card: 'rounded-[24px]',
  innerCard: 'rounded-[16px]',
  input: 'rounded-[12px]',
  modal: 'rounded-[28px]',
  button: 'rounded-full',
  pill: 'rounded-full',
} as const;

export const THEME_FONTS = {
  display: 'font-display',
  sans: 'font-sans',
} as const;
