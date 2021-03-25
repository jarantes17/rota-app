import React from "react"

import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { ToastContainer } from "react-toastify"
import GlobalStyle from "./styles/global"
import { Routes } from "./routes/Route"
import { store, history, persistor } from "./helpers"

const App = ({ theme }) => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ToastContainer position="top-center" />
      <GlobalStyle />
      <BrowserRouter history={history}>
        <Routes />
      </BrowserRouter>
    </PersistGate>
  </Provider>
)

export default App
