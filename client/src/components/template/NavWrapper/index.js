import React, { useState } from "react"
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

export default function () {
  
  // Hooks
  const { accesses } = useSelector(state => state?.auth?.authData || [])
  const [ isColapsed, setColapsed ] = useState(true)
  const dispatch = useDispatch()


  // User access modules
  let modules = []
  if (accesses.length > 0) {
    modules = accesses.map(module => {
      const InputIcon = module?.iconName ? AllIcons[module?.iconName] : null
      return { ...module, icon: <InputIcon /> }
    })
  }

  // Actions
  const logout = () => {
    dispatch(product.clearProductsAction())
    dispatch(auth.logoutAction())
  }

  // Jsx
  return (
    <>
      {/* Top component with grid area css */}
      <S.Wrapper>
        <S.TopInfo>
          <S.TopLogo>
            <Logo isSmall/>
          </S.TopLogo>
          <p>Rota 73</p>
        </S.TopInfo>
        <S.TopIcon onClick={() => setColapsed(!isColapsed)}>
          { isColapsed ? <FaIcons.FaBars /> : <FaIcons.FaTimes /> } 
        </S.TopIcon>
      </S.Wrapper>
      {/* Pro sidebar component */}
      <S.Container collapsed={isColapsed} className="nav">
        <ProSidebar collapsed={false}>
          <SidebarHeader>
            <Logo isSmall={false} />
          </SidebarHeader>
          <SidebarContent>
            <Menu iconShape="round">
              {modules?.map((module, i) => {
                return (
                  (module?.subModules.length > 0 && (
                    <SubMenu key={i} title={module?.title} icon={module?.icon}>
                      {module?.subModules.map((submodule, i) => {
                        return (
                          <MenuItem key={`sub${i}`} onClick={() => setColapsed(true)}>
                            <Link to={submodule.path}>{submodule.title}</Link>
                          </MenuItem>
                        )
                      })}
                    </SubMenu>
                  )) || (
                    <MenuItem key={i} onClick={() => setColapsed(true)} icon={module?.icon}>
                      <Link
                        to={module?.path}>{module?.title}
                      </Link>
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
    </>
  )
}
