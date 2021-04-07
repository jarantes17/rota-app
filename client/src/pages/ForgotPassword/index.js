import React, { useState, useRef, useCallback } from "react"
import { Form } from "@unform/web"
import { toast } from "react-toastify"

import * as Yup from "yup"

import { Input, LoadingButton } from "../../components/common"

import "react-toastify/dist/ReactToastify.css"
import * as S from "./styles"
import RightSide from "../../components/template/RightSide"
import { tryAwait } from "../../helpers"
import { authService } from "../../services"

const authSchema = Yup.object().shape({
  email: Yup.string()
    .email("Insira um e-mail válido")
    .required("O e-mail é obrigatório")
})

export const ForgotPassword = props => {
  const formRef = useRef(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = useCallback(async form => {
    try {
      formRef.current.setErrors({})

      await authSchema.validate(form, {
        abortEarly: false
      })

      tryAwait({
        promise: authService.forgotPassowrd(form),
        onResponse: () => {
          toast.success(
            `Foi enviado um e-mail com detalhes para recuperação de senha para o endereço ${form.email}`
          )

          formRef.current.reset()
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
  }, [])

  const goBack = () => {
    props.history.goBack()
  }

  return (
    <RightSide>
      <S.Container>
        <Form ref={formRef} onSubmit={handleSubmit} className="form">
          <h6>Recuperação de Senha</h6>
          <S.Group>
            <Input
              name="email"
              placeholder="E-mail Cadastrado"
              icon="FaEnvelope"
              type="text"
              disabled={loading}
            />
            <LoadingButton
              color="primary"
              type="submit"
              block
              loading={loading}
              disabled={loading}
            >
              Recuperar Senha
            </LoadingButton>
            <a href="/#" onClick={() => goBack()}>
              &#x2190; Voltar
            </a>
          </S.Group>
        </Form>
      </S.Container>
    </RightSide>
  )
}
