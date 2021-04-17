const fsPromises = require("fs/promises");
const fs = require("fs");
const path = require("path");
const lineReader = require("line-reader");
const config = require("./package.json");

const figlet = require("figlet");

let home = __dirname;

let inFile = process.argv[2] || null;

console.log(figlet.textSync("Geokoord"));
console.log("\n3-Dim-Observer to GeoJSON Converter | by Geokoord.com");
console.log(
  "Version: " +
    config.version +
    "\n ------------------------------------------------------"
);

console.log("IN format: " + ".3dl");
let outExt = ".geojson";
console.log("OUT format: " + outExt);
console.log("");

(async () => {
  try {
    let files = [];

    if (!inFile) {
      //Search for files
      files = await readdir(home);
    } else {
      //Single file is specified with process arguments
      files.push(inFile);
    }

    //Iterate all files
    for (file of files) {
      let p_in = path.parse(path.join(home, file));

      let targetFormat = await threedl2geojson(file);

      console.log(process.argv);

      let p_out_arg = process.argv[3];
      let p_out = null;

      if (p_out_arg) {
        p_out = p_out_arg;
      } else {
        p_out = path.join(home, p_in.name) + outExt;
      }

      console.log(p_out);

      await fsPromises.writeFile(p_out, targetFormat);
    }
  } catch (e) {
    console.log(e);
  }
})();

async function readdir(dir) {
  return new Promise(async (resolve, reject) => {
    let files = await fsPromises.readdir(dir);

    let filesResult = [];

    for (let file of files) {
      //Create full path object
      let fullPath = path.join(dir, file);

      //Createv parsed file object (e.g. for file.name)
      let p = path.parse(fullPath);

      //Extract file extension
      let fileExtension = path.extname(file);

      //Filter fir 3dl files
      if (fileExtension == ".3dl") {
        filesResult.push(file);
      }
    }
    resolve(filesResult);
  });
}

async function threedl2geojson(file) {
  return new Promise((resolve, reject) => {
    let geoJsonObj = {
      type: "FeatureCollection",
      name: "testgeojson",
      crs: {
        type: "name",
        properties: { name: "epsg:31467" },
      },
      features: [],
    };

    //ReadFile
    let r = lineReader.eachLine(file, function (line, last) {
      if (line.startsWith("MPT")) {
        let lineSplit = line.split(",");

        let decimalPlaces = 4;

        let name = lineSplit[3];
        let X = parseFloat((lineSplit[6] / 1000).toFixed(decimalPlaces));
        let Y = parseFloat((lineSplit[7] / 1000).toFixed(decimalPlaces));
        let Z = parseFloat((lineSplit[8] / 1000).toFixed(decimalPlaces));

        geoJsonObj.features.push({
          type: "Feature",
          properties: {
            name: name,
            X: X,
            Y: Y,
            Z: Z,
            REM: lineSplit[0],
            ID: lineSplit[1],
            SortOrder: lineSplit[2],
            Name: lineSplit[3],
            Memo: lineSplit[4],
            Memo2: lineSplit[5],
            "Meas.x": parseFloat((lineSplit[6] / 1000).toFixed(decimalPlaces)),
            "Meas.y": parseFloat((lineSplit[7] / 1000).toFixed(decimalPlaces)),
            "Meas.z": parseFloat((lineSplit[8] / 1000).toFixed(decimalPlaces)),
            "RealMeas.x": parseFloat(
              (lineSplit[9] / 1000).toFixed(decimalPlaces)
            ),
            "RealMeas.y": parseFloat(
              (lineSplit[10] / 1000).toFixed(decimalPlaces)
            ),
            "RealMeas.z": parseFloat(
              (lineSplit[11] / 1000).toFixed(decimalPlaces)
            ),
            "Ref.x": parseFloat((lineSplit[12] / 1000).toFixed(decimalPlaces)),
            "Ref.y": parseFloat((lineSplit[13] / 1000).toFixed(decimalPlaces)),
            "Ref.z": parseFloat((lineSplit[14] / 1000).toFixed(decimalPlaces)),
            "Offset.x": parseFloat(
              (lineSplit[15] / 1000).toFixed(decimalPlaces)
            ),
            "Offset.y": parseFloat(
              (lineSplit[16] / 1000).toFixed(decimalPlaces)
            ),
            "Offset.z": parseFloat(
              (lineSplit[17] / 1000).toFixed(decimalPlaces)
            ),
            X_Check: lineSplit[18],
            Y_Check: lineSplit[19],
            Z_Check: lineSplit[20],
            "MTol.x": parseFloat((lineSplit[21] / 1000).toFixed(decimalPlaces)),
            "MTol.y": parseFloat((lineSplit[22] / 1000).toFixed(decimalPlaces)),
            "MTol.z": parseFloat((lineSplit[23] / 1000).toFixed(decimalPlaces)),
            "PTol.x": parseFloat((lineSplit[24] / 1000).toFixed(decimalPlaces)),
            "PTol.y": parseFloat((lineSplit[25] / 1000).toFixed(decimalPlaces)),
            "PTol.z": parseFloat((lineSplit[26] / 1000).toFixed(decimalPlaces)),
            Visible: lineSplit[27],
            Marked: lineSplit[28],
            PointType: lineSplit[29],
            Code: lineSplit[30],
          },
          geometry: {
            type: "Point",
            coordinates: [X, Y, Z],
          },
        });
      }

      if (last) {
        resolve(JSON.stringify(geoJsonObj));
      }
    });
  });
}
