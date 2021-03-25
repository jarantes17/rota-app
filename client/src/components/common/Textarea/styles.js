import styled from "styled-components"

export const Container = styled.div`
  width: 100%;
  display: block;
`

export const InputWrapper = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  background-color: var(--color-background-input);
  background: ${props =>
    props.background ? props.background : "var(--color-background-input)"};
  border: 2px solid
    ${props =>
      props.isFocused
        ? "var(--color-background-input-focused)"
        : "var(--color-background-input)"};
  overflow: hidden;
  border-radius: 5px;
  transition: border 0.2s ease 0s;
  svg {
    fill: ${props =>
      props.isFocused
        ? "var(--color-background-input-focused)"
        : "var(--color-primary)"};
    font-size: 16px;
    transition: fill 0.2s ease 0s;
  }
`

export const FieldAddonStart = styled.div`
  height: 45px;
  width: 100%;
  max-width: 25px;
  padding: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--color-background-input-addon);
`

export const FieldAddonEnd = styled.div`
  height: 45px;
  width: 25px;
  max-width: 25px;
  padding: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const Field = styled.textarea`
  display: block;
  border: none;
  outline: none;
  background-color: transparent;
  padding: 5px 10px;
  color: ${props =>
    props.isFocused
      ? "var(--color-background-input-focused)"
      : "var(--color-gray)"};
  font-family: "Lato", sans-serif;
  font-size: 1rem;
  width: 100%;
  flex-grow: 1;
  overflow-y: hidden;
  ::-ms-reveal,
  ::-ms-clear {
    display: none;
  }
`
export const PasswordReveal = styled.a`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    fill: ${props =>
      props.isFocused
        ? "var(--color-background-input-focused)"
        : "var(--bg-dark)"} !important;
    font-size: 1rem !important;
  }
`
