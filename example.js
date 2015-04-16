var transformers = require('./')

var schema = {
  id: 'schema',
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

var dynamoItem = transformers.fromModelToDynamoItem(schema, model)
console.log(dynamoItem)

var newModel = transformers.fromDynamoItemToModel(schema, dynamoItem)
console.log(newModel)
