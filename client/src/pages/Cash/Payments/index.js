import React, { useEffect, useState } from "react"
import DataTable from "react-data-table-component"
import { MdDelete } from "react-icons/md"
import NumberFormat from "react-number-format"
import { Col, Row } from "reactstrap"
import { LoadingButton } from "../../../components/common"
import { TableButton, TableContainer } from "../../../styles/global"
import * as S from "./styles"

export const Payments = ({
  payments,
  loadingCloseBill,
  totalAmount,
  handleSetPayed,
  handleRemovePayment,
  handleBillSubmit
}) => {
  const [amountPayed, setAmountPayed] = useState(0)
  const [remaining, setRemaining] = useState(0)
  const [change, setChange] = useState(0)
  const [payed, setPayed] = useState(false)

  const calculate = () => {
    const totalPayed = payments.reduce((a, b) => a + (b.amount || 0), 0)
    const totalChange = totalPayed - totalAmount
    const totalRemaining = totalAmount - totalPayed

    setAmountPayed(totalPayed)

    if (totalRemaining > 0) {
      setRemaining(totalRemaining)
      setPayed(false)
      handleSetPayed(false)
    } else {
      setRemaining(0)
      setPayed(true)
      handleSetPayed(true)
    }

    if (totalChange > 0) {
      setChange(totalChange)
    } else {
      setChange(0)
    }
  }

  useEffect(() => {
    calculate()
  })

  return (
    <S.Container>
      <Row>
        <Col sm={12}>
          <Row>
            <Col sm={6}>
              <strong>Pago até o momento: </strong>
            </Col>
            <Col sm={6}>
              <span>
                <NumberFormat
                  value={amountPayed}
                  displayType="text"
                  decimalSeparator=","
                  fixedDecimalScale
                  decimalScale={2}
                />
              </span>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col sm={12}>
          <Row>
            <Col sm={6}>
              <strong>Faltante: </strong>
            </Col>
            <Col sm={6}>
              <span>
                <NumberFormat
                  value={remaining}
                  displayType="text"
                  decimalSeparator=","
                  fixedDecimalScale
                  decimalScale={2}
                />
              </span>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col sm={12}>
          <Row>
            <Col sm={6}>
              <strong>Troco: </strong>
            </Col>
            <Col sm={6}>
              <span>
                <NumberFormat
                  className={change > 0 ? "hasChange" : ""}
                  value={change}
                  displayType="text"
                  decimalSeparator=","
                  fixedDecimalScale
                  decimalScale={2}
                />
              </span>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="mt-2">
        <TableContainer>
          <DataTable
            noHeader
            striped
            dense
            columns={[
              {
                name: "Método de Pagamento",
                selector: "type.description",
                sortable: true
              },
              {
                name: "Valor Pago",
                selector: "amount",
                sortable: true,
                format: row =>
                  row.amount.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2
                  })
              },
              {
                name: "Ações",
                right: true,
                cell: (row, index) => (
                  <TableButton
                    style={{ marginRight: 0 }}
                    background="red"
                    onClick={() => {
                      handleRemovePayment(index)
                    }}
                  >
                    <MdDelete />
                  </TableButton>
                )
              }
            ]}
            data={payments}
            noDataComponent="Nenhuma entrada de pagamento"
          />
        </TableContainer>
      </Row>
      {payed && (
        <Row className="mt-4">
          <Col>
            <LoadingButton
              color="success"
              type="button"
              block
              loading={loadingCloseBill}
              disabled={loadingCloseBill}
              onClick={() => handleBillSubmit()}
            >
              Fechar Conta
            </LoadingButton>
          </Col>
        </Row>
      )}
    </S.Container>
  )
}
