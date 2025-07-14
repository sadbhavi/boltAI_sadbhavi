/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f6f8f4',
          100: '#e9f0e4',
          200: '#d4e1cb',
          300: '#b2c9a4',
          400: '#8aab77',
          500: '#6a8f54',
          600: '#2d5016',
          700: '#426943',
          800: '#365537',
          900: '#2d472e',
        },
        sage: {
          50: '#f7f8f5',
          100: '#eef1e8',
          200: '#dde3d3',
          300: '#c4cfb4',
          400: '#9caf88',
          500: '#7a9268',
          600: '#5f7250',
          700: '#4c5a41',
          800: '#3f4936',
          900: '#363e2f',
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
};