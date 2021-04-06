import React, { useState, useEffect, useRef, useCallback } from "react"
import { Form } from "@unform/web"
import { endOfDay, format } from "date-fns"

import { Col, Row } from "reactstrap"
import Main from "../../../components/template/Main"
import * as S from "./styles"
import { SelectOption } from "../../../components/common"

export const ExpenseRevenue = () => {
  const formRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [months, setMonths] = useState([])
  const [years, setYears] = useState([])

  const currentYear = parseInt(format(endOfDay(new Date()), "yyyy"))
  const currentMonth = parseInt(format(endOfDay(new Date()), "MM"))

  const handleSearchSubmit = useCallback(async form => {}, [])

  const initValues = () => {
    const minYear = currentYear - 5

    const yy = []
    for (var i = currentYear; i >= minYear; i--) {
      yy.push({ value: i, label: i })
    }
    setYears(yy)

    const mm = [
      { value: 1, label: "Janeiro" },
      { value: 2, label: "Fevereiro" },
      { value: 3, label: "Março" },
      { value: 4, label: "Abril" },
      { value: 5, label: "Maio" },
      { value: 6, label: "Junho" },
      { value: 7, label: "Julho" },
      { value: 8, label: "Agosto" },
      { value: 9, label: "Setembro" },
      { value: 10, label: "Outubto" },
      { value: 11, label: "Novembro" },
      { value: 12, label: "Dezembro" }
    ]
    setMonths(mm)
  }

  useEffect(() => {
    initValues()
  }, [])

  return (
    <Main
      title="Despesas e Faturamento"
      subtitle="Controle de Despesas e Faturamento"
      icon="FaFileInvoiceDollar"
    >
      <S.Container>
        <Form ref={formRef}>
          <Row>
            <Col xl="2">
              <SelectOption
                className="basic-single"
                classNamePrefix="select"
                value={months.find(m => m.value === currentMonth)}
                isLoading={loading}
                isClearable={false}
                name="selectedMonth"
                options={months}
                label="Mês"
              />
            </Col>
            <Col xl="2">
              <SelectOption
                className="basic-single"
                classNamePrefix="select"
                value={years.find(y => y.value == currentYear)}
                isLoading={loading}
                isClearable={false}
                name="selectedYear"
                options={years}
                label="Ano"
              />
            </Col>
          </Row>
        </Form>
      </S.Container>
    </Main>
  )
}
