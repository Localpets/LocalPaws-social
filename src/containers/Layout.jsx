// import React from 'react'
// import Footer from '../components/Footer'
import PropTypes from 'prop-types'

const Layout = ({ children }) => {
  return (
    <main className='mx-auto'>
      {children}
    </main>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
}

export default Layout
