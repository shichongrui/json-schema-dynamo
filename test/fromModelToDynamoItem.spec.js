var assert = require('assert')
var transformer = require('../')

describe('fromModelToDynamoItem', function() {

  describe('validation', function() {
    var schema
    var model

    beforeEach(function() {
      schema = {
        type: 'object',
        properties: {
          prop: {
            type: 'string'
          }
        }
      }

      model = {
        prop: 'a string'
      }
    })

    it('fails if the schema and model data types do not match', function () {
      model.prop = 1234

      assert.throws(function () {
        transformer.fromModelToDynamoItem(schema, model)
      })
    })

    it('fails if a required property is missing', function () {
      delete model.prop
      schema.required = ['prop']

      assert.throws(function () {
        transformer.fromModelToDynamoItem(schema, model)
      })
    })

    it('passes if an optional value is missing', function () {
      schema.properties.anotherProp = {
        type: 'number'
      }

      assert.doesNotThrow(function() {
        transformer.fromModelToDynamoItem(schema, model)
      })
    })

    it ('passes if there are attributes on the model not in the schema', function () {
      model.anotherProp = 99999

      assert.doesNotThrow(function() {
        transformer.fromModelToDynamoItem(schema, model)
      })
    })

  })

  describe('doesnt transform', function () {
    var schema
    var model

    beforeEach(function() {
      schema = {
        type: 'object',
        properties: {
          prop: {
            type: 'string'
          }
        }
      }

      model = {
        prop: 'a string'
      }
    })

    it('optional attributes that are not defined on the model', function () {
      schema.properties.anotherProp = {
        type: 'number'
      }

      var item = transformer.fromModelToDynamoItem(schema, model)
      assert(!item.hasOwnProperty('anotherProp'))
    })

    it('attributes that arent in the schema', function () {
      model.anotherProp = 99999

      var item = transformer.fromModelToDynamoItem(schema, model)
      assert(!item.hasOwnProperty('anotherProp'))
    })
  })

  describe('transforms', function () {
    var schema

    beforeEach(function() {
      schema = {
        type: 'object',
        properties: {
          string: {
            type: 'string'
          },
          number: {
            type: 'number'
          },
          integer: {
            type: 'integer'
          },
          boolean: {
            type: 'boolean'
          },
          arrayString: {
            type: 'array',
            items: {
              type: 'string'
            }
          },
          arrayNumber: {
            type: 'array',
            items: {
              type: 'number'
            }
          }
        }
      }
    })

    it('strings', function () {
      var model = {
        string: 'a string'
      }
      var item = transformer.fromModelToDynamoItem(schema, model)
      assert(item.string.S === model.string)
    })

    it('numbers', function () {
      var model = {
        number: 1234.1234
      }
      var item = transformer.fromModelToDynamoItem(schema, model)
      assert(item.number.N === String(model.number))
    })

    it('integers', function () {
      var model = {
        integer: 1234
      }
      var item = transformer.fromModelToDynamoItem(schema, model)
      assert(item.integer.N === String(model.integer))
    })

    it('booleans', function () {
      var model = {
        boolean: true
      }
      var item = transformer.fromModelToDynamoItem(schema, model)
      assert(item.boolean.B === String(model.boolean))
    })

    it('array of strings', function () {
      var model = {
        arrayString: ['asdf', 'fdas']
      }
      var item = transformer.fromModelToDynamoItem(schema, model)
      assert(item.arrayString.SS[0] === model.arrayString[0])
      assert(item.arrayString.SS[1] === model.arrayString[1])
    })

    it('array of numbers', function () {
      var model = {
        arrayNumber: [10, 20]
      }
      var item = transformer.fromModelToDynamoItem(schema, model)
      assert(item.arrayNumber.SN[0] === String(model.arrayNumber[0]))
      assert(item.arrayNumber.SN[1] === String(model.arrayNumber[1]))
    })
  })

})
