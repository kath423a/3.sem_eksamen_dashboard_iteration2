import "../../sass/index.scss";
import dayjs from "dayjs";
import { settings } from "../modules/settings";
import { getRandomInteger } from "../modules/helpers";

window.addEventListener("DOMContentLoaded", start);

let data;
let allOrders = [];
let filter = "queue";
let activeOrders = [];

const Order = {
    orderid: 0,
    time: 0,
    total: 0,
    quantity: 0,
    image: "",
    items: [],
    customer: null,
};

//Get the order data
function start() {
    console.log("lets gooooo");

    loadJSON();

    // Add event-listeners to filter buttons
    registerButtons();
}

function registerButtons() {
    document
        .querySelectorAll("[data-order]")
        .forEach((button) => button.addEventListener("click", selectFilter));
    document.querySelector(".accept_order").addEventListener("click", () => {
        const alertMessage = document.querySelector(".alert_message");
        alertMessage.classList.remove("hidden");
        setTimeout(function () {
            alertMessage.classList.add("hidden");
        }, 5000);
    });
}

//Get the array
function loadJSON() {
    fetch("https://hold-kaeft-vi-har-det-godt.herokuapp.com/")
        .then((response) => response.json())
        .then((jsonData) => {
            // when loaded, prepare objects
            data = jsonData;
            console.log(jsonData);
            prepareObjects(jsonData[filter]);

            setTimeout(loadJSON, 5000);
        });
}

function prepareObjects(jsonData) {
    const orders = [];

    jsonData.forEach((jsonObject) => {
        const order = Object.create(Order);

        //Get the correct timesyntax
        const correctTime = dayjs(jsonObject.startTime).format("hh:mm:ss");

        order.orderid = jsonObject.id;
        order.time = correctTime;
        order.items = jsonObject.order;
        order.customer = getRandomCustomerName();

        orders.push(order);
        allOrders.push(order);
    });

    // // If there is 1 or more orders
    // if (orders.length >= 1) {
    //     // Show the order(s)
    //     displayList(orders);
    // } else {
    //     // Show the no orders
    //     displayNoOrdersMessage();
    // }

    displayList(orders);
}

function displayNoOrdersMessage() {
    const orderList = document.querySelector(".js_orders_list");
    // const message = orderList.querySelector(".message");
    // message.textContent = `No ${filter} orders`;
    // message.classList.remove("is-hidden");
    orderList.innerHTML = `<p class="message">No ${filter} orders</p>`;
}

function displayList(orders) {
    const orderList = document.querySelector(".js_orders_list");

    // const noOrdersMessage = document.querySelector(".js_orders_list .message");
    // noOrdersMessage.classList.add("is-hidden");

    const newOrders = addNewOrders(orders);
    console.log("newOrders: ", newOrders);
    const oldOrders = removeOldOrders(orders);
    console.log("oldOrders", oldOrders);

    if (newOrders.length >= 1) {
        newOrders.forEach(displayOrder);
    }

    if (oldOrders.length >= 1) {
        oldOrders.forEach(removeOrder);
    }
}

function removeOrder(order) {
    const id = order.orderid;

    const element = document.querySelector(
        `.orders_pop[data-order-id="${id}"]`
    );

    if (element) {
        element.classList.remove("backInLeft");
        element.classList.add("backOutRight");

        element.addEventListener("animationend", () => {
            element.remove();
        });
    }
}

function removeOrderFromActiveOrders(order) {}

function addNewOrders(orders) {
    // console.clear();

    const newOrders = [];

    console.table(activeOrders, ["orderid"]);

    orders.forEach((order) => {
        const orderExists = activeOrders.findIndex(
            (item) => item.orderid === order.orderid
        );

        console.log(orderExists);

        // If order exist - add order
        if (orderExists === -1) {
            console.log("new order, adding order #", order.orderid);
            newOrders.push(order);
            activeOrders.push(order);

            return;
        }
    });

    return newOrders;
}

function removeOldOrders(orders) {
    const oldOrders = [];

    activeOrders.forEach((activeOrder) => {
        const orderExists = orders.findIndex(
            (item) => item.orderid === activeOrder.orderid
        );

        console.log(orderExists);

        if (orderExists === -1) {
            console.log(activeOrder);
            oldOrders.push(activeOrder);
        }
    });

    return oldOrders;
}

function displayOrder(order) {
    //create clone
    const clone = document.querySelector("#order_item").content.cloneNode(true);

    //set clone data
    clone.querySelector(".order_id").textContent = ` #${order.orderid}`;
    clone.querySelector(".time").textContent = order.time;
    clone.querySelector(".total").textContent = order.items.length * 40;

    clone
        .querySelector(".orders_pop")
        .addEventListener("click", () => showSingleOrder(order));

    clone.querySelector(".orders_pop").classList.add("backInLeft");
    clone
        .querySelector(".orders_pop")
        .setAttribute("data-order-id", order.orderid);

    document.querySelector(".js_orders_list").appendChild(clone);
}

function selectFilter() {
    console.log(this.dataset.order);

    filter = this.dataset.order;
    console.log("filter is: ", filter);

    document.querySelectorAll(".order_status_tabs button").forEach((button) => {
        button.classList.remove("is_active");
    });

    this.classList.add("is_active");

    document.querySelector(".js_orders_list").innerHTML = "";
    activeOrders = [];
    prepareObjects(data[this.dataset.order]);
}

function showSingleOrder(order) {
    console.log("Showing data to the order view");

    document.querySelector("#order_info .message").classList.add("hidden");
    document
        .querySelector("#order_info .inner_wrapper")
        .classList.remove("hidden");

    document.querySelector(
        ".order_status_info .order_id"
    ).textContent = ` #${order.orderid}`;
    document.querySelector(".order_status_info .time").textContent = order.time;
    document.querySelector(".order_status_info .customer_name").textContent =
        order.customer;

    displayBeers(order.items);
}

function displayBeers(beers) {
    //clear the list
    document.querySelector(".js_beer_list").innerHTML = "";

    const sortedBeers = [];
    let price = 0;

    beers.forEach((beer) => {
        const beerObject = {
            name: beer,
            quantity: 1,
            price: 40,
        };
        price = price + 40;
        //check om øllen er der i forvejen
        if (sortedBeers.some((e) => e.name === beer)) {
            const findBeer = sortedBeers.find((e) => e.name === beer);
            findBeer.quantity = findBeer.quantity + 1;
            console.log("der er allerede en øl med samme navn");
        } else {
            sortedBeers.push(beerObject);
            console.log("der er IKKE en øl med samme navn");
        }
    });
    console.log("sortedBeers", sortedBeers);
    console.log("beers", beers);

    //build a new list
    sortedBeers.forEach(showBeer);
    showPrice(price);
}

function showPrice(price) {
    document.querySelector(".bottom_info .total_total").textContent = price;
}

function showBeer(beer) {
    //create clone
    const clone = document
        .querySelector("#beer_orders")
        .content.cloneNode(true);

    //set clone data
    clone.querySelector(".beer_image").src = `/images/${beer.name}.png`;
    clone.querySelector(".beer_name").textContent = beer.name;
    clone.querySelector(".beer_price").textContent = `${beer.price},-`;
    clone.querySelector(".quantity").textContent = `${beer.quantity}x`;
    clone.querySelector(".price").textContent = beer.price * beer.quantity;

    document.querySelector(".js_beer_list").appendChild(clone);
}

function getRandomCustomerName() {
    const customers = settings.randomCustomers;
    const customerAmount = customers.length;

    const randomNumber = getRandomInteger(1, customerAmount);
    const randomCustomer = customers[randomNumber - 1];

    return randomCustomer;
}
