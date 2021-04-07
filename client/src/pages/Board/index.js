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
import Main from "../../components/template/Main"
import { tryAwait } from "../../helpers"
import { boardService } from "../../services"

import { Input, SelectOption } from "../../components/common"

import * as S from "./styles"
import {
  DefaultContainer,
  TableContainer,
  Header,
  ActionButton
} from "../../styles/global"

const boardSchema = Yup.object().shape({
  code: Yup.string()
    .required("Código é obrigatório")
    .min(3, "No mínimo, 3 caracteres")
    .max(3, "No máximo, 3 caracteres")
})

const boardToLeaveSchema = Yup.object().shape({
  ids_to_leave: Yup.string().required(
    "Selecione ao menos uma mesa para liberar"
  )
})

export const Board = () => {
  const formRef = useRef(null)
  const leaveRef = useRef(null)
  const [isDropdownButtonOpened, setDropDownButtonOpen] = useState(false)
  const [isRegisterOpened, setRegisterOpen] = useState(false)
  const [isLeaveOpened, setLeaveOpen] = useState(false)
  const [boards, setBoards] = useState([])
  const [busyBoards, setBusyBoards] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingTable, setLoadingTable] = useState(false)

  const toggleDropdown = () => {
    setDropDownButtonOpen(!isDropdownButtonOpened)
  }

  const toggleRegisterModal = () => {
    setRegisterOpen(!isRegisterOpened)
  }

  const toggleLeaveModal = () => {
    setLeaveOpen(!isLeaveOpened)
  }

  const filteredBoards = () => {
    return boards
  }

  const clearState = () => {}

  const retrieveBoards = () => {
    tryAwait({
      promise: boardService.fetch(),
      onResponse: ({
        data: {
          data: { boards }
        }
      }) => {
        setBoards(boards)
      },
      onError: () => {
        toast.error("Erro ao buscar mesas!")
      },
      onLoad: _loading => setLoadingTable(_loading)
    })
  }

  const retrieveBusyBoards = () => {
    tryAwait({
      promise: boardService.busy(),
      onResponse: ({
        data: {
          data: { boards }
        }
      }) => {
        setBusyBoards(
          boards.map(board => {
            return {
              value: board.id,
              label: board.code
            }
          })
        )
      },
      onError: () => {
        toast.error("Erro ao buscar mesas ocupadas!")
      },
      onLoad: _loading => setLoading(_loading)
    })
  }

  const handleRegisterSubmit = useCallback(
    async form => {
      try {
        formRef.current.setErrors({})
        await boardSchema.validate(form, {
          abortEarly: false
        })
        tryAwait({
          promise: boardService.store({ ...form }),
          onResponse: ({
            status,
            data: {
              data: { board }
            }
          }) => {
            if (status === 201) {
              toast.success("Mesa cadastrada com sucesso!")
              setRegisterOpen(false)
              setBoards([...boards, board])
              clearState()
            } else {
              toast.warning(
                "Não foi possível salvar a mesa. Tente novamente mais tarde!"
              )
            }
          },
          onError: () => {
            toast.error("Erro ao cadastrar mesa!")
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
    [boards]
  )

  const handleLeaveSubmit = useCallback(async form => {
    try {
      leaveRef.current.setErrors({})
      await boardToLeaveSchema.validate(form, {
        abortEarly: false
      })
      tryAwait({
        promise: boardService.leave({ ...form }),
        onResponse: ({ status }) => {
          if (status === 204) {
            toast.success("Mesa(s) liberada(s) com sucesso!")
            setLeaveOpen(false)
            retrieveBoards()
          } else {
            toast.warning(
              "Não foi possível liberar a(s) mesa(s). Tente novamente mais tarde!"
            )
          }
        },
        onError: () => {
          toast.error("Erro ao liberar mesa(s)!")
        },
        onLoad: _loading => setLoading(_loading)
      })
    } catch (err) {
      const validationErrors = {}
      if (err instanceof Yup.ValidationError) {
        err.inner.forEach(error => {
          validationErrors[error.path] = error.message
        })
        leaveRef.current.setErrors(validationErrors)
      }
    }
  }, [])

  useEffect(() => {
    retrieveBoards()
  }, [])

  const columns = [
    {
      name: "Identificador",
      selector: "id",
      sortable: true
    },
    {
      name: "Código",
      selector: "code",
      sortable: true
    },
    {
      name: "Status",
      selector: "status",
      sortable: true,
      cell: row => (
        <span
          className={row.status === "Free" ? "text-success" : "text-primary"}
        >
          <strong>{row.status === "Free" ? "Livre" : "Ocupada"}</strong>
        </span>
      )
    },
    {
      name: "Data Criação",
      selector: "created_at",
      sortable: true,
      format: row => format(new Date(row.created_at), "dd/MM/yyyy HH:mm:ss")
    },
    {
      name: "Data Atualização",
      selector: "updated_at",
      sortable: true,
      format: row =>
        row.updated_at
          ? format(new Date(row.updated_at), "dd/MM/yyyy HH:mm:ss")
          : null
    }
  ]

  const tableData = {
    columns,
    data: filteredBoards()
  }

  return (
    <Main title="Mesas" subtitle="Cadastro de Mesas" icon="FaChair">
      <DefaultContainer>
        <Row>
          <Col sm={12}>
            <Header>
              <h5 className="m-0">Cadastro de Mesas</h5>
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
                    <DropdownItem
                      onClick={() => {
                        toggleLeaveModal()
                      }}
                    >
                      Liberar
                    </DropdownItem>
                  </DropdownMenu>
                </ButtonDropdown>
              </ActionButton>
            </Header>
            <TableContainer>
              <DataTableExtensions filterPlaceholder="Filtrar" {...tableData}>
                <DataTable
                  className="mt-2"
                  noHeader
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
                  data={filteredBoards()}
                  noDataComponent="Nenhuma mesa encontrada!"
                  pagination
                  paginationPerPage={20}
                  paginationRowsPerPageOptions={[10, 20, 30]}
                  paginationTotalRows={filteredBoards()?.length}
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
        <ModalHeader toggle={toggleRegisterModal}>Incluir Mesa</ModalHeader>
        <Form ref={formRef} onSubmit={handleRegisterSubmit}>
          <input type="hidden" />
          <ModalBody>
            <Row>
              <Col sm="12">
                <Input
                  aria-label="code"
                  name="code"
                  label="Código"
                  type="text"
                  maxLength={3}
                  disabled={loading}
                />
                <Input type="hidden" name="status" value="Free" />
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

      <Modal
        onOpened={() => retrieveBusyBoards()}
        onClosed={() => retrieveBoards()}
        isOpen={isLeaveOpened}
        toggle={() => toggleLeaveModal()}
        centered
        onOp
      >
        <ModalHeader toggle={toggleLeaveModal}>Liberar Mesa</ModalHeader>
        <Form ref={leaveRef} onSubmit={handleLeaveSubmit}>
          <ModalBody>
            <Row>
              <Col sm="12">
                <SelectOption
                  className="basic-multi-select"
                  classNamePrefix="select"
                  defaultValue={null}
                  isLoading={loading}
                  isClearable={false}
                  isMulti
                  name="ids_to_leave"
                  options={busyBoards}
                  label="Mesas Ocupadas"
                  placeholder="Selecione uma ou mais mesas"
                />
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" type="submit" disabled={loading}>
              Liberar
            </Button>
            <Button color="secondary" onClick={toggleLeaveModal}>
              Fechar
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </Main>
  )
}
