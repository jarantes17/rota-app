import styled from "styled-components"

export const Container = styled.div`
  grid-area: form;

  box-shadow: 1px 0 20px rgba(0, 0, 0, 0.08);

  img {
    width: 100%;
    padding: 0 80px 0 80px;
  }
`

export const Header = styled.div`
  padding: 10px;
  background-color: var(--color-gray-light);
  box-shadow: 0 5px 5px -5px var(--color-gray-semi-dark);
`
