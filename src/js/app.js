  import {settings, select, classNames} from "./settings.js";
  import Product from "./components/Product.js";
  import Cart from "./components/Cart.js";
  import Booking from "./components/Booking.js";

  const app = {
    initPages: function(){
      const thisApp = this;

        thisApp.pages = document.querySelector(select.containerOf.pages).children;

        thisApp.navLinks = document.querySelectorAll(select.nav.links);

        thisApp.activatePage(thisApp.pages[0].id);

        for(let link of thisApp.navLinks){
          link.addEventListener('click', function(event){
            const clickedElement = this;
            event.preventDefault();

            const id = clickedElement.getAttribute('href').replace('#', '');

            thisApp.activatePage(id);
          })
        }
      },

    activatePage: function(pageId){
      const thisApp = this;

      /*add class "active" to matching pages, remove from non-matching*/
      for(let page of thisApp.pages){
        page.classList.toggle(classNames.pages.active, page.id == pageId)
      }

      /*add class "active" to matching links, remove from non-matching*/
      for(let link of thisApp.navLinks){
        link.classList.toggle(
          classNames.nav.active,
          link.getAttribute('href') == '#' + pageId
        );
      }
    },

    initMenu: function(){
      const thisApp = this;

      for(let productData in thisApp.data.products){
        new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
      }
    },

    initData: function(){
      const thisApp = this;
      if(!thisApp.data) thisApp.data = {};

      const url = settings.db.url + '/' + settings.db.products;

      fetch(url)
      .then(function(rawResponse){
        return rawResponse.json();
      })
      .then(function(parsedResponse){
        thisApp.data.products = parsedResponse;
        thisApp.initMenu();
      })
    },

    initCart: function(){
      const thisApp = this;

      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.Cart = new Cart(cartElem);

      thisApp.productList = document.querySelector(select.containerOf.menu)

      thisApp.productList.addEventListener('add-to-cart', function(event){
        app.Cart.add(event.detail.product)
      });

    },

    initBooking: function() {
      const bookingContainer = document.querySelector(select.containerOf.booking);
      this.booking = new Booking(bookingContainer);
  },

    init: function(){
      const thisApp = this;
      thisApp.initPages();
      thisApp.initData();
      thisApp.initCart();
      thisApp.initBooking();
    },
  };

    app.init();