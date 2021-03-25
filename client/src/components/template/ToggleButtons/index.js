import React from "react"

import { Row, Col } from "reactstrap"
import * as FaIcons from "react-icons/fa"

import * as S from "./styles"

export default function ({
  handleCollapsedMenuChange,
  handleCollapsedInfoChange
}) {
  return (
    <S.Container className="toggle-buttons d-none d-sm-flex flex-column">
      <Row>
        <Col>
          <S.ToggleMenuContainer>
            <S.ToggleButtonMenu
              className="navbar-toggler"
              type="button"
              onClick={handleCollapsedMenuChange}
            >
              <FaIcons.FaBars />
            </S.ToggleButtonMenu>
          </S.ToggleMenuContainer>
        </Col>
        <Col>
          <S.ToggleInfoContainer>
            <S.ToggleButtonInfo
              className="navbar-toggler"
              type="button"
              onClick={handleCollapsedInfoChange}
            >
              <FaIcons.FaBars />
            </S.ToggleButtonInfo>
          </S.ToggleInfoContainer>
        </Col>
      </Row>
    </S.Container>
  )
}
