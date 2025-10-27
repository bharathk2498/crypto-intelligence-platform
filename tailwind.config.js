const config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#0A0E17',
          secondary: '#12161F',
          tertiary: '#1A1F2E',
        },
        surface: {
          default: '#1E2433',
          elevated: '#252B3D',
          hover: '#2C3447',
        },
        border: {
          subtle: '#2A3142',
          default: '#3A4358',
          strong: '#4A5468',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#A0AEC0',
          tertiary: '#6B7A90',
          disabled: '#4A5468',
        },
        semantic: {
          success: '#10B981',
          error: '#EF4444',
          warning: '#F59E0B',
          info: '#3B82F6',
        },
        accent: {
          primary: '#6366F1',
          'primary-hover': '#4F46E5',
          secondary: '#8B5CF6',
        },
        bull: '#10B981',
        bear: '#EF4444',
        neutral: '#6B7A90',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

module.exports = config
