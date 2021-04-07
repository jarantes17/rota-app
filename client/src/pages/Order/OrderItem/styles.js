import styled from "styled-components"

export const Container = styled.div`
  font-family: "Open Sans", sans-serif;
`

export const OrderItem = styled.div`
  padding: 6px;
`

export const OrderItemContent = styled.span`
  font-size: 1.2em;
  font-weight: bold;
  display: inline;
  svg {
    margin-top: -5px;
    fill: var(--bg-rota-red);
    font-size: 16px;
    transition: fill 0.2s ease 0s;
    margin-right: 3px;
  }
`

export const OrderItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: center;
  align-items: center;
  height: 100%;
`

export const OrderItemWrapperLeft = styled.div`
  display: flex;
  flex-direction: row;
  align-content: flex-start;
  justify-content: flex-start;
  align-items: flex-start;
  height: 100%;
  margin-left: 10px;
`

export const OrderItemWrapperRight = styled.div`
  display: flex;
  flex-direction: row;
  align-content: flex-end;
  justify-content: flex-end;
  align-items: flex-end;
  height: 100%;
  margin-right: 10px;
`

export const OrderItemCount = styled.h1`
  span {
    font-size: 0.8rem;
  }
`

export const OrderItemNumber = styled.h4`
  span {
    font-size: 0.8rem;
  }
`

export const OrderItemAmmount = styled.h3``

export const CreationDateInfo = styled.span`
  font-size: 0.7em;
  font-weight: 600;
  color: var(--color-gray-semi-dark);
`
