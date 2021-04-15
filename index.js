const fsPromises = require("fs/promises");
const path = require("path");
const lineReader = require("line-reader");
const config = require("./package.json");

console.log("\n3Dim-Observer to GeoJSON Converter | by Geokoord.com");
console.log("Version: " + config.version + "\n");

let home = __dirname;

(async () => {
  try {
    await readdir(home);
    console.log("done.\n");
  } catch (e) {
    console.log(e);
  }
})();

async function readdir(dir) {
  return new Promise(async (resolve, reject) => {
    let files = await fsPromises.readdir(dir);

    for (let file of files) {
      //Create full path object
      let fullPath = path.join(dir, file);

      //Createv parsed file object (e.g. for file.name)
      let p = path.parse(fullPath);

      //Extract file extension
      let fileExtension = path.extname(file);

      //Filter fir 3dl files
      if (fileExtension == ".3dl") {
        let json = await threedl2geojson(file);

        //Write geojson file
        await fsPromises.writeFile(p.name + ".geojson", JSON.stringify(json));

        console.log(
          "Exported file " +
            p.name +
            ".geojson (" +
            json.features.length +
            " Features)"
        );
      }
    }
    resolve(true);
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
        //REM,ID,SortOrder,Name,Memo,Memo2,Meas.x,Meas.y,Meas.z,RealMeas.x,RealMeas.y,RealMeas.z,Ref.x,Ref.y,Ref.z,Offset.x,Offset.y,Offset.z,X_Check,Y_Check,Z_Check,MTol.x,MTol.y,MTol.z,PTol.x,PTol.y,PTol.z,Visible,Marked,PointType,Code,

        let lineSplit = line.split(",");

        let name = lineSplit[3];
        let X = parseFloat((lineSplit[6] / 1000).toFixed(4));
        let Y = parseFloat((lineSplit[7] / 1000).toFixed(4));
        let Z = parseFloat((lineSplit[8] / 1000).toFixed(4));

        geoJsonObj.features.push({
          type: "Feature",
          properties: {
            name: name,
            X: X,
            Y: Y,
            Z: Z,
          },
          geometry: {
            type: "Point",
            coordinates: [X, Y, Z],
          },
        });
      }

      if (last) {
        resolve(geoJsonObj);
      }
    });
  });
}
