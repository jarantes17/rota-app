'use strict'

/** @type {import('../../../Models/Image')} */
const Image = use('App/Models/Image')

/** @type {import('../../../Helpers')} */
const { manageSingleUpload } = use('App/Helpers')

class ImageService {
  constructor(modelInstance, trx) {
    this.model = modelInstance
    this.trx = trx
  }

  async upload(fileJar) {
    let image = null
    if (fileJar) {
      const file = await manageSingleUpload(fileJar)
      if (file.moved()) {
        image = await Image.create(
          {
            path: file.fileName,
            size: file.size,
            original_name: file.clientName,
            extension: file.subtype
          },
          this.trx
        )
      }
    }

    return image
  }
}

module.exports = ImageService
