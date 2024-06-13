const socket = io();

// SELECT ELEMENTS
const form = document.getElementById("form");
const productTitle = document.getElementById("product-title");
const productDescription = document.getElementById("product-description");
const productCode = document.getElementById("product-code");
const productPrice = document.getElementById("product-price");
const productStatus = document.getElementById("product-status");
const productStock = document.getElementById("product-stock");
const productCategory = document.getElementById("product-category");
const productSubmit = document.getElementById("product-submit");

// GET PRODUCT FROM FORM
const getProduct = () => {
  return {
    title: productTitle.value.trim(),
    description: productDescription.value.trim(),
    code: productCode.value.trim(),
    price: parseFloat(productPrice.value.trim()),
    status: productStatus.checked ? "active" : "inactive",
    stock: parseInt(productStock.value.trim(), 10),
    category: productCategory.value.trim(),
  };
};

// CLEAR FORM FIELDS
const clearForm = () => {
  productTitle.value = "";
  productDescription.value = "";
  productCode.value = "";
  productPrice.value = "";
  productStatus.checked = false;
  productStock.value = "";
  productCategory.value = "";
};

// VALIDATE PRODUCT FIELDS
const validateProduct = (product) => {
  if (!product.title || !product.description || !product.code || isNaN(product.price) || isNaN(product.stock) || !product.category) {
    return false;
  }
  return true;
};

// EMIT PRODUCT TO SERVER
productSubmit.addEventListener("click", (e) => {
  e.preventDefault();

  const product = getProduct();
  
  if (validateProduct(product)) {
    socket.emit("add-product", product);
    clearForm();
  } else {
    alert("Please fill in all fields correctly.");
  }
});

// THERE ARE NOT ENOUGH PRODUCTS
const notEnoughProducts = () => {
  const productsContainer = document.getElementById("products");
  productsContainer.innerHTML = "<tr><td colspan='8'>There are no products available.</td></tr>";

  return;
}

// LISTEN FOR ALL PRODUCTS FROM SERVER AND RENDER THEM
socket.on("all-products", (product) => {
  // renderProducts(product);

  if (product.length === 0) {
    notEnoughProducts();
  } else {
    renderProducts(product);
  }
});

// REUSEABLE FUNCTION TO RENDER PRODUCTS
const renderProducts = (products) => {
  const productsContainer = document.getElementById("products");

  productsContainer.innerHTML = "";
  products.forEach((product) => {
    const productElement = document.createElement("tr");
    productElement.innerHTML = `
      <td>${product.title}</td>
      <td>${product.description}</td>
      <td>${product.code}</td>
      <td>${product.price}</td>
      <td>${product.status}</td>
      <td>${product.stock}</td>
      <td>${product.category}</td>
      <td>
        <button onclick="deleteProduct('${product.id}')">Delete</button>
      </td>
    `;
    productsContainer.appendChild(productElement);
  });
}

// DELETE PRODUCT
const deleteProduct = (id) => {
  socket.emit("delete-product", id);
};

// RENDER PRODUCTS ON PAGE LOAD
const init = () => {
  socket.emit("get-products-init");
};

init();
