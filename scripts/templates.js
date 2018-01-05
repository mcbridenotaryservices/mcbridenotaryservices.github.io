const fs = require("fs");
const readFile = require("util").promisify(fs.readFile);
const path = require("path");

module.exports = {
  getTemplates(dir = "templates") {
    const fileNames = fs.readdirSync(path.join(__dirname, "..", dir))
    .filter(fileName=>fileName.includes(".mustache"));
    const getPath = path.join.bind(path, __dirname, "..", dir);
    const filePaths = fileNames.map(name=>getPath(name));

    return Promise.all(filePaths.map(filePath=>readFile(filePath, "utf8")))
    .then(fileDataArr=>fileDataArr.reduce((obj, data, i)=>{
      return {...obj, [fileNames[i].split(".")[0]]: data};
    }, {}));
  },
  getPartials() {
    return module.exports.getTemplates("templates/partials");
  }
}
