import React, { useState, useEffect, useRef, useCallback } from "react"
import { Form } from "@unform/web"
import { endOfDay, format } from "date-fns"

import { Col, Row } from "reactstrap"
import Main from "../../../components/template/Main"
import * as S from "./styles"
import { DefaultCard, Progress, SelectOption } from "../../../components/common"
import { tryAwait } from "../../../helpers"
import { reportService } from "../../../services"
import { toast } from "react-toastify"
import NumberFormat from "react-number-format"
import { Line } from "react-chartjs-2"

export const ExpenseRevenue = () => {
  const formRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [months, setMonths] = useState([])
  const [years, setYears] = useState([])
  const [monthResume, setMonthResume] = useState(null)
  const [daysOfMonth, setDaysOfMonth] = useState([])
  const [revenues, setRevenues] = useState([])
  const [expenses, setExpenses] = useState([])

  let currentYear = parseInt(format(endOfDay(new Date()), "yyyy"), 10)
  let currentMonth = parseInt(format(endOfDay(new Date()), "MM"), 10)

  const retrieveData = (mm, yy) => {
    tryAwait({
      promise: reportService.expenseRevenue(mm, yy),
      onResponse: ({
        data: {
          data: { month_resume, month_balance }
        }
      }) => {
        setMonthResume(month_resume)
        setDaysOfMonth(
          month_balance.map(mb => format(new Date(mb.trade_date), "dd/MM/yyyy"))
        )
        setRevenues(month_balance.map(mb => mb.amount_revenue_of_day))
        setExpenses(month_balance.map(mb => mb.amount_expense_of_day))
      },
      onError: () => {
        toast.error("Erro ao buscar informações do caixa.")
      },
      onLoad: _loading => setLoading(_loading)
    })
  }

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

  const handleChangeMonth = newMonth => {
    currentMonth = newMonth.value
    retrieveData(currentMonth, currentYear)
  }

  const handleChangeYear = newYear => {
    currentYear = newYear.value
    retrieveData(currentMonth, currentYear)
  }

  const data = {
    labels: daysOfMonth,
    datasets: [
      {
        label: "Valor de Entradas",
        data: revenues,
        fill: false,
        backgroundColor: "rgb(54, 162, 235)",
        borderColor: "rgba(54, 162, 235, 0.2)",
        yAxisID: "y-axis-1"
      },
      {
        label: "Valor de Despesas",
        data: expenses,
        fill: false,
        backgroundColor: "#cc0000",
        borderColor: "#efb2b2",
        yAxisID: "y-axis-2"
      }
    ]
  }

  const options = {
    scales: {
      yAxes: [
        {
          type: "linear",
          display: true,
          position: "left",
          id: "y-axis-1"
        },
        {
          type: "linear",
          display: true,
          position: "right",
          id: "y-axis-2",
          gridLines: {
            drawOnArea: false
          }
        }
      ]
    }
  }

  const initialize = useCallback(() => {
    const minYear = currentYear - 5

    const yy = []
    for (let i = currentYear; i >= minYear; i -= 1) {
      yy.push({ value: i, label: i })
    }
    setYears(yy)

    setMonths(mm)

    retrieveData(
      mm.find(m => m.value === currentMonth)?.value,
      yy.find(y => y.value === currentYear)?.value
    )
  }, [])

  useEffect(() => {
    initialize()
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
                defaultValue={{
                  label: mm.find(m => m.value === currentMonth).label,
                  value: currentMonth
                }}
                isLoading={loading}
                isClearable={false}
                name="selected_month"
                options={months}
                label="Mês"
                onChange={handleChangeMonth}
              />
            </Col>
            <Col xl="2">
              <SelectOption
                className="basic-single"
                classNamePrefix="select"
                defaultValue={{ label: currentYear, value: currentYear }}
                isLoading={loading}
                isClearable={false}
                name="selected_year"
                options={years}
                label="Ano"
                onChange={handleChangeYear}
              />
            </Col>
          </Row>
        </Form>
        {loading && (
          <Progress className="mt-2" content="Carregando Informações..." />
        )}
        {!loading && (
          <>
            <Row className="mt-2">
              <Col xl={12}>
                <DefaultCard
                  title="Total de Entradas - Total de Despesas = Faturado"
                  value={
                    <>
                      <NumberFormat
                        className="entry"
                        value={monthResume?.amount_revenues || 0}
                        displayType="text"
                        decimalSeparator=","
                        fixedDecimalScale
                        decimalScale={2}
                      />
                      {" - "}
                      <NumberFormat
                        className="out"
                        value={monthResume?.amount_expenses || 0}
                        displayType="text"
                        decimalSeparator=","
                        fixedDecimalScale
                        decimalScale={2}
                      />
                      {" = "}
                      <NumberFormat
                        className={
                          (monthResume?.amount_revenues || 0) -
                            (monthResume?.amount_expenses || 0) <
                          0
                            ? "out"
                            : "green"
                        }
                        value={
                          (monthResume?.amount_revenues || 0) -
                          (monthResume?.amount_expenses || 0)
                        }
                        displayType="text"
                        decimalSeparator=","
                        fixedDecimalScale
                        decimalScale={2}
                      />
                    </>
                  }
                  display={5}
                />
              </Col>
            </Row>
            <Row className="m-1">
              <Col xl={12}>
                <Line data={data} options={options} />
              </Col>
            </Row>
          </>
        )}
      </S.Container>
    </Main>
  )
}
