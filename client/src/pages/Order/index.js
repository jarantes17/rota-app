import React, { useState, useEffect, useRef, useCallback } from "react"
import { useStateWithCallbackLazy } from "use-state-with-callback"
import { Form } from "@unform/web"
import {
  Button,
  Col,
  Fade,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row
} from "reactstrap"

import { toast } from "react-toastify"
import Swal from "sweetalert2"
import * as Yup from "yup"

import DataTable from "react-data-table-component"
import update from "immutability-helper"
import { MdDelete } from "react-icons/md"
import {
  CheckBox,
  Input,
  LoadingButton,
  Progress,
  SelectOption,
  Textarea
} from "../../components/common"
import Main from "../../components/template/Main"

import { tryAwait } from "../../helpers"
import { orderService, boardService, productService } from "../../services"

import * as S from "./styles"
import {
  Header,
  ActionButton,
  DividerHoriz,
  TableContainer,
  TableButton
} from "../../styles/global"
import { OrderItem } from "./OrderItem"
import useFullPageLoader from "../../hooks/useFullPageLoader"

const orderSchema = Yup.object().shape({
  responsible_name: Yup.string().required("Nome do responsável é obrigatório"),
  status: Yup.string().required("Status é obrigatório"),
  board_id: Yup.string().required("Mesa é obrigatória")
})

const orderItemSchema = Yup.object().shape({
  product_id: Yup.string().required("Produto é obrigatório"),
  quantity: Yup.string().required("Quanitdade é obrigatória")
})

export const Order = props => {
  const [loader, showLoader, hideLoader] = useFullPageLoader()

  const formOrderRef = useRef(null)
  const formOrderItemRef = useRef(null)
  const [editMode, setEditMode] = useState(null)

  const [loadingOrders, setLoadingOrders] = useState(false)
  const [loadingBoards, setLoadingBoards] = useState(false)
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [loadingSave, setLoadingSave] = useState(false)
  const [isVisibleSaveButton, setIsVisibleSaveButton] = useState(false)

  const [orders, setOrders] = useState([])
  const [boards, setBoards] = useState([])
  const [boardsOption, setBoardsOption] = useState([])
  const [productsOption, setProductsOption] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [fadeInOrderForm, setFadeInOrderForm] = useState(false)
  const [isEnabledAddItem, setEnabledAddItem] = useState(false)
  const [isEnabledReady, setEnabledReady] = useState(false)
  const [isManageItemOpened, setManageItemOpened] = useState(false)

  const [order, setOrder] = useStateWithCallbackLazy(null)
  const [filteredOrder, setFilteredOrder] = useState(null)

  const [resaleProducts, setResaleProducts] = useState([])

  const orderStatus = [
    {
      value: "Opened",
      label: "Aberto"
    },
    {
      value: "Done",
      label: "Feito"
    },
    {
      value: "Closed",
      label: "Fechado"
    },
    {
      value: "Canceled",
      label: "Cancelado"
    }
  ]

  const toggleManageItemModal = () => {
    setManageItemOpened(!isManageItemOpened)
    if (isManageItemOpened) {
      setEnabledReady(true)
      setEnabledAddItem(false)
    }
  }

  const filterOrders = filter => {
    if (filter) {
      const filtered = orders.filter(
        ({ id, responsible_name, board: { code } }) =>
          responsible_name?.includes(filter) ||
          code?.includes(filter) ||
          id?.toString().includes(filter)
      )
      setFilteredOrders(filtered)
    } else {
      setFilteredOrders(orders)
    }
  }

  const fetchOpenedOrders = () => {
    tryAwait({
      promise: orderService.opened(),
      onResponse: ({
        data: {
          data: { orders }
        }
      }) => {
        setOrders(orders)
        setFilteredOrders(orders)

        if (filteredOrder?.id) {
          filterOrders(filteredOrder.id)
        }
      },
      onError: () => {
        toast.error("Erro ao buscar pedidos em aberto!")
      },
      onLoad: _loading => setLoadingOrders(_loading)
    })
  }

  const fetchResaleProducts = () => {
    tryAwait({
      promise: productService.fetchResale(),
      onResponse: ({
        data: {
          data: { products }
        }
      }) => {
        setResaleProducts(products)
        setProductsOption(
          products.map(p => {
            return {
              value: p.id,
              label: `${p.code} - ${p.description}`
            }
          })
        )
      },
      onLoad: _loading => setLoadingProducts(_loading)
    })
  }

  const retrieveBoards = () => {
    tryAwait({
      promise: boardService.fetch(),
      onResponse: ({
        data: {
          data: { boards }
        }
      }) => {
        setBoardsOption(
          boards.map(board => {
            return {
              value: board.id,
              label: board.code
            }
          })
        )
        setBoards(boards)
      },
      onError: () => {
        toast.error("Erro ao buscar mesas!")
      },
      onLoad: _loading => setLoadingBoards(_loading)
    })
  }

  const updateOrder = () => {
    const orderIndex = orders.findIndex(o => o.id === order.id)

    order.total_items = order.items
      .filter(a => a.status !== "Canceled")
      .map(item => item.quantity)
      .reduce((a, b) => a + b)
    order.total = order.items
      .filter(a => a.status !== "Canceled")
      .map(item => parseFloat(item.subtotal))
      .reduce((a, b) => a + b)

    const newOrders = update(orders, {
      $splice: [[orderIndex, 1, order]]
    })

    setOrders(newOrders)
  }

  const updateOrderItem = async order_item_id => {
    const itemIndex = order.items.findIndex(o => o.id === order_item_id)
    const orderItem = order.items.find(o => o.id === order_item_id)
    orderItem.status = "Canceled"

    const updatedOrder = update(order, {
      items: {
        $splice: [[itemIndex, 1, orderItem]]
      }
    })

    setOrder(updatedOrder, () => updateOrder())
  }

  const clearOrderForm = () => {
    setOrder(null)
    setFadeInOrderForm(false)
    formOrderRef.current.setErrors({})
    formOrderRef.current.reset()
  }

  const onEditClick = id => {
    const selectedOrder = orders.find(o => o.id === id)
    if (selectedOrder) {
      clearOrderForm()

      const formData = {
        responsible_name: selectedOrder.responsible_name,
        board_id: selectedOrder.board.id,
        for_delivery: selectedOrder.for_delivery,
        status: selectedOrder.status
      }

      setTimeout(() => {
        formOrderRef.current.setData({ ...formData })
      }, 50)

      setOrder(selectedOrder)
      setFadeInOrderForm(true)
      setEditMode(selectedOrder.id)

      setEnabledReady(true)
      setEnabledAddItem(false)
    }
  }

  const onCloseBillClick = id => {
    Swal.fire({
      icon: "question",
      title: "Tem certeza?",
      text: `Deseja fechar a pedido Nº ${id}`,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Não",
      confirmButtonText: "Sim"
    }).then(({ isConfirmed }) => {
      if (isConfirmed) {
        props.history.push({
          pathname: "/admin/cash",
          state: { order_id: id }
        })
      }
    })
  }

  const clearItems = () => {
    setOrders([])
    setFilteredOrders([])
  }

  const handleCreateOrderSubmit = useCallback(
    async form => {
      try {
        formOrderRef.current.setErrors({})
        await orderSchema.validate(form, {
          abortEarly: false
        })

        const board = boards.find(b => b.id === form.board_id)
        const newOrder = { ...form, board }

        setOrder(newOrder)
        setEnabledReady(false)
        setEnabledAddItem(true)
      } catch (err) {
        const validationErrors = {}
        if (err instanceof Yup.ValidationError) {
          err.inner.forEach(error => {
            validationErrors[error.path] = error.message
          })
          formOrderRef.current.setErrors(validationErrors)
        }
      }
    },
    [boards]
  )

  const handleEditOrderSubmit = useCallback(
    async form => {
      try {
        formOrderRef.current.setErrors({})
        await orderSchema.validate(form, {
          abortEarly: false
        })

        const board = boards.find(b => b.id === form.board_id)
        const editedOrder = {
          ...order,
          ...form,
          board
        }

        setOrder(editedOrder)
        setEnabledReady(false)
        setEnabledAddItem(true)
      } catch (err) {
        const validationErrors = {}
        if (err instanceof Yup.ValidationError) {
          err.inner.forEach(error => {
            validationErrors[error.path] = error.message
          })
          formOrderRef.current.setErrors(validationErrors)
        }
      }
    },
    [order, boards]
  )

  const handleAddItemSubmit = useCallback(
    async form => {
      try {
        formOrderItemRef.current.setErrors({})
        await orderItemSchema.validate(form, {
          abortEarly: false
        })

        const product = resaleProducts.find(p => p.id === form.product_id)
        const newItem = {
          ...form,
          product,
          subtotal: parseFloat(product.resale_price * form.quantity).toFixed(2),
          status: "Opened",
          quantity: parseInt(form.quantity, 10),
          order_id: order?.id
        }

        if (!order.items) order.items = []

        order.items.push(newItem)
        updateOrder()

        setManageItemOpened(false)
        setIsVisibleSaveButton(true)
        setFilteredOrders([order])
      } catch (err) {
        const validationErrors = {}
        if (err instanceof Yup.ValidationError) {
          err.inner.forEach(error => {
            validationErrors[error.path] = error.message
          })
          formOrderItemRef.current.setErrors(validationErrors)
        }
      }
    },
    [order, resaleProducts, boards]
  )

  const handleCancelItemSubmit = order_item_id => {
    Swal.fire({
      icon: "question",
      title: "Tem certeza?",
      text: "Essa ação é irreversivel!",
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Não",
      confirmButtonText: "Sim"
    }).then(({ isConfirmed }) => {
      if (isConfirmed) {
        const data = {
          order_id: order.id,
          order_item_id
        }
        tryAwait({
          promise: orderService.cancel(data),
          onResponse: ({ status }) => {
            if (status === 204) {
              updateOrderItem(order_item_id)
              toast.success("Item cancelado com sucesso sucesso!")
            }
          },
          onError: () => {
            toast.error("Erro ao cancelar item do pedido!")
          }
        })
      }
    })
  }

  const handleSaveOrderSubmit = () => {
    showLoader()
    if (order.id) {
      tryAwait({
        promise: orderService.update(order.id, order),
        onResponse: ({
          data: {
            data: { updatedOrder }
          }
        }) => {
          hideLoader()
          clearOrderForm()
          setFilteredOrder(updatedOrder)
          toast.success(`Pedido ${updatedOrder.id} atualizado com sucesso!`)
          clearItems()
          fetchOpenedOrders()
        },
        onError: () => {
          hideLoader()
          toast.error(`Erro ao atualizar o pedido ${order.id}`)
        },
        onLoad: _loading => {
          setLoadingSave(_loading)
        }
      })
    } else {
      tryAwait({
        promise: orderService.store(order),
        onResponse: ({
          data: {
            data: { newOrder }
          }
        }) => {
          hideLoader()
          clearOrderForm()
          setFilteredOrder(newOrder)
          toast.success(`Pedido ${newOrder.id} criado com sucesso!`)
          clearItems()
          fetchOpenedOrders()
        },
        onError: () => {
          hideLoader()
          toast.error("Erro ao inserir novo pedido")
        },
        onLoad: _loading => {
          setLoadingSave(_loading)
        }
      })
    }
  }

  const conditionalRowStyles = [
    {
      when: row => row.status === "Canceled",
      style: {
        backgroundColor: "#777",
        color: "white"
      }
    }
  ]

  useEffect(() => {
    fetchOpenedOrders()
    fetchResaleProducts()
    retrieveBoards()
  }, [])

  return (
    <Main
      title="Pedidos"
      subtitle="Gerenciamento de Pedidos"
      icon="FaClipboardList"
    >
      <S.Container>
        <Row>
          <Col sm="4">
            <Header>
              <h5 className="m-0">Pedidos em Aberto</h5>
              <ActionButton>
                <Button
                  color="primary"
                  onClick={() => {
                    setEditMode(null)
                    clearOrderForm()
                    setFadeInOrderForm(true)
                    setEnabledReady(true)
                    setEnabledAddItem(false)
                  }}
                >
                  Incluir Pedido
                </Button>
              </ActionButton>
            </Header>
            <Row className="mt-3">
              <Col>
                <Form ref={formOrderRef} className="form">
                  <Input
                    name="target-search"
                    placeholder="Pesquise o Pedido Aqui"
                    icon="FaSearch"
                    type="text"
                    onChange={e => {
                      filterOrders(e.target.value)
                    }}
                  />
                </Form>
                <S.OrdersContainer>
                  {filteredOrders.length > 0 &&
                    filteredOrders.map((order, index) => {
                      return (
                        <>
                          <OrderItem
                            order={order}
                            onEditClick={onEditClick}
                            onCloseBillClick={onCloseBillClick}
                          />
                          {index + 1 < filteredOrders.length && (
                            <DividerHoriz />
                          )}
                        </>
                      )
                    })}
                  {filteredOrders.length === 0 && !loadingOrders && (
                    <S.OrdersNotFoundInfo>
                      Nenhum pedido em aberto
                    </S.OrdersNotFoundInfo>
                  )}
                </S.OrdersContainer>
                {loadingOrders && (
                  <Progress content="Carregando pedidos em aberto.." />
                )}
              </Col>
            </Row>
          </Col>

          {/* <Divider /> */}

          <Col sm="8">
            <Fade in={fadeInOrderForm && !loadingBoards}>
              <Header>
                <h5 className="m-0">
                  {!editMode ? "Criar Pedido" : "Editar Pedido"}
                </h5>
              </Header>
              <Form
                ref={formOrderRef}
                onSubmit={
                  !editMode ? handleCreateOrderSubmit : handleEditOrderSubmit
                }
              >
                <fieldset disabled={!isEnabledReady}>
                  <Row>
                    <Col sm="8">
                      <Input
                        aria-label="responsible_name"
                        name="responsible_name"
                        label="Nome Responsável"
                        type="text"
                      />
                    </Col>
                    <Col
                      sm="4"
                      className="d-flex align-items-center justify-content-center"
                    >
                      <h2 className="">{order?.id}</h2>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="3" className="d-flex align-items-center">
                      <FormGroup check inline>
                        <CheckBox name="for_delivery" content="Para Entrega?" />
                      </FormGroup>
                    </Col>
                    <Col sm="5">
                      <SelectOption
                        className="basic-single"
                        classNamePrefix="select"
                        defaultValue={orderStatus[0]}
                        placeholder="Status do Pedido"
                        isClearable={false}
                        name="status"
                        options={orderStatus}
                        label="Status Pedido"
                      />
                    </Col>
                    <Col sm="4">
                      <SelectOption
                        className="basic-single"
                        classNamePrefix="select"
                        placeholder={
                          loadingBoards ? "Carregando.." : "Selecione a Mesa"
                        }
                        defaultValue={boardsOption[0]}
                        isClearable={false}
                        name="board_id"
                        isLoading={loadingBoards}
                        options={boardsOption}
                        label="Mesa"
                      />
                    </Col>
                  </Row>
                </fieldset>
                <Row className="mt-3">
                  <Col sm="12" md="6">
                    <Button
                      block
                      color="primary"
                      type="submit"
                      disabled={!isEnabledReady}
                    >
                      Pronto
                    </Button>
                  </Col>
                  <Col sm="12" md="6">
                    <Button
                      block
                      color="info"
                      disabled={!isEnabledAddItem}
                      onClick={() => toggleManageItemModal()}
                    >
                      Adicionar Item
                    </Button>
                  </Col>
                </Row>
              </Form>

              <div className="mt-4">
                <Header>
                  <h5 className="m-0">Items do Pedido</h5>
                </Header>
                {order?.items?.length > 0 && (
                  <>
                    <Row>
                      <TableContainer>
                        <DataTable
                          noHeader
                          striped
                          dense
                          conditionalRowStyles={conditionalRowStyles}
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
                            },
                            {
                              name: "Ações",
                              right: true,
                              cell: row =>
                                row.status !== "Canceled" && (
                                  <>
                                    <TableButton
                                      style={{ marginRight: 0 }}
                                      background="red"
                                      onClick={() => {
                                        handleCancelItemSubmit(row.id)
                                      }}
                                    >
                                      <MdDelete />
                                    </TableButton>
                                  </>
                                )
                            }
                          ]}
                          data={order.items}
                          noDataComponent="Nenhum item lançado neste Pedido"
                          ptions={[10, 20, 30]}
                          paginationTotalRows={order?.items?.length}
                          paginationComponentOptions={{
                            rowsPerPageText: "Por Página",
                            rangeSeparatorText: "de"
                          }}
                        />
                      </TableContainer>
                    </Row>
                    <Row className="mt-2">
                      <Col>
                        <LoadingButton
                          color="success"
                          type="button"
                          block
                          loading={loadingSave}
                          disabled={loadingSave}
                          visible={isVisibleSaveButton}
                          onClick={() => handleSaveOrderSubmit()}
                        >
                          Salvar Alterações
                        </LoadingButton>
                      </Col>
                    </Row>
                  </>
                )}
              </div>
            </Fade>
          </Col>
        </Row>
      </S.Container>

      <Modal
        isOpen={isManageItemOpened}
        toggle={() => toggleManageItemModal()}
        centered
      >
        <ModalHeader toggle={toggleManageItemModal}>Incluir Item</ModalHeader>
        <Form ref={formOrderItemRef} onSubmit={handleAddItemSubmit}>
          <ModalBody>
            <Row>
              <Col sm="12" md="9">
                <SelectOption
                  className="basic-single"
                  classNamePrefix="select"
                  placeholder="Selecione o Produto"
                  isClearable={false}
                  name="product_id"
                  options={productsOption}
                  isLoading={loadingProducts}
                  label="Produto"
                />
              </Col>
              <Col sm="12" md="3">
                <Input
                  aria-label="quantity"
                  name="quantity"
                  label="Quantidade"
                  className="text-right"
                  type="number"
                />
              </Col>
            </Row>
            <Row>
              <Col sm="12">
                <Textarea label="Observação" name="observation" rows="3" />
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" type="submit">
              Salvar
            </Button>
            <Button color="secondary" onClick={toggleManageItemModal}>
              Fechar
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
      {loader}
    </Main>
  )
}
