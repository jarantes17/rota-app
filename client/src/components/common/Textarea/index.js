import React, { useEffect, useRef, useState } from "react"
import { useField } from "@unform/core"
import PropTypes from "prop-types"

import * as S from "./styles"
import { ErrorContent, Label } from "../../../styles/global"

export const Textarea = ({
  name,
  placeholder,
  label,
  background,
  borderColor,
  borderInputColor,
  mask,
  onChange,
  ...rest
}) => {
  const {
    fieldName,
    defaultValue,
    registerField,
    error,
    clearError
  } = useField(name)

  const [isFocused, setFocused] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: "value"
    })
  }, [fieldName, registerField])

  return (
    <>
      <S.Container>
        {label && <Label>{label}</Label>}
        <S.InputWrapper
          background={background}
          borderColor={borderColor}
          borderInputColor={borderInputColor}
          isFocused={isFocused}
          className={error ? "has-error" : ""}
        >
          <S.Field
            id={fieldName}
            name={name}
            ref={inputRef}
            placeholder={placeholder}
            isFocused={isFocused}
            onBlur={() => setFocused(false)}
            onFocus={() => {
              setFocused(true)
              clearError()
            }}
            onChange={onChange}
            {...rest}
          >
            {defaultValue}
          </S.Field>
        </S.InputWrapper>
      </S.Container>
      {error && <ErrorContent>{error}</ErrorContent>}
    </>
  )
}

Textarea.defaultProps = {
  name: "Textarea",
  placeholder: "",
  label: null,
  background: null,
  borderColor: null,
  borderInputColor: ""
}

Textarea.propTypes = {
  name: PropTypes.string,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  background: PropTypes.string,
  borderColor: PropTypes.string,
  borderInputColor: PropTypes.string
}
