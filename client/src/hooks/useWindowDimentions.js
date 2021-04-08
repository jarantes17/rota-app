// Libs
import { useState, useEffect } from 'react'

// Function to return window dimentions
function getWindowDimensions() {
  const { 
    innerWidth: width,
    innerHeight: height,
    pageYOffset: yOffset,
    pageXOffset: xOffset
  } = typeof window !== 'undefined' ? window : {}

  return { width, height, yOffset, xOffset }
}

// Hook function to get window dimentions
export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions())

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions())
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize)
      window.addEventListener('scroll', handleResize)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize)
        window.removeEventListener('scroll', handleResize)
      }
    }
  }, [])

  return windowDimensions
}