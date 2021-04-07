import styled from "styled-components"

export const ToggleButtonMenu = styled.button`
  background-color: var(--color-gray-light);
  border-radius: 0 0.25em 0.25em 0;

  &:hover {
    cursor: pointer;
    color: var(--bg-nav);
    opacity: 0.8;
  }
`

export const ToggleButtonInfo = styled.button`
  color: var(--fc-nav);
  background-color: var(--bg-nav);
  border-radius: 0.25em 0 0 0.25em;

  &:hover {
    cursor: pointer;
    color: var(--fc-nav);
    opacity: 0.8;
  }
`

export const ToggleMenuContainer = styled.div`
  margin: 0;
  padding: 0;
  display: flex;
  align-items: flex-end;
  align-content: flex-end;
`

export const ToggleInfoContainer = styled.div`
  margin: 0;
  padding: 0;
  display: flex;
  align-items: flex-end;
  align-content: flex-end;
  justify-content: flex-end;
  flex-grow: 1;
`

export const Container = styled.div`
  grid-area: toggle-buttons;

  overflow: hidden;
  white-space: nowrap;
  background-color: var(--color-white);
`
