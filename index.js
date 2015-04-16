var Validator = require('jsonschema').Validator
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
    switch (value) {
    case true:
    case 'true':
    case 1:
    case '1':
    case 'on':
    case 'yes':
      value = true;
      break;
    case false:
    case 'false':
    case 0:
    case '0':
    case 'off':
    case 'no':
      value = false;
      break;
    default:
      value = false
      break;
    }
    return value;
  },
  'SS': function (value) {
    return value.map(this.S)
  },
  'SN': function (value) {
    return value.map(this.N)
  }
}

exports.fromDynamoItemToModel = function (schema, item) {
  var model = _.mapValues(item, function (value, key) {
    var a = Object.keys(value).map(function (type) {
      return stringTo[type](value[type])
    })
    return a[0]
  })

  var v = new Validator()
  var result = v.validate(model, schema)

  if (!result.valid) {
    throw new Error(result.errors)
  }

  return model
}

exports.fromModelToDynamoItem = function (schema, model) {
  var v = new Validator()
  var result = v.validate(model, schema)

  if (!result.valid) {
    throw new Error(result.errors)
  }

  return _.omit(_.mapValues(schema.properties, function (value, key) {
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
