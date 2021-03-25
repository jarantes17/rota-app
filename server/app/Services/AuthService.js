'use strict'

class AuthService {
  getModules(role) {
    let modules = []
    if (role !== 'CLIENT') modules = this.getDefault()

    switch (role) {
      case 'ADMIN':
        modules = [...modules, ...this.getAll()]
        break
      case 'MANAGER':
        modules = [...modules, ...this.getAll()]
        break
      case 'CASHIER':
        modules = [...modules, ...this.getCashier()]
        break
      case 'WAITER':
        modules = [...modules, ...this.getWaiter()]
        break
      case 'CLIENT':
        break
      default:
        break
    }

    return modules
  }

  getDefault() {
    const modules = [
      {
        title: 'Dashboard',
        path: '/admin/dashboard',
        iconName: 'FaHome',
        subModules: []
      }
    ]

    return modules
  }

  getCashier() {
    const modules = [
      {
        title: 'Transações',
        path: '/admin/transactions',
        iconName: 'FaMoneyCheckAlt',
        subModules: []
      },
      {
        title: 'Pedidos',
        path: '/admin/orders',
        iconName: 'FaClipboardList',
        subModules: []
      },
      {
        title: 'Caixa',
        path: '/admin/cash',
        iconName: 'FaDollarSign',
        subModules: []
      }
    ]

    return modules
  }

  getWaiter() {
    const modules = [
      {
        title: 'Pedidos',
        path: '/admin/orders',
        iconName: 'FaClipboardList',
        subModules: []
      }
    ]

    return modules
  }

  getClient() {}

  getAll() {
    const modules = [
      {
        title: 'Cadastros',
        path: '#',
        iconName: 'FaEdit',
        subModules: [
          {
            title: 'Produtos',
            path: '/admin/products',
            iconName: ''
          },
          {
            title: 'Usuários',
            path: '/admin/users',
            iconName: ''
          },
          {
            title: 'Mesas',
            path: '/admin/boards',
            iconName: ''
          },
          {
            title: 'Fornecedores',
            path: '/admin/suppliers',
            iconName: ''
          }
        ]
      },
      {
        title: 'Relatórios',
        path: '#',
        iconName: 'FaChartBar',
        subModules: [
          {
            title: 'Despesas',
            path: '/admin/expenses',
            iconName: ''
          },
          {
            title: 'Faturamento',
            path: '/admin/revenues',
            iconName: ''
          }
        ]
      },
      // {
      //   title: 'Orçamentos',
      //   path: '/admin/budgets',
      //   iconName: 'FaRegListAlt',
      //   subModules: []
      // },
      {
        title: 'Transações',
        path: '/admin/transactions',
        iconName: 'FaMoneyCheckAlt',
        subModules: []
      },
      {
        title: 'Pedidos',
        path: '/admin/orders',
        iconName: 'FaClipboardList',
        subModules: []
      },
      {
        title: 'Caixa',
        path: '/admin/cash',
        iconName: 'FaDollarSign',
        subModules: []
      }
    ]

    return modules
  }

  filterDistinct(modules) {
    return modules.filter(
      (v, i, self) => self.findIndex((t) => t.title === v.title) === i
    )
  }
}

module.exports = AuthService
