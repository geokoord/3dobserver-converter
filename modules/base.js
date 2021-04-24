const fsPromises = require("fs/promises");

const baseFilePath = "./base.crs";

let baseModule = {
  getBase: async (name) => {
    return new Promise(async (resolve, reject) => {
      let baseFile = await readBaseCrs();
      resolve(JSON.parse(baseFile)[name]);
    });
  },

  addBase: async (name, baseObject) => {
    return new Promise(async (resolve, reject) => {
      let baseFile = await readBaseCrs();

      let json = JSON.parse(baseFile);

      json[name] = baseObject;

      //console.log(json);

      baseFile = JSON.stringify(json);

      await fsPromises.writeFile(baseFilePath, baseFile);
      resolve(true);
    });
  },
};

module.exports = baseModule;

async function readBaseCrs() {
  return fsPromises.readFile(baseFilePath);
}
