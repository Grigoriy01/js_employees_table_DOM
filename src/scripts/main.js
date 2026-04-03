'use strict';

// write code here
const headers = document.querySelector('thead');
const headersItemes = [...headers.querySelectorAll('th')];
const tbodyContainer = document.querySelector('tbody');
// const tbodyItemes = [...tbodyContainer.querySelectorAll('tr')];

// var key-name for the normalize()
const colName = headersItemes[0].textContent.toLowerCase();
const position = headersItemes[1].textContent.toLowerCase();
const office = headersItemes[2].textContent.toLowerCase();
const age = headersItemes[3].textContent.toLowerCase();
const salary = headersItemes[4].textContent.toLowerCase();

// for method sort
const asc = 'asc';
const desc = 'desc';

// current a count the rows 'sensor'
const getRowsLenght = () => {
  return [...tbodyContainer.rows];
};

// Listener  row is active
tbodyContainer.addEventListener('click', (checkedRow) => {
  const targetRow = checkedRow.target.closest('tr');

  if (!targetRow) {
    return;
  }

  const currActive = tbodyContainer.querySelector('.active');

  if (currActive) {
    currActive.classList.remove('active');
  }

  targetRow.classList.add('active');
});

// the fun.clean values of cells
const getCleanValue = (iteme, index) => {
  const cleanValue = iteme.cells[index].textContent;

  return Number(cleanValue.replace(/[$,]/g, ''));
};

// the fun. normalize
function normalizeList(row) {
  return row.map((el) => {
    return {
      [colName]: el.cells[0].textContent.toLowerCase(),
      [position]: el.cells[1].textContent.toLowerCase(),
      [office]: el.cells[2].textContent.toLowerCase(),
      [age]: getCleanValue(el, 3),
      [salary]: getCleanValue(el, 4),
      node: el,
    };
  });
}

// the fun. control of state a flag of the Obj
const flags = {
  [colName]: undefined,
  [position]: undefined,
  [office]: undefined,
  [age]: undefined,
  [salary]: undefined,
};

const getControlStateFlag = (checkedTitle) => {
  flags[checkedTitle] = flags[checkedTitle] === asc ? desc : asc;

  return flags[checkedTitle];
};

// Listener 'click'
headers.addEventListener('click', (checked) => {
  const checkedIteme = checked.target.closest('th');
  const checkedValue = checkedIteme.textContent.toLowerCase();

  if (!checkedIteme) {
    return;
  }

  const currentData = normalizeList(getRowsLenght());

  // the func. sortList
  function getSortList(data, key) {
    // callback tool-Numbers
    const sortNumber = (a, b) => a[key] - b[key];
    const sortString = (a, b) => a[key].localeCompare(b[key]);
    const isAsc = getControlStateFlag(checkedValue);

    const selectedTools =
      typeof data[0][key] === 'number' ? sortNumber : sortString;

    const newList = data.sort((a, b) => {
      const callbackResult = selectedTools(a, b);

      return isAsc === asc ? callbackResult : callbackResult * -1;
    });

    newList.forEach((el) => {
      return tbodyContainer.append(el.node);
    });

    return newList;
  }

  getSortList(currentData, checkedValue);
});
