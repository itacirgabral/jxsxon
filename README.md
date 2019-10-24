# jxsxon
file conector to shared json editor to network on shared directories

# action
- create
- list
- read
- remove
- update

## create
```javascript
// create('todo1') 
const create = {
  "id": "M-8DPRoNXCXUJAPbHDObX",
  "action": {
    "type": "create",
    "todo": "todo1"
  }
}
```

## list
```javascript
// list()
const list = {
  "id": "XMPN7-LLc1lSEtc-IF3rz",
  "action": {
    "type": "list"
  }
}
```

## read
```javascript
// read('ToDo')
const read = {
  "id": "2W_ol_vsRw33eIHSupGnf",
  "action": {
    "type": "read",
    "todo": "ToDo2"
  }
}
```

## remove
```javascript
// remove('todo1')
const remove = {
  "id": "bc19VRrdBI70bsg3Mh_Y5",
  "action": {
    "type": "remove",
    "todo": "todo1"
  }
}
```

## update
```javascript
// update('todo2')('ToDo2')
const update = {
  "id": "Xy2Fh-gfr7IDWglsPoZSl",
  "action": {
    "type": "update",
    "todo": "todo2",
    "newtodo": "ToDo2"
  }
}
```

# FUNCIONAMENTO
Há 2 arquivos json, o `action.json` e o `result.json`, eles estarão num diretório compartilhado. O servidor web vai escrever em action e escutar em result, o servidor em c# vai escutar em action e escrever em result.

Toda comunicação será feita neste envelope:
```json
{
  "id": "identificador"
}
```
Uma pergunta (action) feita terá um identificador e o resultado do processamento dela será colocado em result com o mesmo id. Deste modo o servidor web está fazendo requisições para o servidor c# e ele respondendo.