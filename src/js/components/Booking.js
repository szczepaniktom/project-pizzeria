import AmountWidget from './AmountWidget.js';
import { templates, select } from '../settings.js';

class Booking {
    constructor(element) {
        this.render(element);
        this.initWidgets();
    }

    render(element) {
        const generatedHTML = templates.bookingWidget();
        element.innerHTML = generatedHTML;
        this.dom = {};
        this.dom.wrapper = element;
        this.dom.peopleAmount = this.dom.wrapper.querySelector(select.booking.peopleAmount);
        this.dom.hoursAmount = this.dom.wrapper.querySelector(select.booking.hoursAmount);
    }

    initWidgets() {
        this.peopleAmountWidget = new AmountWidget(this.dom.peopleAmount);
        this.hoursAmountWidget = new AmountWidget(this.dom.hoursAmount);
    }
}


export default Booking;