const readline = require("readline");
const welcomeMessage = require("./modules/welcome");
const readDir = require("./modules/readDirectory");
const path = require("path");
const threedl2geojson = require("./modules/obs2geojson");
const base = require("./modules/base");
var colors = require("colors");

const consoleMode = false;

(async () => {
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

    files = await readDir(__dirname, [".geojson", ".3dl"]);
    const indexedFiles = require("./modules/consoleIndexedFiles");
    indexedFiles(files);
  }

  /**
   * SELECT the files for conversion manually.
   */
  let fileIndex = await ask(colors.black.bold("Select a file (by number) :"));
  console.log(colors.green("You choose: " + files[fileIndex]));

  /**
   * Find the correct transformation method
   */
  let FilePath = path.join(__dirname, files[fileIndex]); //The filename of the selected
  let F = path.parse(FilePath);
  let fileExtension = F.ext; //The file extension (format)

  if (fileExtension == ".3dl") {
    let crs = (await base.getBase(files[fileIndex])) || [0, 0, 0];

    await threedl2geojson(
      FilePath,
      path.join(F.dir, F.name + "_res" + ".geojson"),
      crs
    );
  }

  if (fileExtension == ".geojson") {
    //geojson2threedl();
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

/*


rl.question("What is your name ? ", function (name) {
  rl.question("Where do you live ? ", function (country) {
    console.log(`${name}, is a citizen of ${country}`);
    rl.close();
  });
});

rl.on("close", function () {
  console.log("\nBYE BYE !!!");
  process.exit(0);
});
*/
