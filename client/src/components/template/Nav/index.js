import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarContent,
  SidebarFooter,
  SidebarHeader
} from "react-pro-sidebar"

import * as FaIcons from "react-icons/fa"
import * as AllIcons from "react-icons/all"
import Logo from "../Logo"
import { product } from "../../../helpers/store/fetchActions/product"
import { auth } from "../../../helpers/store/fetchActions/auth"

import * as S from "./styles"

import "./styles.scss"

export default function ({ collapsedMenu }) {
  const { accesses } = useSelector(state => state?.auth?.authData || [])

  let modules = []
  if (accesses.length > 0) {
    modules = accesses.map(module => {
      const InputIcon = module?.iconName ? AllIcons[module?.iconName] : null
      return { ...module, icon: <InputIcon /> }
    })
  }

  const dispatch = useDispatch()

  const logout = () => {
    dispatch(product.clearProductsAction())
    dispatch(auth.logoutAction())
  }

  return (
    <S.Container className={`nav${collapsedMenu === true ? " collapsed" : ""}`}>
      <ProSidebar breakPoint="md" collapsed={collapsedMenu}>
        <SidebarHeader>
          <Logo isSmall={collapsedMenu} />
        </SidebarHeader>
        <SidebarContent>
          <Menu iconShape="round">
            {modules?.map(module => {
              return (
                (module?.subModules.length > 0 && (
                  <SubMenu key="" title={module?.title} icon={module?.icon}>
                    {module?.subModules.map(submodule => {
                      return (
                        <MenuItem>
                          <Link to={submodule.path}>{submodule.title}</Link>
                        </MenuItem>
                      )
                    })}
                  </SubMenu>
                )) || (
                  <MenuItem icon={module?.icon}>
                    <Link to={module?.path}>{module?.title}</Link>
                  </MenuItem>
                )
              )
            })}
          </Menu>
        </SidebarContent>
        <SidebarFooter>
          <S.LogoutContainer>
            <button type="button" onClick={logout}>
              <FaIcons.FaSignOutAlt size={28} />
            </button>
          </S.LogoutContainer>
        </SidebarFooter>
      </ProSidebar>
    </S.Container>
  )
}
