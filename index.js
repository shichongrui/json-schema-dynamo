var Validator = require('jsonschema').Validator
var _ = require('lodash')

var toModel = {
  S: function (value) {
    return value
  },
  N: function (value) {
    return +value
  },
  BOOL: function (value) {
    switch (value) {
    case true:
    case 'true':
    case 1:
    case '1':
    case 'on':
    case 'yes':
      return true
    default:
      return false
    }
  },
  L: function (value) {
    return value.map(function (value) {
      var type = Object.keys(value)[0]
      return toModel[type](value[type])
    })
  },
  M: function (value) {
    return _.mapValues(value, function (value) {
      var type = Object.keys(value)[0]
      return toModel[type](value[type])
    })
  },
  SS: function (value) {
    return value.map(toModel.S)
  },
  NS: function (value) {
    return value.map(toModel.N)
  }
}

exports.fromDynamoItemToModel = function (schema, item) {
  var model = toModel.M(item)

  var v = new Validator()
  var result = v.validate(model, schema)

  if (!result.valid) {
    throw new Error(result.errors)
  }

  return model
}

var toItem = {
  string: function (schema, value) {
    return { S: String(value) }
  },
  number: function (schema, value) {
    return { N: String(+value) }
  },
  'boolean': function (schema, value) {
    return { BOOL: value }
  },
  array: function (schema, value) {
    if (!Array.isArray(value)) { return null }

    var isNum = (schema.items && (
      schema.items.type === 'number' || schema.items.type === 'integer')
    )
    if (isNum) {
      return { NS: value.map(String) }
    }

    var isStr = (schema.items && schema.items.type === 'string')
    if (isStr) {
      return { SS: value.map(String) }
    }

    return { L: value.map(toItem.any.bind(toItem, schema.items)) }
  },
  object: function (schema, value) {
    if (typeof value !== 'object') { return null }

    var model = {}
    var properties = schema.properties
    Object.keys(properties).forEach(function (name) {
      var subvalue = toItem.any(properties[name], value[name])
      if (subvalue != null) { model[name] = subvalue }
    })
    return { M: model }
  },
  any: function (schema, value) {
    if (value == null) { return null }
    switch (schema.type) {
    case 'string':
      return toItem.string(schema, value)
    case 'integer':
    case 'number':
      return toItem.number(schema, value)
    case 'boolean':
      return toItem['boolean'](schema, value)
    case 'array':
      return toItem.array(schema, value)
    case 'object':
      return toItem.object(schema, value)
    default:
      break;
    }
    return null // couldn't determine a type
  }
}

exports.fromModelToDynamoItem = function (schema, model) {
  var v = new Validator()
  var result = v.validate(model, schema)

  if (!result.valid) {
    throw new Error(result.errors)
  }

  return toItem.object(schema, model).M
}
