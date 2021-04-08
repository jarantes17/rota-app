import React, { useState, useEffect, useCallback } from "react"
import Clock from "react-live-clock"
import { format } from "date-fns"
import { InfoCard } from "../../common"
import * as S from "./styles"
import SessionInfo from "../SessionInfo"

import { tryAwait } from "../../../helpers"
import { reportService } from "../../../services"

export default function ({ collapsedInfo }) {
  const [busyBoards, setBusyBoards] = useState(0)
  const [openedOrders, setOpenedOrders] = useState(0)
  const [totalDeliveries, setTotalDeliveries] = useState(0)

  const sysdate = () => {
    return format(new Date(), "dd/MM/yyyy")
  }

  const retrieveInfo = useCallback(() => {
    tryAwait({
      promise: reportService.resumeInfo(),
      onResponse: ({
        data: {
          data: { boards, orders, deliveries }
        }
      }) => {
        setBusyBoards(boards)
        setOpenedOrders(orders)
        setTotalDeliveries(deliveries)
        setTimeout(() => {
          retrieveInfo()
        }, 10000)
      },
      onError: () => {}
    })
  }, [])

  useEffect(() => {
    retrieveInfo()
  }, [retrieveInfo])

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
          onClick={null}
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
