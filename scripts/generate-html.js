const fs = require("fs");
const path = require("path");
const targetFilePath = path.join.bind(path, __dirname, "..");
const writeFile = require("util").promisify(fs.writeFile);
const mu = require("mustache");
const sheetData = require("./sheet-data.js");
const templates = require("./templates.js");

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  return console.log("NO GOOGLE_APPLICATION_CREDENTIALS");
}

Promise.all([
  sheetData.getData(),
  templates.getTemplates(),
  templates.getPartials()
])
.then(([sheetData, templates, partials])=>{
  Object.keys(templates).forEach(templateName=>{
    const template = templates[templateName];
    const rendered = mu.render(template, sheetData, partials);

    writeFile(targetFilePath(`${templateName}.html`), rendered);
  });
})
.catch(console.error);
