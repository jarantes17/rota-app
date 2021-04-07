import React from "react"
import PictureFull from "../../../components/template/PictureFull"

const EmptyLayout = ({ children, ...rest }) => {
  return (
    <div className="app-empty">
      <PictureFull>{children}</PictureFull>
    </div>
  )
}

export default EmptyLayout
