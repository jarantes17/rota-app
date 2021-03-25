import React, { useState } from "react"
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap"
import classnames from "classnames"
import Main from "../../components/template/Main"

import * as S from "./styles"
import { ProductTab } from "./ProductTab"
import { ProductTypeTab } from "./ProductTypeTab"
import { ProductUomTab } from "./ProductUomTab"

export const Product = () => {
  const [activeTab, setActiveTab] = useState("1")

  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  return (
    <Main
      title="Produtos"
      subtitle="Cadastro de Produtos em Geral"
      icon="FaHamburger"
    >
      <S.Container>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "1" })}
              onClick={() => {
                toggle("1")
              }}
            >
              Produtos
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "2" })}
              onClick={() => {
                toggle("2")
              }}
            >
              Tipo de Produto
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "3" })}
              onClick={() => {
                toggle("3")
              }}
            >
              Unidade de Medida
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            <ProductTab />
          </TabPane>
          <TabPane tabId="2">
            <ProductTypeTab />
          </TabPane>
          <TabPane tabId="3">
            <ProductUomTab />
          </TabPane>
        </TabContent>
      </S.Container>
    </Main>
  )
}
