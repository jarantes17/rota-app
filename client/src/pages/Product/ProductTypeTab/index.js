import React, { useState, useEffect, useRef, useCallback } from "react"
import { Form } from "@unform/web"
import DataTable from "react-data-table-component"
import DataTableExtensions from "react-data-table-component-extensions"
import { format } from "date-fns"
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

import { toast } from "react-toastify"
import * as Yup from "yup"
import { Input } from "../../../components/common"
import { tryAwait } from "../../../helpers"
import { productTypeService } from "../../../services"

import {
  TableButton,
  DefaultContainer,
  TableContainer,
  Header,
  ActionButton
} from "../../../styles/global"

const productTypeSchema = Yup.object().shape({
  type: Yup.string().required("Tipo de Produto obrigatório")
})

export const ProductTypeTab = () => {
  const formRef = useRef(null)
  const [isDropdownButtonOpened, setDropDownButtonOpen] = useState(false)
  const toggleDropdown = () => setDropDownButtonOpen(!isDropdownButtonOpened)
  const [isRegisterOpened, setRegisterOpen] = useState(false)
  const [productTypes, setProductTypes] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingTable, setLoadingTable] = useState(false)
  const [editMode, setEditMode] = useState(null)

  const toggleRegisterModal = () => {
    setRegisterOpen(!isRegisterOpened)
  }

  const filteredProductTypes = () => {
    return productTypes
  }

  const clearState = () => {
    setEditMode(false)
  }

  const retrieveProductTypes = () => {
    tryAwait({
      promise: productTypeService.fetch(),
      onResponse: ({
        data: {
          data: { productTypes }
        }
      }) => {
        setProductTypes(productTypes)
      },
      onError: () => {
        toast.error("Erro ao buscar tipos de produto!")
      },
      onLoad: _loading => setLoadingTable(_loading)
    })
  }

  const handleRegisterSubmit = useCallback(
    async form => {
      try {
        formRef.current.setErrors({})
        await productTypeSchema.validate(form, {
          abortEarly: false
        })
        tryAwait({
          promise: productTypeService.store({ ...form }),
          onResponse: ({
            status,
            data: {
              data: { productType }
            }
          }) => {
            if (status === 201) {
              toast.success("Tipo de Produto cadastrado com sucesso!")
              setRegisterOpen(false)
              setProductTypes([...productTypes, productType])
              clearState()
            } else {
              toast.warning(
                "Não foi possível salvar o tipo de produto. Tente novamente mais tarde!"
              )
            }
          },
          onError: () => {
            toast.error("Erro ao cadastrar tipo de produto!")
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
    [productTypes]
  )

  const handleEditSubmit = useCallback(
    async form => {
      try {
        formRef.current.setErrors({})
        await productTypeSchema.validate(form, {
          abortEarly: false
        })
        tryAwait({
          promise: productTypeService.update(editMode, form),
          onResponse: ({
            status,
            data: {
              data: { productType }
            }
          }) => {
            if (status === 200) {
              toast.success("Tipo de Produto alterado com sucesso!")
              setRegisterOpen(false)
              productTypes[
                productTypes.findIndex(p => p.id === editMode)
              ] = productType
              setProductTypes(productTypes)
              clearState()
            } else {
              toast.warning(
                "Não foi possível alterar o tipo de produto. Tente novamente mais tarde!"
              )
            }
          },
          onError: () => {
            toast.error("Erro ao alterar tipo de produto!")
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
    [editMode, productTypes]
  )

  const handleDelete = id => {
    Swal.fire({
      title: "Tem certeza?",
      text: "Deseja realmente remover este item?",
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Não",
      confirmButtonText: "Sim"
    }).then(({ value }) => {
      if (value) {
        tryAwait({
          promise: productTypeService.remove(id),
          onResponse: () => {
            toast.success("Tipo de produto excluído com sucesso!")
            setProductTypes(productTypes.filter(s => s.id !== id))
          },
          onError: error => {
            toast.error("Erro ao excluir o tipo de produto!")
          }
        })
      }
    })
  }

  useEffect(() => {
    retrieveProductTypes()
  }, [])

  const columns = [
    {
      name: "Identificador",
      selector: "id",
      sortable: true
    },
    {
      name: "Tipo de Produto",
      selector: "type",
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
    data: filteredProductTypes()
  }

  return (
    <>
      <DefaultContainer>
        <Row>
          <Col sm={12}>
            <Header>
              <h5 className="m-0">Cadastro de Tipos</h5>
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
                        setEditMode(null)
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
                  data={filteredProductTypes()}
                  noDataComponent="Nenhum tipo de produto encontrado!"
                  pagination
                  paginationPerPage={20}
                  paginationRowsPerPageOptions={[10, 20, 30]}
                  paginationTotalRows={filteredProductTypes()?.length}
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
          {!editMode ? "Incluir Tipo de Produto" : "Editar Tipo de Produto"}
        </ModalHeader>
        <Form
          ref={formRef}
          onSubmit={!editMode ? handleRegisterSubmit : handleEditSubmit}
        >
          <ModalBody>
            <Row>
              <Col sm="12" md="12">
                <Input
                  aria-label="type"
                  name="type"
                  label="Tipo de Produto"
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
    </>
  )
}
