import React, { useState, useRef, useCallback, useEffect } from "react"
import { Form } from "@unform/web"
import { toast } from "react-toastify"

import * as Yup from "yup"
import { tryAwait } from "../../helpers"
import { authService } from "../../services"

import { Input, LoadingButton } from "../../components/common"

import "react-toastify/dist/ReactToastify.css"
import * as S from "./styles"
import RightSide from "../../components/template/RightSide"

const authSchema = Yup.object().shape({
  newPassword: Yup.string().required("Preencha a Senha Nova"),
  repeatNewPassword: Yup.string().oneOf(
    [Yup.ref("newPassword"), null],
    "A Nova Senha e a Confimação não conferem"
  )
})

export const ChangePassword = props => {
  const formRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [expressionValidation, setExpressionValidation] = useState(null)

  const checkExpression = () => {
    const params = new URLSearchParams(props.location.search)
    const expression = params.get("checkExpression")
    if (!expression) {
      props.history.push("/login?type=CLIENT")
    } else {
      tryAwait({
        promise: authService.checkExpression(expression),
        onResponse: () => {
          setExpressionValidation(expression)
        },
        onError: error => {
          toast.error(error)
          props.history.push("/login?type=CLIENT")
        }
      })
    }
  }

  const handleSubmit = useCallback(async form => {
    try {
      formRef.current.setErrors({})

      await authSchema.validate(form, {
        abortEarly: false
      })

      const data = {
        newPassword: form.newPassword,
        expression: expressionValidation
      }

      tryAwait({
        promise: authService.changePassword(data),
        onResponse: () => {
          toast.success("Senha redefinida com sucesso!")
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
  })

  useEffect(() => {
    checkExpression()
  })

  return (
    expressionValidation && (
      <RightSide>
        <S.Container>
          <Form ref={formRef} onSubmit={handleSubmit} className="form">
            <h6>Redefinição de Senha</h6>
            <S.Group>
              <Input
                autocomplete="off"
                name="newPassword"
                placeholder="Nova Senha"
                icon="FaLock"
                type="password"
                disabled={loading}
                passwordShow
              />
              <Input
                autocomplete="off"
                name="repeatNewPassword"
                placeholder="Confirmar Nova Senha"
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
                Alterar Senha
              </LoadingButton>
            </S.Group>
          </Form>
        </S.Container>
      </RightSide>
    )
  )
}
