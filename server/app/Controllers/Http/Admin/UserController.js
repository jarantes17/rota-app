'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const MailService = require('../../../Services/MailService')

/** @type {import('../../../Helpers')} */
const { generateRandom } = use('App/Helpers')

const User = use('App/Models/User')
const Role = use('App/Models/Role')
const Transformer = use('App/Transformers/User/UserTransformer')
const Database = use('Database')

class UserController {
  /**
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async index({ response, transform }) {
    let users = await User.query().orderBy('id').fetch()

    users = await transform.collection(users, Transformer)

    return response.status(200).send({
      data: {
        users: users
      }
    })
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, transform }) {
    const trx = await Database.beginTransaction()

    try {
      let user = request.only([
        'name',
        'surname',
        'email',
        'status',
        'password',
        'celphone'
      ])

      const userExists = await User.findBy('email', user.email)

      if (userExists) {
        return response.status(400).send({
          error: 'E-mail já utilizado por outra conta.'
        })
      }

      const { roles } = request.only(['roles'])
      let clientRole
      let temporaryPassword
      if (user.password && !roles) {
        clientRole = await Role.findBy('slug', 'CLIENT')
      } else {
        temporaryPassword = generateRandom(6)
        user.password = temporaryPassword
      }

      user = await User.create(user, trx)
      if (!clientRole) await user.roles().attach(roles, null, trx)
      else await user.roles().attach(clientRole, null, trx)
      await trx.commit()

      if (temporaryPassword) {
        const mailService = new MailService()
        await mailService.temporaryPassword(
          user.name,
          user.email,
          temporaryPassword
        )
      }

      user = await transform.item(user, Transformer)

      return response.status(201).send({
        data: {
          user: user
        }
      })
    } catch (error) {
      await trx.rollback()
      return response.status(error.status).send(error)
    }
  }

  /**
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async show({ response, user, transform }) {
    user = await transform.item(user, Transformer)

    return response.status(200).send({
      data: {
        user: user
      }
    })
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ request, response, user, transform }) {
    const trx = await Database.beginTransaction()

    try {
      const { name, surname, email, status } = request.post()
      const { roles } = request.only(['roles'])

      user.name = name || user.name
      user.surname = surname || user.surname
      user.email = email || user.email
      user.status = status || user.status

      user = await user.save(trx)

      await user.roles().sync(roles, null, trx)
      await trx.commit()

      if (!user.password) {
        // todo - send mail user to update passoword
      }

      user = await transform.item(user, Transformer)

      return response.status(200).send({
        data: {
          user: user
        }
      })
    } catch (error) {
      await trx.rollback()
      return response.status(error.status).send(error)
    }
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ response, user }) {
    await user.delete()
    return response.status(204).send()
  }
}

module.exports = UserController
