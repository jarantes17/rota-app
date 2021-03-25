import React from "react"
import { Container, Card } from "reactstrap"
import PerfectScrollbar from "react-perfect-scrollbar"
import * as S from "./styles"
import Header from "../Header"

export default props => (
  <>
    <Header {...props} />
    <PerfectScrollbar>
      <S.Container>
        <Container fluid>
          <Card className="p-3 mt-3">{props.children}</Card>
        </Container>
      </S.Container>
    </PerfectScrollbar>
  </>
)
