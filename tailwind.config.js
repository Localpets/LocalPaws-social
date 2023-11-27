/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {}
  },
  plugins: [require('daisyui'), require('@tailwindcss/forms')],
  daisyui: {
    themes: [
      {
        mytheme: {

          primary: '#121d32',

          secondary: '#304562',

          accent: '#F0FDFF',

          neutral: '#121d32',

          'base-100': '#F0FDFF'
        }
      }
    ]

  }
}
