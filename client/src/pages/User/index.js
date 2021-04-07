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
import { MdEdit } from "react-icons/md"

import { toast } from "react-toastify"
import * as Yup from "yup"

import {
  CheckBox,
  Input,
  LoadingButton,
  SelectOption
} from "../../components/common"
import Main from "../../components/template/Main"
import { tryAwait } from "../../helpers"
import { userService, roleService } from "../../services"

import {
  TableButton,
  DefaultContainer,
  TableContainer,
  Header,
  ActionButton
} from "../../styles/global"

const userSchema = Yup.object().shape({
  name: Yup.string().required("Nome obrigatório"),
  surname: Yup.string().required("Sobrenome obrigatório"),
  email: Yup.string().email().required("E-mail obrigatório"),
  roles: Yup.array().required(
    "Selecione ao menos uma regras de acesso para o usuário"
  )
})

export const User = () => {
  const formRef = useRef(null)
  const [isDropdownButtonOpened, setDropDownButtonOpen] = useState(false)
  const toggleDropdown = () => setDropDownButtonOpen(!isDropdownButtonOpened)
  const [isRegisterOpened, setRegisterOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingTable, setLoadingTable] = useState(false)
  const [editMode, setEditMode] = useState(null)
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [selectedRoles, setSelectedRoles] = useState([])

  const toggleRegisterModal = () => {
    setRegisterOpen(!isRegisterOpened)
  }

  const filteredUsers = () => {
    return users
  }

  const clearState = () => {
    setEditMode(false)
  }

  const retrieveUsers = () => {
    tryAwait({
      promise: userService.fetch(),
      onResponse: ({
        data: {
          data: { users }
        }
      }) => {
        setUsers(users)
      },
      onError: () => {
        toast.error("Erro ao buscar usuários!")
      },
      onLoad: _loading => setLoadingTable(_loading)
    })
  }

  const retreiveRoles = () => {
    tryAwait({
      promise: roleService.fetch(),
      onResponse: ({
        data: {
          data: { roles }
        }
      }) => {
        setRoles(
          roles.map(role => {
            return {
              value: role.id,
              label: role.name
            }
          })
        )
      },
      onError: () => {
        toast.error("Erro ao buscar regras de acesso!")
      },
      onLoad: _loading => setLoading(_loading)
    })
  }

  const getStatus = status => {
    if (status === true) {
      return "A"
    }
    return "I"
  }

  const handleRegisterSubmit = useCallback(
    async form => {
      try {
        formRef.current.setErrors({})
        await userSchema.validate(form, {
          abortEarly: false
        })

        form.status = getStatus(form.status)

        tryAwait({
          promise: userService.store({ ...form }),
          onResponse: ({
            status,
            data: {
              data: { user }
            }
          }) => {
            if (status === 201) {
              toast.success("Usuário cadastrado com sucesso!")
              setRegisterOpen(false)
              setUsers([...users, user])
              clearState()
            } else {
              toast.warning(
                "Não foi possível salvar o usuário. Tente novamente mais tarde!"
              )
            }
          },
          onError: () => {
            toast.error("Erro ao cadastrar usuário!")
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
    [users]
  )

  const handleEditSubmit = useCallback(
    async form => {
      try {
        formRef.current.setErrors({})
        await userSchema.validate(form, {
          abortEarly: false
        })

        form.status = getStatus(form.status)

        tryAwait({
          promise: userService.update(editMode, form),
          onResponse: ({
            status,
            data: {
              data: { user }
            }
          }) => {
            if (status === 200) {
              toast.success("Usuário alterado com sucesso!")
              setRegisterOpen(false)
              users[users.findIndex(p => p.id === editMode)] = user
              setUsers(users)
              clearState()
            } else {
              toast.warning(
                "Não foi possível alterar o usuário. Tente novamente mais tarde!"
              )
            }
          },
          onError: () => {
            toast.error("Erro ao alterar usuário!")
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
    [editMode, users]
  )

  useEffect(() => {
    retrieveUsers()
    retreiveRoles()
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
      name: "Sobrenome",
      selector: "surname",
      sortable: true
    },
    {
      name: "E-mail",
      selector: "email",
      sortable: true
    },
    {
      name: "Status",
      selector: "status",
      sortable: true,
      cell: row => (
        <span className={row.status === "A" ? "text-success" : "text-primary"}>
          <strong>{row.status === "A" ? "Ativo" : "Inativo"}</strong>
        </span>
      )
    },
    {
      name: "Regras de Acesso",
      selector: "roles",
      sortable: false,
      cell: row => <span>[{row.roles.map(item => item.slug).join(", ")}]</span>
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
              toggleRegisterModal()
              setTimeout(() => {
                formRef.current.setData({ ...row })
                formRef.current.setFieldValue(
                  "roles",
                  row.roles.map(role => {
                    return {
                      value: role.id,
                      label: role.name
                    }
                  })
                )
                formRef.current.setFieldValue("status", row.status === "A")
                setEditMode(row.id)
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
    data: filteredUsers()
  }

  return (
    <Main title="Usuários" subtitle="Gerenciamento de Usuários" icon="FaUsers">
      <DefaultContainer>
        <Row>
          <Col sm={12}>
            <Header>
              <h5 className="m-0">Cadastro de Usuários</h5>
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
                        setEditMode(false)
                        setSelectedRoles([])
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
                  data={filteredUsers()}
                  noDataComponent="Nenhum usuário encontrado!"
                  pagination
                  paginationPerPage={20}
                  paginationRowsPerPageOptions={[10, 20, 30]}
                  paginationTotalRows={filteredUsers()?.length}
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
        size="lg"
        onOpened={() => console.log(selectedRoles)}
      >
        <ModalHeader toggle={toggleRegisterModal}>
          {!editMode ? "Incluir Usuário" : "Editar Usuário"}
        </ModalHeader>
        <Form
          ref={formRef}
          onSubmit={!editMode ? handleRegisterSubmit : handleEditSubmit}
        >
          <ModalBody>
            <Row>
              <Col sm="12" md="6">
                <Input
                  aria-label="name"
                  name="name"
                  label="Nome"
                  type="text"
                  disabled={loading}
                />
              </Col>
              <Col sm="12" md="6">
                <Input
                  aria-label="surname"
                  name="surname"
                  label="Sobrenome"
                  type="text"
                  disabled={loading}
                />
              </Col>
            </Row>
            <Row>
              <Col sm="12" md="6">
                <Input
                  aria-label="email"
                  name="email"
                  label="E-mail"
                  type="text"
                  disabled={loading}
                />
              </Col>
              <Col sm="12" md="6">
                <SelectOption
                  className="basic-multi-select"
                  classNamePrefix="select"
                  defaultValue={[selectedRoles]}
                  isLoading={loading}
                  isClearable={false}
                  isMulti
                  name="roles"
                  options={roles}
                  label="Regras de Acesso"
                  placeholder="Selecione as regras de acesso"
                />
              </Col>
            </Row>
            <Row>
              <Col sm="12" md="6" className="justify-content-end">
                <CheckBox name="status" content="Ativo" />
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
              Salvar
            </LoadingButton>
            <Button color="secondary" onClick={toggleRegisterModal}>
              Fechar
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </Main>
  )
}
