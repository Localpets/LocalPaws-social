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

          primary: '#413C58', // old = bc8a5f

          secondary: '#EB5547',

          accent: '#F5B841',

          neutral: '#503A2B',

          'base-100': '#F9E9EC ' // F9E9EC
        }
      }
    ]

  }
}
