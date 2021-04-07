const tryAwait = async ({
  promise,
  onResponse = () => {},
  onLoad = () => {},
  onError = () => {},
  onComplete = () => {}
}) => {
  onLoad(true)
  try {
    onResponse(await promise)
  } catch ({ response }) {
    onError(
      response || {
        statusCode: 500,
        message: "Serviço indisponível."
      }
    )
  } finally {
    onLoad(false)
    onComplete()
  }
}

export default tryAwait
