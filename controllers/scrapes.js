const {buildDataTable, niceDate, readFile} = require('./utils/utils');

function buildScrapesTable(scrapes, users) {
  const data = {
    headings: [ 'Name', 'User', 'Link', 'Created' ],
    rows: scrapes
      .map(s => {
        const user = users.find(u => u.oauthID === s.userId);
        return [s.scrapeName, (user.hasOwnProperty('name') ? user.name : 'Not Found'), `<a href="${s.url}" target="_blank">Link</a>`, niceDate(s.created)];
      }).reverse()
  };
  const tableOfData = buildDataTable(data);
  return tableOfData;
}

module.exports = async function() {
  try {
    const file = await readFile(process.env.DB_FILE);
    const json = JSON.parse(file);
    return buildScrapesTable(json.scrapes, json.users).outerHTML;
  } catch (e) {
    console.error(e);
    return '500';
  }
};
