import React from "react"
import { Link } from "react-router-dom"
import Main from "../../components/template/Main"

import * as S from "./styles"

export const Start = () => {
  return (
    <Main title="Incío" subtitle="Sistema Administrativo Rota 73" icon="FaHome">
      <S.Container>
        <span className="h3">Seja muito bem-vindo ao RotaApp</span>
        <p className="mt-1">
          Verifique as informações básicas no painel à direita. Caso necessite
          de mais detalhes entre no menu{" "}
          <Link to="/admin/cash">
            <strong>Caixa</strong>
          </Link>{" "}
          ou no relatórios de despesas e faturamento
        </p>
      </S.Container>
    </Main>
  )
}
