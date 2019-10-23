const fs = require('fs');
const nanoid = require('nanoid');
const process = require('process');
const { create } = require('./mkaction');

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
          resolve({ ...result, id: undefined })
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
        if (err) reject(err);
        db[id].status = 'pending';
      })
    })

    const pAdd2 = pAdd1.then(result => {
      if (result.err) {
        return Promise.reject(result.err)
      }  else {
        return new Promise((resolve, reject) => {
          let id;
          do {
            id = nanoid()
          } while (db[id]);
          db[id] = { resolve, reject, status: 'writing' }
  
          const action = create('todo2') 
          fs.writeFile(writeAt, JSON.stringify({ id, action }, null, 2), err => {
            if (err) reject(err);
            db[id].status = 'pending';
          })
        })
      }
    })

    
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});
