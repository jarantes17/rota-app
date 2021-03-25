import styled from "styled-components"

export const Container = styled.div`
  margin-top: 20px;
  width: 100%;

  form {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 0 30px 30px 30px;
  }
  .btn-facebook {
    background: #3b5998;
    color: #fff;
  }

  .btn-facebook:hover {
    color: #fff;
    opacity: 0.8;
  }
`

export const Group = styled.section`
  display: grid;
  grid-auto-flow: row;
  gap: 10px;
`
