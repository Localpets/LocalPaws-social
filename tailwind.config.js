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

          primary: '#779be7',

          secondary: '#eda1b5',

          accent: '#a7f9d3',

          neutral: '#0D1B2A',

          'base-100': '#779be7'
        }
      }
    ]

  }
}
