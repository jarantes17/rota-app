import styled from "styled-components"

export const Container = styled.aside`
  grid-area: resume;
  .h5 {
    font-weight: 600;
  }
  h3 {
    font-weight: bolder;
  }

  width: var(--aside-width);

  transition: all 0.7s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
`

export const NavWidgets = styled.div`
  height: 100%;
  display: block;
  background-color: var(--bg-rota-orange);
`
export const ClockContainer = styled.div`
  background-color: var(--bg-nav);
  width: 100%;
  height: var(--logo-height);
  margin: 0;
  text-align: center;
  display: grid;
  align-items: center;
  align-content: center;
`
export const ClockTitle = styled.p`
  color: var(--fc-nav);
  font-size: 0.8em;
  margin-top: 5px;
`

export const ClockDate = styled.h3`
  color: var(--bg-rota-orange);
`
export const ClockTime = styled.h3`
  color: var(--fc-nav);
`
