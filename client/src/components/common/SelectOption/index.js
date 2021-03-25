import React, { useEffect, useRef } from "react"
import { useField } from "@unform/core"
import PropTypes from "prop-types"
import Select from "react-select"

import * as S from "./styles"
import { ErrorContent, Label } from "../../../styles/global"

export const SelectOption = ({
  name,
  label,
  isLoading,
  isClearable,
  options,
  ...rest
}) => {
  const {
    fieldName,
    defaultValue,
    registerField,
    error,
    clearError
  } = useField(name)

  const inputRef = useRef(null)

  const customStyles =
    error === undefined
      ? {
          control: (provided, state) => ({
            ...provided
          })
        }
      : {
          control: (provided, state) => ({
            ...provided,
            borderColor: "var(--color-error)",
            border: "2px solid var(--color-error) !important"
          })
        }

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      getValue: ref => {
        if (rest.isMulti) {
          if (!ref.state.value) {
            return []
          }
          return ref.state.value.map(option => option.value)
        }
        if (!ref.state.value) {
          return ""
        }
        return ref.state.value.value
      },
      setValue: (ref, value) => {
        if (rest.isMulti && Array.isArray(value)) {
          ref.select.setValue(value)
        } else {
          const item = ref?.props?.options?.filter(
            option => option.value === value
          )
          if (item && item.length === 1) {
            ref.select.setValue(item[0])
          }
        }
      }
    })
  }, [fieldName, registerField, rest.isMulti])

  return (
    <>
      <S.Container>
        {label && <Label>{label}</Label>}
        <Select
          id={fieldName}
          name={name}
          ref={inputRef}
          theme={theme => ({
            ...theme,
            borderRadius: 0,
            colors: {
              ...theme.colors,
              primary25: "var(--color-background-input)",
              primary: "var(--color-background-input-focused)"
            }
          })}
          styles={customStyles}
          className="basic-single"
          classNamePrefix="select"
          defaultValue={defaultValue}
          isLoading={isLoading}
          isClearable={isClearable}
          onFocus={() => {
            clearError()
          }}
          options={options}
          {...rest}
        />
      </S.Container>
      {error && <ErrorContent>{error}</ErrorContent>}
    </>
  )
}

SelectOption.defaultProps = {
  label: "Label",
  defaultValue: null,
  isLoading: false,
  isClearable: false
}

SelectOption.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  defaultValue: PropTypes.object,
  options: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  isClearable: PropTypes.bool
}
