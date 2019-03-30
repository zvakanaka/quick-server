const {buildDataTable, readFile, htmlSafeObj} = require('./utils/utils');
const { Parser } = require('@robojones/nginx-log-parser');
const nginxSchema = '$remote_addr - $remote_user [$time_local] "$request" $status $bytes_sent "$http_referer" "$http_user_agent"';
const nginxParser = new Parser(nginxSchema);
const statusCodes = require('http').STATUS_CODES;
const geoip = require('geoip-lite');
const emojiCountries = require('./utils/emojiCountries');

function buildAccessLogTable(logArr) {
  const data = {
    headings: [ 'IP', 'Time', 'Path', 'Status', 'Referrer', 'User Agent' ],
    rows: logArr
      .filter(line => line)
      .map(line => {
        const notSafeNginx = nginxParser.parseLine(line);
	const l = htmlSafeObj(notSafeNginx);
        let geo = geoip.lookup(l.remote_addr);
	if (!geo) geo = {country: '', region: '', city: ''};
        return [`<span title="${geo.country}, ${geo.region}, ${geo.city}">${geo.country ? emojiCountries[geo.country] : '🌎 '} ${geo.city}</span>`, l.time_local, l.request, `<span title="${statusCodes[l.status]}">${l.status}</span>`, l.http_referer, /*ya the dudes mispelled it*/ l.http_user_agent];
      }).reverse()
  };
  const tableOfData = buildDataTable(data);
  return tableOfData;
}

module.exports = async function() {
  try {
    const style = `
body {margin: 0;}

td {word-break: break-word;}
table {
  border-collapse: collapse;
  font-family: monospace;
}

th,
tr,
td {
  padding: .5em .75em;
}
@media screen and (min-width: 10px) and (max-width: 650px) {
  /* vertical display */
  table, thead, tbody, th, tr, td {
    display: block;
  }
  thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }
  td {
    position: relative;
  }
}

@media screen and (min-width: 651px) {
  table {
    max-width: 100%;
  }
}`;
    const file = await readFile(process.env.ACCESS_LOG_FILE);
    const logArr = file.split('\n');
    const htmlPrefix = `<!DOCTYPE html>
        <html lang="en" dir="ltr">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Access Logs</title>
            <style>${style}</style>
          </head>
          <body>`;
    const htmlBody = buildAccessLogTable(logArr).outerHTML;
    const htmlSuffix = `
          </body>
        </html>`;
    return `${htmlPrefix}${htmlBody}${htmlSuffix}`;
  } catch (e) {
    console.error(e);
    return '500';
  }
};
