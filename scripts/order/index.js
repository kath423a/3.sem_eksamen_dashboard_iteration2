import "../../sass/index.scss";

("use strict");

window.addEventListener("DOMContentLoaded", start);

let allOrders = [];

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
  //registerButtons();
}

//Get the array
function loadJSON() {
  fetch("https://hold-kaeft-vi-har-det-godt.herokuapp.com/")
    .then((response) => response.json())
    .then((jsonData) => {
      // when loaded, prepare objects
      prepareObjects(jsonData.queue);
    });

  //buildList();
}

function prepareObjects(jsonData) {
  jsonData.forEach((jsonObject) => {
    const order = Object.create(Order);

    console.log(jsonObject);

    order.orderid = jsonObject.id;
    order.time = jsonObject.startTime;
    //order.total =

    allOrders.push(order);
  });
  displayList(allOrders);
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

  //clone.querySelector("#details_popup").addEventListener("click", () => showPopup(student));

  document.querySelector(".js_orders_list").appendChild(clone);
}
