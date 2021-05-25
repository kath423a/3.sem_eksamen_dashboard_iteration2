import "../../sass/index.scss";

("use strict");

window.addEventListener("DOMContentLoaded", start);

let data;
let allOrders = [];
let filter = "queue";

const Order = {
  orderid: 0,
  time: 0,
  total: 0,
};

//Get the order data
function start() {
  console.log("lets gooooo");

  loadJSON();

  // Add event-listeners to filter and sort buttons
  registerButtons();
}

function registerButtons() {
  document.querySelectorAll("[data-order]").forEach((button) => button.addEventListener("click", selectFilter));
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

    console.log(jsonObject);

    //Get the correct timesyntax
    //order.newTime = order.jsonObject.startTime.getHours();

    order.orderid = jsonObject.id;
    order.time = jsonObject.startTime;
    //order.total =

    orders.push(order);
    allOrders.push(order);
  });
  displayList(orders);
}

function displayList(orders) {
  //clear the list
  document.querySelector(".js_orders_list").innerHTML = "";

  //build a new list
  orders.forEach(displayOrder);
}

function displayOrder(order) {
  //create clone
  const clone = document.querySelector("#order_item").content.cloneNode(true);

  //set clone data
  clone.querySelector(".order_id").textContent = order.orderid;
  clone.querySelector(".time").textContent = order.time;
  //clone.querySelector(".total").textContent = order.total;

  document.querySelector(".js_orders_list").appendChild(clone);
}

function selectFilter() {
  console.log(this.dataset.order);

  filter = this.dataset.order;
  console.log("filter is: ", filter);

  document.querySelector(".js_orders_list").innerHTML = "";
  prepareObjects(data[this.dataset.order]);
}
