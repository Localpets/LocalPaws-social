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

          primary: '#15007a',

          secondary: '#bec6ff',

          accent: '#dbe0ff',

          neutral: '#15007a',

          'base-100': '#dbe0ff',

          'base-200': '#97a0ff'
        }
      }
    ]

  }
}
