/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        orange: {
          primary: 'var(--color-orange-primary)',
          hover: 'var(--color-orange-hover)',
          light: 'var(--color-orange-light)',
          dark: 'var(--color-orange-dark)',
        },
        bg: {
          primary: 'var(--color-bg-primary)',
          secondary: 'var(--color-bg-secondary)',
          tertiary: 'var(--color-bg-tertiary)',
          card: 'var(--color-bg-card)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
          disabled: 'var(--color-text-disabled)',
        },
        border: {
          primary: 'var(--color-border-primary)',
          secondary: 'var(--color-border-secondary)',
          hover: 'var(--color-border-hover)',
        },
      },
      borderRadius: {
        token: 'var(--radius-md)',
        'token-lg': 'var(--radius-lg)',
        'token-xl': 'var(--radius-xl)',
        'token-2xl': 'var(--radius-2xl)',
      },
      zIndex: {
        dropdown: 'var(--z-dropdown)',
        sticky: 'var(--z-sticky)',
        fixed: 'var(--z-fixed)',
        'modal-backdrop': 'var(--z-modal-backdrop)',
        modal: 'var(--z-modal)',
        popover: 'var(--z-popover)',
        tooltip: 'var(--z-tooltip)',
      },
      transitionDuration: {
        'token-fast': 'var(--transition-fast)ms',
        'token-base': 'var(--transition-base)ms',
        'token-slow': 'var(--transition-slow)ms',
      },
    },
  },
  plugins: [],
};
