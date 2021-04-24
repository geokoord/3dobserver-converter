const fsPromises = require("fs/promises");
const lineReader = require("line-reader");

//const base = require("./basecsr.json");

module.exports = async function (inFile, outFile, base) {
  /**
   *  Convert File to .geojson
   */
  let targetFormat = await threedl2geojson(inFile, base);
  console.log("File has been converted");

  /**
   * Write output file
   */
  await fsPromises.writeFile(outFile, targetFormat);
  console.log("Result has been wrote to file: " + outFile);
};

async function threedl2geojson(file, base) {
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

        //console.log(lineSplit);

        let decimalPlaces = 4;

        //console.log(base);

        let ffX = parseFloat(base[0]);
        let ffY = parseFloat(base[1]);
        let ffZ = parseFloat(base[2]);

        let name = lineSplit[3];
        let X = parseFloat((lineSplit[6] / 1000).toFixed(decimalPlaces));
        let Y = parseFloat((lineSplit[7] / 1000).toFixed(decimalPlaces));
        let Z = parseFloat((lineSplit[8] / 1000).toFixed(decimalPlaces));

        //console.log([lineSplit[6], lineSplit[7], lineSplit[8]]);
        //console.log([X + ffX, Y + ffY, Z + ffZ]);

        geoJsonObj.features.push({
          type: "Feature",
          properties: {
            name: name,
            X: X + ffX,
            Y: Y + ffY,
            Z: Z + ffZ,
            REM: lineSplit[0],
            ID: lineSplit[1],
            SortOrder: lineSplit[2],
            Name: lineSplit[3],
            Memo: lineSplit[4],
            Memo2: lineSplit[5],
            "Meas.x":
              parseFloat((lineSplit[6] / 1000).toFixed(decimalPlaces)) + ffX,
            "Meas.y":
              parseFloat((lineSplit[7] / 1000).toFixed(decimalPlaces)) + ffY,
            "Meas.z":
              parseFloat((lineSplit[8] / 1000).toFixed(decimalPlaces)) + ffZ,
            "RealMeas.x":
              parseFloat((lineSplit[9] / 1000).toFixed(decimalPlaces)) + ffX,
            "RealMeas.y":
              parseFloat((lineSplit[10] / 1000).toFixed(decimalPlaces)) + ffY,
            "RealMeas.z":
              parseFloat((lineSplit[11] / 1000).toFixed(decimalPlaces)) + ffZ,
            "Ref.x":
              parseFloat((lineSplit[12] / 1000).toFixed(decimalPlaces)) + ffX,
            "Ref.y":
              parseFloat((lineSplit[13] / 1000).toFixed(decimalPlaces)) + ffY,
            "Ref.z":
              parseFloat((lineSplit[14] / 1000).toFixed(decimalPlaces)) + ffZ,
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
            coordinates: [X + ffX, Y + ffY, Z + ffZ],
          },
        });
      }

      if (last) {
        resolve(JSON.stringify(geoJsonObj));
      }
    });
  });
}
