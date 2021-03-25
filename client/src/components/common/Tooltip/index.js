import React, { useState } from "react"
import PropTypes from "prop-types"

import { Tooltip as RSTooltip } from "reactstrap"

export const Tooltip = ({ target, position, content, ...rest }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const toggle = () => setTooltipOpen(!tooltipOpen)

  return (
    <>
      <RSTooltip
        placement={position}
        isOpen={tooltipOpen}
        target={target}
        toggle={toggle}
      >
        {content}
      </RSTooltip>
    </>
  )
}

Tooltip.defaultProps = {
  target: "",
  position: "bottom"
}

Tooltip.propTypes = {
  target: PropTypes.string,
  position: PropTypes.string
}
