import React, { useState, useEffect, useRef, useCallback } from "react"

import { Form } from "@unform/web"
import DataTable from "react-data-table-component"
import DataTableExtensions from "react-data-table-component-extensions"
import { format } from "date-fns"
import { toast } from "react-toastify"
import * as Yup from "yup"
import {
  Button,
  ButtonDropdown,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner
} from "reactstrap"
import Swal from "sweetalert2"
import { MdEdit, MdDelete } from "react-icons/md"
import { tryAwait } from "../../helpers"
import Main from "../../components/template/Main"
import { Input, SelectOption } from "../../components/common"

import * as S from "./styles"
import {
  TableButton,
  DefaultContainer,
  TableContainer,
  Header,
  ActionButton
} from "../../styles/global"
import { expenseService } from "../../services"

const expenseSchema = Yup.object().shape({})

export const Expense = () => {
  const formRef = useRef(null)
  const [isDropdownButtonOpened, setDropDownButtonOpen] = useState(false)
  const [isRegisterOpened, setRegisterOpen] = useState(false)
  const [expenses, setExpenses] = useState([])
  const [expenseTypes, setExpenseTypes] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingTable, setLoadingTable] = useState(false)
  const [editMode, setEditMode] = useState(null)

  const toggleDropdown = () => {
    setDropDownButtonOpen(!isDropdownButtonOpened)
  }

  const toggleRegisterModal = () => {
    setRegisterOpen(!isRegisterOpened)
  }

  const filteredExpenses = () => {
    return expenses
  }

  const clearState = () => {}

  const retrieveExpenses = () => {
    tryAwait({
      promise: expenseService.fetch(),
      onResponse: ({
        data: {
          data: { exepenses, expenseTypes }
        }
      }) => {
        setExpenses(exepenses)
        setExpenseTypes(
          expenseTypes.map(uom => {
            return {
              value: uom.description,
              label: uom.description
            }
          })
        )
      },
      onError: () => {
        toast.error("Erro ao buscar despesas!")
      },
      onLoad: _loading => setLoadingTable(_loading)
    })
  }

  const handleRegisterSubmit = useCallback(
    async form => {
      try {
        formRef.current.setErrors({})
        await expenseSchema.validate(form, {
          abortEarly: false
        })
        tryAwait({
          promise: expenseService.store({ ...form }),
          onResponse: ({
            status,
            data: {
              data: { expense }
            }
          }) => {
            if (status === 201) {
              toast.success("Despesa cadastrada com sucesso!")
              setRegisterOpen(false)
              setExpenses([...expenses, expense])
              clearState()
            } else {
              toast.warning(
                "Não foi possível salvar a despesa. Tente novamente mais tarde!"
              )
            }
          },
          onError: () => {
            toast.error("Erro ao cadastrar despesa!")
          },
          onLoad: _loading => setLoading(_loading)
        })
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
    [expenses]
  )

  const handleEditSubmit = useCallback(async form => {
    try {
      formRef.current.setErrors({})
      await expenseSchema.validate(form, {
        abortEarly: false
      })
      tryAwait({
        promise: expenseService.update(editMode, form),
        onResponse: ({
          status,
          data: {
            data: { expense }
          }
        }) => {
          if (status === 200) {
            toast.success("Despesa alterada com sucesso!")
            setRegisterOpen(false)
            expenses[expenses.findIndex(p => p.id === editMode)] = expense
            setExpenses(expenses)
            clearState()
          } else {
            toast.warning(
              "Não foi possível alterar a despensa. Tente novamente mais tarde!"
            )
          }
        },
        onError: () => {
          toast.error("Erro ao alterar despesa!")
        },
        onLoad: _loading => setLoading(_loading)
      })
    } catch (err) {
      const validationErrors = {}
      if (err instanceof Yup.ValidationError) {
        err.inner.forEach(error => {
          validationErrors[error.path] = error.message
        })
        formRef.current.setErrors(validationErrors)
      }
    }
  })

  const handleDelete = id => {
    Swal.fire({
      title: "Tem certeza?",
      text: "Deseja realmente remover esta despesa?",
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Não",
      confirmButtonText: "Sim"
    }).then(({ value }) => {
      if (value) {
        tryAwait({
          promise: expenseService.remove(id),
          onResponse: () => {
            toast.success("Despesa excluída com sucesso!")
            setExpenses(expenses.filter(s => s.id !== id))
          },
          onError: () => {
            toast.error("Erro ao excluir a despesa!")
          }
        })
      }
    })
  }

  useEffect(() => {
    retrieveExpenses()
  }, [])

  const columns = [
    {
      name: "Tipo",
      selector: "type.description",
      sortable: true
    },
    {
      name: "Data",
      selector: "pay_date",
      sortable: true,
      format: row => format(new Date(row.pay_date), "dd/MM/yyyy")
    },
    {
      name: "Valor",
      selector: "amount",
      sortable: true
    },
    {
      name: "Observação",
      selector: "observation",
      sortable: true
    },
    {
      name: "Ações",
      right: true,
      cell: row => (
        <>
          <TableButton
            background="var(--dark)"
            onClick={() => {
              setEditMode(row.id)
              toggleRegisterModal()
              setTimeout(() => {
                formRef.current.setData({ ...row })
              }, 50)
            }}
          >
            <MdEdit />
          </TableButton>
          <TableButton
            style={{ marginRight: 0 }}
            background="red"
            onClick={() => {
              handleDelete(row.id)
            }}
          >
            <MdDelete />
          </TableButton>
        </>
      )
    }
  ]

  const tableData = {
    columns,
    data: filteredExpenses()
  }

  return (
    <Main
      title="Despesas"
      subtitle="Cadastro de Despesas"
      icon="FaFileInvoiceDollar"
    >
      <DefaultContainer>
        <Row>
          <Col sm={12}>
            <Header>
              <h5 className="m-0">Cadastro de Despesas</h5>
              <ActionButton>
                <ButtonDropdown
                  isOpen={isDropdownButtonOpened}
                  toggle={toggleDropdown}
                  disabled={loading}
                >
                  <DropdownToggle caret color="secondary">
                    Selecione
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem
                      onClick={() => {
                        toggleRegisterModal()
                      }}
                    >
                      Incluir
                    </DropdownItem>
                  </DropdownMenu>
                </ButtonDropdown>
              </ActionButton>
            </Header>
            <TableContainer>
              <DataTableExtensions filterPlaceholder="Filtrar" {...tableData}>
                <DataTable
                  noHeader
                  className="mt-2"
                  striped
                  dense
                  progressPending={loadingTable}
                  progressComponent={
                    <div>
                      <Spinner size="sm" color="primary" />
                      <span className="ml-2">Carregando..</span>
                    </div>
                  }
                  columns={columns}
                  data={filteredExpenses()}
                  noDataComponent="Nenhuma despesa encontrada!"
                  pagination
                  paginationPerPage={20}
                  paginationRowsPerPageOptions={[10, 20, 30]}
                  paginationTotalRows={filteredExpenses()?.length}
                  paginationComponentOptions={{
                    rowsPerPageText: "Por Página",
                    rangeSeparatorText: "de"
                  }}
                />
              </DataTableExtensions>
            </TableContainer>
          </Col>
        </Row>
      </DefaultContainer>

      <Modal
        isOpen={isRegisterOpened}
        toggle={() => toggleRegisterModal()}
        centered
      >
        <ModalHeader toggle={toggleRegisterModal}>
          {!editMode ? "Incluir Despesa" : "Editar Despesa"}
        </ModalHeader>
        <Form
          ref={formRef}
          onSubmit={!editMode ? handleRegisterSubmit : handleEditSubmit}
        >
          <input type="hidden" />
          <ModalBody>
            <Row>
              <Col xl="8">
                <SelectOption
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={expenseTypes[0]}
                  isLoading={loading}
                  isClearable={false}
                  name="type"
                  options={expenseTypes}
                  label="Tipo de Despesa"
                />
              </Col>
              <Col xl="4">
                <Input
                  aria-label="amount"
                  name="amount"
                  label="Valor"
                  type="text"
                  placeholder="0,00"
                  currency
                  className="input-custom text-right"
                  disabled={loading}
                />
              </Col>
            </Row>
            <Row>
              <Col xl="12">
                <Input
                  aria-label="pay_date"
                  name="pay_date"
                  label="Data do Pagamento"
                  type="text"
                  disabled={loading}
                />
              </Col>
            </Row>
            <Row>
              <Col xl="12">
                <Input
                  aria-label="observation"
                  name="observation"
                  label="Observação"
                  type="text"
                  disabled={loading}
                />
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" type="submit" disabled={loading}>
              Salvar
            </Button>
            <Button color="secondary" onClick={toggleRegisterModal}>
              Fechar
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </Main>
  )
}
