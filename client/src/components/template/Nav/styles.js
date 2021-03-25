import styled from "styled-components"

export const Container = styled.aside`
  grid-area: menu;

  width: var(--aside-width);

  transition: all 0.7s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;

  button {
    padding: 0;
    border: 0;
    color: var(--bg-white);
    font-size: 100%;
    font-family: inherit;
    font-size: 70%;
    background-color: inherit;
    display: block;

    &:hover {
      cursor: pointer;
      color: var(--bg-white);
      opacity: 0.8;
    }
  }

  .pro-sidebar {
    transition: all 0.7s;
  }
`

export const LogoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  height: 100%;
  margin-right: 5px;
`

export const LogoContainer = styled.aside`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--color-gray-light);

  img {
    padding: 0px 15px;
    width: 100%;
  }
`
