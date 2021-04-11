import React, { useState, useEffect, useRef, useCallback } from "react"
import { Form } from "@unform/web"
import DataTable from "react-data-table-component"
import { format } from "date-fns"
import { toast } from "react-toastify"
import { Line } from "react-chartjs-2"
import Swal from "sweetalert2"
import Col from "reactstrap/lib/Col"
import Row from "reactstrap/lib/Row"
import NumberFormat from "react-number-format"
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"
import * as Yup from "yup"
import Main from "../../components/template/Main"

import * as S from "./styles"
import { tryAwait } from "../../helpers"
import { paymentTypeService, billService, cashService } from "../../services"
import { Header, TableContainer } from "../../styles/global"
import {
  DefaultCard,
  Input,
  LoadingButton,
  Progress,
  SelectOption
} from "../../components/common"
import { Payments } from "./Payments"
import useFullPageLoader from "../../hooks/useFullPageLoader"

const paymentSchema = Yup.object().shape({
  type_id: Yup.string().required("Método de pagamento é obrigatório"),
  amount: Yup.string().required("Valor é obrigatório")
})

export const Cash = props => {
  const [loader, showLoader, hideLoader] = useFullPageLoader()

  const formRef = useRef(null)
  const [isClosingOrder, setClosingOrder] = useState(false)
  const [isAddPaymentOpened, setAddPaymentOpened] = useState(false)
  const [loadingOrderDetail, setLoadingOrderDetail] = useState(false)
  const [loadingSavePayments, setLoadingSavePayments] = useState(false)
  const [loadingCloseBill, setLoadingCloseBill] = useState(false)

  const [bill, setBill] = useState({})
  const [payments, setPayments] = useState([])
  const [payed, setPayed] = useState(false)
  const [id, setId] = useState(0)
  const [loading, setLoading] = useState(false)
  const [paymentTypes, setPaymentTypes] = useState([])
  const [paymentTypesDropDown, setPaymentTypesDropDown] = useState([])

  const [hoursOfDay, setHoursOfDay] = useState([])
  const [amounts, setAmounts] = useState([])
  const [cashInfo, setCashInfo] = useState(null)
  const [loadingCash, setLoadingCash] = useState(true)

  const togglePaymentModal = () => {
    setAddPaymentOpened(!isAddPaymentOpened)
  }

  const handleBillSubmit = () => {
    Swal.fire({
      icon: "question",
      title: `Fechar Conta Pedido ${bill?.order?.id}`,
      text: "Essa ação é irreversivel!",
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Não",
      confirmButtonText: "Sim",
      confirmButtonColor: "#ff1616"
    }).then(({ isConfirmed }) => {
      if (isConfirmed) {
        showLoader()
        tryAwait({
          promise: billService.update(bill.id, bill),
          onResponse: () => {
            hideLoader()
            toast.success("Conta fechada com sucesso")
            props.history.push("/admin/orders")
          },
          onError: () => {
            hideLoader()
            toast.error("Erro ao fechar conta!")
          },
          onLoad: _loading => setLoadingCloseBill(_loading)
        })
      }
    })
  }

  const handleAddPaymentSubmit = useCallback(
    async form => {
      try {
        formRef.current.setErrors({})
        await paymentSchema.validate(form, {
          abortEarly: false
        })

        const newPayment = {
          bill_id: bill.id,
          amount: parseFloat(form.amount),
          payment_type_id: form.type_id,
          type: paymentTypes.find(t => t.id === form.type_id)
        }

        bill.payments.push(newPayment)
        setBill(bill)
        setPayments(bill?.payments || [])
        setAddPaymentOpened(false)
      } catch (err) {
        const validationErrors = {}
        if (err instanceof Yup.ValidationError) {
          err.inner.forEach(error => {
            validationErrors[error.path] = error.message
          })
          formRef.current.setErrors(validationErrors)
        }
      }
    },
    [bill, paymentTypes]
  )

  const handleRemovePayment = i => {
    const paymentToRemove = payments[i]

    if (paymentToRemove) {
      const newPayments = payments.filter((value, index, arr) => index !== i)
      setPayments(newPayments)

      const newBill = bill
      newBill.payments = newBill.payments.filter(
        (value, index, arr) => index !== i
      )
      setBill(newBill)
    } else {
      toast.error("Erro ao encontrar pagamento.")
    }
  }

  const handleSavePaymentsSubmit = () => {
    tryAwait({
      promise: billService.savePayments({
        bill_id: bill.id,
        payments: payments.map(payment => ({
          bill_id: payment.bill_id,
          payment_type_id: payment.payment_type_id,
          amount: payment.amount
        }))
      }),
      onResponse: () => {
        toast.success("Pagamentos salvos com sucesso!")
      },
      onError: () => {
        toast.error("Erro ao salvar pagamentos!")
      },
      onLoad: _loading => setLoadingSavePayments(_loading)
    })
  }

  const handleSetPayed = payed => {
    bill.payed = payed
    setPayed(payed)
    setBill(bill)
  }

  const loadConference = id => {
    tryAwait({
      promise: billService.fetch(id),
      onResponse: ({
        data: {
          data: { bill }
        }
      }) => {
        setBill(bill)
        setPayments(bill?.payments ?? [])
        setPayed(bill?.payed || false)
      },
      onError: () => {
        toast.error("Erro ao calcular conta!")
      },
      onLoad: _loading => setLoadingOrderDetail(_loading)
    })
  }

  const retrievePaymentTypes = () => {
    tryAwait({
      promise: paymentTypeService.fetch(),
      onResponse: ({
        data: {
          data: { paymentTypes }
        }
      }) => {
        setPaymentTypes(paymentTypes)
        setPaymentTypesDropDown(
          paymentTypes.map(type => {
            return {
              value: type.id,
              label: type.description
            }
          })
        )
      },
      onError: () => {
        toast.error("Erro ao buscar métodos de pagamentos!")
      },
      onLoad: _loading => setLoading(_loading)
    })
  }

  const retrieveCashInfo = () => {
    const cashDate = format(new Date(), "yyyy-MM-dd")
    try {
      tryAwait({
        promise: cashService.fetch(cashDate),
        onResponse: ({
          data: {
            data: {
              cash_info,
              hour_by_hour: { hours_of_day, amounts }
            }
          }
        }) => {
          setCashInfo(cash_info)
          setHoursOfDay(hours_of_day)
          setAmounts(amounts)
        },
        onError: () => {
          toast.error("Erro ao buscar informações do caixa.")
        },
        onLoad: _loading => setLoadingCash(_loading)
      })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (props?.location?.state !== undefined) {
      const { order_id } = props.location.state
      if (order_id) {
        loadConference(order_id)
        setId(order_id)
        setClosingOrder(true)
        retrievePaymentTypes()
      }
    } else {
      setClosingOrder(false)
      retrieveCashInfo()
    }
  }, [props])

  const sysdate = format(new Date(), "dd/MM/yyyy")

  const data = {
    labels: hoursOfDay,
    datasets: [
      {
        label: "Entrada de Caixa Hora à Hora as 07:00 às 22:00",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "#c64c00",
        borderColor: "#ff873d",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "#ff873d",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "#ff873d",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: amounts
      }
    ]
  }

  return (
    <>
      {!isClosingOrder ? (
        <Main
          title="Caixa"
          subtitle="Controle de Entrada e Saída"
          icon="FaCashRegister"
        >
          <S.Container>
            {loadingCash && (
              <Progress content="Carregando Informações do dia..." />
            )}
            {!loadingCash && (
              <>
                <Row className="mt-2">
                  <Col xl={3}>
                    <DefaultCard
                      title="Contas Fechadas"
                      subtitle={`Fechadas em ${sysdate}`}
                      value={cashInfo?.total_closed}
                      display={2}
                    />
                  </Col>
                  <Col xl={3}>
                    <DefaultCard
                      title="Contas em Aberto"
                      subtitle={`Abertas em ${sysdate}`}
                      value={cashInfo?.total_opened}
                      display={2}
                    />
                  </Col>
                  <Col xl={6}>
                    <Row>
                      <Col xl={6}>
                        <DefaultCard
                          title="Saídas"
                          subtitle="Retiradas do Caixa"
                          value={
                            <NumberFormat
                              className="out"
                              value={cashInfo?.amount_out}
                              displayType="text"
                              decimalSeparator=","
                              fixedDecimalScale
                              decimalScale={2}
                            />
                          }
                          display={5}
                        />
                      </Col>
                      <Col xl={6}>
                        <DefaultCard
                          title="Entradas"
                          subtitle="Valor Faturado"
                          value={
                            <NumberFormat
                              className="entry"
                              value={cashInfo?.amount_entry}
                              displayType="text"
                              decimalSeparator=","
                              fixedDecimalScale
                              decimalScale={2}
                            />
                          }
                          display={5}
                        />
                      </Col>
                      <Col xl={12}>
                        <Button
                          color="primary"
                          type="button"
                          block
                          onClick={() => {
                            props.history.push("/admin/orders")
                          }}
                        >
                          Ir para Pedidos
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row className="m-1">
                  <Col xl={12}>
                    <Line data={data} height={70} />
                  </Col>
                </Row>
              </>
            )}
          </S.Container>
        </Main>
      ) : (
        <Main
          title="Caixa"
          subtitle="Fechamento de Pedido"
          icon="FaCashRegister"
        >
          <S.Container>
            <Row>
              <Col lg="7">
                <Header>
                  <h5 className="m-0">
                    Fechamento do Pedido &#129026;
                    <strong className="text-primary"> {id}</strong>
                  </h5>
                </Header>
                <Row className="mt-3">
                  <Col>
                    {loadingOrderDetail ? (
                      <Progress content="Calculando Conta.. Aguarde!" />
                    ) : (
                      <>
                        <Row>
                          <Col>
                            <S.Field>
                              <strong>Responsável: </strong>
                              <br />
                              <span>{bill?.order?.responsible_name}</span>
                            </S.Field>
                            <S.Field>
                              <strong>Data do Pedido: </strong>
                              <br />
                              <span>
                                {format(
                                  new Date(bill?.order?.created_at),
                                  "dd/MM/yyyy HH:mm:ss"
                                )}
                              </span>
                            </S.Field>
                            <S.Field>
                              <strong>Mesa: </strong>
                              <br />
                              <span>{bill?.order?.board?.id}</span>
                            </S.Field>
                            <S.Field>
                              <strong>Itens: </strong>
                            </S.Field>
                          </Col>
                          <Col>
                            <S.Ammount>
                              <NumberFormat
                                className={payed ? "payed" : "pendent"}
                                value={bill?.total_amount}
                                displayType="text"
                                decimalSeparator=","
                                fixedDecimalScale
                                decimalScale={2}
                              />
                            </S.Ammount>
                          </Col>
                        </Row>
                        <Row>
                          <TableContainer>
                            <DataTable
                              noHeader
                              striped
                              dense
                              columns={[
                                {
                                  name: "Código",
                                  selector: "product.code",
                                  sortable: true
                                },
                                {
                                  name: "Produto",
                                  selector: "product.description",
                                  sortable: true
                                },
                                {
                                  name: "Qtde.",
                                  selector: "quantity",
                                  sortable: true,
                                  right: true
                                },
                                {
                                  name: "Vlr Unit.",
                                  selector: "product.resale_price",
                                  sortable: true,
                                  right: true,
                                  format: row =>
                                    row.product.resale_price.toLocaleString(
                                      undefined,
                                      {
                                        maximumFractionDigits: 2,
                                        minimumFractionDigits: 2
                                      }
                                    )
                                },
                                {
                                  name: "Total Parcial",
                                  selector: "subtotal",
                                  sortable: true,
                                  right: true,
                                  format: row =>
                                    parseFloat(row.subtotal).toLocaleString(
                                      undefined,
                                      {
                                        maximumFractionDigits: 2,
                                        minimumFractionDigits: 2
                                      }
                                    )
                                }
                              ]}
                              data={bill?.order?.items.filter(
                                o => o.status !== "Canceled"
                              )}
                              noDataComponent="Nenhum item lançado neste Pedido"
                              ptions={[10, 20, 30]}
                              paginationTotalRows={bill?.order?.items?.length}
                              paginationComponentOptions={{
                                rowsPerPageText: "Por Página",
                                rangeSeparatorText: "de"
                              }}
                            />
                          </TableContainer>
                        </Row>
                      </>
                    )}
                  </Col>
                </Row>
              </Col>
              <Col lg="5">
                {!loadingOrderDetail && (
                  <>
                    <Row>
                      <Col xl={6}>
                        <Button
                          color="primary"
                          type="button"
                          block
                          onClick={() => {
                            togglePaymentModal()
                          }}
                        >
                          Adicionar Pagamento
                        </Button>
                      </Col>
                      <Col xl={6}>
                        <LoadingButton
                          color="secondary"
                          type="button"
                          block
                          onClick={() => {
                            handleSavePaymentsSubmit()
                          }}
                          loading={loadingSavePayments}
                          disabled={loadingSavePayments}
                        >
                          Salvar Pagamento(s)
                        </LoadingButton>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <S.Field>
                          <Payments
                            payments={payments}
                            loadingCloseBill={loadingCloseBill}
                            totalAmount={bill?.total_amount}
                            handleSetPayed={handleSetPayed}
                            handleRemovePayment={handleRemovePayment}
                            handleBillSubmit={handleBillSubmit}
                          />
                        </S.Field>
                      </Col>
                    </Row>
                  </>
                )}
              </Col>
            </Row>
          </S.Container>
          {loader}
        </Main>
      )}
      <Modal
        isOpen={isAddPaymentOpened}
        toggle={() => togglePaymentModal()}
        centered
        size="lg"
      >
        <ModalHeader toggle={togglePaymentModal}>
          Adicionar Pagamento
        </ModalHeader>
        <Form ref={formRef} onSubmit={handleAddPaymentSubmit}>
          <ModalBody>
            <Row>
              <Col sm="6" md="8">
                <SelectOption
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={paymentTypesDropDown[0]}
                  isLoading={loading}
                  isClearable={false}
                  name="type_id"
                  options={paymentTypesDropDown}
                  label="Método de Pagamento"
                />
              </Col>
              <Col sm="6" md="4">
                <Input
                  aria-label="amount"
                  name="amount"
                  label="Valor à Pagar"
                  placeholder="0,00"
                  currency
                  type="text"
                  className="input-custom text-right"
                  disabled={loading}
                />
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <LoadingButton
              color="primary"
              type="submit"
              loading={loading}
              disabled={loading}
            >
              Confirmar
            </LoadingButton>
            <Button color="secondary" onClick={togglePaymentModal}>
              Fechar
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  )
}
