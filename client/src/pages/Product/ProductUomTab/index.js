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
import { productUomService } from "../../../services"

import * as S from "./styles"
import {
  TableButton,
  DefaultContainer,
  TableContainer,
  Header,
  ActionButton
} from "../../../styles/global"

const productUomSchema = Yup.object().shape({
  code: Yup.string()
    .required("Código é obrigatório")
    .min(2, "No mínimo, 2 caracteres")
    .max(3, "No máximo, 3 caracteres"),
  description: Yup.string().required("Descrição é obrigatória")
})

export const ProductUomTab = () => {
  const formRef = useRef(null)
  const [isDropdownButtonOpened, setDropDownButtonOpen] = useState(false)
  const toggleDropdown = () => setDropDownButtonOpen(!isDropdownButtonOpened)
  const [isRegisterOpened, setRegisterOpen] = useState(false)
  const [productUoms, setProductUoms] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingTable, setLoadingTable] = useState(false)
  const [editMode, setEditMode] = useState(null)

  const toggleRegisterModal = () => {
    setRegisterOpen(!isRegisterOpened)
  }

  const filteredProductUoms = () => {
    return productUoms
  }

  const clearState = () => {
    setEditMode(false)
  }

  const retrieveProductUoms = () => {
    tryAwait({
      promise: productUomService.fetch(),
      onResponse: ({
        data: {
          data: { productUoms }
        }
      }) => {
        setProductUoms(productUoms)
      },
      onError: () => {
        toast.error("Erro ao buscar unidades de medida!")
      },
      onLoad: _loading => setLoadingTable(_loading)
    })
  }

  const handleRegisterSubmit = useCallback(
    async form => {
      try {
        formRef.current.setErrors({})
        await productUomSchema.validate(form, {
          abortEarly: false
        })
        tryAwait({
          promise: productUomService.store({ ...form }),
          onResponse: ({
            status,
            data: {
              data: { productUom }
            }
          }) => {
            if (status === 201) {
              toast.success("Unidade de Medida cadastrada com sucesso!")
              setRegisterOpen(false)
              setProductUoms([...productUoms, productUom])
              clearState()
            } else {
              toast.warning(
                "Não foi possível salvar a unidade de medida. Tente novamente mais tarde!"
              )
            }
          },
          onError: () => {
            toast.error("Erro ao cadastrar unidade de medida!")
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
    [productUoms]
  )

  const handleEditSubmit = useCallback(async form => {
    try {
      formRef.current.setErrors({})
      await productUomSchema.validate(form, {
        abortEarly: false
      })
      tryAwait({
        promise: productUomService.update(editMode, form),
        onResponse: ({
          status,
          data: {
            data: { productUom }
          }
        }) => {
          if (status === 200) {
            toast.success("Unidade de Medida alterada com sucesso!")
            setRegisterOpen(false)
            productUoms[
              productUoms.findIndex(p => p.id === editMode)
            ] = productUom
            setProductUoms(productUoms)
            clearState()
          } else {
            toast.warning(
              "Não foi possível alterar a unidade de medida. Tente novamente mais tarde!"
            )
          }
        },
        onError: () => {
          toast.error("Erro ao alterar unidade de medida!")
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
      text: "Deseja realmente remover este item?",
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Não",
      confirmButtonText: "Sim"
    }).then(({ value }) => {
      if (value) {
        tryAwait({
          promise: productUomService.remove(id),
          onResponse: () => {
            toast.success("Unidade de medida excluída com sucesso!")
            setProductUoms(productUoms.filter(s => s.id !== id))
          },
          onError: error => {
            toast.error("Erro ao excluir o unidade de medida!")
          }
        })
      }
    })
  }

  useEffect(() => {
    retrieveProductUoms()
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
      name: "Descrição",
      selector: "description",
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
    data: filteredProductUoms()
  }

  return (
    <>
      <DefaultContainer>
        <Row>
          <Col sm={12}>
            <Header>
              <h5 className="m-0">Cadastro de Unidade de Medida</h5>
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
                  data={filteredProductUoms()}
                  noDataComponent="Nenhuma unidade de medida encontrada!"
                  pagination
                  paginationPerPage={20}
                  paginationRowsPerPageOptions={[10, 20, 30]}
                  paginationTotalRows={filteredProductUoms()?.length}
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
          {!editMode
            ? "Incluir Unidade de Medida"
            : "Alterar Unidade de Medida"}
        </ModalHeader>
        <Form
          ref={formRef}
          onSubmit={!editMode ? handleRegisterSubmit : handleEditSubmit}
        >
          <ModalBody>
            <Row>
              <Col sm="12" md="12" lg="4">
                <Input
                  aria-label="code"
                  name="code"
                  label="Código"
                  type="text"
                  maxLength={3}
                  disabled={loading}
                />
              </Col>
              <Col sm="12" md="12" lg="8">
                <Input
                  aria-label="description"
                  name="description"
                  label="Descrição"
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
