const readline = require("readline");
const welcomeMessage = require("./modules/welcome");
const readDir = require("./modules/readDirectory");
const path = require("path");
const threedl2geojson = require("./modules/obs2geojson");
const geojson2threedl = require("./modules/geojson2obs");
const base = require("./modules/base");
var colors = require("colors");

const consoleMode = false;

(async () => {
  try {
    /**
     * APPLICATION WELCOME MESSAGE
     */
    console.log(welcomeMessage());

    /**
     * LIST ALL FOUND FILES
     */
    let files = null;

    if (!consoleMode) {
      //UI Mode

      console.log("Found files:");
      console.log("------------------------------------------------------");

      files = await readDir(__dirname, [".geojson", ".3dl"]);
      const indexedFiles = require("./modules/consoleIndexedFiles");
      indexedFiles(files);
      console.log("------------------------------------------------------");
    }

    /**
     * SELECT the files for conversion manually.
     */
    let fileIndex = await ask(colors.black.bold("Select a file (by number) :"));
    if (fileIndex >= files.length) {
      throw "Index out of range.";
    }
    console.log(colors.green("You choose: " + files[fileIndex]));

    /**
     * Find the correct transformation method
     */
    let FilePath = path.join(__dirname, files[fileIndex]); //The filename of the selected
    let F = path.parse(FilePath);
    let fileExtension = F.ext; //The file extension (format)

    if (fileExtension == ".3dl") {
      let epsg = await ask(
        colors.black.bold(
          "Specify the coordinate reference system (default: EPSG:31467) - EPSG:"
        )
      );

      if (epsg == "") {
        epsg = 31467;
      }

      let crs = (await base.getBase(files[fileIndex])) || [0, 0, 0];

      await threedl2geojson(
        FilePath,
        path.join(F.dir, F.name + "_res" + ".geojson"),
        crs,
        epsg
      );
    }

    if (fileExtension == ".geojson") {
      await geojson2threedl(
        FilePath,
        path.join(F.dir, F.name + "_res" + ".3dl"),
        base
      );
    }

    console.log(colors.green.bold("\nDONE.\n"));

    process.exit(0);
  } catch (error) {
    console.log(colors.red(error));
  }
})();

function ask(questionText) {
  return new Promise((resolve, reject) => {
    let rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(questionText, (input) => {
      rl.close();
      resolve(input);
    });
  });
}
