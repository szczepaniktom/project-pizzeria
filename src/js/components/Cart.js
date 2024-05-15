import {settings, select, templates} from "../settings.js";
import CartProduct from "./CartProduct.js";
import utils from "../utils.js";

class Cart{
    constructor(element){
      const thisCart = this;
      thisCart.products = [];
      thisCart.getElements(element);
      thisCart.initActions();
      thisCart.update();
    }

    getElements(element){
      const thisCart = this;

      thisCart.dom = {};
      thisCart.dom.wrapper = element;
      thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
      thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
      thisCart.dom.deliveryFee = thisCart.dom.wrapper.querySelector(select.cart.deliveryFee);
      thisCart.dom.subtotalPrice = thisCart.dom.wrapper.querySelector(select.cart.subtotalPrice);
      thisCart.dom.totalPrice = thisCart.dom.wrapper.querySelectorAll(select.cart.totalPrice);
      thisCart.dom.totalNumber = thisCart.dom.wrapper.querySelector(select.cart.totalNumber);
      thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
      thisCart.dom.phoneInput = thisCart.dom.wrapper.querySelector(select.cart.phone);
      thisCart.dom.addressInput = thisCart.dom.wrapper.querySelector(select.cart.address);
    }

    initActions() {
      const thisCart = this;

      thisCart.dom.toggleTrigger.addEventListener('click', function(){
        thisCart.dom.wrapper.classList.toggle('active');
      });
      thisCart.dom.productList.addEventListener('updated', function() {
        thisCart.update();
      });

      thisCart.dom.productList.addEventListener('remove', function(event) {
        thisCart.remove(event.detail.cartProduct);
      });

      thisCart.dom.form.addEventListener('submit', function(event){
        event.preventDefault();
        thisCart.sendOrder();
      });
    }

    add(menuProduct){
      const thisCart = this;
      const generatedHTML = templates.cartProduct(menuProduct);
      const generatedDOM = utils.createDOMFromHTML(generatedHTML)
      thisCart.dom.productList.appendChild(generatedDOM);

      const newCartProduct = new CartProduct(menuProduct, generatedDOM);
      thisCart.products.push(newCartProduct);
      thisCart.update();
    }

    update(){
      const thisCart = this;
      const deliveryFee = thisCart.products.length > 0 ? settings.cart.defaultDeliveryFee : 0;
      let totalNumber = 0;
      let subtotalPrice = 0;

      for (let product of thisCart.products){
        totalNumber += product.amount;
        subtotalPrice += product.price;
      }

      const totalPrice = subtotalPrice + deliveryFee;

      if(thisCart.dom.deliveryFee){
        thisCart.dom.deliveryFee.innerHTML = deliveryFee;
      }
      if(thisCart.dom.subtotalPrice){
        thisCart.dom.subtotalPrice.innerHTML = subtotalPrice;
      }
      if(thisCart.dom.totalPrice){
        for(let priceElem of thisCart.dom.totalPrice){
          priceElem.innerHTML = totalPrice;
        }
      }
      if(thisCart.dom.totalNumber){
        thisCart.dom.totalNumber.innerHTML = totalNumber;
      }

      thisCart.totalNumber = totalNumber;
      thisCart.subtotalPrice = subtotalPrice;
      thisCart.totalPrice = totalPrice;
      thisCart.deliveryFee = deliveryFee;
    }

    remove(removedProduct) {
      const thisCart = this;
      removedProduct.dom.wrapper.remove();
      thisCart.products = thisCart.products.filter(product => product.id !== removedProduct.id);
      thisCart.update();
    }

    sendOrder(){
      const thisCart = this;
      const url = settings.db.url + '/' + settings.db.orders;

      const payload = {
        address: thisCart.dom.addressInput.value,
        phone: thisCart.dom.phoneInput.value,
        totalPrice: thisCart.totalPrice,
        subtotalPrice: thisCart.subtotalPrice,
        totalNumber: thisCart.totalNumber,
        deliveryFee: thisCart.deliveryFee,
        products: [],
      };

      for(let prod of thisCart.products) {
      payload.products.push(prod.getData());
      }

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      };

      fetch(url, options)
        .then(function(response){
          return response.json();
        }).then(function(parsedResponse){
          console.log('parsedResponse', parsedResponse);
        });
    }
  }

  export default Cart