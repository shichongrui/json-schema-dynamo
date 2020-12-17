# `json-schema-dynamo`

If you are able to, please consider using the `DocumentClient` in the `AWS.DynamoDB` SDK as it makes this package mostly unnecessary.

An easier way to transform objects into DynamoDB items

    var transformers = require('json-schema-dynamo')

    var schema = {
      type: 'object',
      properties: {
        id: {
          type: 'string'
        },
        createDate: {
          type: 'date'
        },
        name: {
          type: 'string'
        },
        active: {
          type: 'boolean'
        },
        likes: {
          type: 'number'
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
      createDate: new Date(),
      name: 'asdffdas',
      likes: 1,
      active: true,
      types: ['qwerty', 'ytrewq'],
      userIds: [1, 2, 3, 4, 5, 6, 7]
    }

    var item = transformers.fromModelToDynamoItem(schema, model)
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
        likes: {
          N: '1'
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

    var newModel = transformers.fromDynamoItemToModel(schema, item)
    console.log(newModel)
    /*
      {
        id: 'asdf',
        createDate: <Date>,
        name: 'asdffdas',
        active: true,
        likes: 1
        types: ['qwerty', 'ytrewq'],
        userIds: [1, 2, 3, 4, 5, 6, 7]
      }
    */


Currently it supports: string, number, integer, boolean, array of strings, array of numbers, and lists

There is also custom support for dates. You can define an attribute as a date type which will be transformed into an `N` in Dynamo and then back into a date when retrieved.

Both transforms will also validate your model against your schema as well
