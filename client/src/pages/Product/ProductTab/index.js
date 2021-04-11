import React, { useState, useEffect, useRef, useCallback } from "react"
import { Form } from "@unform/web"
import DataTable from "react-data-table-component"
import DataTableExtensions from "react-data-table-component-extensions"
import ImageUploader from "react-images-upload"
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
  Spinner,
  FormGroup
} from "reactstrap"
import Swal from "sweetalert2"
import { MdEdit, MdDelete } from "react-icons/md"

import { toast } from "react-toastify"
import * as Yup from "yup"
import {
  CheckBox,
  Input,
  LoadingButton,
  SelectOption
} from "../../../components/common"
import { tryAwait } from "../../../helpers"
import {
  productService,
  productUomService,
  productTypeService
} from "../../../services"

import {
  TableButton,
  DefaultContainer,
  TableContainer,
  Header,
  ActionButton
} from "../../../styles/global"

const productSchema = Yup.object().shape({
  code: Yup.string().required("Código obrigatório"),
  description: Yup.string()
    .required("Descrição obrigatória")
    .max(100, "O limite máx. de caractéres e de 100"),
  uom_id: Yup.number().required("Unidade de Medida obrigatória"),
  type_id: Yup.number().required("Tipo de produto obrigatória")
})

export const ProductTab = () => {
  const formRef = useRef(null)
  const [isDropdownButtonOpened, setDropDownButtonOpen] = useState(false)
  const toggleDropdown = () => setDropDownButtonOpen(!isDropdownButtonOpened)
  const [isRegisterOpened, setRegisterOpen] = useState(false)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingTable, setLoadingTable] = useState(false)
  const [editMode, setEditMode] = useState(null)
  const [picture, setPicture] = useState(null)
  const [productCode, setProductCode] = useState(null)
  const [productTypes, setProductTypes] = useState([])
  const [productUoms, setProductUoms] = useState([])
  const [defaultImages, setDefaultImages] = useState([])

  const onDrop = _picture => {
    setPicture(_picture)
  }

  const loadDefaultImage = url => {
    setDefaultImages([url])
  }

  const toggleRegisterModal = () => {
    setRegisterOpen(!isRegisterOpened)
  }

  const filteredProducts = () => {
    return products
  }

  const clearState = () => {
    setEditMode(false)
  }

  const retrieveProducts = () => {
    tryAwait({
      promise: productService.fetch(),
      onResponse: ({
        data: {
          data: { products }
        }
      }) => {
        setProducts(products)
      },
      onError: () => {
        toast.error("Erro ao carregar Produtos")
      },
      onLoad: _loading => setLoadingTable(_loading)
    })
  }

  const retreiveProductCode = () => {
    if (!editMode) {
      tryAwait({
        promise: productService.getProductCode(),
        onResponse: ({ data: { code } }) => {
          setProductCode(code)
        },
        onError: () => {
          toast.error("Erro ao buscar código do produto!")
        },
        onLoad: _loading => setLoading(_loading)
      })
    }
  }

  const retrieveProductUoms = () => {
    tryAwait({
      promise: productUomService.fetch(),
      onResponse: ({
        data: {
          data: { productUoms }
        }
      }) => {
        setProductUoms(
          productUoms.map(uom => {
            return {
              value: uom.id,
              label: uom.description
            }
          })
        )
      },
      onError: () => {
        toast.error("Erro ao buscar unidades de medida!")
      },
      onLoad: _loading => setLoading(_loading)
    })
  }

  const retrieveProductTypes = () => {
    tryAwait({
      promise: productTypeService.fetch(),
      onResponse: ({
        data: {
          data: { productTypes }
        }
      }) => {
        setProductTypes(
          productTypes.map(type => {
            return {
              value: type.id,
              label: type.type
            }
          })
        )
      },
      onError: () => {
        toast.error("Erro ao buscar tipos de produto!")
      },
      onLoad: _loading => setLoading(_loading)
    })
  }

  const handleRegisterSubmit = useCallback(
    async form => {
      try {
        const formData = new FormData()
        if (picture.length > 0) {
          formData.append("file", picture[0])
        }

        Object.keys(form).map(key => {
          return formData.append(key, form[key])
        })

        formRef.current.setErrors({})
        await productSchema.validate(form, {
          abortEarly: false
        })

        const header = {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
        tryAwait({
          promise: productService.store(formData, header),
          onResponse: ({
            status,
            data: {
              data: { product }
            }
          }) => {
            if (status === 201) {
              toast.success("Produto cadastrado com sucesso!")
              setRegisterOpen(false)
              setProducts([...products, product])
              clearState()
            } else {
              toast.warning(
                "Não foi possível salvar o produto. Tente novamente mais tarde!"
              )
            }
          },
          onError: () => {
            toast.error("Erro ao cadastrar produto!")
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
    [products, picture]
  )

  const handleEditSubmit = useCallback(
    async form => {
      try {
        formRef.current.setErrors({})
        await productSchema.validate(form, {
          abortEarly: false
        })
        tryAwait({
          promise: productService.update(editMode, form),
          onResponse: ({
            status,
            data: {
              data: { product }
            }
          }) => {
            if (status === 200) {
              toast.success("Produto alterado com sucesso!")
              setRegisterOpen(false)
              products[products.findIndex(p => p.id === editMode)] = product
              setProducts(products)
              clearState()
            } else {
              toast.warning(
                "Não foi possível alterar o produto. Tente novamente mais tarde!"
              )
            }
          },
          onError: () => {
            toast.error("Erro ao alterar produto!")
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
    [editMode, products]
  )

  const handleDelete = id => {
    Swal.fire({
      title: "Tem certeza?",
      text: "Deseja realmente remover este item?",
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Não",
      confirmButtonText: "Sim",
      confirmButtonColor: "#ff1616"
    }).then(({ value }) => {
      if (value) {
        tryAwait({
          promise: productService.remove(id),
          onResponse: () => {
            toast.success("Produto excluído com sucesso!")
            setProducts(products.filter(s => s.id !== id))
          },
          onError: () => {
            toast.error("Erro ao excluir o produto!")
          }
        })
      }
    })
  }

  useEffect(() => {
    retrieveProducts()
    retrieveProductUoms()
    retrieveProductTypes()
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
      name: "Tipo",
      selector: "type.type",
      sortable: true
    },
    {
      name: "U.M.",
      selector: "uom.code",
      sortable: true
    },
    {
      name: "Volume/Peso",
      selector: "volume",
      sortable: true
    },
    {
      name: "Valor Compra",
      selector: "purchase_price",
      sortable: true,
      format: row =>
        (row.purchase_price || 0).toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2
        })
    },
    {
      name: "Valor Venda",
      selector: "resale_price",
      sortable: true,
      format: row =>
        (row.resale_price || 0).toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2
        })
    },
    {
      name: "Revenda?",
      selector: "resale_product",
      sortable: true,
      cell: row => <span>{row.resale_product ? "Sim" : "Não"}</span>
    },
    {
      name: "Estoque?",
      selector: "stock_control",
      sortable: true,
      cell: row => <span>{row.stock_control ? "Sim" : "Não"}</span>
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
                loadDefaultImage(row.image.url)
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
    data: filteredProducts()
  }

  return (
    <>
      <DefaultContainer>
        <Row>
          <Col sm={12}>
            <Header>
              <h5 className="m-0">Cadastro de Produtos</h5>
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
                  data={filteredProducts()}
                  noDataComponent="Nenhum produto encontrado!"
                  pagination
                  paginationPerPage={20}
                  paginationRowsPerPageOptions={[10, 20, 30]}
                  paginationTotalRows={filteredProducts()?.length}
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
        onOpened={() => retreiveProductCode()}
        onClosed={() => setDefaultImages([])}
        isOpen={isRegisterOpened}
        toggle={() => toggleRegisterModal()}
        centered
        size="lg"
      >
        <ModalHeader toggle={toggleRegisterModal}>
          {!editMode ? "Incluir Produto" : "Editar Produto"}
        </ModalHeader>
        <Form
          ref={formRef}
          onSubmit={!editMode ? handleRegisterSubmit : handleEditSubmit}
        >
          <ModalBody>
            <Row>
              <Col sm="12" md="4">
                <Input
                  aria-label="code"
                  name="code"
                  label="Código"
                  type="text"
                  disabled
                  value={productCode}
                />
              </Col>
              <Col sm="12" md="8">
                <Input
                  aria-label="description"
                  name="description"
                  label="Descrição"
                  type="text"
                  disabled={loading}
                />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col sm="12" md="4">
                <Input
                  aria-label="volume"
                  name="volume"
                  label="Volume/Peso"
                  type="text"
                  mask="99999"
                  maskChar=""
                  className="input-custom text-right"
                  disabled={loading}
                />
              </Col>
              <Col sm="12" md="4">
                <Input
                  aria-label="purchase_price"
                  name="purchase_price"
                  label="Valor Compra"
                  placeholder="0,00"
                  currency
                  type="text"
                  className="input-custom text-right"
                  disabled={loading}
                />
              </Col>
              <Col sm="12" md="4">
                <Input
                  aria-label="resale_price"
                  name="resale_price"
                  label="Valor Venda"
                  placeholder="0,00"
                  currency
                  type="text"
                  className="input-custom text-right"
                  disabled={loading}
                />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col sm="12" md="4">
                <FormGroup check inline>
                  <CheckBox
                    name="resale_product"
                    content="Produto de Revenda?"
                  />
                </FormGroup>
                <FormGroup check inline>
                  <CheckBox
                    name="stock_control"
                    content="Controle de Estoque?"
                  />
                </FormGroup>
              </Col>
              <Col sm="12" md="4">
                <SelectOption
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={productUoms[0]}
                  isLoading={loading}
                  isClearable={false}
                  name="uom_id"
                  options={productUoms}
                  label="Unid. Medida"
                />
              </Col>
              <Col sm="12" md="4">
                <SelectOption
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={productTypes[0]}
                  isLoading={loading}
                  isClearable={false}
                  name="type_id"
                  options={productTypes}
                  label="Tipo"
                />
              </Col>
            </Row>
            <Row>
              <Col sm="12">
                <ImageUploader
                  withIcon={false}
                  withPreview
                  withLabel
                  name="image"
                  onChange={onDrop}
                  imgExtension={[".jpg", ".png", ".gif"]}
                  buttonText="Selecionar Imagem do Produto"
                  maxFileSize={2048000}
                  singleImage
                  fileTypeError="Extensão de arquivo não suportada"
                  fileSizeError="Arquivo muito grande"
                  label="Máx. tamanho de arquvio: 2mb, arquivos do tipo JPG, GIF ou PNG"
                  defaultImages={defaultImages}
                  errorStyle={{
                    color: "var(--color-error)"
                  }}
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
              Salvar
            </LoadingButton>
            <Button color="secondary" onClick={toggleRegisterModal}>
              Fechar
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  )
}
