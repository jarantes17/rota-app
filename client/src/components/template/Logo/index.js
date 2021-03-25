import React from "react"
import { Link } from "react-router-dom"

import * as S from "./styles"
import logo from "../../../assets/images/logo.png"
import logoAbbrev from "../../../assets/images/logo-abbrev.png"

export default ({ isSmall }) => (
  <S.Container>
    <Link to="/" className="">
      <img src={isSmall ? logoAbbrev : logo} alt="logo" />
    </Link>
  </S.Container>
)
