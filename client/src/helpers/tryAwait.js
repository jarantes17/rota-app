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
    let error
    if (response) {
      error = {
        statusCode: response?.status || 500,
        message: response?.data?.error
      }
    }
    onError(
      error || {
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
