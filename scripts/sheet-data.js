const config = require("./sheet-config.js");
const sheets = require("googleapis").sheets("v4");
const translateFns = {
  fields(vals) {
    return vals.reduce((obj, val)=>{
      return {...obj, [val[0]]: val[1]};
    }, {});
  },
  list(vals, range) {
    return {[range.name]: vals[0]};
  },
  groupedList(vals, range) {
    const keys = vals[0];

    return {[range.name]: vals.slice(1).reduce((arr, row)=>{
      return arr.concat(keys.reduce((obj, key, i)=>{
        return {...obj, [key]: row[i]};
      }, {}));
    }, [])};
  }
};

module.exports = {
  getAllData() {
    return Promise.all(config.namedRanges.map(getData))
    .then(dataArr=>dataArr.reduce((obj, el)=>{
      return {...obj, ...el};
    }, {}));
  }
};

function getData(range) {
  const majorDimension = range.type === "groupedList" ? "ROWS" : "COLUMNS";
  console.info(`Processing ${range.type}: ${range.name}`);
  return config.getAuth()
  .then((client)=>{
    return new Promise((res, rej)=>{
      const apiOptions = {
        auth: client,
        spreadsheetId:config.spreadsheetId,
        range: range.name,
        majorDimension
      };

      sheets.spreadsheets.values.get(apiOptions, (err, resp)=>{
        if (err) {return rej(err);}
        res(translateFns[range.type](resp.values, range));
      });
    });
  });
}
