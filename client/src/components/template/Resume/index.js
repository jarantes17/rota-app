import React, { useState, useEffect } from "react"
import Clock from "react-live-clock"
import { format } from "date-fns"
import { Card, CardBody, CardText } from "reactstrap"
import { InfoCard } from "../../common"
import * as S from "./styles"
import SessionInfo from "../SessionInfo"

import { tryAwait } from "../../../helpers"
import { boardService } from "../../../services"

export default function ({ collapsedInfo }) {
  const [busyBoards, setBusyBoards] = useState(0)
  const [openedOrders, setOpenedOrders] = useState(0)
  const [totalDeliveries, setTotalDeliveries] = useState(0)

  const sysdate = () => {
    return format(new Date(), "dd/MM/yyyy")
  }

  const retrieveBusyBoards = () => {
    tryAwait({
      promise: boardService.busy(),
      onResponse: ({
        data: {
          data: { boards }
        }
      }) => {
        setBusyBoards(boards.length)
        setTimeout(() => {
          retrieveBusyBoards()
        }, 10000)
      },
      onError: () => {}
    })
  }

  useEffect(() => {
    // retrieveBusyBoards()
  }, [])

  return (
    <S.Container
      className={`resume${collapsedInfo === true ? " collapsed" : ""}`}
    >
      <S.ClockContainer>
        <S.ClockTitle>Resumo das Operações</S.ClockTitle>
        <S.ClockDate>{sysdate()}</S.ClockDate>
        <S.ClockTime>
          <Clock format="HH:mm:ss" ticking timezone="America/Sao_Paulo" />
        </S.ClockTime>
      </S.ClockContainer>
      <SessionInfo />
      <S.NavWidgets>
        <InfoCard
          title="Mesas"
          subtitle="Mesas Ocupadas"
          quantity={busyBoards}
          onClick={null} // todo - open boards and your respective orders
        />

        <InfoCard
          title="Pedidos"
          subtitle="Pedidos em aberto"
          quantity={openedOrders}
          onClick={null}
        />

        <InfoCard
          title="Entregas"
          subtitle="Total de Entregas"
          quantity={totalDeliveries}
          onClick={null}
        />
      </S.NavWidgets>
    </S.Container>
  )
}
