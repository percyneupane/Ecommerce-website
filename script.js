//below are the chunk of codes to be displayed inside the showItem function
function intializeSizeSelect(item) {
  const sizeOptions = item.size
    .map((size) => `<option value="${size}">${size}</option>`)
    .join("");
  return `
    <label for="size-select">Size:</label>
    <select name="size-select" id="size-select">
      <option value="size">Choose your size</option>
      ${sizeOptions}
    </select>
  `;
}

function prepareColorSelect(item) {
  const colorOptions = item.colors
    .map((color) => `<option value="${color}">${color}</option>`)
    .join("");
  return `
    <label for="color-select">Color:</label>
    <select name="color-select" id="color-select">
      <option value="color">Choose your color</option>
      ${colorOptions}
    </select>
  `;
}

function makeQuantityControls() {
  return `
    <div class="quantity-controls">
      <button class="decrement-item-button">-</button>
      <button class="increment-item-button">+</button>
    </div>
  `;
}

function createQuantityDisplay(quantity) {
  return `<p class="item-quantity-display">Quantity: ${quantity}</p>`;
}

function intializeModalContent(
  item,
  sizeSelect,
  colorSelect,
  quantityDisplay,
  quantityControls
) {
  return `
    <span class="close">&times;</span>
    <div class="modal-item-details">
      <h1 id="mod-contain-hd">${item.itemName}</h1>
      <h1 id="mod-contain-hd-pr">$${item.price}</h1>
      <hr id="mod-hr">
      <p id="description-container">${item.itemFull}</p>
      <div class="modal-item-image-container">
        <img class="modal-item-image" src="${item.image[0]}" />
      </div>
      <div class="modal-small-images">
        ${item.image
          .map(
            (img, index) => `
              <img
                class="modal-small-image ${index === 0 ? "active" : ""}"
                src="${img}"
                onclick="document.querySelector('.modal-item-image').src = '${img}'; 
                document.querySelectorAll('.modal-small-image').forEach(el => el.classList.remove('active'));
                this.classList.add('active');"
              />
            `
          )
          .join("")}
      </div>
      <div class="selec-container">
        ${sizeSelect}
        ${colorSelect}
        ${quantityDisplay}
        ${quantityControls}
        <button id="pay-button">Pay Now</button>
      </div>
    </div>
  `;
}

function addQuantityEventListeners() {
  const incrementBtns = document.querySelectorAll(".increment-item-button");
  const decrementBtns = document.querySelectorAll(".decrement-item-button");

  incrementBtns.forEach((button) => {
    button.addEventListener("click", (e) => {
      const quantityDisplay =
        e.target.parentNode.parentNode.querySelector(".item-quantity-display");
      const currentValue = quantityDisplay.textContent.split(": ")[1];
      if (!isNaN(currentValue)) {
        const newValue = parseInt(currentValue) + 1;
        quantityDisplay.textContent = `Quantity: ${newValue}`;
      }
    });
  });

  decrementBtns.forEach((button) => {
    button.addEventListener("click", (e) => {
      const quantityDisplay =
        e.target.parentNode.parentNode.querySelector(".item-quantity-display");
      const currentValue = quantityDisplay.textContent.split(": ")[1];
      if (!isNaN(currentValue)) {
        const newValue = parseInt(currentValue) - 1;
        quantityDisplay.textContent = `Quantity: ${
          newValue > 0 ? newValue : 0
        }`;
      }
    });
  });
}

function addCloseButtonEventListener(modalContent) {
  const closeBtn = modalContent.querySelector(".close");
  closeBtn.addEventListener("click", function () {
    const modal = document.getElementById("ItemModal");
    modal.style.display = "none";
  });
}

function addPayButtonEventListener(modalContent) {
  const payButton = modalContent.querySelector("#pay-button");
  payButton.addEventListener("click", function () {
    window.alert("payment successful!");
    location.reload();
  });
}

async function showItem(itemId, categoryId) {
  const modal = document.getElementById("ItemModal");
  modal.style.display = "block";

  const item = await fetchStoreItem(itemId, categoryId);
  const sizeSelect = intializeSizeSelect(item);
  const colorSelect = prepareColorSelect(item);
  const quantityDisplay = createQuantityDisplay(1);
  const quantityControls = makeQuantityControls();

  const modalContent = document.querySelector(".modal-content-section");
  modalContent.innerHTML = intializeModalContent(
    item,
    sizeSelect,
    colorSelect,
    quantityDisplay,
    quantityControls
  );

  addQuantityEventListeners();
  addCloseButtonEventListener(modalContent);
  addPayButtonEventListener(modalContent);
}
//showItem item's detail here
async function fetchStoreItem(itemId, categoryId) {
  const response = await fetch(
    `https://6245f389e3450d61b0f926c1.mockapi.io/api/v1/categories/${categoryId}/items/${itemId}`
  );
  return response.json();
}

// Fetch the categories from the API
fetch("https://6245f389e3450d61b0f926c1.mockapi.io/api/v1/categories")
  .then((response) => response.json())
  .then((categories) => {
    // Update the navigation menu with category names
    const nav = document.querySelector("nav");
    // categories = categories.slice(0, -3);
    nav.innerHTML = categories
      .map(
        (category) =>
          `<div class="category" data-id="${category.id}">
            <span>
              <input type="radio" id="category-${category.id}" name="selected-category-id" value="${category.id}">
            </span>
            ${category.name}
          </div>`
      )
      .join("");

    // Get the table element
    const table = document.querySelector("table tbody");
    let currentView = "list"; // set the initial view to list

    // Function to update the table with items based on selected category and view type
    const updateItemsTable = async (categoryId, viewType) => {
      // Fetch the items for the selected category
      await fetch(
        `https://6245f389e3450d61b0f926c1.mockapi.io/api/v1/categories/${categoryId}/items`
      )
        .then((response) => response.json())
        .then((items) => {
          if (items.items.length) {

          }
          table.innerHTML = "";
          // Update the table with the item data based on the view type
          if (viewType === "grid") {
            document.getElementById("dark-table").style.display = "none";
            table.innerHTML = `
          <div class="grid-view">
            ${items.items
              .map(
                (item) => `
                <div class="card" style="width: 18rem;" data-id="${item.productId}" onclick="showItem( ${item.itemId}, ${item.categoryId} )">
                <img class="card-img-main" src="${item.image[0]}" alt="Card image cap">
                <div class="card-body">
                  <h5 class="card-title">Name: ${item.itemName}</h5>
                  <p class="item-price">Price: $${item.price}</p>
                  <p class="card-text">Description: ${item.itemBrief}</p>
                  <a href="#" class="btn-link">Read More</a>
                </div>
              </div>
              `
              )
              .join("")}
          </div>
        `;
          } else if (viewType === "list") {
            document.getElementById("dark-table").style.display = "revert";
            table.innerHTML = `
          ${items.items
            .map(
              (item) => `
                <tr class="table-new-item" data-id="${item.productId}">
                  <td onclick="showItem( ${item.itemId}, ${item.categoryId} )"/><img src="${item.image[0]}" onclick="showItem( ${item.itemId}, ${item.categoryId} )"/>  ${item.itemName} </td> 
                  <td id="item-brief" onclick="showItem( ${item.itemId}, ${item.categoryId} )"/>${item.itemBrief}</td> 
                  <td onclick="showItem( ${item.itemId}, ${item.categoryId} )"/>$${item.price}</td>
                </tr>
            `
            )
            .join("")}
        `;
          }
        });
    };

    // Attach event listener to radio button inputs

    const radioButtons = document.querySelectorAll('input[name="selected-category-id"]');
    radioButtons.forEach((radioButton) => {
      radioButton.addEventListener("change", (event) => {
        const categoryId = event.target.value;
        updateItemsTable(categoryId, currentView);
      });
    });

  })
  .catch((error) => console.error("Error fetching data from API:", error));