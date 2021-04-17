const fsPromises = require("fs/promises");
const fs = require("fs");
const path = require("path");
const moment = require("moment");
const config = require("./package.json");

const figlet = require("figlet");

console.log(figlet.textSync("Geokoord"));
console.log("\nGeoJSON to 3-Dim-Observer to Converter | by Geokoord.com");
console.log(
  "Version: " +
    config.version +
    "\n ------------------------------------------------------"
);

let inExt = ".geojson";
console.log("IN format: " + inExt);
let outExt = ".3dl";
console.log("OUT format: " + outExt);
console.log("");

let home = __dirname;

(async () => {
  try {
    await readdir(home);
    console.log("msg - done.\n");
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
      if (fileExtension == inExt) {
        //let json = await threedl2geojson(file);
        let result = await geojson2threedl(file);
        //Write geojson file
        await fsPromises.writeFile(p.name + "_out" + outExt, result);

        console.log("Transform file " + file);
        //console.log("Contains " + json.features.length + " Features");
        console.log("csr: " + "epsg:31467");
        console.log("Write to file: " + p.name + "_out" + outExt + "\n");
      }
    }
    resolve(true);
  });
}

async function geojson2threedl(file) {
  return new Promise(async (resolve, reject) => {
    let geoJsonObj = JSON.parse(
      await fsPromises.readFile(file, { encoding: "utf8" })
    );

    let result =
      "VER,2.4,GLM 3-Dim Observer," +
      "\n" +
      "NAM," +
      file +
      "," +
      "\n" +
      "MTH,none,0," +
      "\n" +
      "DEV,,," +
      "\n" +
      "DTS," +
      moment().toISOString() +
      "," +
      "\n" +
      "DTE,," +
      "\n" +
      "MAT,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1," +
      "\n" +
      "REM,ID,SortOrder,Name,Memo,Memo2,Meas.x,Meas.y,Meas.z,RealMeas.x,RealMeas.y,RealMeas.z,Ref.x,Ref.y,Ref.z,Offset.x,Offset.y,Offset.z,X_Check,Y_Check,Z_Check,MTol.x,MTol.y,MTol.z,PTol.x,PTol.y,PTol.z,Visible,Marked,PointType,Code," +
      "\n";

    let i = 0;
    for (feature of geoJsonObj.features) {
      featureName = feature.properties.name;
      featureX = feature.geometry.coordinates[0] * 1000; //
      featureY = feature.geometry.coordinates[1] * 1000; //
      featureZ = feature.geometry.coordinates[2] * 1000 || 0;

      let pointType = "MeasPoint"; //was "MeasPoint"

      result +=
        "MPT," +
        i +
        ",0," +
        featureName +
        ",,," +
        featureX +
        "," +
        featureY +
        "," +
        featureZ +
        "," +
        featureX +
        "," +
        featureY +
        "," +
        featureZ +
        "," +
        featureX +
        "," +
        featureY +
        "," +
        featureZ +
        ",0.00000,0.00000,0.00000,Y,Y,Y,NaN,NaN,NaN,NaN,NaN,NaN,Y,N," +
        pointType +
        ",,\n";
      i++;
      //console.log("Added feature");
    }

    result +=
      'EOF,\n<Protocol LastChanged="13.06.2007 12:44:37" name="1" xmlns="Protocol" />';
    //console.log(geoJsonObj);

    resolve(result);
  });
}
