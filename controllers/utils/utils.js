const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { document } = (new JSDOM(``)).window;
const fs = require('fs');

function readFile(inputFile) {
  return new Promise(function(resolve, reject) {
    fs.readFile(inputFile, 'utf8', function (err, data) {
      if (err) reject(err);
     resolve(data);
    });
  });
}

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

function niceDate(date = new Date().valueOf()) {
  const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  const nice = new Date(date).toLocaleDateString("en-US", dateOptions);
  return nice;
}

module.exports = {
  buildDataTable,
  niceDate,
  readFile
}
