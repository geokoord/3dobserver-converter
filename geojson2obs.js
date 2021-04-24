const fsPromises = require("fs/promises");
const fs = require("fs");
const path = require("path");
const moment = require("moment");
const config = require("./package.json");

const figlet = require("figlet");

let home = __dirname;

let inFile = process.argv[2] || null;

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

      let targetFormat = await geojson2threedl(file);

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
      //Extract file extension
      let fileExtension = path.extname(file);

      //Filter fir 3dl files
      if (fileExtension == inExt) {
        filesResult.push(file);
      }
    }
    resolve(filesResult);
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

    let firstFeature = geoJsonObj.features[0];

    let base = writeBaseCSRFile(
      firstFeature.geometry.coordinates[0],
      firstFeature.geometry.coordinates[1],
      firstFeature.geometry.coordinates[2]
    );

    for (feature of geoJsonObj.features) {
      featureName = feature.properties.name;

      featureX = (feature.geometry.coordinates[0] - base.baseX) * 1000;
      console.log(featureX);
      featureY = (feature.geometry.coordinates[1] - base.baseY) * 1000;
      console.log(featureY);
      featureZ = (feature.geometry.coordinates[2] - base.baseZ) * 1000 || 0;

      let pointType = "MeasPoint"; //was "MeasPoint"

      let P =
        "MPT," +
        i +
        ",0," +
        featureName +
        ",,," +
        "NaN" +
        "," +
        "NaN" +
        "," +
        "NaN" +
        "," +
        "NaN" +
        "," +
        "NaN" +
        "," +
        "NaN" +
        "," +
        featureX.toFixed(4) +
        "," +
        featureY.toFixed(4) +
        "," +
        featureZ.toFixed(4) +
        ",0.00000,0.00000,0.00000,Y,Y,Y,NaN,NaN,NaN,NaN,NaN,NaN,Y,N," +
        pointType +
        ",,\n";

      console.log(P);
      result += P;
      i++;
      //console.log("Added feature");
    }

    result +=
      'EOF,\n<Protocol LastChanged="13.06.2007 12:44:37" name="1" xmlns="Protocol" />';
    //console.log(geoJsonObj);

    resolve(result);
  });
}

function writeBaseCSRFile(baseX = 0, baseY = 0, baseZ = 0) {
  let basecsr = { baseX: baseX, baseY: baseY, baseZ: baseZ };

  fs.writeFileSync("basecsr.json", JSON.stringify(basecsr));

  return basecsr;
}
