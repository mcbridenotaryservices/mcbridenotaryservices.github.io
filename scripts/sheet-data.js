const google = require("googleapis");
const sheets = google.sheets("v4");
const sheetOptions = {
  spreadsheetId: "1oTNRuM20uQHu3Umpm4tFRhD8hCo4cgVDc9NgB8nMMBY",
  range: "siteData!A1:G2",
  majorDimension: "COLUMNS"
};

module.exports = {
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
  },
  getData() {
    return module.exports.getAuth()
    .then((client)=>{
      return new Promise((res, rej)=>{
        const apiOptions = {auth: client, ...sheetOptions};

        sheets.spreadsheets.values.get(apiOptions, (err, resp)=>{
          if (err) {return rej(err);}
          res(resp.values.reduce((obj, val)=>{
            return {...obj, [val[0]]: val[1]};
          }, {}));
        })
      });
    });
  }
};
