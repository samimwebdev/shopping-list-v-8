//IIFE (immediately Invoked Function expression)

;(() => {
  //selector
  const filterInputElm = document.querySelector('#filter')
  const nameInputElm = document.querySelector('.nameInput')
  const priceInputElm = document.querySelector('.priceInput')
  const msgElm = document.querySelector('.msg')
  const collectionElm = document.querySelector('.collection')
  const form = document.querySelector('form')
  const submitBtnElm = document.querySelector('.submit-btn button')

  let products = localStorage.getItem('storeProducts')
    ? JSON.parse(localStorage.getItem('storeProducts'))
    : []

  function receiveInputs() {
    const name = nameInputElm.value
    const price = priceInputElm.value
    return { name, price }
  }

  function clearMessage() {
    msgElm.textContent = ''
  }

  function showMessage(msg, action = 'success') {
    const textMsg = `<div class="alert alert-${action}" role="alert">
     ${msg}
    </div>`
    msgElm.insertAdjacentHTML('afterbegin', textMsg)
    setTimeout(() => {
      clearMessage()
    }, 2000)
  }

  function validateInputs(name, price) {
    let isValid = true
    //check input is empty
    if (name === '' || price === '') {
      isValid = false
      showMessage('Please provide necessary info', 'danger')
    }

    if (Number(price) !== Number(price)) {
      isValid = false
      showMessage('Please provide price in number', 'danger')
    }

    return isValid
  }

  function resetInput() {
    nameInputElm.value = ''
    priceInputElm.value = ''
  }

  function addProduct(name, price) {
    const product = {
      id: products.length + 1,
      name,
      price,
    }
    //memory data store
    products.push(product)

    return product
  }

  function showProductToUI(productInfo) {
    //Remove not found Product message on adding new Product
    const notFoundMsgElm = document.querySelector('.not-found-product')
    if (notFoundMsgElm) {
      notFoundMsgElm.remove()
    }

    const { id, name, price } = productInfo
    const elm = `<li
              class="list-group-item collection-item d-flex flex-row justify-content-between"
              data-productId="${id}"
            >
              <div class="product-info">
                <strong>${name}</strong>- <span class="price">$${price}</span>
              </div>
              <div class="action-btn">
                <i class="fa fa-pencil-alt edit-product me-2"></i>
                <i class="fa fa-trash-alt delete-product"></i>
              </div>
            </li>`

    collectionElm.insertAdjacentHTML('afterbegin', elm)
    showMessage('Product Added SuccessFully')
  }

  function addProductToStorage(product) {
    let products
    if (localStorage.getItem('storeProducts')) {
      products = JSON.parse(localStorage.getItem('storeProducts'))
      //update and add the new Product
      products.push(product)
    } else {
      products = []
      products.push(product)
    }
    localStorage.setItem('storeProducts', JSON.stringify(products))
  }

  function updateProduct(receivedProduct, storageProducts = products) {
    const updatedProducts = storageProducts.map((product) => {
      if (product.id === receivedProduct.id) {
        return {
          ...product,
          name: receivedProduct.name,
          price: receivedProduct.price,
        }
      } else {
        return product
      }
    })

    return updatedProducts
  }

  function clearEditForm() {
    submitBtnElm.classList.remove('update-btn')
    submitBtnElm.classList.remove('btn-secondary')
    submitBtnElm.textContent = 'Submit'
    submitBtnElm.removeAttribute('[data-id]')
  }

  function updateProductToStorage(product) {
    //long way
    //find existing product from localStorage
    let products
     products = JSON.parse(localStorage.getItem('storeProducts'))
    //update products with new product update
   products = updateProduct(product, products)

    //save back to localStorage
    localStorage.setItem('storeProducts', JSON.stringify(products))
    //alternative way
    // localStorage.setItem('storeProducts', JSON.stringify(products))
  }

  function handleFormSubmit(evt) {
    //prevent browser reloading
    evt.preventDefault()

    //receiving the input
    const { name, price } = receiveInputs()
    //validation check
    const isValid = validateInputs(name, price)
    if (!isValid) return

    //reset the input
    resetInput()

    if (submitBtnElm.classList.contains('update-product')) {
      //user wan to update the product
      const id = Number(submitBtnElm.dataset.id)
      //update data to memory store
      const product = {
        id,
        name,
        price,
      }
      const updatedProducts = updateProduct(product)

      //memory store update
      products = updatedProducts

      //DOM update
      showAllProductsToUI(products)
      //localStorage
      updateProductToStorage(product)

      //clear the edit state
      clearEditForm()
    } else {
      //add Product to data store
      const product = addProduct(name, price)

      //add data to localStorage
      addProductToStorage(product)
      //add product info to UI
      showProductToUI(product)
    }

    console.log(name, price)
  }

  function getProductId(evt) {
    const liElm = evt.target.parentElement.parentElement
    const id = Number(liElm.getAttribute('data-productid'))
    return id
  }

  function removeItem(id) {
    products = products.filter((product) => product.id !== id)
  }

  function removeItemFromUI(id) {
    document.querySelector(`[data-productid="${id}"]`).remove()
    showMessage('Product Deleted Successfully', 'warning')
  }

  function removeProductFromStorage(id) {
    let products
    products = JSON.parse(localStorage.getItem('storeProducts'))
    products = products.filter((product) => product.id !== id)
    localStorage.setItem('storeProducts', JSON.stringify(products))
  }

  function findProduct(id) {
    const foundProduct = products.find((product) => product.id === id)
    return foundProduct
  }

  function populateEditForm(product) {
    nameInputElm.value = product.name
    priceInputElm.value = product.price

    //change button submit
    submitBtnElm.textContent = 'Update Product'
    submitBtnElm.classList.add('btn-secondary')
    submitBtnElm.classList.add('update-product')
    submitBtnElm.setAttribute('data-id', product.id)
  }
  function handleManipulateProduct(evt) {
    const id = getProductId(evt)

    if (evt.target.classList.contains('delete-product')) {
      //get the product Id
      //remove product from data store
      removeItem(id)
      //remove item form localStorage
      removeProductFromStorage(id)

      //remove product from UI
      removeItemFromUI(id)
    } else if (evt.target.classList.contains('edit-product')) {
      //finding the product
      const foundProduct = findProduct(id)
      console.log(foundProduct)
      //populating existing form in edit state
      populateEditForm(foundProduct)
    }
  }

  function showAllProductsToUI(products) {
    //clear Existing content form collectionElm/ul
    collectionElm.textContent = ''
    let liElms

    liElms =
      products.length === 0
        ? '<li class="list-group-item collection-item not-found-product">NO Products to Show</li>'
        : ''
    //sorting product in descending order
    products.sort((a, b) => b.id - a.id)

    products.forEach((product) => {
      const { id, name, price } = product
      liElms += `<li
              class="list-group-item collection-item d-flex flex-row justify-content-between"
              data-productId="${id}"
            >
              <div class="product-info">
                <strong>${name}</strong>- <span class="price">$${price}</span>
              </div>
              <div class="action-btn">
                <i class="fa fa-pencil-alt edit-product me-2"></i>
                <i class="fa fa-trash-alt delete-product"></i>
              </div>
            </li>`
    })
    collectionElm.insertAdjacentHTML('afterbegin', liElms)
  }

  function handleFilter(evt) {
    console.log('Trigger', evt.target.value)
    const text = evt.target.value
    //filter the list
    const filteredProducts = products.filter((product) =>
      product.name.includes(text.toLowerCase())
    )

    showAllProductsToUI(filteredProducts)
  }

  function init() {
    form.addEventListener('submit', handleFormSubmit)
    collectionElm.addEventListener('click', handleManipulateProduct)

    filterInputElm.addEventListener('keyup', handleFilter)

    document.addEventListener('DOMContentLoaded', () =>
      showAllProductsToUI(products)
    )
  }

  init()
})()
