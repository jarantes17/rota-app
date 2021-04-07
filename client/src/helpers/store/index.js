import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit"
import { persistStore } from "redux-persist"
import reducers from "./reducers"

const store = configureStore({
  reducer: reducers,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: ["persist/PERSIST"]
    }
  })
})

const persistor = persistStore(store)

export { store, persistor }
