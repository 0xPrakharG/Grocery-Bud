// ****** SELECT ITEMS **********
const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.grocery-container');
const clearBtn = document.querySelector('.clear-btn');
const list = document.querySelector('.grocery-list');
const grocery = document.getElementById('grocery');

// edit option
let editElement;
let editFlag = false;
let editId = '';

// ****** EVENT LISTENERS **********
// submit form
form.addEventListener('submit', addItem);

// clear items
clearBtn.addEventListener('click', clearItems);

// load items
window.addEventListener('DOMContentLoaded', setupItems);
// ****** FUNCTIONS **********
function addItem(e) {
    e.preventDefault();
    const value = grocery.value;
    const id = new Date().getTime().toString();
    if (value && !editFlag) {
        createListItem(id, value);
        // display alert
        displayAlert('item added to the list', 'success');

        //show container
        container.classList.add('show-container');

        // add to local storage
        addToLocalStorage(id, value);

        //set back to default
        setBackToDefault();
    } else if (value && editFlag) {
        // console.log('editing');
        editElement.innerHTML = value;
        displayAlert('item edited', 'success');
        // edit local storage
        editLocalStorage(editId, value);
        setBackToDefault();
    } else {
        // console.log('empty value');
        displayAlert('Please Enter Value', 'danger');
    }
}

// display alert
function displayAlert(text, action) {
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);

    //remove alert
    setTimeout(function() {
        alert.textContent = '';
        alert.classList.remove(`alert-${action}`);
    }, 1500);
}

//clear items
function clearItems() {
    const items = document.querySelectorAll('.grocery-item');
    if (items.length > 0) {
        items.forEach(function(item) {
            list.removeChild(item);
        });
    }
    container.classList.remove('show-container');
    displayAlert('Empty List', 'danger');
    setBackToDefault();
    localStorage.removeItem('list');
}

//delete fuction
function deleteItem(e) {
    // console.log('item deleted');
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element);
    if (list.children.length === 0) {
        container.classList.remove('show-container');
    }
    displayAlert('Item removed', 'danger');
    setBackToDefault();
    // remove from local storage
    removeFromLocalStorage(id);
}

//edit function
function editItem(e) {
    // console.log('edit item');
    const element = e.currentTarget.parentElement.parentElement;
    //set edit item
    editElement = e.currentTarget.parentElement.previousElementSibling;
    // set form value;
    grocery.value = editElement.innerHTML;
    editFlag = true;
    editId = element.dataset.id;
    submitBtn.textContent = 'edit';
}

//set back to default
function setBackToDefault() {
    // console.log('set back to default');
    grocery.value = '';
    editFlag = false;
    editI = '';
    submitBtn.textContent = 'submit';
}
// ****** LOCAL STORAGE **********
function addToLocalStorage(id, value) {
    const grocery = { id, value };
    let items = getLocalStorage();
    console.log(items);
    items.push(grocery);
    localStorage.setItem('list', JSON.stringify(items));
    // console.log('added to local storage');
}

function removeFromLocalStorage(id) {
    let items = getLocalStorage();
    items = items.filter(function(item) {
        if (item.id !== id) {
            return item;
        }
    });
    localStorage.setItem('list', JSON.stringify(items));
}

function editLocalStorage(id, value) {
    let items = getLocalStorage();
    items = items.map(function(item) {
        if (item.id === id) {
            item.value = value;
        }
        return item;
    });
    localStorage.setItem('list', JSON.stringify(items));
}

function getLocalStorage() {
    return localStorage.getItem('list') ?
        JSON.parse(localStorage.getItem('list')) :
        [];
}
// localStorage API
// setItem
// getItem
//removeItem
// saave as string
// localStorage.setItem('orange', JSON.stringyfy(['item', 'item2']));
// const oranges = JSON.parse(localStorage.getItem('orange'));
// console.log('orange');
// localStorage.removeItem('orange');

// ****** SETUP ITEMS **********

function setupItems() {
    let items = getLocalStorage();
    if (items.length > 0) {
        items.forEach(function(item) {
            createListItem(item.id, item.value);
        });
        container.classList.add('show-container');
    }
}

function createListItem(id, value) {
    // console.log('add item to the list');
    const element = document.createElement('article');
    //add class
    element.classList.add('grocery-item');
    //add id
    const attr = document.createAttribute('data-id');
    attr.value = id;
    element.setAttributeNode(attr);
    element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>`;
    const deleteBtn = element.querySelector('.delete-btn');
    const editBtn = element.querySelector('.edit-btn');
    deleteBtn.addEventListener('click', deleteItem);
    editBtn.addEventListener('click', editItem);
    // append child
    list.appendChild(element);
}