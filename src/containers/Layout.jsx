// import React from 'react'
// import Footer from '../components/Footer'
import PropTypes from 'prop-types'

const Layout = ({ children }) => {
  return (
    <main className='bg-base-100 mx-auto'>
      {children}
    </main>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
}

export default Layout
