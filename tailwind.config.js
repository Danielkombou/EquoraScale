/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./**/*.{tsx,ts,jsx,js}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'label': ['10px', { lineHeight: '1.2' }],
        'caption': ['11px', { lineHeight: '1.3' }],
        'body': ['14px', { lineHeight: '1.5' }],
        'body-md': ['15px', { lineHeight: '1.6' }],
        'title-sm': ['20px', { lineHeight: '1.3' }],
        'title-md': ['24px', { lineHeight: '1.25' }],
        'title-lg': ['30px', { lineHeight: '1.2' }],
      },
      spacing: {
        'gutter': '1rem',   // p-4
        'card': '1.5rem',   // p-6
        'panel': '2rem',    // p-8
      },
      borderRadius: {
        'soft': '0.75rem',  // rounded-xl
        'panel': '1rem',    // rounded-2xl
        'card': '1.5rem',   // rounded-3xl
      },
      colors: {
        ui: {
          surface: '#ffffff',
          surfaceMuted: '#f8fafc',
          border: '#e2e8f0',
          text: '#0f172a',
          textMuted: '#64748b',
          darkSurface: '#0f172a',
          darkSurfaceMuted: '#111827',
          darkBorder: '#1f2937',
          darkText: '#f8fafc',
          darkTextMuted: '#94a3b8',
          brand: '#4f46e5',
        },
      },
    },
  },
  plugins: [],
}
