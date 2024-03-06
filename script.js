const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");
// Item Lists
const listColumns = document.querySelectorAll(".drag-item-list");
const backlogList = document.getElementById("backlog-list");
const progressList = document.getElementById("progress-list");
const completeList = document.getElementById("complete-list");
const onHoldList = document.getElementById("on-hold-list");

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let currentColumn;
let beeingDraged = false;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem("backlogItems")) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ["Do Yoga", "Sit back and relax"];
    progressListArray = ["Work on projects", "Listen to music"];
    completeListArray = ["Being cool", "Getting stuff done"];
    onHoldListArray = ["Being uncool"];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
  ];
  const arrayName = [
    "backlogItems",
    "progressItems",
    "completeItems",
    "onHoldItems",
  ];
  listArrays.forEach((list, index) => {
    localStorage.setItem(`${arrayName[index]}`, JSON.stringify(list));
  });
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  const listEl = document.createElement("li");
  listEl.classList.add("drag-item");
  listEl.draggable = true;
  listEl.textContent = item;
  listEl.ondragstart = drag;
  listEl.contentEditable = true;
  listEl.id = index;
  columnEl.appendChild(listEl);
  listEl.setAttribute("onblur", `updateItem(${index}, ${column})`);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) {
    getSavedColumns();
  }
  // Backlog Column
  backlogList.textContent = "";
  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogList, 0, backlogItem, index);
  });
  // Progress Column
  progressList.textContent = "";
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList, 1, progressItem, index);
  });
  // Complete Column
  completeList.textContent = "";
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 2, completeItem, index);
  });
  // On Hold Column
  onHoldList.textContent = "";
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 3, onHoldItem, index);
  });
  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

function updateItem(id, column) {
  if (!beeingDraged) {
    const selectedArray = listArrays[column];
    const items = listColumns[column].children;
    if (!items[id].textContent) {
      selectedArray.splice(id, 1);
    } else {
      selectedArray[id] = items[id].textContent;
    }
    updateDOM();
  }
}

function rebuildArray() {
  const tempListArrays = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
  ];
  listColumns.forEach((cl, index) => {
    // Empty list Array with slice --> by reference!!!
    tempListArrays[index].splice(0, tempListArrays[index].length);
    // Create new Arrays from columns
    tempListArrays[index] = cl.children.map((i) => i.textContent);
  });
  updateDOM();
}

function drag(e) {
  beeingDraged = true;
  draggedItem = e.target;
}

function dragEnter(e, index) {
  currentColumn = index;
  listColumns[index].classList.add("over");
}

function allowDrop(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();
  listColumns.forEach((cl) => {
    cl.classList.remove("over");
  });
  listColumns[currentColumn].appendChild(draggedItem);
  rebuildArray();
  beeingDraged = false;
}

// Event Listeners
listColumns.forEach((list, index) => {
  list.addEventListener("dragover", allowDrop);
  list.addEventListener("dragenter", (e) => dragEnter(e, index));
  list.addEventListener("drop", drop);
});

function addToColumn(index) {
  listArrays[index].push(addItems[index].textContent);
  addItems[index].textContent = "";

  updateDOM();
}

function showInputBox(index) {
  addBtns[index].style.visibility = "hidden";
  saveItemBtns[index].style.display = "flex";
  addItemContainers[index].style.display = "flex";
  addItems[index].focus();
}

function hideInputBox(index) {
  addBtns[index].style.visibility = "visible";
  saveItemBtns[index].style.display = "none";
  addItemContainers[index].style.display = "none";
  if (addItems[index].textContent) {
    addToColumn(index);
  }
}

addBtns.forEach((btn, index) => {
  btn.addEventListener("click", () => showInputBox(index));
});

saveItemBtns.forEach((btn, index) => {
  btn.addEventListener("click", () => hideInputBox(index));
});
updateDOM();
