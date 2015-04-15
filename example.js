var transform = require('./')

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

var item = transform.fromModelToItem(model, schema)
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
    }
  }
*/

var newModel = transform.fromItemToModel(item, schema)
console.log(newModel)
/* {
    id: 'asdf',
    createDate: 1928383,
    name: 'asdffdas',
    active: true
  }
*/
