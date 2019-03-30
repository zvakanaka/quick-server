const {buildDataTable, niceDate, readFile} = require('./utils/utils');

function buildWatchesTable(watches, users) {
  const data = {
    headings: [ 'Name', 'User', 'Link', 'Created' ],
    rows: watches
      .map(s => {
        const user = users.find(u => u.id === s.userId);
        return [s.watchName, (user.hasOwnProperty('name') ? user.name : 'Not Found'), `<a href="${s.url}" target="_blank">Link</a>`, niceDate(s.creationDate)];
      }).reverse()
  };
  const tableOfData = buildDataTable(data);
  return tableOfData;
}

module.exports = async function() {
  try {
    const file = await readFile(process.env.DB_FILE);
    const json = JSON.parse(file);
    return buildWatchesTable(json.watches, json.users).outerHTML;
  } catch (e) {
    console.error(e);
    return '500';
  }
};
