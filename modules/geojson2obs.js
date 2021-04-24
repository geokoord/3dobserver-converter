const fsPromises = require("fs/promises");
const moment = require("moment");
var colors = require("colors");

module.exports = async function (inFile, outFile, base) {
  /**
   *  Convert File to .3dl
   */
  let targetFormat = await geojson2threedl(inFile, base);
  //console.log("File has been converted");

  /**
   * Write output file
   */
  await fsPromises.writeFile(outFile, targetFormat);
  console.log("Result has been wrote to file: " + colors.yellow(outFile));
};

async function geojson2threedl(file, base) {
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

    await base.addBase(file, [
      firstFeature.geometry.coordinates[0],
      firstFeature.geometry.coordinates[1],
      firstFeature.geometry.coordinates[2],
    ]);

    for (feature of geoJsonObj.features) {
      featureName = feature.properties.name;

      let crs = await base.getBase(file);

      featureX = (feature.geometry.coordinates[0] - crs[0]) * 1000;
      //console.log(featureX);
      featureY = (feature.geometry.coordinates[1] - crs[1]) * 1000;
      //console.log(featureY);
      featureZ = (feature.geometry.coordinates[2] - crs[2]) * 1000 || 0;

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

      //console.log(P);
      result += P;
      i++;
      //console.log("Added feature");
    }

    console.log("Processed " + i + " points.");

    result +=
      'EOF,\n<Protocol LastChanged="' +
      moment().toISOString() +
      '" name="1" xmlns="Protocol" />';
    //console.log(geoJsonObj);

    resolve(result);
  });
}
