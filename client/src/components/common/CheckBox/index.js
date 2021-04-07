import React, { useEffect, useRef } from "react"
import { useField } from "@unform/core"
import PropTypes from "prop-types"

import { Label } from "reactstrap"
import * as S from "./styles"
import { ErrorContent } from "../../../styles/global"

export const CheckBox = ({ name, content, ...rest }) => {
  const { fieldName, registerField, error, clearError } = useField(name)

  const inputRef = useRef(null)

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      getValue: ref => {
        return ref.checked
      },

      clearValue: ref => {
        ref.checked = false
        ref.value = "false"
      },

      setValue: (ref, value) => {
        ref.checked = value
        ref.value = value.toString()
      }
    })
  }, [fieldName, registerField])

  return (
    <>
      <S.Container>
        <div className="custom-control custom-checkbox mt-2">
          <input
            ref={inputRef}
            type="checkbox"
            className="custom-control-input"
            id={fieldName}
            name={name}
            onChange={() => clearError()}
            {...rest}
          />
          {content && (
            <Label className="custom-control-label" for={name} check>
              {content}
            </Label>
          )}
        </div>
      </S.Container>
      {error && <ErrorContent>{error}</ErrorContent>}
    </>
  )
}

CheckBox.defaultProps = {
  name: "CheckBox",
  content: null
}

CheckBox.propTypes = {
  name: PropTypes.string,
  content: PropTypes.string
}
