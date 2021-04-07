import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import DataTable from "react-data-table-component"
import DataTableExtensions from "react-data-table-component-extensions"
import { Col, Row, Spinner } from "reactstrap"
import { format } from "date-fns"
import Main from "../../components/template/Main"
import { tryAwait } from "../../helpers"
import { transactionService } from "../../services"
import { DefaultContainer, TableContainer } from "../../styles/global"

export const Transaction = () => {
  const [transactions, setTransactions] = useState([])
  const [loadingTable, setLoadingTable] = useState(false)

  const filteredTransactions = () => {
    return transactions
  }

  const retrieveLastTransactions = () => {
    tryAwait({
      promise: transactionService.fetch(),
      onResponse: ({
        data: {
          data: { transactions }
        }
      }) => {
        setTransactions(transactions)
      },
      onError: () => {
        toast.error("Erro ao carregar Transações de Estoque")
      },
      onLoad: _loading => setLoadingTable(_loading)
    })
  }

  useEffect(() => {
    retrieveLastTransactions()
  }, [])

  const columns = [
    {
      name: "Data Transações",
      selector: "transaction_date",
      sortable: true,
      format: row => format(new Date(row.transaction_date), "dd/MM/yyyy")
    },
    {
      name: "Tipo",
      selector: "type",
      sortable: true,
      center: true
    },
    {
      name: "Produto",
      selector: "product.description",
      sortable: true
    },
    {
      name: "Quantidade",
      selector: "quantity",
      sortable: true,
      right: true
    },
    {
      name: "Data Criação",
      selector: "created_at",
      sortable: true,
      format: row => format(new Date(row.created_at), "dd/MM/yyyy HH:mm:ss")
    }
  ]

  const tableData = {
    columns,
    data: filteredTransactions()
  }

  return (
    <Main
      title="Transações"
      subtitle="Listagem Auto-Transações de Estoque"
      icon="FaMoneyCheckAlt"
    >
      <DefaultContainer>
        <Row>
          <Col sm={12}>
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
                  data={filteredTransactions()}
                  noDataComponent="Nenhuma transação encontrado entre hoje e ontem!"
                  pagination
                  paginationPerPage={20}
                  paginationRowsPerPageOptions={[10, 20, 30]}
                  paginationTotalRows={filteredTransactions()?.length}
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
    </Main>
  )
}
