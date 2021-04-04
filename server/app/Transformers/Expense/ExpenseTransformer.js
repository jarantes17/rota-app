'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * ExpenseTransformer class
 *
 * @class ExpenseTransformer
 * @constructor
 */
class ExpenseTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform(model) {
    return {
      id: model.id,
      type: model.type,
      observation: model.observation,
      amount: model.amount,
      pay_date: model.pay_date,
      created_at: model.created_at,
      updated_at: model.updated_at
    }
  }
}

module.exports = ExpenseTransformer
