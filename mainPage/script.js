String.prototype.toProperCase = function () {
  return this.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

var dragContainer = document.querySelector(".drag-container");
var itemContainers = [].slice.call(
  document.querySelectorAll(".board-column-content")
);
var columnGrids = [];
var boardGrid;
var dueTasks = 0;
const addTask = document.querySelector("#addTask");
const addTaskButton = document.querySelector(".uil-plus-circle");
const trashDone = document.querySelector(".uil-trash-alt");

const progressRing = document.querySelector("#pR");
const totalTasks = document.querySelector("#totalTasks");
const waitingTasks = document.querySelector("#waitingTasks");
const inProgressTasks = document.querySelector("#inProgressTasks");
const completedTasks = document.querySelector("#completedTasks");
const searchTask = document.getElementById("searchTasks");

var recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.onresult = function (event) {
  for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        console.log(event.results[i][0].transcript);
        searchTask.value=event.results[i][0].transcript;
        searchTask.dispatchEvent(new Event('change'));
      }
  }
};

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
},
});





const categoryButtonMap = {
  work: "primary",
  personal: "success",
  health: "warning",
  home: "neutral",
  goals: "danger",
};
// Declaring Grid Item References
const toDoItems = document.querySelector("#toDoItems");

const workingItems = document.querySelector("#workingItems");

const doneItems = document.querySelector("#doneItems");

const progressGridItems = document.querySelector("#progressItems");

var toDoGrid = new Muuri(toDoItems, {
  layoutEasing: 'ease',
  items: ".board-item",
  dragEnabled: true,

  sortData: {
    id: function (item, element) {
      return element.children[0].textContent;
    },
    date: function (item, element){
      return new Date(element.children[0].children[2].getAttribute("date"));
    }
  },

  dragSort: function () {
    return columnGrids;
  },
  dragContainer: dragContainer,
  dragAutoScroll: {
    targets: (item) => {
      return [
        { element: window, priority: 0 },
        { element: item.getGrid().getElement().parentNode, priority: 1 },
      ];
    },
  },

  dragStartPredicate: {
    distance: 5, // The distance the pointer has to be moved before dragging starts
    delay: 100, // The delay in milliseconds before dragging starts
  },
})
  .on("dragInit", function (item) {
    item.getElement().style.width = item.getWidth() + "px";
    item.getElement().style.height = item.getHeight() + "px";
  })
  .on("dragReleaseEnd", function (item) {
    saveState();
    item.getElement().style.width = "";
    item.getElement().style.height = "";
    item.getGrid().refreshItems([item]);
  })
  .on("layoutStart", function () {
    boardGrid.refreshItems().layout();
  });

columnGrids.push(toDoGrid);

var workingGrid = new Muuri(workingItems, {
  items: ".board-item",
  dragEnabled: true,

  sortData: {
    id: function (item, element) {
      return element.children[0].textContent;
    },
    date: function (item, element){
      return new Date(element.children[0].children[2].getAttribute("date"));
    }
  },

  dragSort: function () {
    return columnGrids;
  },
  dragContainer: dragContainer,
  dragAutoScroll: {
    targets: (item) => {
      return [
        { element: window, priority: 0 },
        { element: item.getGrid().getElement().parentNode, priority: 1 },
      ];
    },
  },
  dragStartPredicate: {
    distance: 5, // The distance the pointer has to be moved before dragging starts
    delay: 100, // The delay in milliseconds before dragging starts
  },
})
  .on("dragInit", function (item) {
    item.getElement().style.width = item.getWidth() + "px";
    item.getElement().style.height = item.getHeight() + "px";
  })
  .on("dragReleaseEnd", function (item) {
    saveState();
    item.getElement().style.width = "";
    item.getElement().style.height = "";
    item.getGrid().refreshItems([item]);
  })
  .on("layoutStart", function () {
    boardGrid.refreshItems().layout();
  });

columnGrids.push(workingGrid);

var doneGrid = new Muuri(doneItems, {
  items: ".board-item",
  dragEnabled: true,

  sortData: {
    id: function (item, element) {
      return element.children[0].textContent;
    },
    date: function (item, element){
      return new Date(element.children[0].children[2].getAttribute("date"));
    }
  },

  dragSort: function () {
    return columnGrids;
  },
  dragContainer: dragContainer,
  dragAutoScroll: {
    targets: (item) => {
      return [
        { element: window, priority: 0 },
        { element: item.getGrid().getElement().parentNode, priority: 1 },
      ];
    },
  },
  dragStartPredicate: {
    distance: 5, // The distance the pointer has to be moved before dragging starts
    delay: 100, // The delay in milliseconds before dragging starts
  },
})
  .on("dragInit", function (item) {
    item.getElement().style.width = item.getWidth() + "px";
    item.getElement().style.height = item.getHeight() + "px";
  })
  .on("dragReleaseEnd", function (item) {
    saveState();
    item.getElement().style.width = "";
    item.getElement().style.height = "";
    item.getGrid().refreshItems([item]);
  })
  .on("layoutStart", function () {
    boardGrid.refreshItems().layout();
  });

columnGrids.push(doneGrid);

var ProgressGrid = new Muuri(progressGridItems, {
  items: ".board-item",
  dragEnabled: true,

  dragSort: function () {
    return columnGrids;
  },
  dragContainer: dragContainer,
  dragAutoScroll: {
    targets: (item) => {
      return [
        { element: window, priority: 0 },
        { element: item.getGrid().getElement().parentNode, priority: 1 },
      ];
    },
  },
  dragStartPredicate: {
    distance: 5, // The distance the pointer has to be moved before dragging starts
    delay: 100, // The delay in milliseconds before dragging starts
  },
})
  .on("dragInit", function (item) {
    item.getElement().style.width = item.getWidth() + "px";
    item.getElement().style.height = item.getHeight() + "px";
  })
  .on("dragReleaseEnd", function (item) {
    saveState();
    item.getElement().style.width = "";
    item.getElement().style.height = "";
    item.getGrid().refreshItems([item]);
  })
  .on("layoutStart", function () {
    boardGrid.refreshItems().layout();
  });

columnGrids.push(ProgressGrid);

// Init board grid so we can drag those columns around.
boardGrid = new Muuri(".board", {
  dragEnabled: false,
  dragHandle: ".board-column-header",
});

// Save the grid state to local storage

async function updateProgress() {
  let doneCount = doneGrid.getItems().length || 0;
  let notDoneCount = toDoGrid.getItems().length + workingGrid.getItems().length;
  let workingCount = workingGrid.getItems().length;

  let progress = (doneCount / (doneCount + notDoneCount)) * 100 || 0;
  progressRing.setAttribute("value", progress);
  progressRing.innerText = Math.floor(progress) + "%";

  totalTasks.innerText = doneCount + notDoneCount;
  completedTasks.innerText = doneCount;
  inProgressTasks.innerHTML = workingCount;
  waitingTasks.innerHTML = notDoneCount - workingCount;

  console.log(progress);
}

async function saveState() {
  const gridState = [];
  await updateProgress();
  // Loop through each grid and get the item order and tag values
  columnGrids.forEach((grid) => {
    const itemData = grid.getItems().map((item) => {
      const itemContent = item
        .getElement()
        .querySelector(".board-item-content")
        .childNodes[0].textContent.trim();
      const tagValue = item
        .getElement()
        .querySelector(".categoryTag")
        .textContent.toLowerCase();
      const taskDate = item
        .getElement()
        .querySelector(".taskDate").getAttribute("date");
      return { content: itemContent, tag: tagValue, date: taskDate };
    });
    gridState.push(itemData);
  });

  // Save the grid state to local storage
  localStorage.setItem("gridState", JSON.stringify(gridState));
  console.log("State Saved");
}

async function addNewTask() {
  const { value: taskName } = await Swal.fire({
    icon: "question",
    input: "textarea",
    inputLabel: "Add Task",
    inputPlaceholder: "Task Description",
    inputAttributes: {
      "aria-label": "Type your message here",
    },
    showCancelButton: true,
  //   backdrop: `
  //   rgba(0,0,123,0.4)
  //   url("https://thumbs.gfycat.com/FreePiercingHamster-size_restricted.gif")
  //   left top
  //   no-repeat
  // `
  });
  if (taskName == undefined) {
    return;
  }

  const { value: category } = await Swal.fire({
    title: "Category",
    input: "select",
    inputOptions: {
      work: "Work",
      personal: "Personal",
      health: "Health",
      home: "Home",
      goals: "Goals",
    },
    inputPlaceholder: "Select a category",
    showCancelButton: true,
  });

  let datepicker;
  const today = new Date().toISOString().slice(0, 10);

  const { value: taskNewDate } = await Swal.fire({
    title: "Task Deadline",
    html: '<input id="dtp" type="date" class="form-control" autofocus min="'+today+'">',
    icon: "info",
    showCancelButton: true,
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
    preConfirm: () => {
      return {
        tnd: $('#dtp').val(),
      };
    },  
  });

  // document.querySelector("#datetimepicker").value;
  console.log("Value of taskNewDate > "+taskNewDate.tnd);


  const newTaskElement = document.createElement("div");
  newTaskElement.classList.add("board-item");
  const newContent = document.createElement("div");
  newContent.classList.add("board-item-content");

  const categoryTag = document.createElement("sl-tag");
  // <sl-tag class = "categoryTag" variant="primary">Primary</sl-tag>
  categoryTag.className = "categoryTag";
  categoryTag.setAttribute("variant", categoryButtonMap[category]);
  categoryTag.textContent = category.toProperCase();

  newContent.textContent = taskName;
  newContent.append(categoryTag);

  // <i class="uil uil-pen"></i>
  var editIcon = document.createElement("i");
  editIcon.className = "uil uil-pen";
  newContent.appendChild(editIcon);

  const rmvButton = '<i class="uil uil-times-circle"></i>';
    newContent.insertAdjacentHTML("beforeend", rmvButton);

    const datePlaceholder =
      '<sl-format-date class = "taskDate" month="short" day="numeric" date="'+taskNewDate.tnd+'"></sl-format-date>';
    newContent.insertAdjacentHTML("beforeend", datePlaceholder);

  newTaskElement.appendChild(newContent);
  // toDoItems.appendChild(newTaskElement);
  toDoGrid.add(newTaskElement);

  editIconButtons = document.querySelectorAll(".uil-pen");
  removeIconButtons = document.querySelectorAll(".uil-times-circle");
  editIconButtons.forEach((el) => el.addEventListener("click", editTaskContent));
  removeIconButtons.forEach((el) => el.addEventListener("click", removeTaskFunc));


  saveState();
}

function setSingularGrid(gridData, gridIndex, gridInstance) {
  gridData[gridIndex].forEach((itemData) => {
    const { content, tag, date} = itemData;
    const newTaskElement = document.createElement("div");
    newTaskElement.classList.add("board-item");
    const newContent = document.createElement("div");
    newContent.classList.add("board-item-content");
    newContent.textContent = content;

    const categoryTag = document.createElement("sl-tag");
    categoryTag.className = "categoryTag";
    categoryTag.setAttribute("variant", categoryButtonMap[tag]);
    categoryTag.textContent = tag.toProperCase(); // Set the tag's text content

    // <i class="uil uil-pen"></i>
    var editIcon = document.createElement("i");
    editIcon.className = "uil uil-pen";
    newContent.appendChild(editIcon);
    const rmvButton = '<i class="uil uil-times-circle"></i>';
    newContent.insertAdjacentHTML("beforeend", rmvButton);

    var classToBeAdded = "taskDate";

    if(isDateInPastOrToday(date)){
      classToBeAdded = "dueDateCrossed";
      dueTasks+=1;
    }

    const datePlaceholder =
      '<sl-format-date class = "'+classToBeAdded+' taskDate " month="short" day="numeric" date="'+ date + '"></sl-format-date>';
    newContent.insertAdjacentHTML("beforeend", datePlaceholder);

    newContent.appendChild(categoryTag); // Append the tag element
    newTaskElement.appendChild(newContent);
    gridInstance.add(newTaskElement);
  });

  gridInstance.refreshItems();
}

// Load the grid state from local storage
function loadState() {
  const userNameHolder = document.getElementById("UserName").innerText = localStorage.getItem("currentUser");

  const savedState = localStorage.getItem("gridState");

  if (savedState) {
    const gridState = JSON.parse(savedState);

    // Clear the grids before adding items from the saved state
    toDoGrid.remove(toDoGrid.getItems());
    workingGrid.remove(workingGrid.getItems());
    doneGrid.remove(doneGrid.getItems());

    // Add items based on saved item order
    setSingularGrid(gridState, 0, toDoGrid);
    setSingularGrid(gridState, 1, workingGrid);
    setSingularGrid(gridState, 2, doneGrid);
  }
}

function refreshState() {
  boardGrid.refreshItems().layout();
  toDoGrid.refreshItems();
  toDoGrid.layout();
  workingGrid.refreshItems();
  workingGrid.layout();
  doneGrid.refreshItems();
  doneGrid.layout();
}

//Trash Functions To Delete All Data From the Grids

function trashDoneContent() {
  Swal.fire({
    title: "Alert",
    text: "Are you sure you want to trash all done tasks?",
    icon: "warning",
    confirmButtonColor: "#d33",
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: "Trash",
    cancelButtonText: "Pass",
  }).then((result) => {
    if (result.isConfirmed) {
      // Function to execute when "Confirm" button is clicked
      console.log("trashin");
      doneGrid.remove(doneGrid.getItems());
      const doneBoardItems = doneItems.querySelectorAll(".board-item");
      doneBoardItems.forEach((item) => {
        doneItems.removeChild(item);
      });
      doneGrid.refreshItems().layout();
      setTimeout(refreshState, 500);
      saveState();
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      // Function to execute when "Cancel" button is clicked
      console.log("Cancel button clicked");
    }
  });
}

function trashEverything() {
      console.log("trashin");
      toDoGrid.remove(toDoGrid.getItems());
      workingGrid.remove(workingGrid.getItems());
      doneGrid.remove(doneGrid.getItems());
      const todoBoardItems = toDoItems.querySelectorAll(".board-item");
      const workingBoardItems = workingItems.querySelectorAll(".board-item");
      const doneBoardItems = doneItems.querySelectorAll(".board-item");
      
      todoBoardItems.forEach((item) => {
        toDoItems.removeChild(item);
      });
      workingBoardItems.forEach((item) => {
        workingItems.removeChild(item);
      });
      doneBoardItems.forEach((item) => {
        doneItems.removeChild(item);
      });
      doneGrid.refreshItems().layout();
      workingGrid.refreshItems().layout();
      toDoGrid.refreshItems().layout();
      setTimeout(refreshState, 500);
}

async function removeTaskFunc(event) {
  console.log("Event called" + event);

  let boardItem = event.target.closest(".board-item");
  let boardGrid = event.target.closest(".board-column-content").id;
  let boardItemText = boardItem.querySelector(".board-item-content")
    .childNodes[0].textContent;

  //Removing it from the grid

  const savedState = JSON.parse(localStorage.getItem("gridState"));
  const filteredState = savedState.map((section) =>
    section.filter((item) => item.content !== boardItemText)
  );
  localStorage.setItem("gridState", JSON.stringify(filteredState));

  columnGrids.forEach((grid) => {
    const itemData = grid.getItems().map((item) => {
      const itemContent = item
        .getElement()
        .querySelector(".board-item-content")
        .childNodes[0].textContent.trim();
      if (itemContent == boardItemText) {
        grid.remove([item], { removeElements: true });
        grid.refreshItems().layout();
        setTimeout(refreshState, 500);
        console.log("GRID ELEMENT FOUND AND REMOVED");
      }
    });
  });

  // console.log(boardItem.querySelector(".board-item-content").childNodes[0].textContent);
  // document.getElementById(boardGrid).removeChild(boardItem);
  // console.log(boardGrid)
  // doneGrid.refreshItems().layout();
  // setTimeout(refreshState, 500);
}

async function editTaskContent(event) {
  console.log("Event called" + event);
  const taskContent = event.target
    .closest(".board-item")
    .querySelector(".board-item-content").childNodes[0];
  const taskTag = event.target
    .closest(".board-item")
    .querySelector(".categoryTag");
  const taskDate = event.target
    .closest(".board-item")
    .querySelector(".taskDate");
  const { value: taskName } = await Swal.fire({
    icon: "question",
    input: "textarea",
    inputLabel: "Edit Task",
    inputValue: taskContent.textContent,
    inputAttributes: {
      "aria-label": "Type your message here",
    },
    showCancelButton: true,
  });
  if (taskName == undefined) {
    return;
  }
  taskContent.textContent = taskName;

  const { value: category } = await Swal.fire({
    title: "Category",
    input: "select",
    inputValue: taskTag.textContent.toLowerCase(),
    inputOptions: {
      work: "Work",
      personal: "Personal",
      health: "Health",
      home: "Home",
      goals: "Goals",
    },
    inputPlaceholder: "Select a category",
    showCancelButton: true,
  });
  taskTag.textContent = category.toProperCase();

  let datepicker;
  const today = new Date().toISOString().slice(0, 10);

  const { value: taskNewDate } = await Swal.fire({
    title: "Task Deadline",
    html: '<input id="dtp" type="date" class="form-control" autofocus min="'+today+'">',
    icon: "info",
    showCancelButton: true,
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
    preConfirm: () => {
      return {
        tnd: $('#dtp').val(),
      };
    },  
  });

  // document.querySelector("#datetimepicker").value;
  console.log("Value of taskNewDate > "+taskNewDate.tnd);
  taskDate.setAttribute("date",taskNewDate.tnd);

  saveState();
}

function isDateInPastOrToday(date) {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  const inputDate = new Date(date);
  inputDate.setHours(0, 0, 0, 0);
  
  return inputDate < currentDate;
}


loadState();

setTimeout(updateProgress, 700);
setTimeout(refreshState, 700);

// Event Listeners

addTaskButton.addEventListener("click", addNewTask);

trashDone.addEventListener("click", trashDoneContent);

var editIconButtons = document.querySelectorAll(".uil-pen");
editIconButtons.forEach((el) => el.addEventListener("click", editTaskContent));

var removeIconButtons = document.querySelectorAll(".uil-times-circle");
removeIconButtons.forEach((el) => el.addEventListener("click", removeTaskFunc));


// document.getElementById("trashEverything").addEventListener("click",trashEverything);
// document.getElementById("loadEverything").addEventListener("click",loadState);

document.getElementById("sortEverything").addEventListener("click",function(){
  console.log("sorting to do ");
  toDoGrid.sort("date")
  workingGrid.sort("date")
  doneGrid.sort("date")
});

function refreshSearchedTasks() {
  const searchTerm = searchTask.value.toLowerCase().trim();
  console.log("Input box value changed");	
  
  toDoGrid.filter(function (item) {
    const content = item.getElement().querySelector(".board-item-content").textContent.toLowerCase();
    return content.includes(searchTerm);
  });
  workingGrid.filter(function (item) {
    const content = item.getElement().querySelector(".board-item-content").textContent.toLowerCase();
    return content.includes(searchTerm);
  });
  doneGrid.filter(function (item) {
    const content = item.getElement().querySelector(".board-item-content").textContent.toLowerCase();
    return content.includes(searchTerm);
  });
}

searchTask.addEventListener("input", refreshSearchedTasks);

function searchValueChanged(e){
  console.log(e.target.classList);
  e.target.classList.toggle('fa-microphone');
  e.target.classList.toggle('fa-microphone-slash');
  if(e.target.classList.contains("fa-microphone-slash")){
    console.log("Enabled Speech Recognition");
    recognition.start();
  }
  else{
    console.log("Disabled Speech Recognition");
    recognition.stop();
  }
}

searchTask.addEventListener("change", refreshSearchedTasks);
document.querySelector(".searchMicrophoneIcon").addEventListener("click",searchValueChanged);

document.addEventListener("DOMContentLoaded",function(){

  if(localStorage.getItem("currentUser") == ""){
    Swal.fire({
      title: 'Error',
      text: 'You are not logged in. Please Log In To Continue!',
      icon: 'error',
      confirmButtonText: 'Login',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        // Function to execute when "Confirm" button is clicked
        window.open("../log-in/login.html","_self");
        console.log('Confirm button clicked');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Function to execute when "Cancel" button is clicked
        console.log('Cancel button clicked');
      }
    });
  }
  else{
  setTimeout(function(){
    if(dueTasks>0){
    Toast.fire({
      icon: "warning",
      title: "Welcome Back\nYou have "+dueTasks+" tasks overdue!",
    })
  }
  else{
    Toast.fire({
      icon: "success",
      title: "Welcome Back\nYou don't have any overdue tasks!!",
    })
  }
  },1500);
  }

})
document.getElementById("categoryFilter").addEventListener('sl-select', event => {
  var selectedItem = event.detail.item.value;
  console.log("SELECTED ITEMS > "+selectedItem);
  if(selectedItem == "all"){
    selectedItem = "";
  }
  toDoGrid.filter(function (item) {
    const content = item.getElement().querySelector(".board-item-content").querySelector(".categoryTag").textContent.toLowerCase();
    console.log("Category Tag"+content);
    return content.includes(selectedItem);
  });
  workingGrid.filter(function (item) {
    const content = item.getElement().querySelector(".board-item-content").querySelector(".categoryTag").textContent.toLowerCase();
    console.log("Category Tag"+content);
    return content.includes(selectedItem);
  });
  doneGrid.filter(function (item) {
    const content = item.getElement().querySelector(".board-item-content").querySelector(".categoryTag").textContent.toLowerCase();
    console.log("Category Tag"+content);
    return content.includes(selectedItem);
  });
});
