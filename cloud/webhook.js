const http = require("http");
const exec = require("util").promisify(require("child_process").exec);
const cwd = require("path").join(__dirname, "..");
const triggerKey = process.env.TRIGGER_KEY;
const STATUS_OK = 200;
const STATUS_SERVER_ERROR = 500;
const PORT = 80;

if (!triggerKey) {console.log("NO TRIGGER KEY"); return;}

http.createServer((req, resp)=>{
  if (req.url === "/hc") {return resp.end();}
  if (!req.url.includes(triggerKey)) {return;}

  exec("npm run pull-generate-push", {cwd})
  .then((stdout, stderr)=>{
    resp.statusCode = STATUS_OK;
    resp.end(new Date());
  })
  .catch((err, stdout, stderr)=>{
    const errOutput = err.stack.concat(stdout).concat(stderr);
    console.log(errOutput);

    resp.statusCode = STATUS_SERVER_ERROR;
    resp.end(errOutput);
  });
}).listen(PORT, ()=>console.log(`Listening on port ${PORT}`));
