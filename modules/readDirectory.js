const fsPromises = require("fs/promises");
const path = require("path");

module.exports = async function readdir(dir, ext) {
  return new Promise(async (resolve, reject) => {
    let files = await fsPromises.readdir(dir);

    let filesResult = [];

    for (let file of files) {
      //Extract file extension
      let fileExtension = path.extname(file);

      //Filter fir 3dl files
      if (ext.indexOf(fileExtension) > -1) {
        filesResult.push(file);
      }
    }
    resolve(filesResult);
  });
};
