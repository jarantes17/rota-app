import React from "react"

import { Link } from "react-router-dom"
import * as S from "./styles"
import logo from "../../../assets/images/logo.png"
import Picture from "../Picture"

export default ({ children, isAdmin }) => (
  <>
    <Picture />
    <S.Container className="col-sm-12 p-0">
      <S.Header>
        <div className="text-center">
          <Link to="/">
            <img src={logo} className="mt-2 py-2" alt="logo" />
          </Link>
          <h6 lead>{isAdmin ? "Área Administrativa" : "Área do Cliente"}</h6>
        </div>
      </S.Header>
      {children}
    </S.Container>
  </>
)
