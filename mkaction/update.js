const model = {
  type: 'update',
  todo: 'ToDo',
}

module.exports =  todo => newtodo => ({ ...model, todo, newtodo })