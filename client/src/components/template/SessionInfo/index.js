import React from "react"
import * as FaIcons from "react-icons/fa"
import { authUtilService } from "../../../services"

import * as S from "./styles"

export default props => {
  const user = authUtilService.getUserData()
  return (
    <S.Container>
      <div>
        <FaIcons.FaUser className="mr-1" />
        <span>
          {user?.name} {user?.surname}
        </span>
      </div>
      <div className="text-light">
        <span>({user?.roles[0].slug})</span>
      </div>
    </S.Container>
  )
}
