import React, { useState, useEffect, useRef, useCallback } from "react"
import { Form } from "@unform/web"
import DataTable from "react-data-table-component"
import { format } from "date-fns"
import Main from "../../components/template/Main"
import * as S from "./styles"

export const Transaction = () => {
  const formRef = useRef(null)

  const handleRegisterSubmit = useCallback(async form => {}, [])

  const handleEditSubmit = useCallback(async form => {}, [])

  const handleDelete = id => {}

  useEffect(() => {}, [])

  return (
    <Main
      title="Transações"
      subtitle="Controle de Transações de Estoque"
      icon="FaMoneyCheckAlt"
    >
      <S.Container>Transaction Content</S.Container>
    </Main>
  )
}
