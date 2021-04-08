import styled from "styled-components"

// New styles
export const Wrapper = styled.div`
  grid-area: menu;
  background-color: #1d1d1d;
  padding: 10px 15px;

  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const TopInfo = styled.div`
  display: flex;
  align-items: center;
  
  p {
    color: white;
    margin-bottom: 0;
    margin-left: 1rem;
    font-weight: normal;
    font-size: 1.5rem;
  }
`

export const TopLogo = styled.div`
  max-width: 50px;
  max-height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 100px;
`

export const TopIcon = styled.div`
  color: white;
  font-size: 1.5rem;
  
  &:hover {
    svg {
      cursor: pointer;
      color: var(--color-primary);
    }
  }
`

// From original component
export const Container = styled.aside`
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

  // In drawer view
  position: fixed;
  left: ${props => props.collapsed ? '-250px' : '0'};
  bottom: 0;
  top: 0;
  width: 250px;
  z-index: 5;
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
