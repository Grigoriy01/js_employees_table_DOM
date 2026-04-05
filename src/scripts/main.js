'use strict';

// write code here
const headers = document.querySelector('thead');
const headersItemes = [...headers.querySelectorAll('th')];
const tbodyContainer = document.querySelector('tbody');
const bodyContainer = document.querySelector('body');

// var toString key-name for the normalize()
const colName = headersItemes[0].textContent.toLowerCase();
const position = headersItemes[1].textContent.toLowerCase();
const office = headersItemes[2].textContent.toLowerCase();
const age = headersItemes[3].textContent.toLowerCase();
const salary = headersItemes[4].textContent.toLowerCase();

// var for notifications
const error = 'error';
const success = 'success';

// for method sort
const asc = 'asc';
const desc = 'desc';

// current a count the rows 'sensor'
const getRowsLenght = () => {
  return [...tbodyContainer.rows];
};

// Listener  row is active
// нужно подумать чтобы убирать полностью выделение строки при клике вне тела
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

// Listener 'click sort_asc->desc'
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

// the func. create notifications
const notification = (typeStatus, titleInput) => {
  const valueNotif = {
    [success]: 'You have added successfully',
    [error]: {
      [colName]: 'The name is less than four letters long',

      [age]: 'Your age does not match',
    },
  };

  const textSuccess = valueNotif.success;
  const textError = valueNotif[typeStatus][titleInput];
  const finalTextMessage = typeStatus === success ? textSuccess : textError;

  const createMessage = `
    <div class="notification">
      <h2 class="title">${typeStatus}</h2>
      <p class="${typeStatus}">
          ${finalTextMessage}
      </p>
    </div>
  `;

  bodyContainer.insertAdjacentHTML('afterbegin', createMessage);

  setTimeout(() => {
    const alertMessage = document.querySelector('.notification');

    alertMessage.style.visibility = 'hidden';
  }, 2000);
};

// <--- create html form --->
const formHtml = `
  <form action="#" class="new-employee-form">
    <label>Name:
      <input name="name" data-qa = "name" type="text" required>
    </label>

    <label>Position:
      <input name="office" data-qa = "office" type="text" required>
    </label>

    <label>Office:
      <select name="position" data-qa = "position" required>

        <option value="tokyo">Tokyo</option>
        <option value="singapore ">Singapore</option>
        <option value="london">London</option>
        <option value="new York">New York</option>
        <option value="edinburgh">Edinburgh</option>
        <option value="san Francisco">San Francisco</option>
      </select>
    </label>

    <label>Age:
      <input name="age" data-qa = "age" type="number" required>
    </label>

    <label>Salary:
      <input name="salary" data-qa = "salary" type="number" required>
    </label>

    <button id="btn-save" type="submit">Save to table</button>
  </form>
`;

// Form rate
bodyContainer.insertAdjacentHTML('beforeend', formHtml);

// access to the form
const myForm = document.querySelector('.new-employee-form');

// Listener for save to table
myForm.addEventListener('click', (e) => {
  e.preventDefault();

  // var for form
  const checkedSave = e.target.closest('#btn-save');

  if (!checkedSave) {
    return;
  }

  const inputName = myForm.elements.name.value;
  const inputPos = myForm.elements.position.value;
  const inputOffice = myForm.elements.office.value;
  const inputAge = myForm.elements.age.value;
  const inputSalary = myForm.elements.salary.value;

  // input validetion logic

  if (inputName.length < 4) {
    return notification(error, colName);
  }

  if (+inputAge < 18 || +inputAge > 90) {
    return notification(error, age);
  }

  const formatedSalary = Number(inputSalary).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  // creating a string temlate
  const newString = `
    <tr>
      <td>${inputName}</td>
      <td>${inputPos}</td>
      <td>${inputOffice}</td>
      <td>${inputAge}</td>
      <td>${formatedSalary}</td>
    </tr>
  `;

  notification(success);
  tbodyContainer.insertAdjacentHTML('afterbegin', newString);
});
