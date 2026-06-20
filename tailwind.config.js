/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1f2c22',
          container: '#dfe9df',
          'on-container': '#1f2c22',
          fixed: '#f7f2e8',
          'fixed-dim': '#d9dfd6',
          'on-fixed': '#1f2c22',
          'on-fixed-variant': '#5f6e62',
        },
        secondary: {
          DEFAULT: '#0f5b46',
          container: '#d9efe7',
          'on-container': '#0f5b46',
          fixed: '#0f5b46',
          'fixed-dim': '#1c6b55',
          'on-fixed': '#ffffff',
          'on-fixed-variant': '#0f5b46',
        },
        tertiary: {
          DEFAULT: '#c49a3a',
          container: '#f5e8c7',
          'on-container': '#1f2c22',
          fixed: '#f5e8c7',
          'fixed-dim': '#e4c77d',
          'on-fixed': '#1f2c22',
          'on-fixed-variant': '#c49a3a',
        },
        error: {
          DEFAULT: '#ba1a1a', // Red
          container: '#ffdad6',
          'on-container': '#93000a',
        },
        background: '#f7f2e8',
        'on-background': '#1f2c22',
        surface: {
          DEFAULT: '#fffdf8',
          dim: '#f1eadc',
          bright: '#fffdf8',
          'container-lowest': '#fffdf8',
          'container-low': '#fbf7ef',
          container: '#f7f2e8',
          'container-high': '#f4efe4',
          'container-highest': '#efe8d9',
          variant: '#e8dfcb',
        },
        'on-surface': '#1f2c22',
        'on-surface-variant': '#5f6e62',
        outline: 'rgba(31, 44, 34, 0.14)',
        'outline-variant': 'rgba(31, 44, 34, 0.08)',
      },
      borderRadius: {
        'sm': '0.25rem', // 4px
        'DEFAULT': '0.5rem', // 8px
        'md': '0.75rem', // 12px
        'lg': '1rem', // 16px
        'xl': '1.5rem', // 24px
      },
      spacing: {
        'margin-mobile': '20px',
        'margin-desktop': '40px',
        'gutter': '16px',
        'stack-sm': '8px',
        'stack-md': '16px',
        'stack-lg': '24px',
        'section-gap': '40px',
      },
      fontFamily: {
        arabic: ['IBM Plex Sans Arabic', 'sans-serif'],
        sans: ['IBM Plex Sans Arabic', 'IBM Plex Sans', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
