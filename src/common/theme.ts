// src/common/theme.ts

export interface AppColors {
  // Surfaces
  background: string;        // main screen background
  surface: string;           // rows, cards
  surfaceAlt: string;        // zebra rows
  surfacePressed: string;    // row pressed state

  // Text
  text: string;              // primary
  textMuted: string;         // labels, secondary

  // Header
  headerBg: string;
  headerText: string;
  headerBorder: string;

  // Grid lines
  cellBorder: string;
  codeColumnBorder: string;

  // Semantic
  positive: string;          // up / green
  negative: string;          // down / red
  neutral: string;           // no change
  accent: string;            // primary buttons (login, etc.)
  danger: string;            // logout button, errors
}

export const DarkTheme: AppColors = {
  background: '#121212',
  surface: '#1a1a1a',
  surfaceAlt: '#1f1f1f',
  surfacePressed: '#2a3a4a',

  text: '#ffffff',
  textMuted: '#999999',

  headerBg: '#0a0a0a',
  headerText: '#ffffff',
  headerBorder: '#333333',

  cellBorder: '#2a2a2a',
  codeColumnBorder: '#444444',

  positive: '#00d26a',
  negative: '#ff4c4c',
  neutral: '#888888',
  accent: '#208AEF',        // matches your app.json splash color
  danger: '#a00',
};

export const LightTheme: AppColors = {
  background: '#ffffff',
  surface: '#ffffff',
  surfaceAlt: '#f7f7f7',
  surfacePressed: '#e6f2ff',

  text: '#000000',
  textMuted: '#666666',

  headerBg: '#222222',
  headerText: '#ffffff',
  headerBorder: '#555555',

  cellBorder: '#e5e5e5',
  codeColumnBorder: '#888888',

  positive: '#0a7',
  negative: '#c00',
  neutral: '#666666',
  accent: '#208AEF',
  danger: '#900',
};