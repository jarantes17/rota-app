import React from "react"

import * as S from "./styles"

export default ({ children }) => (
  <S.Container>
    <S.BackImage>
      {children}
      <S.BackImageContent>
        <S.Title className="display-1 d-none d-sm-none d-md-block">
          Rota <span>73</span>
        </S.Title>
        <S.SubTitle className="h2 d-none d-sm-none d-md-block">
          Sua Melhor Parada
        </S.SubTitle>
      </S.BackImageContent>
    </S.BackImage>
  </S.Container>
)
