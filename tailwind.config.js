/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': '#0B1021',
        'sidebar': '#12182D',
        'card': '#1A2035',
        'card-hover': '#1E253C',
        'primary-blue': '#3B82F6',
        'primary-blue-light': '#60A5FA',
        'accent-cyan': '#22D3EE',
        'accent-green': '#34D399',
        'text-primary': '#E0E0E0',
        'text-secondary': '#8A92A6',
        'border-color': '#2A3149',
        'status-pending': '#FBBF24',
        'status-sent': '#34D399',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 15px rgba(59, 130, 246, 0.5)',
      },
    },
  },
  plugins: [],
}