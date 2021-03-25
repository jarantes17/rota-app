import React, { useEffect, useState } from "react"
import { LoginCli } from "./Client"
import { LoginAdm } from "./Admin"

export const Login = props => {
  const [type, setType] = useState("ADMIN")

  const checkType = () => {
    const params = new URLSearchParams(props.location.search)
    const type = params.get("type")
    setType(type)
  }

  useEffect(() => {
    checkType()
  })

  return type === "ADMIN" ? <LoginAdm /> : <LoginCli />
}
