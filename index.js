var validate = require('jsonschema').validate
var _ = require('lodash')

var typeMap = {
  'string': 'S',
  'integer': 'N',
  'number': 'N',
  'boolean': 'B'
}

var stringTo = {
  'S': function (value) {
    return value
  },
  'N': function (value) {
    return parseInt(value, 10)
  },
  'B': function (value) {
    return Boolean(value)
  }
}

exports.fromItemToModel = function (item, schema) {
  var model = _.mapValues(item, function (value, key) {
    var a = Object.keys(value).map(function(type) {
      return stringTo[type](value[type])
    })
    return a[0]
  })

  var valid = validate(model, schema)

  if (!valid) {
    throw new Error('That item did not transform into a valid model')
  }

  return model
}

exports.fromModelToItem = function (model, schema) {
  var valid = validate(model, schema)

  if (!valid) {
    throw new Error('That model doesn\'t validate against that schema')
  }

  return _.omit(_.mapValues(schema.properties, function(value, key) {
    if (!model[key]) {
      return null
    }

    var item = {}
    item[typeMap[value.type]] = model[key]
    return item
  }), _.isNull)
}


