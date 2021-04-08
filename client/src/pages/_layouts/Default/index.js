import React, { useState } from "react"

import Nav from "../../../components/template/Nav"
import NavWrapper from '../../../components/template/NavWrapper'
import Resume from "../../../components/template/Resume"
import Footer from "../../../components/template/Footer"
import ToggleButtons from "../../../components/template/ToggleButtons"

import useWindowDimentions from '../../../hooks/useWindowDimentions'

const DefaultLayout = ({ children }) => {
  
  // Hooks
  const [collapsedMenu, setCollapsedMenu] = useState(false)
  const [collapsedInfo, setCollapsedInfo] = useState(false)
  const { width } = useWindowDimentions()

  // Actions
  const handleCollapsedMenuChange = () => {
    setCollapsedMenu(!collapsedMenu)
  }

  const handleCollapsedInfoChange = () => {
    setCollapsedInfo(!collapsedInfo)
  }

  const NavComponent = width <= 768 ? NavWrapper : Nav

  // Jsx
  return (
    <div className="app">
      <NavComponent
        collapsedMenu={collapsedMenu}
        handleCollapsedMenuChange={handleCollapsedMenuChange}
        handleCollapsedInfoChange={handleCollapsedInfoChange}
      />
      <ToggleButtons
        handleCollapsedMenuChange={handleCollapsedMenuChange}
        handleCollapsedInfoChange={handleCollapsedInfoChange}
      />
      {children}
      <Resume collapsedInfo={collapsedInfo} />
      <Footer />
    </div>
  )
}

export default DefaultLayout
