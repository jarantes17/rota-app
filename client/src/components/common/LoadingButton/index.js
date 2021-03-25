import React from "react"
import PropTypes from "prop-types"
import { Button } from "reactstrap"

import * as S from "./styles"

export const LoadingButton = ({
  type,
  loading,
  children,
  visible,
  ...rest
}) => {
  return (
    <Button
      type={type}
      {...rest}
      style={{ display: visible ? "block" : "none" }}
    >
      {loading ? <S.Spinner /> : children}
    </Button>
  )
}

LoadingButton.defaultProps = {
  color: "primary",
  marginTop: null,
  marginBottom: null,
  type: "submit",
  loading: false,
  visible: true
}

LoadingButton.propTypes = {
  color: PropTypes.string,
  marginTop: PropTypes.string,
  marginBottom: PropTypes.string,
  type: PropTypes.string,
  loading: PropTypes.bool,
  visible: PropTypes.bool
}
