import React, { useEffect, useState } from "react"
import { Col, Row } from "reactstrap"
import { toast } from "react-toastify"
import { tryAwait } from "../../helpers"
import menuService from "../../services/menu/menuService"

import * as S from "./styles"
import { Progress } from "../../components/common"
import { useDispatch } from "react-redux"
import { product } from "../../helpers/store/fetchActions/product"
import { auth } from "../../helpers/store/fetchActions/auth"
import * as FaIcons from "react-icons/fa"
import { authUtilService } from "../../services"

export const Menu = props => {
  const user = authUtilService.getUserData()
  const [loading, setLoading] = useState(false)
  const [menuPDF, setMenuPDF] = useState(null)

  const retrieveMenu = () => {
    tryAwait({
      promise: menuService.fetch(),
      onResponse: ({
        data: {
          data: { menu_pdf }
        }
      }) => {
        setMenuPDF(menu_pdf)
      },
      onError: () => {
        toast.error("Erro ao buscar menu para o cliente!")
      },
      onLoad: _loading => setLoading(_loading)
    })
  }

  const dispatch = useDispatch()

  const logout = () => {
    dispatch(product.clearProductsAction())
    dispatch(auth.logoutAction())
  }

  useEffect(() => {
    retrieveMenu()
  }, [])

  return (
    <S.Container className="container">
      <nav class="navbar navbar-light bg-light">
        <a href="/#" class="navbar-brand">
          Rota 73 - Acesso ao Menu
        </a>
        <ul class="nav navbar-nav navbar-right">
          <li>
            <span class="navbar-text">
              Olá,{" "}
              <strong>
                {user?.name} {user?.surname}
              </strong>
            </span>
          </li>
          <li>
            <button className="btn float-right" type="button" onClick={logout}>
              <FaIcons.FaSignOutAlt size={28} /> Sair
            </button>
          </li>
        </ul>
      </nav>
      {loading ? (
        <Progress content="Carregando Cardápio.. Aguarde!" />
      ) : (
        <Row>
          <Col xl={12}>
            <object
              aria-label="Cardápio Rota 73"
              data={menuPDF}
              type="application/pdf"
              width="100%"
              height="800px"
            ></object>
          </Col>
        </Row>
      )}
    </S.Container>
  )
}
