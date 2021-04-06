import React, { useState, useRef, useCallback } from "react"
import { Form } from "@unform/web"
import { toast } from "react-toastify"

import { useDispatch } from "react-redux"
import * as Yup from "yup"

import * as S from "./styles"
import RightSide from "../../components/template/RightSide"
import { Input, LoadingButton } from "../../components/common"
import { tryAwait } from "../../helpers"
import { authService } from "../../services"

const authSchema = Yup.object().shape({
  name: Yup.string().required("Preencha seu Nome"),
  surname: Yup.string().required("Preencha seu Sobrenome"),
  email: Yup.string()
    .email("Insira um e-mail válido")
    .required("O e-mail é obrigatório"),
  celphone: Yup.string().required("Preencha a Senha Nova"),
  password: Yup.string()
    .required("Preencha a Senha Nova")
    .min(5, "No mínimo, 5 caracteres"),
  repeatPassword: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "A Nova Senha e a Confimação não conferem"
  )
})

export const Register = props => {
  const formRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const handleSubmit = useCallback(
    async form => {
      try {
        formRef.current.setErrors({})

        await authSchema.validate(form, {
          abortEarly: false
        })
        tryAwait({
          promise: authService.register({ ...form }),
          onResponse: () => {
            toast.success(
              "Cadastro efetuado com sucesso. Enviamos um e-mail para confirmação"
            )

            props.history.push("/login?type=CLIENT")
          },
          onError: error => {
            toast.error(error)
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
    [dispatch, props]
  )

  const goBack = () => {
    props.history.goBack()
  }

  return (
    <RightSide>
      <S.Container>
        <Form ref={formRef} onSubmit={handleSubmit} className="form">
          <h6>Registro Novo Cliente</h6>
          <S.Group>
            <Input
              name="name"
              placeholder="Nome"
              icon="FaUser"
              type="text"
              disabled={loading}
            />
            <Input
              name="surname"
              placeholder="Sobrenome"
              icon="FaUser"
              type="text"
              disabled={loading}
            />
            <Input
              name="email"
              placeholder="E-mail"
              icon="FaEnvelope"
              type="text"
              disabled={loading}
            />
            <Input
              name="celphone"
              placeholder="Celular"
              icon="FaPhone"
              type="text"
              className="input-custom"
              disabled={loading}
              mask="(99) 9999-99999"
              maskChar={null}
              isCellPhone
            />
            <Input
              autoComplete="new-password"
              name="password"
              placeholder="Senha"
              icon="FaLock"
              type="password"
              disabled={loading}
              passwordShow
            />
            <Input
              autocomplete="new-password"
              name="repeatPassword"
              placeholder="Confirmar Senha"
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
              Registrar
            </LoadingButton>
            <a href="#" onClick={() => goBack()}>
              &#x2190; Voltar
            </a>
          </S.Group>
        </Form>
      </S.Container>
    </RightSide>
  )
}
