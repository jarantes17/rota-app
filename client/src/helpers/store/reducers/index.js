import { combineReducers } from "redux"
import { persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"

import auth from "../ducks/auth"
import product from "../ducks/product"

const persist = (key, reducer) =>
  persistReducer({ key: `ROTA.73/${key}`, storage }, reducer)

const appReducer = combineReducers({
  auth: persist("AUTH_STORAGE", auth),
  product // persist("PRODUCT_STORAGE", product)
})

const rootReducer = (state, action) => {
  return appReducer(state, action)
}

export default rootReducer
