/**
 * Cage Logic — Design Tokens
 * Locked: 2026-05-22
 *
 * Source of truth for all colors, typography references, and spacing.
 * Every rebuilt screen imports from here. Do not define colors inline.
 *
 * Full rationale: docs/cage-logic-visual-constitution.md
 */

// ── Color system ──────────────────────────────────────────────────────────────

export const colors = {
  // Backgrounds
  void:       '#050505',   // Page background — true black
  steel:      '#111111',   // Main panel background
  gunmetal:   '#1E1E1E',   // Raised surface
  graphite:   '#23201C',   // Secondary surface, input fields

  // Brand accents — gold is ENERGY, not decoration
  brass:      '#C8943A',   // Primary accent — burnt brass
  gold:       '#E2A93B',   // Active highlight — molten gold
  glow:       '#FFB627',   // Glowing active energy — cage LEDs, pulses
  dirtygold:  '#A87A2A',   // Subdued accent, secondary labels

  // Typography
  offwhite:   '#F2EFE8',   // Primary text
  warmgray:   '#8E8577',   // Secondary text, metadata

  // Danger — use sparingly, never decoratively
  rust:       '#A43A2F',   // Warning / pain / failure
  orange:     '#D86B1D',   // Grit / intensity energy
  crimson:    '#7E1F18',   // High danger, injury active

  // Utility
  border:     'rgba(242,239,232,0.10)',  // Subtle borders
  borderHard: 'rgba(242,239,232,0.18)',  // Emphasized borders
  overlay:    'rgba(5,5,5,0.92)',         // Modal/overlay backgrounds
} as const;

// ── Semantic aliases (what the color MEANS in UI context) ─────────────────────

export const C = {
  // Surfaces
  bg:         colors.void,
  surface:    colors.steel,
  raised:     colors.gunmetal,
  sunk:       colors.graphite,

  // Accent
  amber:      colors.brass,       // Default accent
  amberBright: colors.gold,       // Active/highlighted state
  amberGlow:  colors.glow,        // Pulse / glow state
  amberLow:   'rgba(200,148,58,0.25)',  // Dim accent background/border ONLY — never use as text color (invisible)

  // Text
  text:       colors.offwhite,    // Primary
  mid:        'rgba(242,239,232,0.65)',  // Secondary
  dim:        'rgba(242,239,232,0.45)',  // Tertiary / helper
  dimmer:     'rgba(242,239,232,0.28)',  // Metadata / timestamps

  // Borders
  line:       colors.border,
  lineHard:   colors.borderHard,

  // Danger
  brick:      colors.rust,
  brickLow:   'rgba(164,58,47,0.20)',
  danger:     colors.crimson,
} as const;

// ── Typography ────────────────────────────────────────────────────────────────

export const fonts = {
  header:  'var(--font-anton)',      // Anton — hero headers
  label:   'var(--font-bebas)',      // Bebas Neue — UI labels, section heads
  body:    'var(--font-dm-mono)',    // DM Mono — data, body copy, metadata
} as const;

// Minimum font sizes (never go below these for content text)
export const fontSizes = {
  min:     10,   // Absolute minimum for readable content
  label:   11,   // Section labels
  body:    13,   // Body copy
  subhead: 15,   // Sub-headers
  head:    20,   // Section headers
  hero:    28,   // Page heroes
} as const;

// ── Spacing ───────────────────────────────────────────────────────────────────

export const spacing = {
  pagePad:   22,   // Horizontal page padding
  sectionGap: 24,  // Gap between sections
  cardPad:   16,   // Card internal padding
  tight:     10,   // Tight internal spacing
} as const;

// ── Image assets ──────────────────────────────────────────────────────────────

export const images = {
  // Belt progression
  beltWhite:   '/white-belt.png',
  beltBlue:    '/blue-belt.png',
  beltPurple:  '/purple-belt.png',
  beltBrown:   '/brown-belt.png',
  beltBlack1:  '/first-degree.png',
  beltBlack2:  '/second-degree.png',
  beltBlack3:  '/third-degree.png',
  beltBlack4:  '/fourth-degree.png',

  // Recovery
  recovery:    '/recovery.jpg',
  injury:      '/recovery-injury.jpg',

  // Mental
  mentalLoss:  '/mental-loss.jpg',
  mentalBRS:   '/mental-brs_bright.png',
  mentalDaily: '/mental-daily_bright.png',
  mentalBreath: '/mental-breath_bright.png',

  // Log
  logSession:  '/log-session_bright.jpg',
} as const;
