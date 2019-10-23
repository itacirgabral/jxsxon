const fs = require('fs');
const nanoid = require('nanoid');
const db = {};

let whatchid 
let w = 0

module.exports = ({ writeAt, listenAt }) => {
  console.log(`whatching ${ listenAt }`);

  whatchid = fs.watch(listenAt, event => {
    console.log(`event = ${ event }`);
    fs.readFile(listenAt, (err, file) => {
      if (err) throw err;
      console.log(`file = ${ file }`);
      let result
      try {
        result = JSON.parse(file);
      } catch {
        console.error(`${listenAt} is not json`);
      }
      const { resolve } = db[result.id]
      resolve(result)
    })
  })

  return {
    hang: (action) => {
      console.log('action')
      console.dir(action)
      let id
      do {
          id = nanoid()
      } while (db[id]);

      const data = { id, action }

      console.log('data')
      console.dir(data)

      return new Promise((resolve, reject) => {
        db.id = { resolve, reject, status: 'writing' }
        fs.writeFile(writeAt, JSON.stringify(data, null, 2), err => {
          if (err) reject(err);
            db.id.status = 'pending';
            console.log(`w: ${ w++ }`);
        })
      })
    },
    pendings: () => Object.values(db).filter(el => el.status === 'pending'),
    quit: () => {},
  }
}


