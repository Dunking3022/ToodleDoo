String.prototype.toProperCase = function () {
  return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

var dragContainer = document.querySelector(".drag-container");
var itemContainers = [].slice.call(
  document.querySelectorAll(".board-column-content")
);
var columnGrids = [];
var boardGrid;
var addTask = document.querySelector("#addTask");
const categoryButtonMap = {
  work: "primary",
  personal: "success",
  health: "warning",
  home: "neutral",
  goals: "danger",
};
// Declaring Grid Item References
var toDoItems = document.querySelector("#toDoItems");

var workingItems = document.querySelector("#workingItems");

var doneItems = document.querySelector("#doneItems");

var toDoGrid = new Muuri(toDoItems, {
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

// itemContainers.forEach(function (container) {
//   var grid = new Muuri(container, {
//     items: '.board-item',
//     dragEnabled: true,

//     dragSort: function () {
//       return columnGrids;
//     },
//     dragContainer: dragContainer,
//     dragAutoScroll: {
//       targets: (item) => {
//         return [
//           { element: window, priority: 0 },
//           { element: item.getGrid().getElement().parentNode, priority: 1 },
//         ];
//       }
//     },
//   })
//   .on('dragInit', function (item) {
//     item.getElement().style.width = item.getWidth() + 'px';
//     item.getElement().style.height = item.getHeight() + 'px';
//   })
//   .on('dragReleaseEnd', function (item) {
//     item.getElement().style.width = '';
//     item.getElement().style.height = '';
//     item.getGrid().refreshItems([item]);
//   })
//   .on('layoutStart', function () {
//     boardGrid.refreshItems().layout();
//   });

//   columnGrids.push(grid);
// });

// Init board grid so we can drag those columns around.
boardGrid = new Muuri(".board", {
  dragEnabled: false,
  dragHandle: ".board-column-header",
});

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

  if (category) {
    Swal.fire(`You selected: ${category}`);
  }

  const newTaskElement = document.createElement("div");
  newTaskElement.classList.add("board-item");
  const newContent = document.createElement("div");
  newContent.classList.add("board-item-content");

  const categoryTag = document.createElement("sl-tag");
  // <sl-tag class = "categoryTag" variant="primary">Primary</sl-tag>
  categoryTag.className = "categoryTag";
  categoryTag.setAttribute("variant", categoryButtonMap[category]);
  categoryTag.textContent = category;

  newContent.textContent = taskName;
  newContent.append(categoryTag);
  newTaskElement.appendChild(newContent);
  // toDoItems.appendChild(newTaskElement);
  toDoGrid.add(newTaskElement);
  saveState();
}

// Save the grid state to local storage

function saveState() {
  const gridState = [];

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
      return { content: itemContent, tag: tagValue };
    });
    gridState.push(itemData);
  });

  // Save the grid state to local storage
  localStorage.setItem("gridState", JSON.stringify(gridState));
  console.log("State Saved");
}

function setSingularGrid(gridData, gridIndex, gridInstance) {
  gridData[gridIndex].forEach((itemData) => {
    const { content, tag } = itemData;
    const newTaskElement = document.createElement("div");
    newTaskElement.classList.add("board-item");
    const newContent = document.createElement("div");
    newContent.classList.add("board-item-content");
    newContent.textContent = content;

    const categoryTag = document.createElement("sl-tag");
    categoryTag.className = "categoryTag";
    categoryTag.setAttribute("variant",categoryButtonMap[tag]);
    categoryTag.textContent = tag.toProperCase(); // Set the tag's text content

    newContent.appendChild(categoryTag); // Append the tag element
    newTaskElement.appendChild(newContent);
    gridInstance.add(newTaskElement);
  });

  gridInstance.refreshItems();
}

// Load the grid state from local storage
function loadState() {
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

loadState();

setTimeout(refreshState, 200);

addTask.addEventListener("click", addNewTask);
