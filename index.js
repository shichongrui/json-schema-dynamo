var validate = require('jsonschema').validate
var _ = require('lodash')

var typeMap = {
  'string': 'S',
  'integer': 'N',
  'number': 'N',
  'boolean': 'B',
  'array-string': 'SS',
  'array-number': 'SN'
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
  },
  'SS': function (value) {
    return value.map(this.S)
  },
  'SN': function (value) {
    return value.map(this.N)
  }
}

exports.fromDynamoItemToModel = function (item, schema) {
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

exports.fromModelToDynamoItem = function (model, schema) {
  var valid = validate(model, schema)

  if (!valid) {
    throw new Error('That model doesn\'t validate against that schema')
  }

  return _.omit(_.mapValues(schema.properties, function(value, key) {
    if (!model[key]) {
      return null
    }

    var type = (value.type === 'array') ? 'array-' + value.items.type : value.type
    var itemValue = (Array.isArray(model[key])) ? model[key].map(String) : String(model[key])

    var item = {}
    item[typeMap[type]] = itemValue
    return item
  }), _.isNull)
}


