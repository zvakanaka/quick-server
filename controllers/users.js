const model = require('../../bike-list/lib/db'); // from sibling directory
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { document } = (new JSDOM(``)).window;

function buildDataTable(data) {
  const tableOfData = document.createElement('table');
  const frag = document.createDocumentFragment();
  const tableHeadingRow = document.createElement('tr');
  data.headings.forEach(heading => {
    const tableHeading = document.createElement('th');
    tableHeading.textContent = heading;
    tableHeadingRow.appendChild(tableHeading);
  });
  frag.appendChild(tableHeadingRow);
  data.rows.forEach(row => {
    const tableRow = document.createElement('tr');
    data.headings.forEach((name, i) => {
      const rowEl = document.createElement('td');
      rowEl.innerHTML = row[i];
      tableRow.appendChild(rowEl);
    });
    frag.appendChild(tableRow);
  });
  tableOfData.appendChild(frag);
  return tableOfData;
}

function buildUsersTable(users) {
  const data = {
    headings: [ 'Name', 'Created' ],
    rows: users.map(user => ([user.name, user.created]))
  };
  const tableOfData = buildDataTable(data);
  return tableOfData;
}

module.exports = function() {
  return buildUsersTable(model.getAllUsers()).outerHTML;
};
