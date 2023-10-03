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

          primary: '#bc8a5f',

          secondary: '#e7bc91',

          accent: '#a7f9d3',

          neutral: '#503a2b',

          'base-100': '#ffedd8'
        }
      }
    ]

  }
}
