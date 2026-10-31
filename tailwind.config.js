/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: 'rgb(var(--c-surface) / <alpha-value>)',
          dim: 'rgb(var(--c-surface-dim) / <alpha-value>)',
          bright: 'rgb(var(--c-surface-bright) / <alpha-value>)',
          'container-lowest': 'rgb(var(--c-surface-container-lowest) / <alpha-value>)',
          'container-low': 'rgb(var(--c-surface-container-low) / <alpha-value>)',
          container: 'rgb(var(--c-surface-container) / <alpha-value>)',
          'container-high': 'rgb(var(--c-surface-container-high) / <alpha-value>)',
          'container-highest': 'rgb(var(--c-surface-container-highest) / <alpha-value>)',
        },
        'on-surface': {
          DEFAULT: 'rgb(var(--c-on-surface) / <alpha-value>)',
          variant: 'rgb(var(--c-on-surface-variant) / <alpha-value>)',
        },
        outline: {
          DEFAULT: 'rgb(var(--c-outline) / <alpha-value>)',
          variant: 'rgb(var(--c-outline-variant) / <alpha-value>)',
        },
        primary: {
          DEFAULT: 'rgb(var(--c-primary) / <alpha-value>)',
          container: 'rgb(var(--c-primary-container) / <alpha-value>)',
        },
        'on-primary': 'rgb(var(--c-on-primary) / <alpha-value>)',
        secondary: {
          DEFAULT: 'rgb(var(--c-secondary) / <alpha-value>)',
          container: 'rgb(var(--c-secondary-container) / <alpha-value>)',
          fixed: 'rgb(var(--c-secondary-fixed) / <alpha-value>)',
        },
        tertiary: {
          DEFAULT: 'rgb(var(--c-tertiary) / <alpha-value>)',
          container: 'rgb(var(--c-tertiary-container) / <alpha-value>)',
        },
        'on-tertiary': 'rgb(var(--c-on-tertiary) / <alpha-value>)',
        error: {
          DEFAULT: 'rgb(var(--c-error) / <alpha-value>)',
          container: 'rgb(var(--c-error-container) / <alpha-value>)',
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['48px', { lineHeight: '56px', letterSpacing: '-0.03em', fontWeight: '700' }],
        'display-lg-mobile': ['36px', { lineHeight: '44px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'metric-display': ['40px', { lineHeight: '44px', letterSpacing: '-0.04em', fontWeight: '700' }],
        'headline-lg': ['32px', { lineHeight: '40px', letterSpacing: '-0.02em', fontWeight: '600' }],
        'headline-lg-mobile': ['26px', { lineHeight: '32px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-md': ['22px', { lineHeight: '28px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-sm': ['18px', { lineHeight: '24px', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'body-sm': ['12px', { lineHeight: '16px', fontWeight: '400' }],
        'label-lg': ['14px', { lineHeight: '20px', letterSpacing: '0.01em', fontWeight: '600' }],
        'label-md': ['12px', { lineHeight: '16px', letterSpacing: '0.02em', fontWeight: '500' }],
        'label-sm': ['10px', { lineHeight: '12px', letterSpacing: '0.06em', fontWeight: '600' }],
      },
      spacing: {
        'space-xs': '0.25rem',
        'space-sm': '0.5rem',
        'space-md': '1rem',
        'space-lg': '1.5rem',
        'space-xl': '2.5rem',
        gutter: '1rem',
        'gutter-md': '1.5rem',
        'gutter-lg': '2rem',
        margin: '1rem',
        'margin-md': '2rem',
        'margin-lg': '3rem',
      },
    },
  },
  plugins: [],
};
