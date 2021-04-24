const figlet = require("figlet");
const config = require("./../package.json");

module.exports = function () {
  let result = "";

  result += figlet.textSync("Geokoord");
  result += "\n3Dim-Observer-Data Converter | by Geokoord.com\n";
  result += "Version: " + config.version + "\n";

  return result;
};
