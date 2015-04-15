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
    }
  }
}

var model = {
  id: 'asdf',
  createDate: 1928383,
  name: 'asdffdas',
  active: true
}

var item = transform.fromModelToItem(model, schema)

/*
  item = {
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

/* model = {
    id: 'asdf',
    createDate: 1928383,
    name: 'asdffdas',
    active: true
  }
*/
