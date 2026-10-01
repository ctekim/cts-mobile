// src/common/theme.ts

export interface AppColors {
  background: string;
  surface: string;
  surfaceAlt: string;
  surfacePressed: string;

  text: string;
  textMuted: string;

  headerBg: string;
  headerText: string;
  headerBorder: string;

  cellBorder: string;
  codeColumnBorder: string;

  codeText: string;
  codeTextSuspended: string;

  positive: string;
  negative: string;
  neutral: string;
  accent: string;
  danger: string;
}

export const DarkTheme: AppColors = {
  background: '#121212',
  surface: '#141414',
  surfaceAlt: '#1e1e1e',
  surfacePressed: '#2a3a4a',

  text: '#ffffff',
  textMuted: '#999999',

  headerBg: '#0a0a0a',
  headerText: '#ffffff',
  headerBorder: '#333333',

  cellBorder: '#2a2a2a',
  codeColumnBorder: '#444444',

  codeText: '#5DC9E2',
  codeTextSuspended: '#ff4c4c',

  positive: '#00d26a',
  negative: '#ff4c4c',
  neutral: '#888888',
  accent: '#208AEF',
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

  codeText: '#0070a0',
  codeTextSuspended: '#c00',

  positive: '#0a7',
  negative: '#c00',
  neutral: '#666666',
  accent: '#208AEF',
  danger: '#900',
};