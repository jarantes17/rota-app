import React, { useCallback, useEffect, useRef, useState } from "react"
import InputMask from "react-input-mask"
import { useField } from "@unform/core"
import * as AllIcons from "react-icons/all"
import NumberFormat from "react-number-format"
import PropTypes from "prop-types"

import { iff } from "../../../utils"

import * as S from "./styles"
import { ErrorContent, Label } from "../../../styles/global"

export const Input = ({
  name,
  placeholder,
  type,
  label,
  icon,
  passwordShow,
  background,
  borderColor,
  borderInputColor,
  mask,
  currency,
  isCellPhone,
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

  const beforeMaskedValueChange = newState => {
    let { value } = newState

    const newValue = value.replace(/\D/g, "")
    if (newValue.length === 11) {
      value = newValue.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3")
    }

    return {
      ...newState,
      value
    }
  }

  const [passwordReveal, setPasswordReveal] = useState(false)
  const [isFocused, setFocused] = useState(false)
  const inputRef = useRef(null)

  const InputIcon = icon ? AllIcons[icon] : null

  const PasswordIcon = iff(
    passwordShow,
    iff(passwordReveal, AllIcons.HiEyeOff, AllIcons.HiEye),
    null
  )

  useEffect(() => {
    if (inputRef.current instanceof NumberFormat) {
      registerField({
        name: fieldName,
        ref: inputRef.current,
        getValue: ref => {
          return ref.state.numAsString
        },
        setValue(ref, value) {
          ref.state.value = value
          ref.state.numAsString = value?.toLocaleString(undefined, {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
          })
        }
      })
    } else if (inputRef.current instanceof InputMask) {
      registerField({
        name: fieldName,
        ref: inputRef.current,
        path: "value",
        setValue(ref, value) {
          ref.setInputValue(value !== null ? value.toString() : "")
        },
        clearValue(ref) {
          ref.setInputValue("")
        }
      })
    } else {
      registerField({
        name: fieldName,
        ref: inputRef.current,
        path: "value"
      })
    }
  }, [fieldName, registerField])

  const handlePasswordShow = useCallback(reveal => setPasswordReveal(!reveal), [
    setPasswordReveal
  ])

  return (
    <>
      <S.Container>
        {label && <Label>{label}</Label>}
        <S.InputWrapper
          background={background}
          borderColor={borderColor}
          borderInputColor={borderInputColor}
          isFocused={isFocused}
          icon={icon}
          className={error ? "has-error" : ""}
        >
          {InputIcon && (
            <S.FieldAddonStart>
              <InputIcon />
            </S.FieldAddonStart>
          )}
          {!mask && currency && (
            <NumberFormat
              id={fieldName}
              name={name}
              type={type}
              ref={inputRef}
              inputRef={inputRef}
              defaultValue={defaultValue}
              placeholder={placeholder}
              isFocused={isFocused}
              onBlur={() => setFocused(false)}
              onFocus={() => {
                setFocused(true)
                clearError()
              }}
              onChange={onChange}
              decimalSeparator=","
              thousandSeparator="."
              decimalScale={2}
              {...rest}
            />
          )}
          {mask && !currency && (
            <InputMask
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
              mask={mask}
              beforeMaskedValueChange={
                isCellPhone ? beforeMaskedValueChange : null
              }
              {...rest}
            />
          )}
          {!mask && !currency && (
            <S.Field
              id={fieldName}
              name={name}
              type={passwordReveal ? "text" : type}
              placeholder={placeholder}
              ref={inputRef}
              defaultValue={defaultValue}
              isFocused={isFocused}
              onBlur={() => setFocused(false)}
              onFocus={() => {
                setFocused(true)
                clearError()
              }}
              onChange={onChange}
              {...rest}
            />
          )}
          {passwordShow && (
            <S.FieldAddonEnd>
              <S.PasswordReveal
                isFocused={isFocused}
                password={passwordReveal}
                tabindex="-1"
                onClick={() => handlePasswordShow(passwordReveal)}
              >
                {PasswordIcon && <PasswordIcon />}
              </S.PasswordReveal>
            </S.FieldAddonEnd>
          )}
        </S.InputWrapper>
      </S.Container>
      {error && <ErrorContent>{error}</ErrorContent>}
    </>
  )
}

Input.defaultProps = {
  name: "Input",
  placeholder: "",
  type: "text",
  icon: null,
  label: null,
  background: null,
  borderColor: null,
  borderInputColor: "",
  passwordShow: false,
  mask: null,
  currency: false,
  isCellPhone: false
}

Input.propTypes = {
  name: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  icon: PropTypes.string,
  label: PropTypes.string,
  background: PropTypes.string,
  borderColor: PropTypes.string,
  borderInputColor: PropTypes.string,
  passwordShow: PropTypes.bool,
  mask: PropTypes.string,
  currency: PropTypes.bool,
  isCellPhone: PropTypes.bool
}
