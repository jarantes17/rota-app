'use strict'

const AuthService = require('../../../Services/AuthService')
const MailService = require('../../../Services/MailService')

/** @type {import('../../../Helpers')} */
const { generateRandom } = use('App/Helpers')

/** @type {import('@adonisjs/lucid/src/Database')} */
const Database = use('Database')
/** @type {typeof import('../../../Models/User')} */
const User = use('App/Models/User')
/** @type {typeof import('../../../Models/Role')} */
const Role = use('App/Models/Role')

const Transformer = use('App/Transformers/User/AuthTransformer')

class AuthController {
  /**
   * SignIn a User
   * POST login
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async login({ request, response, transform, auth }) {
    const { email, password } = request.all()
    const token = await auth.withRefreshToken().attempt(email, password)

    let user = await User.query().with('roles').where('email', email).first()
    user = await transform.item(user, Transformer)

    const authService = new AuthService()
    let modules = []
    user.roles.forEach((role) => {
      modules = [...modules, ...authService.getModules(role.slug)]
    })

    modules = authService.filterDistinct(modules)
    return response.status(200).send({
      data: {
        user: user,
        token: token,
        accesses: modules
      }
    })
  }

  /**
   * SignIn or Register a User with Social
   * POST socialLogin
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async socialLogin({ request, response, transform, auth }) {
    const trx = await Database.beginTransaction()
    const { data } = request.all()
    const { email, provider_id, provider, name } = data

    try {
      let user = await User.query()
        .with('roles')
        .where('provider', provider)
        .where('provider_id', provider_id)
        .where('status', 'A')
        .first()

      if (user) {
        const token = await auth.generate(user) // await auth.withRefreshToken().attempt(email)
        user = await transform.item(user, Transformer)
        return response.status(200).send({
          data: {
            user: user,
            token: token
          }
        })
      } else {
        const data = {
          email: email,
          name: name.split(' ').slice(0, -1).join(' '),
          surname: name.split(' ').slice(-1).join(' '),
          provider: provider,
          provider_id: provider_id
        }

        let user = await User.create(data, trx)
        const clientRole = await Role.findBy('slug', 'CLIENT')
        if (clientRole) {
          await user.roles().attach([clientRole.id], null, trx)
        }

        trx.commit()

        user = await User.query()
          .with('roles')
          .where('provider', provider)
          .where('provider_id', provider_id)
          .where('status', 'A')
          .first()

        const token = await auth.generate(user) // await auth.withRefreshToken().attempt(email)

        return response.status(200).send({
          data: {
            user: user,
            token: token
          }
        })
      }
    } catch (error) {
      trx.rollback()
      return response.status(400).send({
        message: 'Erro ao realizar autenticação usuário.'
      })
    }
  }

  async register({ request, response, transform }) {
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

      const clientRole = await Role.findBy('slug', 'CLIENT')

      user = await User.create(user, trx)
      await user.roles().attach(clientRole.id, null, trx)
      await trx.commit()

      const mailService = new MailService()
      await mailService.welcome(user.name, user.email)

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
   * Change user's passowrd
   * POST changePassword
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async changePassword({ request, response }) {
    const { newPassword, expression } = request.all()
    const user = await User.findBy('expression_validation', expression)

    if (user) {
      user.password = newPassword
      user.expression_validation = null
      await user.save()
    } else {
      return response.status(400).send({
        message: 'Expressão de checagem inválida.'
      })
    }

    return response.status(204).send()
  }

  /**
   * Check Expression to allow change passowrd
   * POST checkExpression
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async checkExpression({ request, response, transform, auth }) {
    const { expression } = request.all()
    const user = await User.findBy('expression_validation', expression)

    if (!user) {
      return response.status(400).send({
        message: 'Expressão de checagem inválida.'
      })
    } else {
      return response.status(204).send()
    }
  }

  /**
   * Send Email with expression to redefine user's passowrd
   * POST forgotPassword
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async forgotPassword({ request, response, transform, auth }) {
    const { email } = request.all()

    const user = await User.findBy('email', email)

    const roles = await user.roles().fetch()

    if (user) {
      if (roles && roles.rows[0].slug === 'CLIENT') {
        user.expression_validation = await generateRandom()
        await user.save()

        const mailService = new MailService()
        await mailService.forgotPassword(
          user.name,
          user.email,
          `http://localhost:3000/changePassword?checkExpression=${user.expression_validation}`
        )

        return response.status(204).send()
      } else {
        return response.status(400).send({
          message: 'Tipo de usuário não permitido alteração de senha.'
        })
      }
    } else {
      return response.status(400).send({
        message: 'E-mail inválido.'
      })
    }
  }

  /**
   * Refresh a Token
   * POST login
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async refresh({ request, response, auth, refreshToken }) {
    const user = await auth
      .newRefreshToken()
      .generateForRefreshToken(refreshToken)

    return response.status(200).send({
      data: user
    })
  }

  /**
   * SignOut a User
   * POST authenticate
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async logout({ request, response, auth, refreshToken }) {
    await auth.authenticator('jwt').revokeTokens([refreshToken], true)

    return response.status(204).send()
  }
}

module.exports = AuthController
