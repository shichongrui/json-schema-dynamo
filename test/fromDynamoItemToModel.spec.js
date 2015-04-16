var assert = require('assert')
var transformer = require('../')

describe('fromDynamoItemToModel', function () {

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

    it('S', function () {
      var item = {
        string: {
          S: 'a string'
        }
      }
      var model = transformer.fromDynamoItemToModel(item, schema)
      assert(model.string === item.string.S)
    })

    it('N', function () {
      var item = {
        number: {
          N: '1234'
        }
      }

      var model = transformer.fromDynamoItemToModel(item, schema)
      assert(model.number === parseInt(item.number.N, 10))
    })

    it('B', function () {
      var item = {
        boolean: {
          B: 'true'
        }
      }

      var model = transformer.fromDynamoItemToModel(item, schema)
      assert(model.boolean === Boolean(item.boolean.B))
    })

    it('SS', function () {
      var item = {
        arrayString: {
          SS: ['asdf', 'fdsa']
        }
      }

      var model = transformer.fromDynamoItemToModel(item, schema)
      assert(model.arrayString[0] === item.arrayString.SS[0])
      assert(model.arrayString[1] === item.arrayString.SS[1])
    })

    it('SN', function () {
      var item = {
        arrayNumber: {
          SN: ['10', '20']
        }
      }

      var model = transformer.fromDynamoItemToModel(item, schema)
      assert(model.arrayNumber[0] === parseInt(item.arrayNumber.SN[0], 10))
      assert(model.arrayNumber[1] === parseInt(item.arrayNumber.SN[1], 10))
    })
  })

})