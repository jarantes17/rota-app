'use strict'

const OrderHook = (exports = module.exports = {})

OrderHook.updateValues = async (modelInstance) => {
  modelInstance.$sideLoaded.subtotal = await modelInstance
    .items()
    .whereNot('status', 'Canceled')
    .getSum('subtotal')
  modelInstance.$sideLoaded.total_items = await modelInstance
    .items()
    .whereNot('status', 'Canceled')
    .getSum('quantity')
  modelInstance.total = modelInstance.$sideLoaded.subtotal
  return modelInstance
}

OrderHook.updateCollectionValues = async (models) => {
  for (let model of models) {
    model = await OrderHook.updateValues(model)
  }
}
