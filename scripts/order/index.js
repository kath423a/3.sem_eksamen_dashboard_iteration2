import "../../sass/index.scss";
import dayjs from "dayjs";
import { settings } from "../modules/settings";
import { getRandomInteger } from "../modules/helpers";

window.addEventListener("DOMContentLoaded", start);

let data;
let allOrders = [];
let filter = "queue";

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

            // setTimeout(loadJSON, 5000);
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
    displayList(orders);
}

function displayList(orders) {
    //clear the list
    const orderList = document.querySelector(".js_orders_list");
    orderList.innerHTML = "";

    // If there is at least one order - Show the order
    if (orders.length >= 1) {
        //build a new list
        orders.forEach(displayOrder);
        console.log("There is orders");
    } else {
        // Else show a message
        orderList.innerHTML = `<p class="message">No ${filter} orders</p>`;
    }
}

function displayOrder(order) {
    //create clone
    const clone = document.querySelector("#order_item").content.cloneNode(true);

    //set clone data
    clone.querySelector(".order_id").textContent = ` #${order.orderid}`;
    clone.querySelector(".time").textContent = order.time;
    clone.querySelector(".total").textContent = order.items.length * 40;
    console.log(order);

    clone
        .querySelector(".orders_pop")
        .addEventListener("click", () => showSingleOrder(order));

    clone.querySelector(".orders_pop").classList.add("backInLeft");

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
    console.log(customerAmount);

    const randomNumber = getRandomInteger(1, customerAmount);
    const randomCustomer = customers[randomNumber - 1];

    return randomCustomer;
}

// function newOrder() {
//   let clone = document.querySelector("#order_item").content.cloneNode(true);

//   //set clone data
//   clone.querySelector(".order_id").textContent = `#9000`;
//   clone.querySelector(".time").textContent = "12:50:12";
//   clone.querySelector(".total").textContent = "200";

//   clone.querySelector(".orders_pop").classList.add("backInLeft");

//   document.querySelector(".js_orders_list").appendChild(clone);
// }
