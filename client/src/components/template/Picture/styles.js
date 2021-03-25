import styled from "styled-components"
import picture from "../../../assets/images/panqueca.jpg"

export const Container = styled.div`
  grid-area: picture;

  .element-with-background-image {
    position: relative;
    background-image: url(${picture});
    width: 100%;
    height: 100%;
  }

  .color-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--bg-dark);
    opacity: 0.6;
  }
`

export const BackImage = styled.div`
  position: relative;
  background-image: url(${picture});
  width: 100%;
  height: 100%;
`
export const BackImageConent = styled.div`
  position: absolute;
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: flex-end;
  flex-direction: column;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--bg-dark);
  opacity: 0.6;
`

export const Title = styled.span`
  color: var(--bg-rota-red);
  /* font-size: 8rem; */
  opacity: 1;
  font-weight: bold;
  margin-right: 100px;
  line-height: 0.7;
  span {
    color: var(--bg-rota-orange);
  }
`

export const SubTitle = styled.span`
  color: var(--color-white);
  /* font-size: 2.5rem; */
  opacity: 1;
  font-family: "Lato", sans-serif;
  margin-right: 40px;
`
