'use strict'

const crypto = use('crypto')
const Helpers = use('Helpers')

/**
 * Generate a random string
 *
 * @param { int } length - Size of string to generate
 * @return { string } - A random string with length size
 */
const generateRandom = async (length = 40) => {
  let string = ''
  const len = string.length

  if (len < length) {
    const size = length - len
    const bytes = await crypto.randomBytes(size)
    const buffer = Buffer.from(bytes)
    string += buffer
      .toString('base64')
      .replace(/[^a-zA-Z0-9]/g, '')
      .substr(0, size)
  }

  return string
}

/**
 * Manage single upload
 *
 * @param { FileJar } file - File to manage
 * @param { string }  path- Path of file will be moved
 * @return { Object<FileJar> } - Result file object
 */
const manageSingleUpload = async (file, path = null) => {
  path = path || Helpers.publicPath('uploads')

  const randomName = await generateRandom(30)
  const filename = `${new Date().getDate()}-${randomName}.${file.subtype}`

  await file.move(path, {
    name: filename
  })

  return file
}

/**
 * Manage single upload
 *
 * @param { FileJar } fileJar - File to manage
 * @param { string }  path- Path of file will be moved
 * @return { Object } - Result file object
 */
const manageMultipleUploads = async (fileJar, path = null) => {
  path = path || Helpers.publicPath('uploads')

  const successes = []
  const errors = []

  await Promise.all(
    fileJar.files.map(async (file) => {
      const randomName = await generateRandom(30)
      const filename = `${new Date().getDate()}-${randomName}.${file.subtype}`

      await file.move(path, {
        name: filename
      })

      if (file.moved()) {
        successes.push(file)
      } else {
        errors.push(file.error())
      }
    })
  )

  return { successes, errors }
}

const boardStatus = {
  FREE: 'Free',
  BUSY: 'Busy'
}

const orderStatus = {
  OPENED: 'Opened',
  DONE: 'Done',
  CLOSED: 'Closed',
  CANCELED: 'Canceled'
}

module.exports = {
  generateRandom,
  manageSingleUpload,
  manageMultipleUploads,
  boardStatus,
  orderStatus
}
