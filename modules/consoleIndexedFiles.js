var colors = require("colors");

module.exports = function (fileArray) {
  let i = 0;

  for (file of fileArray) {
    if (file) {
      console.log(colors.yellow("(" + i + ") " + file));
      i++;
    }
  }
};
