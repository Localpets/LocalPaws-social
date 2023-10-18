import { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

const IntersectionObserverComponent = ({ onIntersect }) => {
  const targetRef = useRef(null)

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2
    }

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onIntersect() // Llama a la función proporcionada cuando el elemento es visible en el viewport.
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersection, options)

    if (targetRef.current) {
      observer.observe(targetRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [onIntersect])

  return <div ref={targetRef} />
}

IntersectionObserverComponent.propTypes = {
  onIntersect: PropTypes.func.isRequired
}

export default IntersectionObserverComponent
