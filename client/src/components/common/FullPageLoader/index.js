import React from "react"
import Spinner from "../../../assets/images/spinner.gif"

export const FullPageLoader = () => {
  return (
    <div className="fp-container">
      <div className="fp-loader">
        <img src={Spinner} alt="loading" />
        <h5 className="mt-0 font-weight-bold">Processando... Aguarde!</h5>
      </div>
    </div>
  )
}
