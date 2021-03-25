'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * ImageTransformer class
 *
 * @class ImageTransformer
 * @constructor
 */
class ImageTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform(model) {
    model = model.toJSON()
    return {
      id: model.id,
      path: model.path,
      size: model.size,
      original_name: model.original_name,
      extension: model.extension,
      url: model.url
    }
  }
}

module.exports = ImageTransformer
