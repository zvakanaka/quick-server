const {buildDataTable, niceDate, readFile} = require('./utils/utils');

function buildUsersTable(users) {
  const data = {
    headings: [ 'Name', 'Created' ],
    rows: users.map(user => ([user.name, niceDate(user.created)]))
  };
  const tableOfData = buildDataTable(data);
  return tableOfData;
}

module.exports = async function() {
  try {
    const file = await readFile(process.env.DB_FILE);
    return buildUsersTable(JSON.parse(file).users).outerHTML;
  } catch (e) {
    console.error(e);
    return '500';
  }
};
