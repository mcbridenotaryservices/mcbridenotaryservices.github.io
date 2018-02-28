const fs = require("fs");
const path = require("path");
const targetFilePath = path.join.bind(path, __dirname, "..");
const writeFile = require("util").promisify(fs.writeFile);
const mu = require("mustache");
const sheetData = require("./sheet-data.js");
const templates = require("./templates.js");
const config = require("./sheet-config.js");

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.warn("NO GOOGLE_APPLICATION_CREDENTIALS - OK if running in GCP");
}

config.verifyConfiguredRangeNames()
.then(()=>Promise.all([
  sheetData.getAllData(),
  templates.getTemplates(),
  templates.getPartials()
]))
.then(([sheetData, templates, partials])=>{
  Object.keys(templates).forEach(templateName=>{
    const template = templates[templateName];
    const rendered = mu.render(template, sheetData, partials);

    writeFile(targetFilePath(`${templateName}.html`), rendered);
  });
})
.catch(console.error);
