import "../../sass/index.scss";

("use strict");

window.addEventListener("DOMContentLoaded", init);

let data;

async function init() {
  getData();
}

async function getData() {
  const response = await fetch("https://hold-kaeft-vi-har-det-godt.herokuapp.com/");
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

    // updateBeerTapStatus(data.taps);

    // Call getQueue again, to wait for the next update to the queue
    await setTimeout(await getData, 1000);
  } // TAK NIKLAS<3

  console.log(data);

  displayQueue();
}

function displayQueue() {
  console.log("queue");

  document.querySelector(".queue_num_wrapper").innerHTML = "";

  const clone = document.querySelector(".queue_template").content.cloneNode(true);

  clone.querySelector(".queue_number").textContent = data.queue.length;

  document.querySelector(".queue_num_wrapper").appendChild(clone);
}
