const showMenu = (toggleId, navId) => {
  const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId)

  // Validate that variables exist
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      // We add the show-menu class to the div tag with the nav__menu class
      nav.classList.toggle('show-menu')
    })
  }
}
showMenu('nav-toggle', 'nav-menu')

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction() {
  const navMenu = document.getElementById('nav-menu')
  // When we click on each nav__link, we remove the show-menu class
  navMenu.classList.remove('show-menu')
}

navLink.forEach(n => n.addEventListener('click', linkAction))

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

function scrollActive() {
  const scrollY = window.pageYOffset
  sections.forEach(current => {
    const sectionHeight = current.offsetHeight
    const sectionTop = current.offsetTop - 50;
    sectionId = current.getAttribute('id')

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link')
    } else {
      document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link')
    }
  })
}

window.addEventListener('scroll', scrollActive)

/*==================== CHANGE BACKGROUND HEADER ====================*/
function scrollHeader() {
  const nav = document.getElementById('header')
  // When the scroll is greater than 200 viewport height, add the scroll-header class to the header tag
  if (this.scrollY >= 200) nav.classList.add('scroll-header'); else nav.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)

/*==================== DARK LIGHT THEME ====================*/
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'bx-toggle-right'

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'bx-toggle-left' : 'bx-toggle-right'

// We validate if the user previously chose a topic
if (selectedTheme) {
  // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
  document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
  themeButton.classList[selectedIcon === 'bx-toggle-left' ? 'add' : 'remove'](iconTheme)
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener('click', () => {
  // Add or remove the dark / icon theme
  document.body.classList.toggle(darkTheme)
  themeButton.classList.toggle(iconTheme)
  // We save the theme and the current icon that the user chose
  localStorage.setItem('selected-theme', getCurrentTheme())
  localStorage.setItem('selected-icon', getCurrentIcon())
})

const cartElement = document.getElementById('cart')
const cartButton = document.getElementById('cart-button')
const arrowUp = 'bxs-chevron-up'
const arrowDown = 'bxs-chevron-down'
const cartBody = document.getElementById('cart-body')
const cartHeaderSumm = document.getElementById('cart-header-summ')
const cartHeaderCount = document.getElementById('cart-header-count')
const cartTrash = document.getElementById('cart-trash')
const cartOrder = document.getElementById('cart-order')
const addressElement = document.getElementById('address')


class Product {

  constructor(name, price, count) {
    this.name = name;
    this.price = price;
    this.count = count;
  }

}

class ShoppingCart {
  cart = []
  cartSumm = 0;
  cartCount = 0;

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart))
  }

  removeAll() {
    localStorage.removeItem('cart');
    displayCart();
  }

  loadCart() {
    this.cart = [];
    this.cartSumm = 0;
    this.cartCount = 0;
    let cartFromLocal = JSON.parse(localStorage.getItem('cart'))
    this.cart = cartFromLocal ? cartFromLocal : [];
    if (this.cart.length > 0) {
      this.cart.forEach(product => {
        this.cartSumm += product.count * product.price
        this.cartCount += product.count
      })
    }
  }

  addItemToCart(name, price, count) {
    let index = this.cart.findIndex(product => product.name === name)

    if (index >= 0) {
      this.cart[index].count++
      this.saveCart();
    } else {
      let product = new Product(name, price, count);
      this.cart.push(product);
      this.saveCart();
    }

    displayCart()
  }

  removeItemCount(name) {
    let index = this.cart.findIndex(product => product.name === name)

    if (index >= 0 && this.cart[index].count > 1) {
      this.cart[index].count--
      this.saveCart()
      displayCart()
    } else if (index >= 0 && this.cart[index].count === 1) {
      this.cart.splice(index, 1)
      this.saveCart()
      displayCart()
    }
  }

  addItemCount(name) {
    let index = this.cart.findIndex(product => product.name === name)

    if (index >= 0) {
      this.cart[index].count++
      this.saveCart();
      displayCart()
    }
  }
}
const shoppingCart = new ShoppingCart()


cartButton.parentNode.addEventListener('click', () => {
  if (cartButton.classList.contains(arrowUp)) {
    cartElement.className = 'cart preview show'
    cartButton.classList.remove(arrowUp)
    cartButton.classList.add(arrowDown)
  } else {
    cartElement.className = 'cart preview'
    cartButton.classList.remove(arrowDown)
    cartButton.classList.add(arrowUp)
  }
})

document.querySelectorAll('.menu__button__cart').forEach(m => m.addEventListener('click', () => {
  let name = m.parentNode.querySelector('.menu__title').innerHTML;
  let price = m.parentNode.querySelector('.menu__price').innerHTML;
  shoppingCart.addItemToCart(name, price, 1)
}))

cartTrash.addEventListener('click', () => {
  shoppingCart.removeAll()
})

function displayCart() {
  cartBody.innerHTML = ''
  shoppingCart.loadCart()
  if (shoppingCart.cart.length > 0) {
    cartElement.classList.add('preview')
    cartHeaderSumm.innerHTML = shoppingCart.cartSumm
    cartHeaderCount.innerHTML = shoppingCart.cartCount

    shoppingCart.cart.forEach(product => {
      let cartItem = document.createElement('div')
      cartItem.classList.add('cart__item')
      cartItem.append(document.getElementById('cart-item-tmpl').content.cloneNode(true))
      cartItem.querySelector('.cart__item__name').innerHTML = product.name

      cartItem.querySelector('.cart__item__count').innerHTML = product.count

      cartItem.querySelector('.decrement').addEventListener('click', () => shoppingCart.removeItemCount(product.name))
      cartItem.querySelector('.increment').addEventListener('click', () => shoppingCart.addItemCount(product.name))
      cartBody.append(cartItem)
    })
  } else {
    cartElement.classList.remove('show')
    cartElement.classList.remove('preview')
  }

}
displayCart()

cartOrder.addEventListener('click', () => {
  addressElement.classList.add('show-address')
})

