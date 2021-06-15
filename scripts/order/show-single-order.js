export function showSingleOrder(order, orderElement) {
  const orderInfo = document.querySelector("#order_info");
  orderInfo.classList.remove("is-hidden");

  document.querySelector(".order_details_h2").classList.remove("hide");

  document.querySelectorAll(".orders_pop").forEach((order) => {
    order.classList.remove("is_active");
  });

  orderElement.classList.add("is_active");

  document.querySelector("#order_info .message").classList.add("hidden");
  document.querySelector("#order_info .inner_wrapper").classList.remove("hidden");

  document.querySelector("#order_info .order_id").textContent = ` #${order.id}`;
  document.querySelector(".order_status_info .time").textContent = order.time;
  document.querySelector(".order_status_info .customer_name").textContent = order.customer;

  if (order.status === "queue") {
    document.querySelector(".order_status_info .order_status").textContent = "New";
  } else if (order.status === "serving") {
    document.querySelector(".order_status_info .order_status").textContent = "Doing";
  } else {
    document.querySelector(".order_status_info .order_status").textContent = "Done";
  }

  displayBeers(order.items);
  // updateSingleview();
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
  const clone = document.querySelector("#beer_orders").content.cloneNode(true);

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
