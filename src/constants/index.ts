export const COLORS = {
  primary: '#1A1A2E',
  secondary: '#16213E',
  accent: '#0F3460',
  highlight: '#E94560',
  safe: '#00B894',
  warning: '#FDCB6E',
  danger: '#D63031',
  critical: '#6C5CE7',
  text: {
    primary: '#FFFFFF',
    secondary: '#A0AEC0',
    muted: '#718096',
  },
  background: {
    dark: '#0D0D1A',
    card: '#1A1A2E',
    elevated: '#16213E',
  },
  border: '#2D3748',
} as const;

export const RISK_COLORS: Record<string, string> = {
  safe: COLORS.safe,
  low: '#55EFC4',
  medium: COLORS.warning,
  high: '#E17055',
  critical: COLORS.danger,
};

export const SENSITIVE_DATA_PATTERNS = {
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  phone: /(\+48|0048)?\s?([0-9]{3}[\s-]?[0-9]{3}[\s-]?[0-9]{3})/g,
  pesel: /\b\d{2}[0-1]\d[0-3]\d{8}\b/g,
  credit_card: /\b(?:\d{4}[\s-]?){3}\d{4}\b/g,
  bank_account: /\bPL\d{2}[\s]?(\d{4}[\s]?){6}\b/gi,
  id_number: /\b[A-Z]{3}\d{6}\b/g,
  passport: /\b[A-Z]{2}\d{7}\b/g,
};

export const PHISHING_KEYWORDS = [
  'kliknij natychmiast',
  'twoje konto zostanie zablokowane',
  'zweryfikuj swoje dane',
  'podaj hasło',
  'pilne działanie wymagane',
  'wygrałeś',
  'nagroda czeka',
  'potwierdź tożsamość',
  'aktualizuj dane bankowe',
  'link wygasa',
  'urgent action required',
  'verify your account',
  'click immediately',
  'your account will be suspended',
  'confirm your password',
];

export const APP_NAME = 'SecureAI Guard';
export const APP_VERSION = '1.0.0';
