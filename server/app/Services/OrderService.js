'use strict'

class OrderService {
  constructor(modelInstance, trx) {
    this.model = modelInstance
    this.trx = trx
  }

  async syncItems(items) {
    // remove older items
    await this.model.items().delete(this.trx)

    // add new items
    await this.model.items().createMany(items, this.trx)
  }

  async updateItems(items) {
    // retreive current items
    const currentItems = await this.model
      .items()
      .whereIn(
        'id',
        items.map((item) => item.id)
      )
      .fetch()

    // delete all that not contatins in items
    await this.model
      .items()
      .whereNotIn(
        'id',
        items.map((item) => item.id)
      )
      .delete(this.trx)

    // update all values and quantities
    await Promise.all(
      currentItems.rows.map(async (item) => {
        item.fill(items.filter((n) => n.id === item.id)[0])
        await item.save(this.trx)
      })
    )
  }
}

module.exports = OrderService
