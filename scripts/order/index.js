import "../../sass/index.scss";
import dayjs from "dayjs";

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
};

//Get the order data
function start() {
  console.log("lets gooooo");

  loadJSON();

  // Add event-listeners to filter buttons
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

    //Get the correct timesyntax
    const correctTime = dayjs(jsonObject.startTime).format("hh:mm:ss");

    order.orderid = jsonObject.id;
    order.time = correctTime;
    order.items = jsonObject.order;
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
  clone.querySelector(".order_id").textContent = ` #${order.orderid}`;
  clone.querySelector(".time").textContent = order.time;
  clone.querySelector(".total").textContent = order.items.length * 40;
  console.log(order);

  clone.querySelector(".orders_pop").addEventListener("click", () => showSingleOrder(order));

  document.querySelector(".js_orders_list").appendChild(clone);
}

function selectFilter() {
  console.log(this.dataset.order);

  filter = this.dataset.order;
  console.log("filter is: ", filter);

  document.querySelectorAll(".order_status_tabs button").forEach((button) => {
    button.classList.remove("chosen_desc");
  });

  document.querySelector(".js_orders_list").innerHTML = "";
  prepareObjects(data[this.dataset.order]);
}

function showSingleOrder(order) {
  console.log("Showing data to the order view");

  document.querySelector(".order_status_info .order_id").textContent = ` #${order.orderid}`;
  document.querySelector(".order_status_info .time").textContent = order.time;

  console.log(order);

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

  console.log(price);
}

function showPrice(price) {
  document.querySelector(".bottom_info .total_total").textContent = price;
}

function showBeer(beer) {
  //create clone
  const clone = document.querySelector("#beer_orders").content.cloneNode(true);

  console.log(beer);

  //set clone data
  clone.querySelector(".beer_image").src = `/images/${beer.name}.png`;
  clone.querySelector(".beer_name").textContent = beer.name;
  clone.querySelector(".beer_price").textContent = `${beer.price},-`;
  clone.querySelector(".quantity").textContent = `${beer.quantity}x`;
  clone.querySelector(".price").textContent = beer.price * beer.quantity;

  document.querySelector(".js_beer_list").appendChild(clone);
}

// Change color on button on click
