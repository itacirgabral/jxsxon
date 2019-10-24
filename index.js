const fs = require('fs');
const nanoid = require('nanoid');
const process = require('process');
const { create, remove, update, read, list } = require('./mkaction');

const db = {};
let whatchid;

fs.readFile('conf.json', (err, data) => {
  try {
    if (err) throw err;
    const { writeAt, listenAt } = JSON.parse(data);
    console.log(`writeAt = ${ writeAt } listenAt = ${ listenAt }`);

    whatchid = fs.watch(listenAt, event => {
      console.log(`event = ${ event }`)
      fs.readFile(listenAt, (err, file) => {
        if (err) throw err;
        let result
        try {
          result = JSON.parse(file);
        } catch {
          console.error(`${listenAt} is not json`);
          result = { }
        }
        /**
         * o arquivo foi alterado!
         */
        console.dir(result)
        if(!db[result.id]) {
          // pergunta não feita ou já respondida
          // não consta na fila de espera
          // deve avisar quem tá oferecendo a resposta?
          console.error(`not found ${ result.id }`)
          console.dir(db)
        } else {
          console.log(`found ${ result.id }`)
          const { resolve } = db[result.id]
          db[result.id] = undefined
          resolve(result)
        }
      })
    })

    const pAdd1 = new Promise((resolve, reject) => {
      let id;
      do {
        id = nanoid()
      } while (db[id]);
      db[id] = { resolve, reject, status: 'writing' }
      console.log(`db[id] = db[${ id }]`)
      
      const action = create('todo1') 
      fs.writeFile(writeAt, JSON.stringify({ id, action }, null, 2), err => {
        if (err) {
          console.log('pAdd1 write error');
          console.err(err);
          reject(err);
        }
        db[id].status = 'pending';
      })
    }).catch(console.error)

    const pAdd2 = pAdd1.then(result => {
      if (result.err) {
        return Promise.reject(result.err)
      }  else {
        console.log('then')
        console.dir(result)
        return new Promise((resolve, reject) => {
          let id;
          do {
            id = nanoid()
          } while (db[id]);
          db[id] = { resolve, reject, status: 'writing' }
  
          const action = create('todo2') 
          fs.writeFile(writeAt, JSON.stringify({ id, action }, null, 2), err => {
            if (err) {
              console.log('pAdd2 write error');
              console.err(err);
              reject(err);
            }
            db[id].status = 'pending';
          })
        })
      }
    }).catch(console.error)

    const pList3 = pAdd2.then(result => {
      if (result.err) {
        return Promise.reject(result.err)
      }  else {
        console.log('then')
        console.dir(result)
        return new Promise((resolve, reject) => {
          let id;
          do {
            id = nanoid()
          } while (db[id]);
          db[id] = { resolve, reject, status: 'writing' }
  
          const action = list() 
          fs.writeFile(writeAt, JSON.stringify({ id, action }, null, 2), err => {
            if (err) {
              console.log('pList3 write error');
              console.err(err);
              reject(err);
            }
            db[id].status = 'pending';
          })
        })
      }
    }).catch(console.error)

    const pUpdate4 = pList3.then(result => {
      if (result.err) {
        return Promise.reject(result.err)
      }  else {
        console.log('then')
        console.dir(result)
        return new Promise((resolve, reject) => {
          let id;
          do {
            id = nanoid()
          } while (db[id]);
          db[id] = { resolve, reject, status: 'writing' }
  
          const action = update('todo2')('ToDo2')
          fs.writeFile(writeAt, JSON.stringify({ id, action }, null, 2), err => {
            if (err) {
              console.log('pUpdate4 write error');
              console.err(err);
              reject(err);
            }
            db[id].status = 'pending';
          })
        })
      }
    }).catch(console.error)

    const pView4 = pUpdate4.then(result => {
      if (result.err) {
        return Promise.reject(result.err)
      }  else {
        console.log('then')
        console.dir(result)
        return new Promise((resolve, reject) => {
          let id;
          do {
            id = nanoid()
          } while (db[id]);
          db[id] = { resolve, reject, status: 'writing' }
  
          const action = read('ToDo2')
          fs.writeFile(writeAt, JSON.stringify({ id, action }, null, 2), err => {
            if (err) {
              console.log('pView4 write error');
              console.err(err);
              reject(err);
            }
            db[id].status = 'pending';
          })
        })
      }
    }).catch(console.error)

    const pRemove5 = pView4.then(result => {
      if (result.err) {
        return Promise.reject(result.err)
      }  else {
        console.log('then')
        console.dir(result)
        return new Promise((resolve, reject) => {
          let id;
          do {
            id = nanoid()
          } while (db[id]);
          db[id] = { resolve, reject, status: 'writing' }
  
          const action = remove('todo1')
          fs.writeFile(writeAt, JSON.stringify({ id, action }, null, 2), err => {
            if (err) {
              console.log('pRemove5 write error');
              console.err(err);
              reject(err);
            }
            db[id].status = 'pending';
          })
        })
      }
    }).catch(console.error)

    const pList6 = pRemove5.then(result => {
      if (result.err) {
        return Promise.reject(result.err)
      }  else {
        console.log('then')
        console.dir(result)
        return new Promise((resolve, reject) => {
          let id;
          do {
            id = nanoid()
          } while (db[id]);
          db[id] = { resolve, reject, status: 'writing' }
  
          const action = list()
          fs.writeFile(writeAt, JSON.stringify({ id, action }, null, 2), err => {
            if (err) {
              console.log('pList6 write error');
              console.err(err);
              reject(err);
            }
            db[id].status = 'pending';
          })
        })
      }
    }).catch(console.error)

    pList6.then(result => {
      if (result.err) {
        return Promise.reject(result.err)
      }  else {
        console.log('then')
        console.dir(result)
      }
    }).catch(console.error)

    
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});
