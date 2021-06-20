import "../../sass/index.scss";
import dayjs from "dayjs";
import { settings } from "../modules/settings";
import { sortBy, getRandomCustomerName } from "../modules/helpers";
import { showSingleOrder } from "./show-single-order";

let data;
let filter = "queue";
let activeOrders = [];
let allOrders = [];
let selectedOrder = null;

window.addEventListener("DOMContentLoaded", start);

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

  orderController();
}

async function orderController() {
  const serverUrl = settings.url;

  // Call function to get fetched data
  const jsonData = await loadJSON(serverUrl);

  // Destructoring queue and serving
  const { queue, serving } = jsonData;

  // Combine queue and serving arrays
  // const newestOrderData = [...queue, ...serving];

  // Make new data into {Order} objects and add them to allOrders
  prepareObjects(queue, "queue");
  prepareObjects(serving, "serving");

  const queueOrdersToUpdate = compareOrderLists(filterOrdersByStatus("queue"), queue);

  const servingOrdersToUpdate = compareOrderLists(filterOrdersByStatus("serving"), serving);

  // Combine them in an array
  const ordersToUpdate = [...queueOrdersToUpdate, ...servingOrdersToUpdate];

  ordersToUpdate.forEach((order) => {
    const newStatus = findNewStatus(order);

    const index = findOrder(order.id);
    allOrders[index].status = newStatus;
  });

  console.log("queueOrdersToUpdate", queueOrdersToUpdate);
  console.log("servingOrdersToUpdate", servingOrdersToUpdate);
  console.table(allOrders.sort(sortBy("id")), ["id", "status"]);

  console.log(`Queue: ${data.queue.length} \nServing: ${data.serving.length} \nTotal: ${data.serving.length + data.queue.length}`);

  buildList();

  setTimeout(orderController, 5000);
}

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

function prepareObjects(orderArray, status) {
  orderArray.forEach((order) => {
    const orderObject = createObject(order, status);
    const newOrder = isOrderNew(order);

    if (newOrder) {
      addToAllOrders(orderObject);
      return null;
    }
  });
}

function isOrderNew(order) {
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
  const correctTime = dayjs(startTime).format("HH:mm:ss");

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

function buildList() {
  const filteredOrders = filterOrdersByStatus(filter);

  // Check if there is new orders based on the selected {filter},
  // that is not in the current {activeOrders}.
  const newOrders = addNewOrders(filteredOrders);
  console.log("newOrders: ", newOrders);

  // Check if there is orders from the active list based on {filter},
  // that is no longer a part of the "activeList".
  const oldOrders = removeOldOrders(filteredOrders);
  console.log("oldOrders", oldOrders);

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

  updateNumbers();

  if (selectedOrder) {
    updateSingleview();
  }

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

function updateSingleview() {
  const index = findOrder(selectedOrder);
  const status = allOrders[index].status;
  const button = document.querySelector(".accept_order");

  if (status === "queue") {
    button.textContent = "Accept order";
    button.classList.remove("hide");
    document.querySelector(".order_status_info .order_status").textContent = "New";
  } else if (status === "serving") {
    button.textContent = "Order done";
    button.classList.remove("hide");
    document.querySelector(".order_status_info .order_status").textContent = "Doing";
  } else {
    button.classList.add("hide");
    document.querySelector(".order_status_info .order_status").textContent = "Done";
  }
}

function updateNumbers() {
  document.querySelector("[data-order=queue] .order_number").textContent = data.queue.length;
  document.querySelector("[data-order=serving] .order_number").textContent = data.serving.length;

  const amountDone = filterOrdersByStatus("done");
  document.querySelector("[data-order=done] .order_number").textContent = amountDone.length;
}

function findNewStatus(order) {
  // Destructoring
  const id = order.id;
  const { queue, serving } = data;

  const belongsInQueue = queue.findIndex((item) => item.id === id);
  if (belongsInQueue !== -1) {
    return "queue";
  }

  const belongsInServing = serving.findIndex((item) => item.id === id);
  if (belongsInServing !== -1) {
    return "serving";
  }

  return "done";
}

function removeOrder(order) {
  const id = order.id;

  const element = document.querySelector(`.orders_pop[data-order-id="${id}"]`);

  if (element) {
    element.classList.remove("backInLeft");
    element.classList.add("backOutRight");

    element.addEventListener("animationend", () => {
      element.remove();
    });
  }
}

function addNewOrders(orders) {
  const newOrders = [];

  orders.forEach((order) => {
    if (order.status === filter) {
      const orderExists = activeOrders.findIndex((item) => item.id === order.id);

      // If order does not exist - add order
      if (orderExists === -1) {
        console.log("new order, adding order #", order.id);
        newOrders.push(order);
        activeOrders.push(order);
      } else {
        console.log("order already exists", order);
      }
    }
  });

  return newOrders;
}

function removeOldOrders(orders) {
  const oldOrders = [];

  // Make a clone of active orders
  const activeOrdersClone = [...activeOrders];

  activeOrdersClone.forEach((activeOrder) => {
    const orderExists = orders.findIndex((item) => item.id === activeOrder.id);

    if (orderExists === -1) {
      oldOrders.push(activeOrder);

      const activeIndex = activeOrders.findIndex((item) => item.id === activeOrder.id);

      activeOrders.splice(activeIndex, 1);

      const newStatus = findNewStatus(activeOrder);
      const allIndex = findOrder(activeOrder.id);
      allOrders[allIndex].status = newStatus;
    }
  });

  return oldOrders;
}

function displayOrder(order) {
  //create clone
  const clone = document.querySelector("#order_item").content.cloneNode(true);

  //set clone data
  clone.querySelector(".order_id").textContent = ` #${order.id}`;
  clone.querySelector(".time").textContent = order.time;
  clone.querySelector(".total").textContent = order.items.length * 40;

  const orderElement = clone.querySelector(".orders_pop");

  orderElement.addEventListener("click", () => {
    selectedOrder = order.id;
    showSingleOrder(order, orderElement);
    updateSingleview();
  });

  if (order.id === selectedOrder) {
    orderElement.classList.add("is_active");
  }

  orderElement.classList.add("backInLeft");
  orderElement.setAttribute("data-order-id", order.id);

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

  const newActiveOrders = filterOrdersByStatus(filter);
  activeOrders = newActiveOrders;

  // If there is 1 or more {activeOrders},
  // Hide the "no orders" message
  if (activeOrders.length >= 1) {
    toggleNoOrdersMessage("hide");
    activeOrders.forEach(displayOrder);
  } else {
    toggleNoOrdersMessage("show");
  }
}

function filterOrdersByStatus(status) {
  const filteredOrders = allOrders.filter((order) => order.status === status);

  return filteredOrders;
}

function compareOrderLists(listA, listB) {
  //Find values that are in listA, but not in listB
  const result = listA.filter(function (obj) {
    return !listB.some(function (obj2) {
      return obj.id == obj2.id;
    });
  });

  return result;
}

function registerButtons() {
  document.querySelectorAll("[data-order]").forEach((button) => button.addEventListener("click", selectFilter));
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
    document.querySelector("#order_info .inner_wrapper").classList.add("hidden");
    document.querySelector(".order_details_h2").classList.add("hide");
    const activeOrder = document.querySelector(".orders_pop.is_active");
    if (activeOrder) {
      activeOrder.classList.remove("is_active");
    }
  });
}

function findOrder(id) {
  const index = allOrders.findIndex((item) => item.id === id);
  console.log("index", index);
  return index;
}
