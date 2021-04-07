import React, { useState } from "react"

import Nav from "../../../components/template/Nav"
import Resume from "../../../components/template/Resume"
import Footer from "../../../components/template/Footer"
import ToggleButtons from "../../../components/template/ToggleButtons"

const DefaultLayout = ({ children, ...rest }) => {
  const [collapsedMenu, setCollapsedMenu] = useState(false)
  const [collapsedInfo, setCollapsedInfo] = useState(false)

  const handleCollapsedMenuChange = () => {
    setCollapsedMenu(!collapsedMenu)
  }

  const handleCollapsedInfoChange = () => {
    setCollapsedInfo(!collapsedInfo)
  }

  return (
    <div className="app">
      <Nav
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
