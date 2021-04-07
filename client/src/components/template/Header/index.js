import React from "react"

import { Row, Col } from "reactstrap"
import * as AllIcons from "react-icons/all"

import * as S from "./styles"

export default function (props) {
  const { title, subtitle, icon } = props

  const HeaderIcon = icon ? AllIcons[icon] : null

  return (
    <S.Container className="header d-none d-sm-flex flex-column">
      <Row>
        <Col className="col-sm-auto d-flex pr-0">
          <S.IconContainer>
            {icon && (
              <h1>
                <HeaderIcon size={32} />
              </h1>
            )}
          </S.IconContainer>
        </Col>
        <Col xs={10}>
          <h1 className="mt-3 mb-0">{title}</h1>
          <p className="lead text-muted">{subtitle}</p>
        </Col>
      </Row>
    </S.Container>
  )
}
