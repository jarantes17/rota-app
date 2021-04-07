import React, { useState, useRef, useCallback } from "react"
import { Form } from "@unform/web"
import { toast } from "react-toastify"

import { useDispatch } from "react-redux"
import * as Yup from "yup"
import { tryAwait } from "../../../helpers"
import { auth } from "../../../helpers/store/fetchActions/auth"
import { authService } from "../../../services"

import { Input, LoadingButton } from "../../../components/common"

import "react-toastify/dist/ReactToastify.css"
import * as S from "./styles"
import RightSide from "../../../components/template/RightSide"

const authSchema = Yup.object().shape({
  email: Yup.string()
    .email("Insira um e-mail válido")
    .required("O e-mail é obrigatório"),
  password: Yup.string()
    .min(5, "No mínimo, 5 caracteres")
    .required("A senha é obrigatória")
})

export const LoginAdm = props => {
  const dispatch = useDispatch()

  const formRef = useRef(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = useCallback(async form => {
    try {
      formRef.current.setErrors({})

      await authSchema.validate(form, {
        abortEarly: false
      })

      tryAwait({
        promise: authService.login(form),
        onResponse: ({ data: { data } }) => {
          dispatch(auth.loginAction(data))
        },
        onError: error => {
          toast.error("Oops.. Usuário ou senha incorretos")
        },
        onLoad: _loading => setLoading(_loading)
      })
    } catch (err) {
      const validationErrors = {}
      if (err instanceof Yup.ValidationError) {
        err.inner.forEach(error => {
          validationErrors[error.path] = error.message
        })
        formRef.current.setErrors(validationErrors)
      }
    }
  })

  return (
    <RightSide isAdmin>
      <S.Container>
        <Form ref={formRef} onSubmit={handleSubmit} className="form">
          <h6>Acesso Restrito</h6>
          <S.Group>
            <Input
              name="email"
              placeholder="E-mail"
              icon="FaUser"
              type="text"
              disabled={loading}
            />
            <Input
              autoComplete="off"
              name="password"
              placeholder="Senha"
              icon="FaLock"
              type="password"
              disabled={loading}
              passwordShow
            />
            <LoadingButton
              color="primary"
              type="submit"
              block
              loading={loading}
              disabled={loading}
            >
              Acessar Sistema
            </LoadingButton>
          </S.Group>
        </Form>
      </S.Container>
    </RightSide>
  )
}
