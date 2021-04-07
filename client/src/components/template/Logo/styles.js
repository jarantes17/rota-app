import styled from "styled-components"

export const Container = styled.div`
  grid-area: logo;

  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--color-gray-light);

  img {
    padding: 0px 5px;
    width: 100%;
  }

  height: var(--logo-height);
`
