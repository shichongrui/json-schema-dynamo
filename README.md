#json-schema-dynamo#
Just an easier way to transform objects into DynamoDB items

    var transformers = require('json-schema-dynamo')

    var schema = {
      type: 'object',
      properties: {
        id: {
          type: 'string'
        },
        createDate: {
          type: 'number'
        },
        name: {
          type: 'string'
        },
        active: {
          type: 'boolean'
        },
        types: {
          type: 'array',
          items: {
            type: 'string'
          }
        },
        userIds: {
          type: 'array',
          items: {
            type: 'number'
          }
        }
      }
    }

    var model = {
      id: 'asdf',
      createDate: 1928383,
      name: 'asdffdas',
      active: true,
      types: ['qwerty', 'ytrewq'],
      userIds: [1, 2, 3, 4, 5, 6, 7]
    }

    var item = transformers.fromModelToItem(model, schema)
    console.log(item)
    /*
      {
        id: {
          S: 'asdf'
        },
        createDate: {
          N: '1928383'
        },
        name: {
          S: 'asdffdas'
        },
        active: {
          B: 'true'
        },
        types: {
          SS: ['qwerty', 'ytrewq']
        },
        userIds: {
          SN: ['1', '2', '3', '4', '5', '6', '7']
        }
      }
    */

    var newModel = transformers.fromItemToModel(item, schema)
    console.log(newModel)
    /*
      {
        id: 'asdf',
        createDate: 1928383,
        name: 'asdffdas',
        active: true,
        types: ['qwerty', 'ytrewq'],
        userIds: [1, 2, 3, 4, 5, 6, 7]
      }
    */


Currently it supports: string, number, integer, boolean, array of strings, and array of numbers

Both transforms will also validate your model against your schema as well
