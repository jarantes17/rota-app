import React from "react"
import PropTypes from "prop-types"

import { Spinner } from "reactstrap"
import * as S from "./styles"

export const Progress = ({ content, color, size, ...rest }) => {
  return (
    <>
      <S.ProgressContainer>
        <Spinner size={size} color={color} />
        <span className="ml-2">{content}</span>
      </S.ProgressContainer>
    </>
  )
}

Progress.defaultProps = {
  content: "Carregando..",
  color: "primary",
  size: "sm"
}

Progress.propTypes = {
  content: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.string
}
