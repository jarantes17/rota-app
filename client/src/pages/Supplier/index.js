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
import { MdEdit } from "react-icons/md"
import Main from "../../components/template/Main"
import { tryAwait } from "../../helpers"
import { supplierService } from "../../services"

import { Input } from "../../components/common"

import {
  TableButton,
  DefaultContainer,
  TableContainer,
  Header,
  ActionButton
} from "../../styles/global"

const supplierSchema = Yup.object().shape({
  name: Yup.string().required("Nome é obrigatório")
})

export const Supplier = () => {
  const formRef = useRef(null)
  const [isDropdownButtonOpened, setDropDownButtonOpen] = useState(false)
  const [isRegisterOpened, setRegisterOpen] = useState(false)
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingTable, setLoadingTable] = useState(false)
  const [editMode, setEditMode] = useState(null)

  const toggleDropdown = () => {
    setDropDownButtonOpen(!isDropdownButtonOpened)
  }

  const toggleRegisterModal = () => {
    setRegisterOpen(!isRegisterOpened)
  }

  const filteredSuppliers = () => {
    return suppliers
  }

  const clearState = () => {}

  const retrieveSuppliers = () => {
    tryAwait({
      promise: supplierService.fetch(),
      onResponse: ({
        data: {
          data: { suppliers }
        }
      }) => {
        setSuppliers(suppliers)
      },
      onError: () => {
        toast.error("Erro ao buscar fornecedores!")
      },
      onLoad: _loading => setLoadingTable(_loading)
    })
  }

  const handleRegisterSubmit = useCallback(
    async form => {
      try {
        formRef.current.setErrors({})
        await supplierSchema.validate(form, {
          abortEarly: false
        })
        tryAwait({
          promise: supplierService.store({ ...form }),
          onResponse: ({
            status,
            data: {
              data: { supplier }
            }
          }) => {
            if (status === 201) {
              toast.success("Fornecedor cadastrado com sucesso!")
              setRegisterOpen(false)
              setSuppliers([...suppliers, supplier])
              clearState()
            } else {
              toast.warning(
                "Não foi possível salvar o fornecedor. Tente novamente mais tarde!"
              )
            }
          },
          onError: () => {
            toast.error("Erro ao cadastrar fornecedor!")
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
    [suppliers]
  )

  const handleEditSubmit = useCallback(
    async form => {
      try {
        formRef.current.setErrors({})
        await supplierSchema.validate(form, {
          abortEarly: false
        })
        tryAwait({
          promise: supplierService.update(editMode, form),
          onResponse: ({
            status,
            data: {
              data: { supplier }
            }
          }) => {
            if (status === 200) {
              toast.success("Fornecedor alterado com sucesso!")
              setRegisterOpen(false)
              suppliers[suppliers.findIndex(p => p.id === editMode)] = supplier
              setSuppliers(suppliers)
              clearState()
            } else {
              toast.warning(
                "Não foi possível alterar o fornecedor. Tente novamente mais tarde!"
              )
            }
          },
          onError: () => {
            toast.error("Erro ao alterar fornecedor!")
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
    [editMode, suppliers]
  )

  useEffect(() => {
    retrieveSuppliers()
  }, [])

  const columns = [
    {
      name: "Identificador",
      selector: "id",
      sortable: true
    },
    {
      name: "Nome",
      selector: "name",
      sortable: true
    },
    {
      name: "Cidade",
      selector: "city",
      sortable: true
    },
    {
      name: "Frete",
      selector: "freight",
      sortable: true,
      format: row =>
        row.freight !== null
          ? row.freight?.toLocaleString(undefined, {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2
            })
          : "0,00"
    },
    {
      name: "Tel/Cel",
      selector: "phone",
      sortable: true
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
        </>
      )
    }
  ]

  const tableData = {
    columns,
    data: filteredSuppliers()
  }

  return (
    <Main
      title="Fornecedores"
      subtitle="Cadastro de Fornecedores"
      icon="FaTruck"
    >
      <DefaultContainer>
        <Row>
          <Col sm={12}>
            <Header>
              <h5 className="m-0">Cadastro de Fornecedores</h5>
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
                  data={filteredSuppliers()}
                  noDataComponent="Nenhum fornecedor encontrado!"
                  pagination
                  paginationPerPage={20}
                  paginationRowsPerPageOptions={[10, 20, 30]}
                  paginationTotalRows={filteredSuppliers()?.length}
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
          {!editMode ? "Incluir Fornecedor" : "Editar Fornecedor"}
        </ModalHeader>
        <Form
          ref={formRef}
          onSubmit={!editMode ? handleRegisterSubmit : handleEditSubmit}
        >
          <input type="hidden" />
          <ModalBody>
            <Row>
              <Col sm="6">
                <Input
                  aria-label="name"
                  name="name"
                  label="Nome"
                  type="text"
                  disabled={loading}
                />
              </Col>
              <Col sm="6">
                <Input
                  aria-label="city"
                  name="city"
                  label="Cidade"
                  type="text"
                  disabled={loading}
                />
              </Col>
            </Row>
            <Row>
              <Col sm="6">
                <Input
                  aria-label="freight"
                  name="freight"
                  label="Frete"
                  type="text"
                  placeholder="0,00"
                  currency
                  className="input-custom text-right"
                  disabled={loading}
                />
              </Col>
              <Col sm="6">
                <Input
                  aria-label="phone"
                  name="phone"
                  label="Tel/Cel"
                  type="text"
                  className="input-custom"
                  disabled={loading}
                  mask="(99) 9999-99999"
                  maskChar={null}
                  isCellPhone
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
