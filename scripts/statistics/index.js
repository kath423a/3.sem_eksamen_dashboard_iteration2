import "../../sass/index.scss";

window.addEventListener("DOMContentLoaded", init);

let data;
let newestOrder = [1];
let employeesStatus = {
    Peter: [0],
    Jonas: [0],
    Dannie: [0],
};
let revenueResults = {
    8: 0,
    10: 0,
    12: 0,
    14: 0,
    16: 0,
    18: 0,
    20: 0,
    22: 0,
};

async function init() {
    getData();
    createChart();
}

async function getData() {
    const response = await fetch(
        "https://hold-kaeft-vi-har-det-godt.herokuapp.com/"
    );
    //   data = await JSONData.json();

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
        // updateData(data);

        data = json;

        getDailyOrders();
        getBartenderOrders();

        // Call getQueue again, to wait for the next update to the queue
        await setTimeout(await getData, 1000);
    } // TAK NIKLAS<3

    // console.log(data);

    displayNumber("queue");
    resetStorage();
}

function createChart() {
    const container = document.querySelector(".revenue_time");
    Object.keys(revenueResults).forEach(function (key) {
        console.log(key, revenueResults[key]);
        const li = document.createElement("li");
        li.textContent = key;
        li.classList.add(`${key}`);
        container.append(li);
        const point = document.createElement("div");
        point.classList.add("point", `${key}`);
        document.querySelector(".chart_box").append(point);
    });
}

function getDailyOrders() {
    if (data.serving.length > 0) {
        let newestCustomer = data.serving.slice(-1)[0].id;
        // console.log(newestCustomer, "im the newest customer");
        if (newestCustomer > newestOrder[0]) {
            newestOrder.unshift(newestCustomer);
            // console.log("new order:", newestOrder[0]);
            newestOrder.pop();
            getOrderPrice(newestCustomer);
            if (localStorage.servedCount) {
                localStorage.servedCount = Number(localStorage.servedCount) + 1;
            } else {
                localStorage.servedCount = 1;
            }
        }
    }
    // console.log(localStorage.servedCount);
    displayNumber("served");
    getChartPoints();
}

function getOrderPrice(newestCustomer) {
    let findOrder = data.serving.find((x) => x.id === newestCustomer).order;
    console.log(findOrder);
    let findPrice = findOrder.length * 40;
    console.log(findPrice);
    if (localStorage.dailyRevenue) {
        localStorage.dailyRevenue =
            Number(localStorage.dailyRevenue) + findPrice;
    } else {
        localStorage.dailyRevenue = 0;
    }

    let time = new Date(data.timestamp);
    console.log(time.getMinutes());
    console.log(parseInt(localStorage.getItem("dailyRevenue")));

    if ([time.getHours()] in revenueResults) {
        let hourlyRevenue = parseInt(localStorage.getItem("dailyRevenue"));
        revenueResults[time.getHours()] = hourlyRevenue;
        // console.log(revenueResults);

        // let revenue = JSON.parse(localStorage.getItem("hourlyRevenue")) || [];
        let revenue = [JSON.parse(localStorage.getItem("hourlyRevenue"))];

        // console.log(localStorage.getItem("hourlyRevenue"));
        console.log(revenue);

        revenue.unshift(revenueResults);
        revenue.pop();

        localStorage.setItem("hourlyRevenue", JSON.stringify(revenue));

        // console.log(JSON.parse(localStorage.getItem("hourlyRevenue")));
    }

    // if (time.getMinutes() == "00") {
    //   localStorage.dailyRevenue = 0;
    //   // console.log(localStorage);
    // }
}

function getChartPoints() {
    let points = "";

    let revenues = Object.values(
        JSON.parse(localStorage.getItem("hourlyRevenue"))[0]
    );
    revenues.forEach((value, i) => {
        points += i * 130 + "," + value / 100 + " ";
    });
    // console.log(revenueResults);
    // console.log(points);
    const line = document.querySelector("#line");
    line.setAttribute("points", points);
    line.style.strokeDashoffset = 0;
}

function getBartenderOrders() {
    data.bartenders.forEach((person) => {
        // console.log(`${person.name} serving ${person.servingCustomer}`);
        let epmloyeeStatus = employeesStatus[person.name].slice(-1)[0];
        let serving = person.servingCustomer;
        // console.log(serving);
        // console.log(epmloyeeStatus);
        if (serving > epmloyeeStatus) {
            employeesStatus[person.name].unshift(serving);
            employeesStatus[person.name].pop();
            changeCount(person);
            displayBartenderOrders(person);
        }

        // console.log(employeesStatus);
        // console.log(localStorage);
    });
}

function changeCount(person) {
    // console.log(person.name, "finished an order!");

    if (person.name == "Peter") {
        if (localStorage.PeterCount) {
            localStorage.PeterCount = Number(localStorage.PeterCount) + 1;
        } else {
            localStorage.PeterCount = 1;
        }
    } else if (person.name == "Jonas") {
        if (localStorage.JonasCount) {
            localStorage.JonasCount = Number(localStorage.JonasCount) + 1;
        } else {
            localStorage.JonasCount = 1;
        }
    } else if (person.name == "Dannie") {
        if (localStorage.DannieCount) {
            localStorage.DannieCount = Number(localStorage.DannieCount) + 1;
        } else {
            localStorage.DannieCount = 1;
        }
    }
}

function resetStorage() {
    const today = new Date(data.timestamp);
    const hours = today.getHours();
    const minutes = today.getMinutes();
    const seconds = today.getSeconds();
    if (hours === 22 && minutes === 0 && seconds === 0) {
        console.log("Bar closes and data is reset");
        localStorage.clear();
    }
}

function displayNumber(item) {
    document.querySelector(`.${item}_num_wrapper`).innerHTML = "";
    const clone = document
        .querySelector(`.${item}_template`)
        .content.cloneNode(true);
    if (item === "served") {
        clone.querySelector(".served_number").textContent =
            localStorage.servedCount;
    } else if (item === "queue") {
        clone.querySelector(".queue_number").textContent = data.queue.length;
    }
    document.querySelector(`.${item}_num_wrapper`).appendChild(clone);
}

function displayBartenderOrders(person) {
    document.querySelector(`.${person.name} .order_num_wrapper`).innerHTML = "";
    const clone = document
        .querySelector(".orders_template")
        .content.cloneNode(true);
    if (person.name === "Jonas") {
        clone.querySelector(".orders_number").textContent =
            localStorage.JonasCount;
    } else if (person.name === "Peter") {
        clone.querySelector(".orders_number").textContent =
            localStorage.PeterCount;
    } else if (person.name === "Dannie") {
        clone.querySelector(".orders_number").textContent =
            localStorage.DannieCount;
    }
    document
        .querySelector(`.${person.name} .order_num_wrapper`)
        .appendChild(clone);
}
