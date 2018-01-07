const config = require("../config/sheetConfig.json");
const google = require("googleapis");
const sheets = google.sheets("v4");
const validRangeTypes = [
  "fields",
  "list",
  "groupedList"
];

if (!config.spreadsheetId) {
  throw Error("Missing spreadsheet id");
}

if (!config.namedRanges) {
  throw Error("No named ranges configured");
}

if (!config.namedRanges.every(nr=>validRangeTypes.includes(nr.type))) {
  throw Error("Invalid range type detected");
}

module.exports = {
  ...config,
  verifyConfiguredRangeNames() {
    return module.exports.getAuth()
    .then((client)=>{
      return new Promise((res, rej)=>{
        const apiOptions = {auth: client, spreadsheetId:config.spreadsheetId};

        sheets.spreadsheets.get(apiOptions, (err, resp)=>{
          if (err) {return rej(err);}
          console.info(`Using spreadsheet: ${resp.properties.title}`);

          const sheetRangeNames = resp.namedRanges.map(nr=>nr.name);
          const configuredRangeNames = config.namedRanges.map(nr=>nr.name);

          if (!configuredRangeNames.every(name=>sheetRangeNames.includes(name))) {
            return rej(Error("A configured named range is missing from the spreadsheet"));
          }

          if (configuredRangeNames.length !== sheetRangeNames.length) {
            console.warn("There are named ranges in the spreadsheet that aren't configured in sheetConfig.json");
          }
          console.info(`${configuredRangeNames.length} named ranges will be rendered`);
          res();
        });
      });
    });
  },
  getAuth() {
    return new Promise((res, rej)=>{
      google.auth.getApplicationDefault((err, client)=>{
        if (err) {return rej(err);}

        if (client.createScopedRequired && client.createScopedRequired()) {
          client = client.createScoped([
            "https://www.googleapis.com/auth/spreadsheets.readonly"
          ]);
        }

        res(client);
      });
    });
  }
};
