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
          date: {
            type: 'date'
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
          },
          arrayDate: {
            type: 'array',
            items: {
              type: 'date'
            }
          },
          arrayObject: {
            type: 'array',
            items: {
              anyOf: [
                {
                  type: 'number'
                },
                {
                  type: 'object',
                  properties: {
                    string: {
                      type: 'string'
                    }
                  }
                }
              ]
            }
          },
          nestedObject: {
            type: 'object',
            properties: {
              number: {
                type: 'number'
              }
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
      var model = transformer.fromDynamoItemToModel(schema, item)
      assert(model.string === item.string.S)
    })

    it('N', function () {
      var item = {
        number: {
          N: '12.34'
        },
        integer: {
          N: '1234'
        }
      }

      var model = transformer.fromDynamoItemToModel(schema, item)
      assert(model.number === parseFloat(item.number.N))
      assert(model.integer === parseInt(item.integer.N, 10))
    })

    it('N that is a date', function () {
      var item = {
        date: {
          N: +Date.now()
        }
      }
      var model = transformer.fromDynamoItemToModel(schema, item)
      assert(+model.date === parseInt(item.date.N, 10))
    })

    it('BOOL', function () {
      var item = {
        boolean: {
          BOOL: 'true'
        }
      }

      var model = transformer.fromDynamoItemToModel(schema, item)
      assert(model.boolean === Boolean(item.boolean.BOOL))
    })

    it('SS', function () {
      var item = {
        arrayString: {
          SS: ['asdf', 'fdsa']
        }
      }

      var model = transformer.fromDynamoItemToModel(schema, item)
      assert(model.arrayString[0] === item.arrayString.SS[0])
      assert(model.arrayString[1] === item.arrayString.SS[1])
    })

    it('NS', function () {
      var item = {
        arrayNumber: {
          NS: ['10', '20']
        }
      }

      var model = transformer.fromDynamoItemToModel(schema, item)
      assert(model.arrayNumber[0] === parseInt(item.arrayNumber.NS[0], 10))
      assert(model.arrayNumber[1] === parseInt(item.arrayNumber.NS[1], 10))
    })

    it('NS of dates', function () {
      var item = {
        arrayDate: {
          NS: ['1441127720385', '1441127720385']
        }
      }
      var model = transformer.fromDynamoItemToModel(schema, item)
      assert(String(+model.arrayDate[0]) === item.arrayDate.NS[0])
      assert(String(+model.arrayDate[1]) === item.arrayDate.NS[1])
    })

    it('L', function () {
      var item = {
        arrayObject: {
          L: [
            { M: { string: { S: 'ewr' } } },
            { M: { string: { S: 'wqe' } } }
          ]
        }
      }

      var model = transformer.fromDynamoItemToModel(schema, item)
      assert(model.arrayObject[0].string === item.arrayObject.L[0].M.string.S)
      assert(model.arrayObject[1].string === item.arrayObject.L[1].M.string.S)
    })

    it('M', function () {
      var item = {
        nestedObject: {
          M: { number: { N: '7' } }
        }
      }

      var model = transformer.fromDynamoItemToModel(schema, item)
      assert(model.nestedObject.number === parseInt(item.nestedObject.M.number.N, 10))
    })
  })

})
