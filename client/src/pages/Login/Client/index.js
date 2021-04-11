import React, { useState, useRef, useCallback } from "react"
import { Form } from "@unform/web"
import { toast } from "react-toastify"
import FacebookLogin from "react-facebook-login"
import * as FaIcons from "react-icons/fa"

import { useDispatch } from "react-redux"
import * as Yup from "yup"
import { Link } from "react-router-dom"
import RightSide from "../../../components/template/RightSide"
import { tryAwait } from "../../../helpers"
import { auth } from "../../../helpers/store/fetchActions/auth"
import { authService } from "../../../services"

import { Input, LoadingButton } from "../../../components/common"

import "react-toastify/dist/ReactToastify.css"
import * as S from "./styles"

const authSchema = Yup.object().shape({
  email: Yup.string()
    .email("Insira um e-mail válido")
    .required("O e-mail é obrigatório"),
  password: Yup.string()
    .min(5, "No mínimo, 5 caracteres")
    .required("A senha é obrigatória")
})

export const LoginCli = props => {
  const dispatch = useDispatch()

  const formRef = useRef(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = useCallback(
    async form => {
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
          onError: _ => {
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
    },
    [dispatch]
  )

  const responseFacebook = response => {
    const data = {
      provider: response.graphDomain,
      provider_id: response.userID,
      name: response.name,
      email: response.email
    }

    if (data.email) {
      try {
        tryAwait({
          promise: authService.socialLogin(data),
          onResponse: ({ data: { data } }) => {
            if (!data.message) {
              dispatch(auth.loginAction(data))
              props.history.push("/")
            } else {
              toast.info(data.message)
            }
          },
          onError: error => {
            console.log(error)
          },
          onLoad: _loading => setLoading(_loading)
        })
      } catch (err) {
        console.log(err)
        toast.error("Oops.. Falha ao autenticar o usuário pelo Facebook 2")
      }
    } else {
      toast.error("Oops.. Falha ao obter dados do Facebook")
    }
  }

  return (
    <RightSide>
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
            <p className="text-center">
              Esqueceu a Senha? <Link to="/forgotPassword">Recuperar</Link>
            </p>
            <p className="text-center mt-2">Ou</p>
            <FacebookLogin
              appId="2894458900874343"
              fields="name,email,picture"
              callback={responseFacebook}
              cssClass="btn btn-block btn-facebook"
              textButton=" Login com Facebook"
              icon={<FaIcons.FaFacebook />}
            />
            <p className="text-center">
              Não possui acesso? <Link to="/register">Registre-se</Link>
            </p>
          </S.Group>
        </Form>
      </S.Container>
    </RightSide>
  )
}
