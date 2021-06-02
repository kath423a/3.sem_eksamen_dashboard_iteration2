import "../../sass/index.scss";
import dayjs from "dayjs";
import { settings } from "../modules/settings";
import { getRandomInteger, sortBy } from "../modules/helpers";

window.addEventListener("DOMContentLoaded", start);

let data;
let filter = "queue";
let activeOrders = [];
let allOrders = [];

const Order = {
    id: 0,
    time: 0,
    items: [],
    customer: null,
    status: null,
};

//Get the order data
async function start() {
    // Add event-listeners to filter buttons
    registerButtons();

    buildList();
}

async function buildList() {
    const serverUrl = settings.url;

    const orders = await loadJSON(serverUrl);

    if (orders) {
        prepareObjects(orders);
    }

    allOrders = allOrders.sort(sortBy("id"));
    console.log("allOrders", allOrders);

    setTimeout(buildList, 5000);
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

    const orderInfo = document.querySelector("#order_info");
    const message = document.querySelector("#order_info .message");
    const closeButton = document.querySelector(".js-close-button");
    closeButton.addEventListener("click", () => {
        orderInfo.classList.add("is-hidden");
        message.classList.remove("hidden");
        document
            .querySelector("#order_info .inner_wrapper")
            .classList.add("hidden");
    });
}

//Get the array
async function loadJSON(url) {
    const response = await fetch(url);

    if (response.ok) {
        // if HTTP-status is 200-299
        // get the response body (the method explained below)
        const jsonData = await response.json();
        data = jsonData;

        return jsonData;
    } else {
        alert("HTTP-Error: " + response.status);
        return null;
    }
}

function prepareObjects(jsonData) {
    const orders = [];

    // Destructoring
    const { queue, serving } = jsonData;

    queue.forEach((order) => {
        const orderObject = createObject(order, "queue");
        const newOrder = isOrderNew(order);

        if (newOrder) {
            addToAllOrders(orderObject);
        }

        orders.push(orderObject);
    });

    serving.forEach((order) => {
        const orderObject = createObject(order, "queue");
        const newOrder = isOrderNew(order);

        if (newOrder) {
            addToAllOrders(orderObject);
        }

        orders.push(orderObject);
    });

    console.log("updatedOrdersoaksdoasdoskda", orders);

    displayList(orders);
}

function isOrderNew(order) {
    const allOrdersClone = [...allOrders];

    const orderExists = allOrders.findIndex((item) => item.id === order.id);

    // If it does not exist
    if (orderExists === -1) {
        return true;
    }
    // Order is not new
    return false;
}

function addToAllOrders(order) {
    allOrders.push(order);

    // const allOrders = allOrders
}

function createObject(orderObject, status) {
    const order = Object.create(Order);

    // Destructoring
    const { id, order: items, startTime } = orderObject;

    //Get the correct timesyntax
    const correctTime = dayjs(startTime).format("hh:mm:ss");

    order.id = id;
    order.time = correctTime;
    order.items = items;
    order.customer = getRandomCustomerName();
    order.status = status;

    return order;
}

function toggleNoOrdersMessage(state) {
    if (state === "hide") {
        const message = document.querySelector(".js_orders_list .message");

        if (message) {
            message.remove();
        }

        return;
    }

    const orderList = document.querySelector(".js_orders_list");

    // Reset list and show no orders filter
    orderList.innerHTML = `<p class="message">No ${filter} orders</p>`;
}

function displayList(orders) {
    // Check if there is new orders based on the selected {filter},
    // that is not in the current {activeOrders}.
    const newOrders = addNewOrders(orders);
    console.log("newOrders: ", newOrders);

    // Check if there is orders from the active list based on {filter},
    // that is no longer a part of the "activeList".
    const oldOrders = removeOldOrders(orders);
    console.log("oldOrders", oldOrders);

    console.table(allOrders, ["id", "status"]);

    // Display all new orders, if any.
    if (newOrders.length >= 1) {
        newOrders.forEach(displayOrder);
    }

    console.log("activeOrders", activeOrders);

    console.log(
        `incoming queue: ${data.queue.length}
        serving orders: ${data.serving.length}
        = ${data.serving.length + data.queue.length}`
    );

    console.log("-------------------------------");

    // If there is 1 or more {activeOrders},
    // Hide the "no orders" message
    if (activeOrders.length >= 1) {
        toggleNoOrdersMessage("hide");
    } else {
        toggleNoOrdersMessage("show");
    }

    // Old and new activeOrders gets compared.
    // If anyone is not in the new updated list, move them to one of the other lists {queue, serving, done}
    if (oldOrders.length >= 1) {
        oldOrders.forEach(removeOrder);
    }
}

function findNewStatus(order) {
    // Destructoring
    const id = order.id;
    const { queue, serving } = data;

    const belongsInQueue = queue.findIndex((item) => item.id === id);
    console.log("belongsInQueue", belongsInQueue);
    if (belongsInQueue !== -1) {
        console.log("belongs in Queue!");
        return "queue";
    }

    const belongsInServing = serving.findIndex((item) => item.id === id);
    console.log("belongsInServing", belongsInServing);
    if (belongsInServing !== -1) {
        console.log("belongs in Serving!");
        return "serving";
    }

    console.log("Belongs in done!");
    return "done";
}

function removeOrder(order) {
    const id = order.id;

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

function addNewOrders(orders) {
    // console.clear();

    const newOrders = [];

    orders.forEach((order) => {
        if (order.status !== filter) {
            console.log(order.status);
        }

        const orderExists = activeOrders.findIndex(
            (item) => item.id === order.id
        );

        // If order does not exist - add order
        if (orderExists === -1) {
            console.log("new order, adding order #", order.id);
            newOrders.push(order);
            activeOrders.push(order);
        } else {
            console.log("order already exists", order);
        }
    });

    return newOrders;
}

function removeOldOrders(orders) {
    const oldOrders = [];

    // Make a clone of active orders
    const activeOrdersClone = [...activeOrders];

    activeOrdersClone.forEach((activeOrder) => {
        const orderExists = orders.findIndex(
            (item) => item.id === activeOrder.id
        );

        if (orderExists === -1) {
            oldOrders.push(activeOrder);

            const activeIndex = activeOrders.findIndex(
                (item) => item.id === activeOrder.id
            );

            activeOrders.splice(activeIndex, 1);

            const newStatus = findNewStatus(activeOrder);
            const allIndex = findOrder(activeOrder.id);
            allOrders[allIndex].status = newStatus;
        }
    });

    return oldOrders;
}

function findOrder(id) {
    const index = allOrders.findIndex((item) => item.id === id);
    console.log("index", index);
    return index;
}

function displayOrder(order) {
    //create clone
    const clone = document.querySelector("#order_item").content.cloneNode(true);

    //set clone data
    clone.querySelector(".order_id").textContent = ` #${order.id}`;
    clone.querySelector(".time").textContent = order.time;
    clone.querySelector(".total").textContent = order.items.length * 40;

    clone
        .querySelector(".orders_pop")
        .addEventListener("click", () => showSingleOrder(order));

    clone.querySelector(".orders_pop").classList.add("backInLeft");
    clone.querySelector(".orders_pop").setAttribute("data-order-id", order.id);

    document.querySelector(".js_orders_list").appendChild(clone);
}

function selectFilter() {
    filter = this.dataset.order;
    console.log("filter is: ", filter);

    document.querySelectorAll(".order_status_tabs button").forEach((button) => {
        button.classList.remove("is_active");
    });

    this.classList.add("is_active");

    document.querySelector(".js_orders_list").innerHTML = "";
    activeOrders = [];

    if (filter === "done") {
        displayList(doneOrders);
        return;
    } else {
        console.log(data);

        prepareObjects(data);
    }
}

function showSingleOrder(order) {
    const orderInfo = document.querySelector("#order_info");
    orderInfo.classList.remove("is-hidden");

    document.querySelector("#order_info .message").classList.add("hidden");
    document
        .querySelector("#order_info .inner_wrapper")
        .classList.remove("hidden");

    document.querySelector(
        ".order_status_info .order_id"
    ).textContent = ` #${order.id}`;
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
        } else {
            sortedBeers.push(beerObject);
        }
    });

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

    const ordersPopLong = clone.querySelector(".orders_pop_long");

    ordersPopLong.addEventListener("click", toggleOrderItemStatus);

    document.querySelector(".js_beer_list").appendChild(clone);

    function toggleOrderItemStatus() {
        ordersPopLong.classList.toggle("is-done");
    }
}

function getRandomCustomerName() {
    const customers = settings.randomCustomers;
    const customerAmount = customers.length;

    const randomNumber = getRandomInteger(1, customerAmount);
    const randomCustomer = customers[randomNumber - 1];

    return randomCustomer;
}
