import "../../sass/index.scss";

("use strict");

window.addEventListener("DOMContentLoaded", init);

let data;
let newestOrder = [1];

let revenueResults = {
  8: 0,
  9: 0,
  10: 0,
  11: 0,
  12: 0,
  13: 0,
  14: 0,
  15: 0,
  16: 0,
  17: 0,
  18: 0,
  19: 0,
  20: 0,
  21: 0,
  22: 0,
};

const Bartender = {
  name: null,
  ordersServed: 0,
  lastOrder: null,
};

async function init() {
  const localStorageHourlyRevenue = JSON.parse(localStorage.getItem("hourlyRevenue"));

  if (!localStorageHourlyRevenue) {
    localStorage.setItem("hourlyRevenue", JSON.stringify(revenueResults));
  }

  await getData();

  createChart();
}

async function getData() {
  const response = await fetch("https://hold-kaeft-vi-har-det-godt.herokuapp.com/");
  if (response.status == 502) {
    // Connection timeout, let's reconnect
    await getData();
  } else if (response.status != 200) {
    // An error - show it in the console
    console.log(response.statusText);
    // reconnect after 1 second
    await getData();
  } else {
    const json = await response.json();
    data = await json;

    data.bartenders.forEach((person) => {
      const name = person.name;
      const storage = JSON.parse(localStorage.getItem(`bartender${name}`));

      if (!storage) {
        const bartender = Object.create(Bartender);

        bartender.name = name;
        bartender.ordersServed = 0;
        bartender.lastOrder = null;

        localStorage.setItem(`bartender${name}`, JSON.stringify(bartender));
      }
    });

    getDailyOrders();
    getBartenderOrders();

    // Call getQueue again, to wait for the next update to the queue
    setTimeout(getData, 4000);
  }

  // console.log(data);

  displayNumber("queue");
  resetStorage();
}

function createChart() {
  const container = document.querySelector(".revenue_time");
  Object.keys(revenueResults).forEach(function (key) {
    const li = document.createElement("li");
    li.classList.add(`${key}`);
    container.append(li);

    const span = document.createElement("span");
    span.textContent = key;
    li.append(span);

    const div = document.createElement("div");
    div.classList.add(`${key}`, "revenue_total", "beer-bar__percent");
    li.append(div);
  });
}

function getDailyOrders() {
  if (data.serving.length > 0) {
    let newestCustomer = data.serving.slice(-1)[0].id;
    console.log(newestCustomer, "im the newest customer");
    if (newestCustomer > newestOrder[0]) {
      newestOrder.unshift(newestCustomer);
      console.log("new order:", newestOrder[0]);
      newestOrder.pop();
      getOrderPrice(newestCustomer);
      if (localStorage.servedCount) {
        localStorage.servedCount = Number(localStorage.servedCount) + 1;
      } else {
        localStorage.servedCount = 1;
      }
    }
  }
  console.log(localStorage.servedCount);
  displayNumber("served");
  getChartPoints();
}

function getOrderPrice(newestCustomer) {
  let findOrder = data.serving.find((x) => x.id === newestCustomer).order;
  let findPrice = findOrder.length * 40;
  if (localStorage.dailyRevenue) {
    localStorage.dailyRevenue = Number(JSON.parse(localStorage.dailyRevenue)) + findPrice;
  } else {
    localStorage.dailyRevenue = 0;
  }
  getHourlyRevenue();
}

function getHourlyRevenue() {
  let time = new Date(data.timestamp);
  const hour = time.getHours();
  if (hour in revenueResults) {
    let hourlyRevenue = parseInt(JSON.parse(localStorage.getItem("dailyRevenue")));
    revenueResults[hour] = hourlyRevenue;

    let revenue = JSON.parse(localStorage.getItem("hourlyRevenue")) || revenueResults;

    revenue[hour] = revenueResults[hour];

    localStorage.setItem("hourlyRevenue", JSON.stringify(revenue));

    displayHourlyRevenue(revenue);
  }

  if (time.getMinutes() == "00") {
    localStorage.dailyRevenue = 0;
  }
}

function displayHourlyRevenue(revenue) {
  document.querySelectorAll(".revenue_total").forEach((total) => {
    let getHour = total.className.split(" ")[0];
    total.textContent = `${revenue[getHour]},-`;
  });
}

function getChartPoints() {
  let points = "";
  if (!JSON.parse(localStorage.getItem("hourlyRevenue"))) {
    console.log("please wait for next hourly interval to start collecting data");
  } else {
    if (document.querySelector(".chart_box span").classList.contains("hidden")) {
      let revenues = Object.values(JSON.parse(localStorage.getItem("hourlyRevenue")));
      revenues.forEach((value, i) => {
        points += i * 65 + "," + value / 100 + " ";
      });
    } else {
      document.querySelector(".chart_box span").classList.add("hidden");
      let revenues = Object.values(JSON.parse(localStorage.getItem("hourlyRevenue")));
      revenues.forEach((value, i) => {
        points += i * 65 + "," + value / 100 + " ";
      });
    }
  }

  const line = document.querySelector("#line");
  line.setAttribute("points", points);
  line.style.strokeDashoffset = 0;
}

function getBartenderOrders() {
  const list = document.querySelector(".js-bartender-order-list");
  list.innerHTML = "";

  const bartenderList = [];

  data.bartenders.forEach((person) => {
    const storage = JSON.parse(localStorage[`bartender${person.name}`]);

    let serving = person.servingCustomer;
    if (serving > storage.lastOrder) {
      changeCount(person);
    }

    bartenderList.push(storage);
  });

  const sortedBartenders = bartenderList.sort((firstPerson, secondPerson) => firstPerson.ordersServed - secondPerson.ordersServed).reverse();

  displayBartenderOrders(bartenderList);
}

function changeCount(person) {
  const presentStorage = JSON.parse(localStorage.getItem(`bartender${person.name}`));

  presentStorage.ordersServed += 1;
  presentStorage.lastOrder = person.servingCustomer;

  localStorage.setItem(`bartender${person.name}`, JSON.stringify(presentStorage));
}

function resetStorage() {
  const today = new Date(data.timestamp);
  const hours = today.getHours();
  const minutes = today.getMinutes();
  const seconds = today.getSeconds();
  if ((hours === 22) & (minutes === 0) & (seconds === 0)) {
    console.log("Bar closes and data is reset");
    localStorage.clear();
  }
}

function displayNumber(item) {
  document.querySelector(`.${item}_num_wrapper`).innerHTML = "";
  const clone = document.querySelector(`.${item}_template`).content.cloneNode(true);
  if (item === "served") {
    clone.querySelector(".served_number").textContent = localStorage.servedCount;
  } else if (item === "queue") {
    clone.querySelector(".queue_number").textContent = data.queue.length;
  }
  document.querySelector(`.${item}_num_wrapper`).appendChild(clone);
}

function displayBartenderOrders(bartenders) {
  bartenders.forEach((person) => {
    const template = document.querySelector(".bartender_template").content;
    const list = document.querySelector(".js-bartender-order-list");
    const clone = template.cloneNode(true);

    clone.querySelector(".bartender__image").src = `bartenders/${person.name}.jpg`;

    clone.querySelector(".bartender_name").textContent = person.name;
    clone.querySelector(".order_num_wrapper").textContent = JSON.parse(localStorage[`bartender${person.name}`]).ordersServed;

    list.append(clone);
  });
}
