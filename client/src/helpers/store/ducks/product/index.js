import { createAction, createReducer } from "@reduxjs/toolkit"

const INITIAL_STATE = {
  allProducts: [],
  resaleProducts: []
}

export const loadAllProducts = createAction("LOAD_ALL_PRODUCTS")
export const loadResaleProducts = createAction("LOAD_RESALE_PRODUCTS")
export const clearProducts = createAction("CLEAR_PRODUCTS")

export default createReducer(INITIAL_STATE, {
  [loadAllProducts.type]: (state, action) => ({
    ...state,
    allProducts: action.payload
  }),
  [loadResaleProducts.type]: (state, action) => ({
    ...state,
    resaleProducts: action.payload
  }),
  [clearProducts.type]: (state, action) => ({
    ...state,
    resaleProducts: [],
    allProducts: []
  })
})
