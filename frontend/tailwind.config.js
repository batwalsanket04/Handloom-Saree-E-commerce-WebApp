/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
      },
      spacing: {
        'section': '4rem',      // 64px - section vertical padding
        'container': '1.5rem',  // 24px - container horizontal padding
        'card': '1.5rem',       // 24px - card padding
        'element': '1rem',      // 16px - element gap
      },
      container: {
        center: true,
        padding: '1.5rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1400px',
        }
      },
      fontSize: {
        'heading-1': ['3.5rem', { lineHeight: '1.1', fontWeight: '700' }],    // 56px
        'heading-2': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],    // 40px
        'heading-3': ['2rem', { lineHeight: '1.3', fontWeight: '600' }],       // 32px
        'heading-4': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],     // 24px
        'heading-5': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],    // 20px
        'heading-6': ['1rem', { lineHeight: '1.5', fontWeight: '600' }],       // 16px
        'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],     // 18px
        'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],            // 16px
        'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],     // 14px
        'caption': ['0.75rem', { lineHeight: '1.5', fontWeight: '400' }],      // 12px
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'modal': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'dropdown': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      },
      borderRadius: {
        'card': '1rem',        // 16px
        'button': '9999px',    // full rounded
        'input': '0.75rem',    // 12px
      },
      transitionDuration: {
        'fast': '150ms',
        'normal': '200ms',
        'slow': '300ms',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}