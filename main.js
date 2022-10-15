//selector
const filterInputElm = document.querySelector('#filter')
const nameInputElm = document.querySelector('.nameInput')
const priceInputElm = document.querySelector('.priceInput')
const msgElm = document.querySelector('.msg')
const collectionElm = document.querySelector('.collection')
const form = document.querySelector('form')

let products = [
  //   {
  //     id: 1,
  //     name: 'Potato',
  //     price: 30,
  //   },
  //   {
  //     id: 2,
  //     name: 'Banana',
  //     price: 20,
  //   },
]

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

  //add Product to data store
  const product = addProduct(name, price)

  //add product info to UI
  showProductToUI(product)
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

function handleManipulateProduct(evt) {
  if (evt.target.classList.contains('delete-product')) {
    //get the product Id
    const id = getProductId(evt)
    //remove product from data store
    removeItem(id)
    //remove product from UI
    removeItemFromUI(id)
  }
}

form.addEventListener('submit', handleFormSubmit)
collectionElm.addEventListener('click', handleManipulateProduct)
