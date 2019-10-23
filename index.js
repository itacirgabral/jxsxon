const fs = require('fs');
const process = require('process');

fs.readFile('conf.json', (err, data) => {
  try {
    if (err) throw err;
    const { writeAt, listenAt } = JSON.parse(data)
    console.log(`writeAt = ${ writeAt } listenAt = ${ listenAt }`)
    fs.watch(listenAt, (event, filename) => {
      console.log(`event = ${ event } filename = ${ filename }`);
      fs.readFile(filename, (err, file) => {
        if (err) throw err;
        console.log(`file = ${ file }`);
        let result
        try {
          result = JSON.parse(file);
        } catch {
          console.error(`${listenAt} is not json`);
        }

        console.dir(result)
      })
    })
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});
