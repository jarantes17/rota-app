'use strict'

const Mail = use('Mail')
const Env = use('Env')

class MailService {
  async welcome(name, to) {
    await Mail.send('emails.welcome', { name }, (message) => {
      message
        .to(to)
        .from(Env.get('MAIL_USERNAME'))
        .subject('Bem Vindo - ROTA 73')
    })
  }

  async forgotPassword(name, to, link) {
    await Mail.send('emails.forgotpassword', { name, link }, (message) => {
      message
        .to(to)
        .from(Env.get('MAIL_USERNAME'))
        .subject('Redefinição de Senha - ROTA 73')
    })
  }

  async temporaryPassword(name, to, temporaryPassowrd) {
    await Mail.send(
      'emails.forgotpassword',
      { name, temporaryPassowrd },
      (message) => {
        message
          .to(to)
          .from(Env.get('MAIL_USERNAME'))
          .subject('Senha Temporária - ROTA 73')
      }
    )
  }
}

module.exports = MailService
