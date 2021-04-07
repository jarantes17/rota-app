import React from "react"
import { Container, Row } from "reactstrap"

import * as S from "./styles"

export default props => (
  <S.Container className="d-none d-sm-none d-md-block">
    <S.BackImage>
      <S.BackImageConent>
        <S.Title className="display-1">
          Rota <span>73</span>
        </S.Title>
        <S.SubTitle className="h2">Sua Melhor Parada</S.SubTitle>
      </S.BackImageConent>
    </S.BackImage>
  </S.Container>
)
