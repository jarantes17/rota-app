import { Button } from "reactstrap"
import React from "react"

import * as S from "./styles"

export const Main = props => {
  const handleLogin = type => {
    props.history.push({
      pathname: "/login",
      search: `?type=${type}`
    })
  }

  return (
    <S.Container className="container">
      <S.Title className="h1 text-center">Bem-vindo ao Rota 73</S.Title>
      <S.SubTitle className="h5 mt-0 text-center">
        Escolha a opção de acesso abaixo
      </S.SubTitle>
      <S.Options>
        <div className="row">
          <div className="col-md-6">
            <Button
              color="primary"
              className="btn-block mt-2"
              size="lg"
              onClick={() => handleLogin("ADMIN")}
            >
              Acessar como Administrador
            </Button>
          </div>
          <div className="col-md-6">
            <Button
              color="secondary"
              className="btn-block mt-2"
              size="lg"
              onClick={() => handleLogin("CLIENT")}
            >
              Acessar como Cliente
            </Button>
          </div>
        </div>
      </S.Options>
    </S.Container>
  )
}
