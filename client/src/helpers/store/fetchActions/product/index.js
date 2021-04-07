import {
  loadAllProducts,
  loadResaleProducts,
  clearProducts
} from "../../ducks/product"

const loadAllProductsAction = products => {
  return dispatch => {
    dispatch(loadAllProducts(products))
  }
}

const loadResaleProductsAction = products => {
  return dispatch => {
    dispatch(loadResaleProducts(products))
  }
}

const clearProductsAction = () => {
  return dispatch => {
    dispatch(clearProducts())
  }
}

export const product = {
  loadAllProductsAction,
  loadResaleProductsAction,
  clearProductsAction
}
