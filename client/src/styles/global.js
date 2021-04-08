import styled, { createGlobalStyle } from "styled-components"

export default createGlobalStyle`

  :root {
    --bg-nav: #1d1d1d;
    --bg-dark: #1C1C1C;
    --bg-accent: #FF4500;

    --bg-rota-orange: #EF5B00;
    --bg-rota-red: #FF1616;
    --bg-rota-black: #100F0D;

    --color-error: #ef5350;
    --color-background-input-focused: #8a8a90;
    --color-background-input: #E6E6F0;
    --color-background-input-addon: #f7f7fa;
    --color-primary: #FF4500;
    --color-primary-light: #ff873d;
    --color-primary-dark: #c64c00;
    --color-gray: #333333;
    --color-gray-light: #f7f7fa;
    --color-gray-semi-light: #ebebf2;

    --color-gray-semi-dark: #8a8a90;
    --color-gray-dark: #565657;
    --color-white: #fff;
    --fc-nav: #adadad;

    --logo-height: 110px;
    --header-height: 80px;
    --toggle-buttons-height: 30px;
    --aside-width: 250px;
    --footer-height: 40px;

    --div-empty-width: 350px;

    --shadow:
        0 40px 23px -20px rgba(0, 0, 0, 0.05),
        0 40px 49px -20px rgba(0, 0, 0, 0.06);
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
  }


  @-webkit-keyframes spinner-border {
    to {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
    }
  }

  @keyframes spinner-border {
      to {
          -webkit-transform: rotate(360deg);
          transform: rotate(360deg);
      }
  }

  .app {
    margin: 0px;
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-template-rows:
      var(--toggle-buttons-height)
      var(--header-height)
      1fr
      var(--footer-height);
    grid-template-areas:
      "menu toggle-buttons resume"
      "menu header resume"
      "menu content resume"
      "menu footer footer";
    height: 100vh;
    background-color: #f6f6fa;

    // Responsive Tablet + Cellphone
    @media(max-width: 768px) {
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr auto;
      grid-template-areas:
      "menu"
      "content"
      "footer"
    }
  }

  .app-auth {
    margin: 0px;
    display: grid;
    grid-template-columns: 1fr var(--div-empty-width);
    grid-template-areas: "picture form";
    height: 100vh;
    background-color: #fff;
  }

  @media (max-width : 768px) {
    .app-auth {
      grid-template-columns: 1fr;
      grid-template-areas:
        "form"
    }
  }

  .app-empty {
    margin: 0px;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-areas: "pictureFull";
    height: 100vh;
    background-color: #fff;
  }

  html, body, #root {
    min-height: 100%;
    font-family: 'Poppins', sans-serif;
  }

  .resume.collapsed {
    width: 0px;
  }

  .nav.collapsed {
    width: 80px;
  }

  .fp-container {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: #f6f6faad;
  }
  .fp-container .fp-loader {
    top: 38%;
    left: 40%;
    z-index: 1000;
    position: absolute;
    text-align: center;
  }

  html, body {margin: 0; height: 100%; overflow: hidden}

  body {
    -webkit-font-smoothing: antialiased !important;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type=number] {
    -moz-appearance: textfield;
  }

  input.input-custom {
    display: block;
    border: none;
    outline: none;
    background-color: transparent;
    height: 40px;
    padding: 15px 10px;
    color: ${props =>
      props.isFocused
        ? "var(--color-background-input-focused)"
        : "var(--color-gray)"};
    font-family: "Lato", sans-serif;
    font-size: 1rem;
    width: 100%;
    flex-grow: 1;
    ::-ms-reveal,
    ::-ms-clear {
      display: none;
    }
  }

  .has-error{
    border: 2px solid var(--color-error);
    svg {
      fill: var(--color-error);
    }
  }
  .swal2-title{
    color: #373a3c;
  }

  .swal2-styled.swal2-cancel {
    color: #212529;
  }

  .fileContainer .deleteImage {
    background-color: var(--bg-accent)
  }

  .fileContainer .chooseFileButton {
    background-color: var(--bg-dark)
  }
`

export const TableButton = styled.button`
  outline: none;
  border: none;
  width: 25px;
  height: 25px;
  border-radius: 4px;
  background-color: ${({ background }) => background || "black"};
  margin-right: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  ::last-child {
    margin-right: 0;
  }
  svg {
    fill: white;
    font-size: 1rem;
    transition: all 0.3s;
  }
  &:hover {
    opacity: 0.5;
    svg {
      transform: rotate(360deg);
    }
  }
`

export const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  line-height: 32px;
  color: #9c98a6;
  margin-bottom: 0;
`

export const InputWrapper = styled.div`
  width: 100%;
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

export const ErrorContent = styled.span`
  font-size: 0.75rem;
  color: var(--color-error);
  margin-top: -10px;
`

export const DefaultContainer = styled.div`
  margin: 10px;
`
export const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
  justify-items: center;
  align-items: center;
`

export const ActionButton = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
  justify-items: center;
  align-items: center;
`

export const TableContainer = styled.div`
  margin-top: 20px;
  width: 100%;
`

export const Divider = styled.div`
  border-left: 1px solid var(--color-gray-semi-light);
  display: flex;
  justify-content: center;
  height: 95%;
  position: absolute;
  left: 50%;
  margin-left: -3px;
`

export const DividerHoriz = styled.hr`
  border-color: var(--color-gray-semi-light);
  height: 95%;
  left: 50%;
  margin: 3px;
`
